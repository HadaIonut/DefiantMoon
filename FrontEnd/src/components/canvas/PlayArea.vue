<script setup lang="ts">
import {Ref, ref, watch} from 'vue'
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
import {findLocationFromCoords} from 'src/utils/CanvasUtils'
import {handleKeyNavigation, hideNonVisibleLights, initCharacter} from './characterController'
import {adjustableShape} from 'src/components/canvas/adjustableShape'
import Stats from 'three/examples/jsm/libs/stats.module'
import {canvasSpawnLight} from 'src/components/canvas/lightController'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {initGround} from 'src/components/canvas/groud'

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

let camera: Camera
let scene: Scene
let renderer: Renderer
let controls: OrbitControls
let rayCaster: Raycaster
let plane: Plane
const canvas: Ref<HTMLElement | null> = ref(null)
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
const playAreaStore = usePlayAreaStore()

const enableRotation = false

const mouse = new Vector2()

const handleDragComplete = () => {
  if (!playAreaStore.getCurrentPlayerPosition) return

  hideNonVisibleLights(scene, playAreaStore.getCurrentPlayerPosition)
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

const initCanvas = () => {
  scene = new Scene()
  scene.background = new Color(0x333333)

  initGUI()
  // @ts-ignore
  watch(canvas, (newValue: HTMLElement) => {
    if (!newValue) return
    newValue.appendChild(renderer.domElement)
    newValue.addEventListener('click', (event) => {
      if (!playAreaStore.drawMode) return
      const clickLocation = findLocationFromCoords(event.clientX, event.clientY, camera, scene)

      if (!playAreaStore.canvasWalls[playAreaStore.currentDrawingId]) {
        playAreaStore.createNewWall(clickLocation, 0, false, false, false)
        return
      }
      playAreaStore.addPointToShape(clickLocation, playAreaStore.currentDrawingId)
    })
  })
  initGround(scene)

  Object.keys(playAreaStore.canvasPlayers).forEach((playerId) => {
    initCharacter(scene, camera, renderer, playerId)
  })

  Object.keys(playAreaStore.canvasLights).forEach((key) => {
    canvasSpawnLight(scene, camera, renderer, key)
  })

  Object.keys(playAreaStore.canvasWalls).forEach((key) => {
    adjustableShape({
      id: key,
      scene,
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

  renderer.render(scene, camera)
  stats.end()
}

initEngine()
initCanvas()
animate()

playAreaStore.$subscribe((mutation) => {
  if (mutation.type === 'patch function') {
    initCanvas()
  }
  if (mutation.type === 'direct') {
    const parsedEvents = Array.isArray(mutation.events) ? mutation.events : [mutation.events]
    parsedEvents.forEach((event) => {
      if (event?.newValue?.type === 'light' && event?.type === 'add') {
        canvasSpawnLight(scene, camera, renderer, event.key)
      } else if (event.type === 'add' && event.newValue.type === 'wall') {
        adjustableShape({
          id: event.key,
          scene,
          controls,
          rayCaster,
          plane,
          mouse,
          renderer,
          onDragComplete: handleDragComplete,
        })
      } else if (event.type === 'add' && event.newValue.type === 'player') {
        initCharacter(scene, camera, renderer, event.key)
      } else if (event.type === 'set' && event.key === 'isActive') {
        scene.getObjectsByProperty('name', 'player').forEach((player) => {
          player.userData.selected = playAreaStore.canvasPlayers[player.uuid].isActive
        })
      }
    })
  }
})

document.addEventListener('keydown', (event) => handleKeyNavigation(event, scene))

</script>

<template>
  <div ref="canvas" style="width: 100%; height: 100%">
    <CanvasContextMenu/>
  </div>
</template>

<style scoped lang="scss">

</style>
