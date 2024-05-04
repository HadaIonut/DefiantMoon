import {defineStore} from 'pinia'
import {CanvasPlayerProperties, PlayerStore} from 'src/types/PlayerArea'
import {computed, ref} from 'vue'
import {MathUtils, Vector3} from 'three'

export const usePlayerStore = defineStore('playerStore', (): PlayerStore => {
  const canvasPlayers = ref<Record<string, CanvasPlayerProperties>>({})

  function addPlayerToCanvas(position: Vector3, playerId = MathUtils.generateUUID()) {
    canvasPlayers.value[playerId] = {
      isActive: true,
      position,
      type: 'player',
    }
    selectPlayer(playerId)
    return playerId
  }

  function updatePlayerLocation(playerId: string, newLocation: Vector3, networkUpdate = false) {
    newLocation.set(Math.round(newLocation.x), Math.round(newLocation.y), Math.round(newLocation.z))

    canvasPlayers.value[playerId] = {
      ...canvasPlayers.value[playerId],
      position: newLocation,
      networkUpdate,
    }
    return playerId
  }

  function selectPlayer(currentPlayerId: string) {
    Object.keys(canvasPlayers.value).forEach((playerId) => {
      canvasPlayers.value[playerId].isActive = false
    })

    canvasPlayers.value[currentPlayerId].isActive = true
  }

  function updatePlayer(playerId: string, data: CanvasPlayerProperties, networkUpdate = false) {
    canvasPlayers.value[playerId] = data
    canvasPlayers.value[playerId].networkUpdate = networkUpdate
    return playerId
  }

  const getActivePlayer = computed(() => {
    return Object.entries(canvasPlayers.value).find(([, value]) => value.isActive) ?? []
  })

  const getCurrentPlayerPosition = computed(() => {
    const activeId = Object.entries(canvasPlayers.value).find(([, value]) => value.isActive)
    if (!activeId) return
    const position = canvasPlayers.value[activeId[0]].position
    return new Vector3(position.x, position.y, position.z)
  })

  const getNetworkPlayer = computed(() => (playerId: string) => {
    return {
      position: canvasPlayers.value[playerId].position,
      type: canvasPlayers.value[playerId].type,
    }
  })
  return {
    canvasPlayers,
    addPlayerToCanvas,
    updatePlayerLocation,
    selectPlayer,
    updatePlayer,
    getActivePlayer,
    getCurrentPlayerPosition,
    getNetworkPlayer,
  }
})
