import {canvasSpawnLight} from 'src/components/canvas/lightController'
import {StoreEventMaps} from 'src/components/canvas/networkManager'
import {hideNonVisibleLights, initCharacter} from 'src/components/canvas/characterController'
import {adjustableShape} from 'src/components/canvas/adjustableShape'
import {Scene} from 'three'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {removeObjectsWithChildren} from 'src/utils/CanvasUtils'

export const handleDragComplete = (canvas: Scene) => () => {
  const playAreaStore = usePlayAreaStore()
  if (!playAreaStore.getCurrentPlayerPosition) return

  hideNonVisibleLights(canvas)
}

export const canvasSpawn: StoreEventMaps[] = [{
  storeFunctionName: 'addLightToCanvas',
  spawnFunction: (spawnedId, {canvas, camera, renderer}) => canvasSpawnLight(canvas, camera, renderer, spawnedId),
}, {
  storeFunctionName: 'addPlayerToCanvas',
  spawnFunction: (spawnedId, {canvas, camera, renderer}) => initCharacter(canvas, camera, renderer, spawnedId),
}, {
  storeFunctionName: 'createNewWall',
  spawnFunction: (spawnedId, {canvas, controls, renderer, rayCaster, mouse, plane}) => adjustableShape({
    id: spawnedId,
    canvas: canvas,
    controls,
    rayCaster,
    plane,
    mouse,
    renderer,
    onDragComplete: handleDragComplete(canvas),
  }),
}]
