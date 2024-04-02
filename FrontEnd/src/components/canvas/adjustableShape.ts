import * as THREE from 'three'
import {
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial, Object3D,
  Plane,
  Raycaster,
  Renderer,
  Scene,
  Vector2,
  Vector3,
} from 'three'
import {Ref, watch} from 'vue'
import concaveman from 'concaveman'
import {WallGeometry} from './WallGeometry'
import {updateAllLightsShadowCasting} from './lightController'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

export type AdjustableShapeInput = {
  scene: Scene,
  controls: OrbitControls,
  rayCaster: Raycaster,
  originPoint: DraggablePoint,
  plane: Plane,
  mouse: Vector2,
  tension: Ref<number>,
  renderer: Renderer,
  filled: boolean,
  closed: boolean,
  concaveHull: boolean,
  handleContextMenu: () => void,
  onDragComplete: () => void,
}

export type DraggablePoint = Mesh | Object3D

const findCenterOfObject = (points: Vector3[]) => {
  const xCenter = points.reduce((acc, cur) => acc + cur.x, 0) / points.length
  const zCenter = points.reduce((acc, cur) => acc + cur.z, 0) / points.length

  return new Vector3(xCenter, 0, zCenter)
}

const createCenterPoint = (controlPoints: DraggablePoint[], scene: Scene) => {
  const points = controlPoints.reduce((acc: Vector3[], cur) => [...acc, cur.position], [])

  return createPoint(findCenterOfObject(points), scene, 'blue', 'centerPoint')
}

const createCurveGeometry = (controlPoints: DraggablePoint[], tension: Ref<number>, centralPoint: DraggablePoint, concaveHull: boolean, closed: boolean) => {
  let pts: number[][] = []
  let vectorPoints: Vector3[] = []

  controlPoints.forEach((pt) => {
    pts.push([pt.position.x, pt.position.z])
  })
  if (concaveHull) {
    pts = concaveman(pts, 1)
    if (!closed) pts.pop()
  }

  vectorPoints = pts.map((pt) => new THREE.Vector3(pt[0], 0, pt[1]))

  if (vectorPoints.length <= 1) return {}

  const curve = new THREE.CatmullRomCurve3(vectorPoints, false, 'catmullrom', tension.value)
  const curveGeometry = new BufferGeometry()
  // @ts-ignore
  curveGeometry.vertices = curve.getPoints(75)
  curveGeometry.translate(0, 1, 0)

  const newCenterLocation = findCenterOfObject(vectorPoints)
  centralPoint.position.set(newCenterLocation.x, newCenterLocation.y, newCenterLocation.z)

  return {curveGeometry, curve}
}

