<script setup lang="ts">
import {onMounted, Ref, ref, watch} from 'vue'
import * as THREE from 'three'
import {
  Camera,
  Color, Mesh,
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
import {findLocationFromCoords, getRandomInt} from 'src/utils/CanvasUtils'
import {hideNonVisibleLights, initCharacter} from './characterController'
import {adjustableShape, createPoint} from 'src/components/canvas/adjustableShape'
import Stats from 'three/examples/jsm/libs/stats.module'
import {canvasSpawnLight, initLights} from 'src/components/canvas/lightController'
import {usePlayAreaStore} from 'src/stores/PlayArea'

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
const wallTension = ref(0)
// const lightColor = ref(0xffffff)
// const drawMode = ref(false)

const mouse = new Vector2()
// const currentDrawingId: string = ''
let player: Mesh
const groundSizes = [1000, 1000]

const initGUI = () => {
  const panel = new GUI({width: 310})
  const settings = {
    'enable rotation': false,
    'wall tension': 0,
    'light color': 0xffffff,
  }
  panel.add(settings, 'enable rotation').onChange((newValue) => controls.enableRotate = newValue)
  panel.add(settings, 'wall tension', 0, 1, 0.1).onChange((newValue) => wallTension.value = newValue)
  panel.addColor(settings, 'light color', 0xffffff).onChange((newValue) => {
    Object.keys(playAreaStore.canvasLights).forEach((key) => {
      playAreaStore.canvasLights[key].color = newValue
    })
    // lightColor.value = newValue
  })
}

const initGround = () => {
  const groundTexture = new THREE.TextureLoader().load('./map.jpg')
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(groundSizes[0], groundSizes[1]),
    new THREE.MeshStandardMaterial({
      map: groundTexture,
      color: 0xffffff,
      depthWrite: true,
    }))
  ground.rotateX(-Math.PI / 2)
  ground.receiveShadow = true

  scene.add(ground)
  const size = 1000
  const divisions = 20

  const gridHelper = new THREE.GridHelper(size, divisions)
  gridHelper.position.y += 5
  scene.add(gridHelper)
}

const initCanvas = () => {
  rayCaster = new Raycaster()
  plane = new Plane()
  plane.setFromCoplanarPoints(new Vector3(), new Vector3(1, 0, 0), new Vector3(0, 0, 1))
  camera = new OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000)
  camera.position.set(0, 700, 0)

  scene = new Scene()
  scene.background = new Color(0x333333)

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

  initGUI()
  // @ts-ignore
  watch(canvas, (newValue: HTMLElement) => {
    if (!newValue) return
    newValue.appendChild(renderer.domElement)
    newValue.addEventListener('click', (event) => {
      if (!playAreaStore.drawMode) return
      const clickLocation = findLocationFromCoords(event.clientX, event.clientY, camera, scene)
      const newPoint = createPoint(clickLocation, scene)

      if (!playAreaStore.shapes[playAreaStore.currentDrawingId]) {
        const [updateShape, extrudeMesh, object] = adjustableShape({
          scene,
          controls,
          rayCaster,
          originPoint: newPoint,
          plane,
          mouse,
          tension: wallTension,
          filled: false,
          closed: false,
          concaveHull: false,
          renderer,
          handleContextMenu: playAreaStore.handleContextMenu,
          onDragComplete: () => {
            hideNonVisibleLights(scene, player.position)
          },
        })
        playAreaStore.setDrawingId(object.uuid)
        playAreaStore.setCurrentShape({
          object,
          updateShape,
          extrudeMesh,
        })
      }
      playAreaStore.addPointToCurrentShape(newPoint)
    })
  })
  initCharacter(scene, camera, renderer)
  player = initCharacter(scene, camera, renderer, new Vector3(100, 10, 100))
  initGround()

  Object.keys(playAreaStore.canvasLights).forEach((key) => {
    canvasSpawnLight(scene, camera, renderer, key)
  })

  playAreaStore.$subscribe((mutation) => {
    const parsedMutation = Array.isArray(mutation) ? mutation : [mutation]

    parsedMutation.forEach((mutation) => {
      if (mutation.events?.newValue?.type === 'light' && mutation?.events?.type === 'add') {
        canvasSpawnLight(scene, camera, renderer, mutation.events.key)
      }
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

initCanvas()
animate()

</script>

<template>
  <div ref="canvas" style="width: 100%; height: 100%">
    <CanvasContextMenu/>
  </div>
</template>

<style scoped lang="scss">

</style>
