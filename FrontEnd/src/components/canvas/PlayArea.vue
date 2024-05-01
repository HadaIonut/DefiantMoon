<script setup lang="ts">
import {onMounted, onUnmounted, Ref, ref, toRaw, watch} from 'vue'
import * as THREE from 'three'
import {
  Camera,
  Color,
  OrthographicCamera,
  PCFSoftShadowMap,
  Plane,
  Raycaster,
  Renderer,
  Scene, Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min'
import {acceleratedRaycast, computeBoundsTree, disposeBoundsTree} from 'three-mesh-bvh'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {findLocationFromCoords, removeObjectsWithChildren} from 'src/utils/CanvasUtils'
import {handleKeyNavigation, hideNonVisibleLights, initCharacter} from './characterController'
import {adjustableShape} from 'src/components/canvas/adjustableShape'
import Stats from 'three/examples/jsm/libs/stats.module'
import {canvasSpawnLight} from 'src/components/canvas/lightController'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {initGround} from 'src/components/canvas/groud'
import {websocket} from 'src/websocket/websocket'
import {WEBSOCKET_RECEIVABLE_EVENTS} from 'src/websocket/events'
import {useUsersStore} from 'src/stores/users'
import {useCanvasCollectionStore} from 'src/stores/CanvasCollection'

const playAreaStore = usePlayAreaStore()

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

let camera: Camera
let canvas: Scene
let renderer: WebGLRenderer
let controls: OrbitControls
let rayCaster: Raycaster
let plane: Plane
const canvasElement: Ref<HTMLElement | null> = ref(null)
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const enableRotation = false

const mouse = new Vector2()

const handleDragComplete = () => {
  if (!playAreaStore.getCurrentPlayerPosition) return

  hideNonVisibleLights(canvas)
}
const initGUI = () => {
  const panel = new GUI({width: 310})
  const settings = {
    'enable rotation': false,
    'wall tension': 0,
    'light color': 0xffffff,
    'ground size': playAreaStore.groundDimension,
    'grid size': playAreaStore.gridSize,
  }
  panel.add(settings, 'ground size', 0, 10000, 10).onChange((newValue) => {
    playAreaStore.groundDimension = newValue
  })
  panel.add(settings, 'grid size', 0, 500, 1).onChange((newValue) => {
    playAreaStore.gridSize = newValue
  })
  panel.add(settings, 'wall tension', 0, 1, 0.1).onChange((newValue) => {
    Object.keys(playAreaStore.canvasWalls).forEach((key) => {
      playAreaStore.canvasWalls[key] = {
        ...playAreaStore.canvasWalls[key],
        tension: newValue,
      }
    })
  })
  panel.addColor(settings, 'light color', 0xffffff).onChange((newValue) => {
    Object.keys(playAreaStore.canvasLights).forEach((key) => {
      playAreaStore.canvasLights[key].color = newValue
    })
  })
}
const initEngine = () => {
  rayCaster = new Raycaster()
  plane = new Plane()
  plane.setFromCoplanarPoints(new Vector3(), new Vector3(1, 0, 0), new Vector3(0, 0, 1))
  camera = new OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000)
  camera.position.set(0, 700, 0)

  renderer = new WebGLRenderer({antialias: true})
  renderer.setSize(window.innerWidth, window.innerHeight)
  // @ts-ignore
  renderer.shadowMap.type = PCFSoftShadowMap
  // @ts-ignore
  renderer.shadowMap.enabled = true
  // @ts-ignore
  renderer.shadowMap.autoUpdate = false

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableRotate = enableRotation
  controls.enabled = true
}

