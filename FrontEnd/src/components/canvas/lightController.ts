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
  SphereGeometry, Vector3,
} from 'three'
import {usePlayAreaStore} from 'src/stores/PlayArea'

type LightLocation = {
  x: number
  y: number
  z: number
}

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

export const initLights = (scene: Scene, lightColor: number, camera: Camera, renderer: Renderer) =>
  (position: Vector3, intensity = 1000, distance = 300, decay = 1, lightId?: string) => {
    const playAreaStore = usePlayAreaStore()
    const lightProps = playAreaStore.getLightProps(lightId)

    const geometry = new SphereGeometry(20)
    geometry.computeBoundsTree()
    const material = new MeshBasicMaterial({color: 'orange'})
    const cube = new Mesh(geometry, material)
    cube.position.copy(lightProps?.position ?? position)
    cube.castShadow = false
    cube.name = lightProps?.cubeName ?? 'sourceLight'
    if (lightProps?.cubeId) cube.uuid = lightProps.cubeId
    scene.add(cube)

    const light = new PointLight(lightColor, intensity, distance, decay)
    light.position.copy(position)
    light.castShadow = shouldCastShadow(light, scene)
    light.name = `sourceLight-${cube.uuid}`

    playAreaStore.addLightToScene(light, cube, scene)

    const helper = new PointLightHelper(light)
    scene.add(helper)

    addDragControls(camera, renderer)({
      primary: cube, secondary: light, onDragComplete: () => {
        const player = getActivePlayer(scene)
        hideNonVisibleLights(scene, player.position)
        light.castShadow = shouldCastShadow(light, scene)
      },
    })

    playAreaStore.$subscribe((mutation) => {
      if (mutation.events.key !== 'color') return

      light.color.set(mutation.events.newValue)
    })
  }
