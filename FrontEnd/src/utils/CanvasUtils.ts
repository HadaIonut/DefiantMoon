import * as THREE from 'three'
import {Camera, Scene, Vector3} from 'three'
import {DragControls} from 'three/addons/controls/DragControls.js'

export const findLocationFromCoords = (x: number, y: number, camera: Camera, scene: Scene): Vector3 => {
  const reycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  mouse.x = (x / window.innerWidth) * 2 - 1
  mouse.y = -(y / window.innerHeight) * 2 + 1

  reycaster.setFromCamera(mouse, camera)
  const intersectedObjects = reycaster.intersectObjects(scene.children)

  if (intersectedObjects.length === 0) return []
  return new THREE.Vector3(intersectedObjects[0].point.x, 0, intersectedObjects[0].point.z)
}

export const getRandomInt = (max: number) => {
  return Math.ceil(Math.random() * max) * (Math.round(Math.random()) ? 1 : -1)
}

export const addDragControls = (camera, renderer) => ({primary, secondary, onDragComplete}) => {
  const controls = new DragControls([primary], camera, renderer.domElement)

  controls.addEventListener('drag', () => {
    if (secondary) {
      secondary.position.x = primary.position.x
      secondary.position.z = primary.position.z
    }
  })

  controls.addEventListener('dragend', () => {
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

    renderer.shadowMap.needsUpdate = true

    onDragComplete?.(primary.position)
  })
}

export const getActivePlayer = (scene) => {
  const player = scene.getObjectsByProperty('name', 'player')
  return player.filter((player) => player.userData.selected)[0]
}
