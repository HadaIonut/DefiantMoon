import {canvasSpawnLight} from 'src/components/canvas/lightController'
import {StoreEventMaps} from 'src/components/canvas/networkManager'
import {hideNonVisibleLights, initCharacter} from 'src/components/canvas/characterController'
import {adjustableShape} from 'src/components/canvas/adjustableShape'
import {Scene} from 'three'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {rtFetch} from 'src/utils/fetchOverRTC'
import {PlayAreaStore} from 'src/types/PlayerArea'

export const handleDragComplete = (canvas: Scene) => () => {
  const playAreaStore = usePlayAreaStore()
  if (!playAreaStore.getCurrentPlayerPosition) return

  hideNonVisibleLights(canvas)
}

export const handleNetworkRequest = (objectId: string, objectName: string, storeProperty: keyof PlayAreaStore, functionGetter: string) => {
  const playAreaStore = usePlayAreaStore()

  if ((playAreaStore[storeProperty] as Record<string, any>)[objectId].networkUpdate) {
    // @ts-ignore
    playAreaStore[storeProperty][objectId].networkUpdate = false
    return
  }
  rtFetch({
    route: `/api/canvas/${playAreaStore.id}/${objectName}/${objectId}`,
    method: 'PATCH',
    body: (playAreaStore[functionGetter as keyof typeof playAreaStore] as Function)?.(objectId),
  })
}

export const canvasSpawn: StoreEventMaps[] = [{
  storeFunctionName: 'addLightToCanvas',
  spawnFunction: (spawnedId, {canvas, camera, renderer}) => {
    canvasSpawnLight(canvas, camera, renderer, spawnedId as string)
    handleNetworkRequest(spawnedId as string, 'light', 'canvasLights', 'getNetworkLight')
  },
}, {
  storeFunctionName: 'addPlayerToCanvas',
  spawnFunction: (spawnedId, {canvas, camera, renderer}) => {
    initCharacter(canvas, camera, renderer, spawnedId as string)
    handleNetworkRequest(spawnedId as string, 'player', 'canvasPlayers', 'getNetworkPlayer')
  },
}, {
  storeFunctionName: 'createNewWall',
  spawnFunction: (spawnedId, {canvas, controls, renderer, rayCaster, mouse, plane}) => {
    adjustableShape({
      id: spawnedId as string,
      canvas: canvas,
      controls,
      rayCaster,
      plane,
      mouse,
      renderer,
      onDragComplete: handleDragComplete(canvas),
    })
    handleNetworkRequest(spawnedId as string, 'wall', 'canvasWalls', 'getNetworkWall')
  },
}]
