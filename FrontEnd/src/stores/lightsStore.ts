import {defineStore} from 'pinia'
import {CanvasLightParams, CanvasLightProperties, LightsStore} from 'src/types/PlayerArea'
import {computed, ref} from 'vue'
import {MathUtils, Vector3} from 'three'
import {pointsAreEqual} from 'src/utils/CanvasUtils'

export const useLightsStore = defineStore('lightsStore', (): LightsStore => {
  const canvasLights = ref<Record<string, CanvasLightProperties>>({})

  function addLightToCanvas({
    decay = 1,
    distance = 300,
    intensity = 1000,
    color = 0xffffff,
    position,
    indicatorId = MathUtils.generateUUID(),
    lightId = MathUtils.generateUUID(),
  }: CanvasLightParams) {
    canvasLights.value[lightId] = {
      decay: decay,
      distance: distance,
      intensity: intensity,
      color: color,
      position: position,
      indicatorId: indicatorId,
      type: 'light',
    }
    return lightId
  }

  function updateLightLocation(lightId: string, newPosition: Vector3, networkUpdate = false) {
    newPosition.set(Math.round(newPosition.x), Math.round(newPosition.y), Math.round(newPosition.z))
    const oldPosition = canvasLights.value[lightId].position

    if (pointsAreEqual(oldPosition, newPosition)) return

    canvasLights.value[lightId] = {
      ...canvasLights.value[lightId],
      position: JSON.parse(JSON.stringify(newPosition)),
      networkUpdate,
    }
    return lightId
  }

  function updateLight(lightId: string, data: CanvasLightProperties, networkUpdate = false) {
    canvasLights.value[lightId] = data
    canvasLights.value[lightId].networkUpdate = networkUpdate
    return lightId
  }

  const getLightProps = computed(() => (id: string): CanvasLightProperties => {
    return canvasLights.value[id]
  })

  const getNetworkLight = computed(() => (lightId: string) => {
    const {position, distance, intensity, decay, color, indicatorId, type} = canvasLights.value[lightId]
    return {
      position,
      distance,
      intensity,
      decay,
      color,
      indicatorId,
      type,
    }
  })

  return {canvasLights, updateLight, addLightToCanvas, getLightProps, getNetworkLight, updateLightLocation}
}, {persist: true})
