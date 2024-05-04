import {defineStore, storeToRefs} from 'pinia'
import {DraggablePoint} from 'src/components/canvas/adjustableShape'
import {ContextMenu, PlayAreaStore, PositionObject} from 'src/types/PlayerArea'
import {rtFetch} from 'src/utils/fetchOverRTC'
import {computed, ref} from 'vue'
import {useLightsStore} from 'src/stores/lightsStore'
import {useWallsStore} from 'src/stores/wallsStore'
import {usePlayerStore} from 'src/stores/playerStore'

export const usePlayAreaStore = defineStore('playArea', (): PlayAreaStore => {
  const drawMode = ref(false)
  const groundDimension = ref(1000)
  const gridSize = ref(20)
  const contextMenu = ref<ContextMenu>({})
  const id = ref('')
  const targetedObject = ref<DraggablePoint|null>(null)

  const {getNetworkLight, getLightProps, canvasLights} = storeToRefs(useLightsStore())
  const {addLightToCanvas, updateLight, updateLightLocation} = useLightsStore()
  const {canvasWalls, currentDrawingId, getNetworkWall} = storeToRefs(useWallsStore())
  const {updatePointLocation, removePointFromShape, addPointToShape, createNewWall, updateWall} = useWallsStore()
  const {canvasPlayers, getActivePlayer, getCurrentPlayerPosition, getNetworkPlayer} = storeToRefs(usePlayerStore())
  const {addPlayerToCanvas, updatePlayerLocation, selectPlayer, updatePlayer} = usePlayerStore()
  function toggleDrawMode() {
    drawMode.value = !drawMode.value
    currentDrawingId.value = ''
  }
  function setTargetObject(newValue: DraggablePoint) {
    targetedObject.value = newValue
  }
  function deleteTargetObject() {
    if (!targetedObject.value?.parent) return

    delete canvasWalls.value[targetedObject.value.parent.uuid as keyof typeof canvasWalls.value]
    targetedObject.value?.parent?.removeFromParent?.()
  }
  function addPointsToObject() {
    setTimeout(() => {
      drawMode.value = true
      currentDrawingId.value = targetedObject.value?.parent?.uuid ?? ''
    }, 0)
  }
  function handleContextMenu(position: PositionObject, targetedObject ?: DraggablePoint, visibility ?: string) {
    if (contextMenu.value.display === 'none' && Object.keys(position).length === 0) return

    if (visibility) contextMenu.value.display = visibility
    else {
      if (contextMenu.value.display === 'none') contextMenu.value.display = 'block'
      else contextMenu.value.display = 'none'
    }
    if (targetedObject) setTargetObject(targetedObject)
    if (!position.top || !position.left) return
    contextMenu.value.top = Number(position.top) ?? position.top
    contextMenu.value.left = Number(position.left) ?? position.left
  }

  async function loadCanvas(newId: string) {
    const newCanvas = (await rtFetch({
      route: `/api/canvas/${newId}`,
      method: 'GET',
    })).data

    // @ts-ignore
    // eslint-disable-next-line no-invalid-this
    this.$patch((state) => {
      Object.assign(state, newCanvas)
    })
  }
  const getNetworkCanvas = computed(() => {
    return {
      groundDimension: groundDimension.value,
      gridSize: gridSize.value,
      canvasLights: canvasLights.value,
      canvasWalls: canvasWalls.value,
      canvasPlayers: canvasPlayers.value,
    }
  })

  return {
    getNetworkCanvas,
    getNetworkPlayer,
    getCurrentPlayerPosition,
    getActivePlayer,
    loadCanvas, updatePlayer, updatePlayerLocation, addPlayerToCanvas, handleContextMenu, addPointsToObject, deleteTargetObject, setTargetObject, selectPlayer, toggleDrawMode,
    addLightToCanvas, updateLight, updateLightLocation, updatePointLocation, removePointFromShape, addPointToShape, createNewWall, updateWall,
    drawMode, currentDrawingId, groundDimension,
    gridSize, contextMenu, canvasPlayers, id,
    getNetworkLight, getLightProps, canvasLights,
    canvasWalls, getNetworkWall,
  }
}, {persist: true})
