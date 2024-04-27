import * as THREE from 'three'
import {
  BoxGeometry,
  BufferGeometry, CatmullRomCurve3, DoubleSide, ExtrudeGeometry,
  Group,
  Line,
  LineBasicMaterial, MathUtils,
  Mesh,
  MeshBasicMaterial, Object3D,
  Plane,
  Raycaster,
  Renderer,
  Scene, Shape,
  Vector2,
  Vector3,
} from 'three'
import concaveman from 'concaveman'
import {WallGeometry} from './WallGeometry'
import {updateAllLightsShadowCasting} from './lightController'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {usePlayAreaStore} from 'src/stores/PlayArea'

export type AdjustableShapeInput = {
  id: string,
  canvas: Scene,
  controls: OrbitControls,
  rayCaster: Raycaster,
  plane: Plane,
  mouse: Vector2,
  renderer: Renderer,
  onDragComplete: () => void,
}

export type DraggablePoint = Mesh | Object3D

const findCenterOfObject = (points: Vector3[]) => {
  const xCenter = points.reduce((acc, cur) => acc + cur.x, 0) / points.length
  const zCenter = points.reduce((acc, cur) => acc + cur.z, 0) / points.length

  return new Vector3(xCenter, 0, zCenter)
}

const createCenterPoint = (controlPoints: DraggablePoint[], canvas: Scene) => {
  const points = controlPoints.reduce((acc: Vector3[], cur) => [...acc, cur.position], [])

  return createPoint([
    MathUtils.generateUUID(),
    findCenterOfObject(points),
  ], canvas, 'blue', 'centerPoint')
}

const createCurveGeometry = (controlPoints: DraggablePoint[], tension: number, centralPoint: DraggablePoint, concaveHull: boolean, closed: boolean) => {
  let pts: number[][] = []
  let vectorPoints: Vector3[] = []
  const curveGeometry = new BufferGeometry()

  controlPoints.forEach((pt) => {
    pts.push([pt.position.x, pt.position.z])
  })

  if (concaveHull) {
    pts = concaveman(pts, 1)
    if (!closed) pts.pop()
  }

  vectorPoints = pts.map((pt) => new Vector3(pt[0], 0, pt[1]))

  if (vectorPoints.length <= 1) return {curveGeometry, curve: new CatmullRomCurve3()}

  const curve = new CatmullRomCurve3(vectorPoints, false, 'catmullrom', tension)
  // @ts-ignore
  curveGeometry.vertices = curve.getPoints(75)
  curveGeometry.translate(0, 1, 0)

  const newCenterLocation = findCenterOfObject(vectorPoints)
  centralPoint.position.set(newCenterLocation.x, newCenterLocation.y, newCenterLocation.z)

  return {curveGeometry, curve}
}

