import {hideNonVisibleLights} from './characterController'
import {addDragControls} from 'src/utils/CanvasUtils'
import {
  Camera,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  PointLightHelper,
  Renderer,
  Scene,
  SphereGeometry,
  Vector3,
} from 'three'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {handleNetworkRequest} from 'src/components/canvas/canvasSpawn'
import {CanvasLightProperties} from 'src/types/PlayerArea'

export const updateAllLightsShadowCasting = (canvas: Scene) => {
  const lights = canvas.getObjectsByProperty('type', 'PointLight')

  lights.forEach((light) => {
    light.castShadow = shouldCastShadow(light as PointLight, canvas)
  })
}

const shouldCastShadow = (light: PointLight, canvas: Scene) => {
  const walls = canvas.getObjectsByProperty('name', 'controlPoint')
  return walls.reduce((acc, cur) => acc || cur.position.distanceTo(light.position) < light.distance, false)
}

const spawnLightIndicator = (position: Vector3, indicatorId: string | undefined, canvas: Scene) => {
  const geometry = new SphereGeometry(20)
  geometry.computeBoundsTree()
  const material = new MeshBasicMaterial({color: 'orange'})
  const indicator = new Mesh(geometry, material)
  indicator.position.copy(position)
  indicator.castShadow = false
  indicator.name = 'sourceLight'
  if (indicatorId) indicator.uuid = indicatorId
  canvas.add(indicator)

  return indicator
}

export const canvasSpawnLight = (canvas: Scene, camera: Camera, renderer: Renderer, lightId: string) => {
  const playAreaStore = usePlayAreaStore()
  const {color, decay, distance, indicatorId, intensity, position} = playAreaStore.getLightProps(lightId)

  const indicator = spawnLightIndicator(position, indicatorId, canvas)

  const light = new PointLight(color, intensity, distance, decay)
  light.position.copy(position)
  light.castShadow = shouldCastShadow(light, canvas)
  light.name = `sourceLight-${indicator.uuid}`
  if (lightId) light.uuid = lightId

  canvas.add(light)

  const helper = new PointLightHelper(light)
  canvas.add(helper)
  // @ts-ignore
  renderer.shadowMap.needsUpdate = true

  addDragControls(camera, renderer)({
    primary: indicator, secondary: light, onDragComplete: (newPosition: Vector3) => {
      hideNonVisibleLights(canvas)
      light.castShadow = shouldCastShadow(light, canvas)
      playAreaStore.updateLightLocation(light.uuid, newPosition)
    },
  })

  return playAreaStore.$onAction(({name, after}) => {
    after((resolvedReturn) => {
      if (name === 'updateLight' && resolvedReturn === lightId) {
        const lightValue = playAreaStore.canvasLights[resolvedReturn as keyof CanvasLightProperties]

        light.position.copy(lightValue.position)
        indicator.position.copy(lightValue.position)
        light.color.set(lightValue.color)
        light.decay = lightValue.decay
        light.distance = lightValue.distance
        light.intensity = lightValue.intensity
        handleNetworkRequest(lightId, 'light', 'canvasLights', 'getNetworkLight')
      } else if (name === 'updateLightLocation' && resolvedReturn === lightId) {
        const lightValue = playAreaStore.canvasLights[resolvedReturn as keyof CanvasLightProperties]

        light.position.copy(lightValue.position)
        indicator.position.copy(lightValue.position)
        handleNetworkRequest(lightId, 'light', 'canvasLights', 'getNetworkLight')
      }
    })
  })
}
