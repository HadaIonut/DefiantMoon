import {BufferGeometry, CatmullRomCurve3, Float32BufferAttribute, Vector2, Vector3} from 'three'

export type WallParameters = {
  path: CatmullRomCurve3,
  tubularSegments: number,
  radius: number,
  radialSegments: number,
  closed: boolean,
}

// eslint-disable-next-line require-jsdoc
export class WallGeometry extends BufferGeometry {
  public parameters?: WallParameters
  public tangents: Vector3[]
  public normals: Vector3[]
  public binormals: Vector3[]

  // eslint-disable-next-line require-jsdoc
  constructor(
    path:CatmullRomCurve3,
    tubularSegments = 64,
    radius = 1,
    heightMultiplier = 10,
    radialSegments = 8,
    closed = false,
  ) {
    super()

    // @ts-ignore
    this.type = 'WallGeometry'

    this.parameters = {
      path: path,
      tubularSegments: tubularSegments,
      radius: radius,
      radialSegments: radialSegments,
      closed: closed,
    }

    const frames = path.computeFrenetFrames(tubularSegments, closed)

    // expose internals

    this.tangents = frames.tangents
    this.normals = frames.normals
    this.binormals = frames.binormals

    // helper variables

    const vertex = new Vector3()
    const normal = new Vector3()
    const uv = new Vector2()
    let P = new Vector3()

    // buffer

    const vertices: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    // create buffer data

    generateBufferData()

    // build geometry

    this.setIndex(indices)
    this.setAttribute('position', new Float32BufferAttribute(vertices, 3))
    this.setAttribute('normal', new Float32BufferAttribute(normals, 3))
    this.setAttribute('uv', new Float32BufferAttribute(uvs, 2))

    // functions

    // eslint-disable-next-line require-jsdoc
    function generateBufferData() {
      for (let i = 0; i < tubularSegments; i++) {
        generateSegment(i)
      }

      // if the geometry is not closed, generate the last row of vertices and normals
      // at the regular position on the given path
      //
      // if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

      generateSegment((closed === false) ? tubularSegments : 0)

      // uvs are generated in a separate function.
      // this makes it easy compute correct values for closed geometries

      generateUVs()

      // finally create faces

      generateIndices()
    }

    // eslint-disable-next-line require-jsdoc
    function generateSegment(i:number) {
      // we use getPointAt to sample evenly distributed points from the given path

      P = path.getPointAt(i / tubularSegments, P)

      // retrieve corresponding normal and binormal

      const N = frames.normals[i]
      const B = frames.binormals[i]

      // generate normals and vertices for the current segment

      for (let j = 0; j <= radialSegments; j++) {
        const sin = j % 2 === 0 ? j : 0
        const cos = j % 2 !== 0 ? -j : 0

        // normal

        normal.x = (cos * N.x + sin * B.x)
        normal.y = (cos * N.y + sin * B.y)
        normal.z = (cos * N.z + sin * B.z)
        normal.normalize()

        normals.push(normal.x, normal.y, normal.z)

        // vertex

        vertex.x = P.x + 5 * normal.x
        vertex.y = P.y + heightMultiplier * radius * normal.y
        vertex.z = P.z + 5 * normal.z

        vertices.push(vertex.x, vertex.y, vertex.z)
      }
    }

    // eslint-disable-next-line require-jsdoc
    function generateIndices() {
      for (let j = 1; j <= tubularSegments; j++) {
        for (let i = 1; i <= radialSegments; i++) {
          const a = (radialSegments + 1) * (j - 1) + (i - 1)
          const b = (radialSegments + 1) * j + (i - 1)
          const c = (radialSegments + 1) * j + i
          const d = (radialSegments + 1) * (j - 1) + i

          // faces

          indices.push(a, b, d)
          indices.push(b, c, d)
        }
      }
    }

    // eslint-disable-next-line require-jsdoc
    function generateUVs() {
      for (let i = 0; i <= tubularSegments; i++) {
        for (let j = 0; j <= radialSegments; j++) {
          uv.x = i / tubularSegments
          uv.y = j / radialSegments

          uvs.push(uv.x, uv.y)
        }
      }
    }
  }

  copy(source: WallGeometry) {
    super.copy(source)

    this.parameters = Object.assign({}, source.parameters)

    return this
  }

  // eslint-disable-next-line require-jsdoc
  toJSON() {
    const data = super.toJSON()

    data.path = this.parameters.path.toJSON()

    return data
  }

  static fromJSON(data) {
    // This only works for built-in curves (e.g. CatmullRomCurve3).
    // User defined curves or instances of CurvePath will not be deserialized.
    return new TubeGeometry(
      new Curves[data.path.type]().fromJSON(data.path),
      data.tubularSegments,
      data.radius,
      data.radialSegments,
      data.closed,
    )
  }
}
