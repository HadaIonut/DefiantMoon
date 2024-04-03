import * as THREE from 'three'
import {Camera, Object3D, Renderer, Scene, Vector3} from 'three'
import {addDragControls, getActivePlayer} from 'src/utils/CanvasUtils'

export const hideNonVisibleLights = (scene: Scene, position: Vector3, viewDistance = 400) => {
  const lights = scene.getObjectsByProperty('name', 'sourceLight')
  const walls = scene.getObjectsByProperty('name', 'adjustableShape')
    .map((group) => group.children)
    .reduce((acc, cur) => [...acc, ...cur], []).filter((el) => el.name === 'Wall')

  lights.forEach((cur) => {
    const raycaster = new THREE.Raycaster()
    const direction = new THREE.Vector3()

    const lightSource = scene.getObjectByProperty('name', `sourceLight-${cur.uuid}`)

    if (!lightSource) return

    raycaster.firstHitOnly = true
    direction.subVectors(cur.position, position)

    raycaster.set(position, direction.normalize())
    raycaster.near = 0
    raycaster.far = viewDistance

    const intersects = raycaster.intersectObjects([cur, ...walls], false).map((el) => el.object)

    if (intersects[0]?.name === 'sourceLight') {
      cur.visible = true
      lightSource.visible = true
    } else {
      lightSource.visible = false
      cur.visible = false
    }
  }, [])
}

const handleKeyNavigation = (event: KeyboardEvent, scene: Scene) => {
  const player = getActivePlayer(scene)
  if (event.key === 'ArrowUp') {
    player.translateZ(-25)
  } else if (event.key === 'ArrowDown') {
    player.translateZ(25)
  } else if (event.key === 'ArrowLeft') {
    player.translateX(-25)
  } else if (event.key === 'ArrowRight') {
    player.translateX(25)
  }

  hideNonVisibleLights(scene, player.position)
}

const selectPlayer = (currentPlayer: Object3D, scene: Scene) => {
  const otherPlayers = scene.getObjectsByProperty('name', 'player')
  otherPlayers.forEach((player) => {
    player.userData.selected = false
  })
  currentPlayer.userData.selected = true
}

export const initCharacter = (scene: Scene, camera: Camera, renderer: Renderer, location = new Vector3(25, 10, 25)) => {
  const otherPlayers = scene.getObjectsByProperty('name', 'player')
  otherPlayers.forEach((player) => {
    player.userData.selected = false
  })

  const geometry = new THREE.CylinderGeometry(20, 5, 20, 32)
  const material = new THREE.MeshBasicMaterial({color: 0xffff00})
  const cylinder = new THREE.Mesh(geometry, material)

  cylinder.userData = {
    selected: true,
  }

  cylinder.name = 'player'

  scene.add(cylinder)

  cylinder.position.set(location.x, location.y, location.z)
  setTimeout(() => hideNonVisibleLights(scene, cylinder.position), 10)

  addDragControls(camera, renderer)({
    primary: cylinder, onDragComplete: (newPosition) => {
      selectPlayer(cylinder, scene)
      hideNonVisibleLights(scene, cylinder.position)
    },
  })

  document.addEventListener('keydown', (event) => handleKeyNavigation(event, scene))

  scene.add(cylinder)
  return cylinder
}