const handleCanvasClick = (event: MouseEvent) => {
  if (!playAreaStore.drawMode) return
  const clickLocation = findLocationFromCoords(event.clientX, event.clientY, camera, canvas)

  if (!playAreaStore.canvasWalls[playAreaStore.currentDrawingId]) {
    playAreaStore.createNewWall(clickLocation, 0, false, false, false)
    return
  }
  playAreaStore.addPointToShape(clickLocation, playAreaStore.currentDrawingId)
}
const initCanvas = () => {
  canvas = new Scene()
  canvas.background = new Color(0x333333)

  initGUI()
  // @ts-ignore
  watch(canvasElement, (newValue: HTMLElement) => {
    if (!newValue) return
    newValue.appendChild(renderer.domElement)
    newValue.addEventListener('click', handleCanvasClick)
  })
  initGround(canvas)

  Object.keys(playAreaStore.canvasPlayers).forEach((playerId) => {
    initCharacter(canvas, camera, renderer, playerId)
  })

  Object.keys(playAreaStore.canvasLights).forEach((key) => {
    canvasSpawnLight(canvas, camera, renderer, key)
  })

  Object.keys(playAreaStore.canvasWalls).forEach((key) => {
    adjustableShape({
      id: key,
      canvas: canvas,
      controls,
      rayCaster,
      plane,
      mouse,
      renderer,
      onDragComplete: handleDragComplete,
    })
  })
}
const animate = () => {
  stats.begin()
  requestAnimationFrame(animate)

  rayCaster.setFromCamera(mouse, camera)

  renderer.render(canvas, camera)
  stats.end()
}
const subscribeToStore = () => {
// TODO CLEAN UP THE FUCKING CLOWN FUCNTION
  playAreaStore.$subscribe((mutation) => {
    if (mutation.type === 'patch function') {
      console.log(mutation, 'patch')
      removeObjectsWithChildren(canvas)
      initCanvas()
    }
    if (mutation.type === 'direct') {
      const parsedEvents = Array.isArray(mutation.events) ? mutation.events : [mutation.events]
      console.log(parsedEvents)
      parsedEvents.forEach((event) => {
        if (event?.newValue?.type === 'light' && event?.type === 'add') {
          canvasSpawnLight(canvas, camera, renderer, event.key)
        } else if (event.type === 'add' && event.newValue.type === 'wall') {
          adjustableShape({
            id: event.key,
            canvas: canvas,
            controls,
            rayCaster,
            plane,
            mouse,
            renderer,
            onDragComplete: handleDragComplete,
          })
        } else if (event.type === 'add' && event.newValue.type === 'player') {
          initCharacter(canvas, camera, renderer, event.key)
        } else if (event.type === 'set' && event.key === 'isActive') {
          canvas.getObjectsByProperty('name', 'player').forEach((player) => {
            player.userData.selected = playAreaStore.canvasPlayers[player.uuid].isActive
          })
        }
      })
    }
  })
}
const subscribeToEvents = () => {
  document.addEventListener('keydown', (event) => handleKeyNavigation(event, canvas))
  websocket.addEventListener(WEBSOCKET_RECEIVABLE_EVENTS.CANVAS_UPDATE, (message) => {
    const userStore = useUsersStore()
    const canvasCollectionStore = useCanvasCollectionStore()

    if (message.source === userStore.currentUser.id) return
    if (message.canvasId !== canvasCollectionStore.active) return

    if (message.playerId) {
      handlePlayerNetworkEvent(message)
    } else if (message.lightId) {
      handleLightNetworkEvent(message)
    } else if (message.wallId) {
      handleWallNetworkEvent(message)
    }
  })
}
const handleWallNetworkEvent = (message: Record<string, any>) => {
  if (Object.keys(playAreaStore.canvasWalls).includes(message.wallId)) {
    Object.assign(playAreaStore.canvasWalls[message.wallId], message.data)
    playAreaStore.canvasWalls[message.wallId].networkUpdate = true
  } else {
    const [newWallOriginId, newWallOriginValue] = Object.entries(message.data.controlPoints)[0]
    playAreaStore.createNewWall(newWallOriginValue.position, 0, false, false, false, newWallOriginId, message.wallId)
    playAreaStore.canvasWalls[message.wallId].networkUpdate = true
  }
}
const handlePlayerNetworkEvent = (message: Record<string, any>) => {
  const newPosition = message.data.position

  if (Object.keys(playAreaStore.canvasPlayers).includes(message.playerId)) {
    playAreaStore.updatePlayerLocation(message.playerId, new Vector3(newPosition.x, newPosition.y, newPosition.z), true)
  } else {
    playAreaStore.addPlayerToCanvas(new Vector3(newPosition.x, newPosition.y, newPosition.z), message.playerId)
  }
}
const handleLightNetworkEvent = (message: Record<string, any>) => {
  const newPosition = message.data.position

  if (Object.keys(playAreaStore.canvasLights).includes(message.lightId)) {
    playAreaStore.updateLightLocation(message.lightId, new Vector3(newPosition.x, newPosition.y, newPosition.z), true)
  } else {
    playAreaStore.addLightToCanvas({
      position: newPosition,
      indicatorId: message.data.indicatorId,
      lightId: message.lightId,
    })
  }
}

initEngine()
initCanvas()
animate()
subscribeToEvents()
subscribeToStore()

onUnmounted(() => {
  removeObjectsWithChildren(canvas)
})

</script>

<template>
  <div ref="canvasElement" style="width: 100%; height: 100%">
    <CanvasContextMenu/>
  </div>
</template>

<style scoped lang="scss">

</style>
