import * as THREE from 'three'
import {Camera, Object3D, Renderer, Scene, Vector3} from 'three'
// @ts-ignore
import {DragControls} from 'three/addons/controls/DragControls.js'

export type DragControlsParams = {
  primary: Object3D,
  secondary?: Object3D,
  onDragComplete?: (position: Vector3) => void
}

export const findLocationFromCoords = (x: number, y: number, camera: Camera, canvas: Scene): Vector3 => {
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  mouse.x = (x / window.innerWidth) * 2 - 1
  mouse.y = -(y / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  const intersectedObjects = raycaster.intersectObjects(canvas.children)

  if (intersectedObjects.length === 0) return new Vector3()
  return new THREE.Vector3(intersectedObjects[0].point.x, 0, intersectedObjects[0].point.z)
}

export const getRandomInt = (max: number) => {
  return Math.ceil(Math.random() * max) * (Math.round(Math.random()) ? 1 : -1)
}

const handleDraggedEvent = (renderer: Renderer, {primary, secondary, onDragComplete}: DragControlsParams) => {
  const grid = 50
  const halfGrd = grid / 2
  primary.position.set(
    Math.round((primary.position.x + halfGrd) / grid) * grid - halfGrd,
    primary.position.y,
    Math.round((primary.position.z + halfGrd) / grid) * grid - halfGrd,
  )

  if (secondary) {
    secondary.position.set(primary.position.x, primary.position.y, primary.position.z)
  }

  // @ts-ignore
  renderer.shadowMap.needsUpdate = true

  onDragComplete?.(primary.position)
}

export const addDragControls = (camera: Camera, renderer: Renderer) => ({primary, secondary, onDragComplete}: DragControlsParams) => {
  const controls = new DragControls([primary], camera, renderer.domElement)

  controls.addEventListener('drag', () => {
    if (secondary) {
      secondary.position.x = primary.position.x
      secondary.position.z = primary.position.z
    }
  })

  controls.addEventListener('dragend', () => handleDraggedEvent(renderer, {primary, secondary, onDragComplete}))
}

export const getActivePlayer = (canvas: Scene) => {
  const player = canvas.getObjectsByProperty('name', 'player')
  return player.filter((player) => player.userData.selected)[0] || player[0]
}

export const pointsAreEqual = (controlPoint: Vector3, point: Vector3) => {
  return (controlPoint.x === point.x && controlPoint.y === point.y && controlPoint.z === point.z)
}

export const removeObjectsWithChildren = (obj: any) => {
  if (obj.children.length > 0) {
    for (let x = obj.children.length - 1; x>=0; x--) {
      removeObjectsWithChildren( obj.children[x])
    }
  }

  if (obj.geometry) {
    obj.geometry.dispose()
  }

  if (obj.material) {
    if (obj.material.length) {
      for (let i = 0; i < obj.material.length; ++i) {
        if (obj.material[i].map) obj.material[i].map.dispose()
        if (obj.material[i].lightMap) obj.material[i].lightMap.dispose()
        if (obj.material[i].bumpMap) obj.material[i].bumpMap.dispose()
        if (obj.material[i].normalMap) obj.material[i].normalMap.dispose()
        if (obj.material[i].specularMap) obj.material[i].specularMap.dispose()
        if (obj.material[i].envMap) obj.material[i].envMap.dispose()

        obj.material[i].dispose()
      }
    } else {
      if (obj.material.map) obj.material.map.dispose()
      if (obj.material.lightMap) obj.material.lightMap.dispose()
      if (obj.material.bumpMap) obj.material.bumpMap.dispose()
      if (obj.material.normalMap) obj.material.normalMap.dispose()
      if (obj.material.specularMap) obj.material.specularMap.dispose()
      if (obj.material.envMap) obj.material.envMap.dispose()

      obj.material.dispose()
    }
  }

  obj.removeFromParent()

  return true
}