export const createPoint = ([uuid, position]: [string, Vector3], canvas: Scene, color = 'white', objectName = 'controlPoint'): DraggablePoint => {
  const viewGeometry = new BoxGeometry(15, 50, 15, 1, 3, 1)
  viewGeometry.translate(0, .75, 0)
  const viewMaterial = new MeshBasicMaterial({color: color, wireframe: false, transparent: true, opacity: .5})
  const view = new Mesh(viewGeometry, viewMaterial)
  view.position.copy(position)
  view.uuid = uuid
  view.name = objectName
  canvas.add(view)
  return view
}
export const adjustableShape = ({
  id,
  canvas,
  controls,
  rayCaster,
  plane,
  mouse,
  renderer,
  onDragComplete,
}: AdjustableShapeInput) => {
  const playAreaStore = usePlayAreaStore()
  const {controlPoints: controlPointVectors, closed, concaveHull, filled, tension} = playAreaStore.canvasWalls[id]
  let controlPoints = Object.entries(controlPointVectors).map((vect) => createPoint([vect[0], vect[1].position], canvas))

  const shapeGroup: Group = new Group()
  shapeGroup.add(...controlPoints)
  shapeGroup.uuid = id

  const centralPoint = createCenterPoint(controlPoints, canvas)

  const curveMaterial = new LineBasicMaterial({color: 'white'})
  let {curveGeometry, curve} = createCurveGeometry(controlPoints, tension, centralPoint, concaveHull, closed)
  const curveLine = new Line(curveGeometry, curveMaterial)

  const extrudeSettings = {amount: 1, bevelEnabled: false, depth: 20}
  const points: Vector2[] = []
  let shape = null
  let shapeGeometry
  const shapeMaterial = new MeshBasicMaterial({color: 'red', side: DoubleSide})
  const shapeMesh = new Mesh(shapeGeometry, shapeMaterial)

  let intersects: DraggablePoint[]
  let dragging = false
  let dragObject: Object3D | null
  const pointOfIntersection = new Vector3()
  const planeNormal = new Vector3(0, 1, 0)
  const shift = new Vector3()
  shapeGroup.name = 'adjustableShape'

  shapeGroup.add(shapeMesh)
  shapeGroup.add(curveLine)
  shapeGroup.add(centralPoint)

  shapeMesh.castShadow = true
  shapeMesh.name = 'Wall'
  canvas.add(shapeGroup)

  if (controlPoints.length !== 1) {
    // @ts-ignore
    curveLine.geometry.vertices.forEach((vertex) => {
      points.push(new THREE.Vector2(vertex.x, vertex.z)) // fill the array of points with Vector2() for re-use
    })
  }

  const updateShape = () => {
    if (controlPoints.length === 1) return

    const curveObj = createCurveGeometry(controlPoints, tension, centralPoint, concaveHull, closed)
    curveGeometry = curveObj.curveGeometry
    curve = curveObj.curve
    curveLine.geometry.dispose()
    curveLine.geometry = curveGeometry
    controlPoints.forEach((point) => shapeGroup.add(point))
    shapeGroup.userData.id = controlPoints[0].userData.groupId

    extrudeMesh()
  }
  const extrudeMesh = () => {
    // @ts-ignore
    curveLine.geometry.vertices.forEach((vertex, index) => {
      if (points[index]) points[index].set(vertex.x, vertex.z) // re-use the array
      else points[index] = new Vector2(vertex.x, vertex.z) // re-use the array
    })

    if (filled) {
      shape = new Shape(points)
      shape.autoClose = false
      shapeGeometry = new ExtrudeGeometry(shape, extrudeSettings)
      shapeGeometry.rotateX(Math.PI * .5)
    } else {
      shapeGeometry = new WallGeometry(curve, 75 * controlPoints.length, 2, 10, 8, false)
    }
    shapeGeometry.computeBoundsTree()
    shapeGeometry.translate(0, 0, 0)
    shapeMesh.geometry.dispose()
    shapeMesh.geometry = shapeGeometry
    updateAllLightsShadowCasting(canvas)
  }
  const onMouseDown = (event: MouseEvent) => {
    const controlPointsIntersection: DraggablePoint[] = rayCaster.intersectObjects(controlPoints) as unknown as DraggablePoint[]
    const centralPointIntersection: DraggablePoint[] = rayCaster.intersectObject(centralPoint) as unknown as DraggablePoint[]
    // @ts-ignore
    renderer.shadowMap.autoUpdate = true

    if (event.button === 0) {
      if (controlPointsIntersection.length) intersects = controlPointsIntersection
      else intersects = centralPointIntersection

      if (Array.isArray(intersects) && intersects.length > 0) {
        controls.enableRotate = false
        // @ts-ignore
        dragObject = intersects[0].object
        // @ts-ignore
        plane.setFromNormalAndCoplanarPoint(planeNormal, intersects[0].point)
        // @ts-ignore
        shift.subVectors(dragObject.position, intersects[0].point)
        dragging = true
      }
    }
    if (event.button === 2) {
      if (centralPointIntersection.length || controlPointsIntersection.length) {
        playAreaStore.handleContextMenu({
          top: event.clientY,
          left: event.clientX,
          // @ts-ignore
        }, centralPointIntersection?.[0]?.object ?? controlPointsIntersection?.[0]?.object)
      }
      event.preventDefault()
      return false
    }
  }
  const onMouseUp = (event: MouseEvent) => {
    if (dragging && dragObject) {
      updateAllLightsShadowCasting(canvas)
      // @ts-ignore
      renderer.shadowMap.autoUpdate = false
      if (dragObject.name === 'centerPoint') {
        controlPoints.forEach((point) => {
          playAreaStore.updatePointLocation(point.uuid, shapeGroup.uuid, point.position)
        })
      } else playAreaStore.updatePointLocation(dragObject?.uuid, shapeGroup.uuid, dragObject?.position)
    }
    controls.enableRotate = false
    dragObject = null
    dragging = false

    onDragComplete()
    event.preventDefault()
  }
  const onMouseMove = (event: MouseEvent) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    if (intersects?.length === 0 || !dragging) return

    const curveObj = createCurveGeometry(controlPoints, tension, centralPoint, concaveHull, closed)
    curveGeometry = curveObj.curveGeometry
    curve = curveObj.curve

    if (!dragObject) return

    // @ts-ignore
    if (intersects[0].object.name === 'centerPoint') {
      const oldObjectPosition = dragObject.position.clone()
      rayCaster.ray.intersectPlane(plane, pointOfIntersection)
      dragObject.position.copy(pointOfIntersection).add(shift)
      const newObjectPosition = dragObject.position

      const moveDelta = new Vector3().subVectors(newObjectPosition, oldObjectPosition)

      controlPoints.forEach((point) => {
        point.position.setY(25).add(moveDelta)
      })

      curveLine.geometry.dispose()
      curveLine.geometry = curveGeometry
      extrudeMesh()
    } else {
      rayCaster.ray.intersectPlane(plane, pointOfIntersection)
      dragObject.position.copy(pointOfIntersection).add(shift)
      curveLine.geometry.dispose()
      curveLine.geometry = curveGeometry
      extrudeMesh()
    }
  }

  if (controlPoints.length !== 1) {
    extrudeMesh()
  }

  window.addEventListener('mousedown', onMouseDown, false)
  window.addEventListener('mouseup', onMouseUp, false)
  window.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('contextmenu', (event) => event.preventDefault(), false)

  playAreaStore.$subscribe(({events}) => {
    const parsedEvents = Array.isArray(events) ? events : [events]
    parsedEvents.forEach((event) => {
      if (event.key === 'contextMenu' || event.key === 'display' || event.key === 'drawMode') return

      if (event.type === 'add' && event.newValue.type === 'controlPoint' && playAreaStore.currentDrawingId === shapeGroup.uuid) {
        const newPoint = createPoint([event.key, event.newValue.position], canvas)
        shapeGroup.add(newPoint)
        controlPoints.push(newPoint)
        updateShape()
      }
      if (event.type === 'delete' && event.oldValue.type === 'controlPoint' && playAreaStore.targetedObject?.parent?.uuid === shapeGroup.uuid) {
        shapeGroup.children.find((el) => el.uuid === event.key)?.removeFromParent()
        controlPoints = controlPoints.filter((point) => point.uuid !== event.key)
        updateShape()
      }
      if (event.type === 'set' && event.newValue.type === 'wall' && event.key === shapeGroup.uuid) {
        const curveObj = createCurveGeometry(controlPoints, event.newValue.tension, centralPoint, concaveHull, closed)
        curveGeometry = curveObj.curveGeometry
        curve = curveObj.curve
        curveLine.geometry.dispose()
        curveLine.geometry = curveGeometry
        extrudeMesh()
      }
    })
  })
}

