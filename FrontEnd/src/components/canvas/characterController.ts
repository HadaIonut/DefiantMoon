import * as THREE from 'three'
import {Camera, Renderer, Scene, Vector3} from 'three'
import {addDragControls} from 'src/utils/CanvasUtils'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {rtFetch} from 'src/utils/fetchOverRTC'
export const hideNonVisibleLights = (canvas: Scene, viewDistance = 400) => {
  const playAreaStore = usePlayAreaStore()
  const [, player] = playAreaStore.getActivePlayer
  const position = player.position

  const lights = canvas.getObjectsByProperty('name', 'sourceLight')
  const walls = canvas.getObjectsByProperty('name', 'adjustableShape')
    .map((group) => group.children)
    .reduce((acc, cur) => [...acc, ...cur], []).filter((el) => el.name === 'Wall')

  lights.forEach((cur) => {
    const raycaster = new THREE.Raycaster()
    const direction = new THREE.Vector3()

    const lightSource = canvas.getObjectByProperty('name', `sourceLight-${cur.uuid}`)

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

export const handleKeyNavigation = (event: KeyboardEvent, canvas: Scene) => {
  const playerAreaStore = usePlayAreaStore()
  const [playerId] = playerAreaStore.getActivePlayer
  const playerPosition = playerAreaStore.getCurrentPlayerPosition
  if (!playerPosition || !playerId) return

  if (event.key === 'ArrowUp') {
    playerPosition.add(new Vector3(0, 0, -50))
    playerAreaStore.updatePlayerLocation(playerId, playerPosition)
  } else if (event.key === 'ArrowDown') {
    playerPosition.add(new Vector3(0, 0, 50))
    playerAreaStore.updatePlayerLocation(playerId, playerPosition)
  } else if (event.key === 'ArrowLeft') {
    playerPosition.add(new Vector3(-50, 0, 0))
    playerAreaStore.updatePlayerLocation(playerId, playerPosition)
  } else if (event.key === 'ArrowRight') {
    playerPosition.add(new Vector3(50, 0, 0))
    playerAreaStore.updatePlayerLocation(playerId, playerPosition)
  }

  hideNonVisibleLights(canvas, playerAreaStore.canvasPlayers[playerId].position)
}

export const initCharacter = (canvas: Scene, camera: Camera, renderer: Renderer, playerId: string) => {
  const playerAreaStore = usePlayAreaStore()
  const {position} = playerAreaStore.canvasPlayers[playerId]

  const otherPlayers = canvas.getObjectsByProperty('name', 'player')
  otherPlayers.forEach((player) => {
    player.userData.selected = false
  })

  const geometry = new THREE.CylinderGeometry(20, 5, 20, 32)
  const material = new THREE.MeshBasicMaterial({color: 0xffff00})
  const cylinder = new THREE.Mesh(geometry, material)

  cylinder.name = 'player'
  cylinder.uuid = playerId

  canvas.add(cylinder)

  cylinder.position.copy(position)
  setTimeout(() => hideNonVisibleLights(canvas, cylinder.position), 10)

  const handleNetworkRequest = (canvasId: string, playerId: string, networkUpdate = false) => {
    if (networkUpdate) {
      playerAreaStore.canvasPlayers[playerId].networkUpdate = false
      return
    }

    rtFetch({
      route: `/api/canvas/${canvasId}/player/${playerId}`,
      method: 'PATCH',
      body: playerAreaStore.getNetworkPlayer(playerId),
    })
  }

  addDragControls(camera, renderer)({
    primary: cylinder, onDragComplete: (newPosition) => {
      playerAreaStore.selectPlayer(cylinder.uuid)
      hideNonVisibleLights(canvas)
      playerAreaStore.updatePlayerLocation(cylinder.uuid, newPosition)
    },
  })

  playerAreaStore.$subscribe(({events}) => {
    const parsedEvents = Array.isArray(events) ? events : [events]
    parsedEvents.forEach((event) => {
      if (event.type === 'set' && event.key === playerId) {
        cylinder.position.copy(event.newValue.position)
        hideNonVisibleLights(canvas)
        handleNetworkRequest(playerAreaStore.id, playerId, event.newValue.networkUpdate)
      } else if (event.type === 'add' && event.newValue.type === 'player') {
        console.log('adding player')
        handleNetworkRequest(playerAreaStore.id, event.key)
      }
    })
  })

  canvas.add(cylinder)
  return cylinder
}
