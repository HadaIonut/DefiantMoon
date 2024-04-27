import {hideNonVisibleLights} from './characterController'
import {addDragControls, getActivePlayer} from 'src/utils/CanvasUtils'
import {
  Camera,
  Mesh,
  MeshBasicMaterial,
  PointLight,
  PointLightHelper,
  Renderer,
  Scene,
  SphereGeometry, Vector3,
} from 'three'
import {usePlayAreaStore} from 'src/stores/PlayArea'

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
      const player = getActivePlayer(canvas)
      hideNonVisibleLights(canvas, player.position)
      light.castShadow = shouldCastShadow(light, canvas)
      playAreaStore.updateLightLocation(light, newPosition)
    },
  })

  playAreaStore.$subscribe((mutation) => {
    const parsedMutation = Array.isArray(mutation) ? mutation : [mutation]

    parsedMutation.forEach((mutation) => {
      if (mutation.events.key === 'color') {
        light.color.set(mutation.events.newValue)
      } else if (mutation.events.key === 'position' && mutation.events.target.indicatorId === indicator.uuid) {
        light.position.copy(mutation.events.newValue)
        indicator.position.copy(mutation.events.newValue)
      }
    })
  })
}
