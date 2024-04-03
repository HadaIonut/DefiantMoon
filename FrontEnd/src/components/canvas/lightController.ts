import * as THREE from 'three'
import {hideNonVisibleLights} from './characterController'
import {Ref, watch} from 'vue'
import {addDragControls, getActivePlayer} from 'src/utils/CanvasUtils'
import {
  Camera,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  PointLightHelper,
  Renderer,
  Scene,
  SphereGeometry,
} from 'three'

export const updateAllLightsShadowCasting = (scene: Scene) => {
  const lights = scene.getObjectsByProperty('type', 'PointLight')

  lights.forEach((light) => {
    light.castShadow = shouldCastShadow(light as PointLight, scene)
  })
}

const shouldCastShadow = (light: PointLight, scene: Scene) => {
  const walls = scene.getObjectsByProperty('name', 'controlPoint')
  return walls.reduce((acc, cur) => acc || cur.position.distanceTo(light.position) < light.distance, false)
}

export const initLights = (scene:Scene, lightColor:Ref<number>, camera: Camera, renderer:Renderer) => ({x, y, z}: {x: number, y: number, z:number}) => {
  const geometry = new SphereGeometry(20)
  geometry.computeBoundsTree()
  const material = new MeshBasicMaterial({color: 'orange'})
  const cube = new Mesh(geometry, material)
  cube.position.set(x, y, z)
  cube.castShadow = false
  cube.name = 'sourceLight'
  scene.add(cube)

  const light = new PointLight(lightColor.value, 1000, 500, 1)
  light.position.set(x, y, z)
  light.distance = 300
  light.castShadow = shouldCastShadow(light, scene)
  light.name = `sourceLight-${cube.uuid}`

  scene.add(light)

  const helper = new PointLightHelper(light)
  scene.add(helper)

  addDragControls(camera, renderer)({
    primary: cube, secondary: light, onDragComplete: () => {
      const player = getActivePlayer(scene)
      console.log(player.position)
      hideNonVisibleLights(scene, player.position)
      console.log('drag complete')
      light.castShadow = shouldCastShadow(light, scene)
    },
  })

  watch(lightColor, (newValue) => {
    light.color.set(newValue)
  })
}
