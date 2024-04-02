import * as THREE from 'three'
import {hideNonVisibleLights} from './characterController.ts'
import {watch} from 'vue'
import {addDragControls, getActivePlayer} from 'src/utils/CanvasUtils'

export const updateAllLightsShadowCasting = (scene) => {
  const lights = scene.getObjectsByProperty('type', 'PointLight')

  lights.forEach((light) => {
    light.castShadow = shouldCastShadow(light, scene)
  })
}

const shouldCastShadow = (light, scene) => {
  const walls = scene.getObjectsByProperty('name', 'controlPoint')
  return walls.reduce((acc, cur) => acc || cur.position.distanceTo(light.position) < light.distance, false)
}

export const initLights = (scene, lightColor, camera, renderer) => ({x, y, z}) => {
  const geometry = new THREE.SphereGeometry(20)
  geometry.computeBoundsTree()
  const material = new THREE.MeshBasicMaterial({color: 'orange'})
  const cube = new THREE.Mesh(geometry, material)
  cube.position.set(x, y, z)
  cube.castShadow = false
  cube.name = 'sourceLight'
  scene.add(cube)

  const light = new THREE.PointLight(lightColor.value, 1000, 500, 1)
  light.position.set(x, y, z)
  light.distance = 300
  light.castShadow = shouldCastShadow(light, scene)
  light.name = `sourceLight-${cube.uuid}`

  scene.add(light)

  const helper = new THREE.PointLightHelper(light)
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
