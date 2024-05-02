import {Camera, Plane, Raycaster, Scene, Vector2, WebGLRenderer} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {usePlayAreaStore} from 'src/stores/PlayArea'

export type StoreEventMaps = {
  storeFunctionName: string,
  spawnFunction: (spawnedId: string, canvasData: CanvasData) => void
}

type CanvasData = {
  canvas: Scene,
  camera: Camera,
  controls: OrbitControls,
  rayCaster: Raycaster,
  plane: Plane,
  mouse: Vector2,
  renderer: WebGLRenderer
}

export const handleObjectSpawn = (canvasEntries: StoreEventMaps[], canvasData: CanvasData) => {
  const playAreaStore = usePlayAreaStore()

  return playAreaStore.$onAction(({name, after}) => {
    after((resolvedReturn) => {
      const triggered = canvasEntries.find((entry) => entry.storeFunctionName === name)
      if (!triggered || !resolvedReturn) return

      triggered.spawnFunction(resolvedReturn, canvasData)
    })
  })
}
