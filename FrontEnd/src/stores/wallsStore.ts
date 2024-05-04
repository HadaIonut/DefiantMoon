import {defineStore} from 'pinia'
import {CanvasWallProperties, WallStore} from 'src/types/PlayerArea'
import {computed, ref} from 'vue'
import {MathUtils, Vector3} from 'three'

export const useWallsStore = defineStore('wallsStore', (): WallStore => {
  const canvasWalls = ref<Record<string, CanvasWallProperties>>({})
  const currentDrawingId = ref('')

  function createNewWall(originPoint: Vector3, tension: number, filled: boolean, closed: boolean, concaveHull: boolean, wallId ?: string, objectId ?: string) {
    const newDrawingId = objectId ?? MathUtils.generateUUID()
    canvasWalls.value[newDrawingId] = {
      controlPoints: {[wallId ?? MathUtils.generateUUID()]: {position: originPoint, type: 'controlPoint'}},
      tension,
      closed,
      concaveHull,
      filled,
      type: 'wall',
    }
    currentDrawingId.value = newDrawingId
    return newDrawingId
  }

  function addPointToShape(point: Vector3, shapeId: string, pointId = MathUtils.generateUUID()) {
    point.set(Math.round(point.x), Math.round(point.y), Math.round(point.z))

    canvasWalls.value[shapeId].controlPoints[pointId] = {position: point, type: 'controlPoint'}
    return {shapeId, pointId}
  }

  function removePointFromShape(pointId: string, shapeId: string) {
    delete canvasWalls.value[shapeId].controlPoints[pointId]
    return {shapeId, pointId}
  }

  function updatePointLocation(pointId: string, shapeId: string, newLocation: Vector3) {
    newLocation.set(Math.round(newLocation.x), Math.round(newLocation.y), Math.round(newLocation.z))
    canvasWalls.value[shapeId].controlPoints[pointId].position = newLocation
    return {shapeId, pointId}
  }

  function updateWall(shapeId: string, data: CanvasWallProperties, networkUpdate = false) {
    Object.assign(canvasWalls.value[shapeId], data)
    canvasWalls.value[shapeId].controlPoints.networkUpdate = networkUpdate
    return {shapeId}
  }

  const getNetworkWall = computed(() => (wallId: string) => {
    const {type, closed, concaveHull, controlPoints, filled, tension} = canvasWalls.value[wallId]
    return {
      type,
      closed,
      concaveHull,
      controlPoints,
      filled,
      tension,
    }
  })

  return {
    canvasWalls,
    currentDrawingId,
    getNetworkWall,
    updatePointLocation,
    removePointFromShape,
    addPointToShape,
    createNewWall,
    updateWall,
  }
}, {persist: true})