export const createPoint = (position: Vector3, scene: Scene, color = 'white', objectName = 'controlPoint'): DraggablePoint => {
  const viewGeometry = new THREE.BoxGeometry(15, 50, 15, 1, 3, 1)
  viewGeometry.translate(0, .75, 0)
  const viewMaterial = new THREE.MeshBasicMaterial({color: color, wireframe: false, transparent: true, opacity: .5})
  const view = new THREE.Mesh(viewGeometry, viewMaterial)
  view.position.copy(position)
  view.name = objectName
  scene.add(view)
  return view
}
export const adjustableShape = ({
  scene,
  controls,
  rayCaster,
  originPoint,
  plane,
  mouse,
  tension,
  renderer,
  filled = true,
  closed = false,
  concaveHull = true,
  handleContextMenu,
  onDragComplete,
}: AdjustableShapeInput) => {
  const shapeGroup = new Group()
  shapeGroup.add(originPoint)
  let controlPoints: DraggablePoint[] = shapeGroup.children.filter((child) => child.name === 'controlPoint')

  const centralPoint = createCenterPoint(controlPoints, scene)

  const curveMaterial = new LineBasicMaterial({color: 'white'})
  let {curveGeometry, curve} = createCurveGeometry(controlPoints, tension, centralPoint, concaveHull, closed)
  const curveLine = new Line(curveGeometry, curveMaterial)

  const extrudeSettings = {amount: 1, bevelEnabled: false, depth: 20}
  const points: Vector2[] = []
  let shape = null
  let shapeGeometry
  const shapeMaterial = new MeshBasicMaterial({color: 'red', side: THREE.DoubleSide})
  const shapeMesh = new Mesh(shapeGeometry, shapeMaterial)

  let intersects: DraggablePoint[]
  let dragging = false
  let dragObject
  const pointOfIntersection = new Vector3()
  const planeNormal = new Vector3(0, 1, 0)
  const shift = new Vector3()
  shapeGroup.name = 'adjustableShape'

  shapeGroup.add(shapeMesh)
  shapeGroup.add(curveLine)
  shapeGroup.add(centralPoint)

  watch(tension, () => {
    if (controlPoints.length === 0) return
    const curveObj = createCurveGeometry(controlPoints, tension, centralPoint, concaveHull, closed)
    curveGeometry = curveObj.curveGeometry
    curve = curveObj.curve
    curveLine.geometry.dispose()
    curveLine.geometry = curveGeometry
    extrudeMesh()
  })

  shapeMesh.castShadow = true
  shapeMesh.name = 'Wall'
  scene.add(shapeGroup)

  if (controlPoints.length !== 1) {
    curveLine.geometry.vertices.forEach((vertex, index) => {
      points.push(new THREE.Vector2(vertex.x, vertex.z)) // fill the array of points with THREE.Vector2() for re-use
    })
  }

  const updateShape = () => {
    controlPoints = shapeGroup.children.filter((child) => child.name === 'controlPoint')

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
    curveLine.geometry.vertices.forEach((vertex, index) => {
      if (points[index]) points[index].set(vertex.x, vertex.z) // re-use the array
      else points[index] = new THREE.Vector2(vertex.x, vertex.z) // re-use the array
    })

    if (filled) {
      shape = new THREE.Shape(points)
      shape.autoClose = false
      shapeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      shapeGeometry.rotateX(Math.PI * .5)
    } else {
      shapeGeometry = new WallGeometry(curve, 75 * controlPoints.length, 2, 10, 8, false)
    }
    shapeGeometry.computeBoundsTree()
    shapeGeometry.translate(0, 0, 0)
    shapeMesh.geometry.dispose()
    shapeMesh.geometry = shapeGeometry
    updateAllLightsShadowCasting(scene)
  }
  if (controlPoints.length !== 1) {
    extrudeMesh()
  }
  const onMouseDown = (event) => {
    const controlPointsIntersection: DraggablePoint[] = rayCaster.intersectObjects(controlPoints) as unknown as DraggablePoint[]
    const centralPointIntersection: DraggablePoint[] = rayCaster.intersectObject(centralPoint) as unknown as DraggablePoint[]
    renderer.shadowMap.autoUpdate = true

    if (event.button === 0) {
      if (controlPointsIntersection.length) intersects = controlPointsIntersection
      else intersects = centralPointIntersection

      if (Array.isArray(intersects) && intersects.length > 0) {
        controls.enableRotate = false
        dragObject = intersects[0].object
        plane.setFromNormalAndCoplanarPoint(planeNormal, intersects[0].point)
        shift.subVectors(dragObject.position, intersects[0].point)
        dragging = true
      }
    }
    if (event.button === 2) {
      if (centralPointIntersection.length || controlPointsIntersection.length) {
        handleContextMenu({
          top: event.clientY,
          left: event.clientX,
        }, centralPointIntersection?.[0]?.object ?? controlPointsIntersection?.[0]?.object)
      }
      event.preventDefault()
      return false
    }
  }

  const onMouseUp = (event) => {
    controls.enableRotate = false
    dragObject = null
    if (dragging) {
      updateAllLightsShadowCasting(scene)
      renderer.shadowMap.autoUpdate = false
    }
    dragging = false

    onDragComplete()
    event.preventDefault()
  }

  const onMouseMove = (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    if (intersects?.length === 0 || !dragging) return

    const curveObj = createCurveGeometry(controlPoints, tension, centralPoint, concaveHull, closed)
    curveGeometry = curveObj.curveGeometry
    curve = curveObj.curve

    if (intersects[0].object.name === 'centerPoint') {
      const oldObjectPosition = dragObject.position.clone()
      rayCaster.ray.intersectPlane(plane, pointOfIntersection)
      dragObject.position.copy(pointOfIntersection).add(shift)
      const newObjectPosition = dragObject.position

      const moveDelta = new Vector3().subVectors(newObjectPosition, oldObjectPosition)

      controlPoints.forEach((point, index) => {
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

  window.addEventListener('mousedown', onMouseDown, false)
  window.addEventListener('mouseup', onMouseUp, false)
  window.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('contextmenu', (event) => event.preventDefault(), false)

  return [updateShape, extrudeMesh, shapeGroup]
}

