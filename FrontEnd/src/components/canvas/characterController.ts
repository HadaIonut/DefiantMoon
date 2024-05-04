import * as THREE from 'three'
import {Camera, Renderer, Scene, Vector3} from 'three'
import {addDragControls} from 'src/utils/CanvasUtils'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {rtFetch} from 'src/utils/fetchOverRTC'

export const hideNonVisibleLights = (canvas: Scene, viewDistance = 400) => {
  const playAreaStore = usePlayAreaStore()
  const [, player] = playAreaStore.getActivePlayer
  const position = player?.position

  if (!position) return

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

  hideNonVisibleLights(canvas)
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
  setTimeout(() => hideNonVisibleLights(canvas), 10)

  const handleNetworkRequest = (canvasId: string, playerId: string, networkUpdate = false) => {
    if (networkUpdate) {
      console.log('skipping update')
      playerAreaStore.canvasPlayers[playerId].networkUpdate = false
      return
    }
    console.log('player update network')

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
      setTimeout(() => playerAreaStore.updatePlayerLocation(cylinder.uuid, newPosition), 0)
    },
  })
  canvas.add(cylinder)

  return playerAreaStore.$onAction(({name, after}) => {
    after((resolvedReturn) => {
      console.log(name)
      if ((name === 'updatePlayer' || name === 'updatePlayerLocation') && resolvedReturn === cylinder.uuid) {
        console.log('updating the canvas')
        const player = playerAreaStore.canvasPlayers[resolvedReturn]
        cylinder.position.copy(player.position)
        hideNonVisibleLights(canvas)
        handleNetworkRequest(playerAreaStore.id, playerId, player.networkUpdate)
        if (playerAreaStore.canvasPlayers[playerId]?.isActive) {
          cylinder.material = new THREE.MeshBasicMaterial({color: 0xff0000})
        } else {
          cylinder.material = new THREE.MeshBasicMaterial({color: 0xffff00})
        }
      }
    })
  })
}
