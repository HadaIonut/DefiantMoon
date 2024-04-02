<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
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
import {findLocationFromCoords, getRandomInt} from 'src/utils/CanvasUtils'
import {hideNonVisibleLights, initCharacter} from './characterController'
import {adjustableShape, createPoint} from 'src/components/canvas/adjustableShape'
import Stats from 'three/examples/jsm/libs/stats.module'
import {initLights} from 'src/components/canvas/lightController'

THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

let camera: Camera
let scene: Scene
let renderer: Renderer
let controls: OrbitControls
let rayCaster: Raycaster
let plane: Plane
const canvas = ref(null)
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

const enableRotation = false
const wallTension = ref(0)
const lightColor = ref(0xffffff)
const drawMode = ref(false)

const shapes = {}
const mouse = new Vector2()
let currentDrawingId: string = ''
let player
const groundSizes = [1000, 1000]
const controlPoints = []


const initGUI = () => {
  const panel = new GUI({width: 310})
  const settings = {
    'enable rotation': false,
    'wall tension': 0,
    'light color': 0xffffff,
  }
  panel.add(settings, 'enable rotation').onChange((newValue) => controls.enableRotate = newValue)
  panel.add(settings, 'wall tension', 0, 1, 0.1).onChange((newValue) => wallTension.value = newValue)
  panel.addColor(settings, 'light color', 0xffffff).onChange((newValue) => lightColor.value = newValue)
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
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.shadowMap.enabled = true
  renderer.shadowMap.autoUpdate = false

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableRotate = enableRotation
  controls.enabled = true

  initGUI()

  watch(canvas, (newValue: Element) => {
    if (!newValue) return
    newValue.appendChild(renderer.domElement)
    newValue.addEventListener('click', (event) => {
      if (!drawMode.value) return
      const clickLocation = findLocationFromCoords(event.clientX, event.clientY, camera, scene)
      const newPoint = createPoint(clickLocation, scene)

      if (!shapes[currentDrawingId]) {
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
          handleContextMenu,
          onDragComplete: () => {
            hideNonVisibleLights(scene, player.position)
          },
        })
        currentDrawingId = object.uuid
        shapes[currentDrawingId] = {
          object,
          updateShape,
          extrudeMesh,
        }
      }
      shapes[currentDrawingId].object.add(newPoint)
      shapes[currentDrawingId].updateShape()
    })
  })
  initCharacter(scene, camera, renderer)
  initCharacter(scene, camera, renderer, new Vector3(100, 10, 100))

  const spawnLight = initLights(scene, lightColor, camera, renderer)

  initGround()
  for (let i = 0; i < 10; i++) {
    spawnLight({x: getRandomInt(10) * 25, y: 10, z: getRandomInt(10) * 25})
  }

  spawnLight({x: 75, y: 10, z: 25})
}

const animate = () => {
  stats.begin()
  requestAnimationFrame(animate)

  rayCaster.setFromCamera(mouse, camera)
  controlPoints.forEach((cp, idx) => {
    curShift = (Math.PI / 2) * idx
    cp.material.opacity = 0.6 + Math.sin(time - curShift) * .2
  })

  renderer.render(scene, camera)
  stats.end()
}

initCanvas()
animate()

</script>

<template>
  <div ref="canvas" style="width: 100%; height: 100%">
<!--    <div :style="`position: absolute; top: 100px; color: white; background:${drawMode ? 'pink' : 'darkslategray'} `"-->
<!--         @click="drawModeToggleFunction">test-->
<!--    </div>-->
<!--    <div ref="contextMenuRef"-->
<!--         style="display: none; position: absolute; top: 0; left: 0; background: #888888; transform: translateX(-50%)">-->
<!--      <div style="cursor: pointer;" @click="addPointsToObject">add points</div>-->
<!--      <div style="cursor: pointer;" @click="removePointFromObject"-->
<!--           v-if="contextMenuTargetedObject?.name === 'controlPoint'">remove point-->
<!--      </div>-->
<!--      <div style="cursor: pointer;" @click="objectDelete">delete object</div>-->
<!--    </div>-->
  </div>
</template>

<style scoped lang="scss">

</style>
