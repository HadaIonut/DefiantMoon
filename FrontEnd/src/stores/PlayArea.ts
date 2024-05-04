import {defineStore} from 'pinia'
import {DraggablePoint} from 'src/components/canvas/adjustableShape'
import {MathUtils, PointLight, Vector2, Vector3} from 'three'
import {
  CanvasLightParams,
  CanvasLightProperties, CanvasPlayerProperties,
  CanvasWallProperties,
  PlayAreaStore,
  PositionObject,
} from 'src/types/PlayerArea'
import {rtFetch} from 'src/utils/fetchOverRTC'
import {pointsAreEqual} from 'src/utils/CanvasUtils'
export const usePlayAreaStore = defineStore('playArea', {
  state: (): PlayAreaStore => {
    return {
      drawMode: false,
      currentDrawingId: '',
      groundDimension: 1000,
      gridSize: 20,
      contextMenu: {},
      canvasLights: {},
      canvasWalls: {},
      canvasPlayers: {},
      id: '',
    }
  },
  actions: {
    toggleDrawMode() {
      this.drawMode = !this.drawMode
      this.currentDrawingId = ''
    },
    setTargetObject(newValue: DraggablePoint) {
      this.targetedObject = newValue
    },
    deleteTargetObject() {
      if (!this?.targetedObject?.parent) return

      delete this.canvasWalls[this.targetedObject.parent.uuid]
      this.targetedObject?.parent?.removeFromParent?.()
    },
    addPointsToObject() {
      setTimeout(() => {
        this.drawMode = true
        this.currentDrawingId = this.targetedObject?.parent?.uuid ?? ''
      }, 0)
    },
    handleContextMenu(position: PositionObject, targetedObject?: DraggablePoint, visibility?: string) {
      if (this.contextMenu.display === 'none' && Object.keys(position).length === 0) return

      if (visibility) this.contextMenu.display = visibility
      else {
        if (this.contextMenu.display === 'none') this.contextMenu.display = 'block'
        else this.contextMenu.display = 'none'
      }
      if (targetedObject) this.setTargetObject(targetedObject)
      if (!position.top || !position.left) return
      this.contextMenu.top = Number(position.top) ?? position.top
      this.contextMenu.left = Number(position.left) ?? position.left
    },
    addLightToCanvas({
      decay = 1,
      distance = 300,
      intensity = 1000,
      color = 0xffffff,
      position,
      indicatorId = MathUtils.generateUUID(),
      lightId = MathUtils.generateUUID(),
    }: CanvasLightParams) {
      this.canvasLights[lightId] = {
        decay: decay,
        distance: distance,
        intensity: intensity,
        color: color,
        position: position,
        indicatorId: indicatorId,
        type: 'light',
      }
      return lightId
    },
    addPlayerToCanvas(position: Vector3, playerId = MathUtils.generateUUID()) {
      this.canvasPlayers[playerId] = {
        isActive: true,
        position,
        type: 'player',
      }
      this.selectPlayer(playerId)
      return playerId
    },
    updateLightLocation(lightId: string, newPosition: Vector3, networkUpdate = false) {
      newPosition.set(Math.round(newPosition.x), Math.round(newPosition.y), Math.round(newPosition.z))
      const oldPosition = this.canvasLights[lightId].position

      if (pointsAreEqual(oldPosition, newPosition)) return

      this.canvasLights[lightId] = {
        ...this.canvasLights[lightId],
        position: JSON.parse(JSON.stringify(newPosition)),
        networkUpdate,
      }
      return lightId
    },
    createNewWall(originPoint: Vector3, tension: number, filled: boolean, closed: boolean, concaveHull: boolean, wallId?: string, objectId?: string) {
      const newDrawingId = objectId ?? MathUtils.generateUUID()
      this.canvasWalls[newDrawingId] = {
        controlPoints: {[wallId ?? MathUtils.generateUUID()]: {position: originPoint, type: 'controlPoint'}},
        tension,
        closed,
        concaveHull,
        filled,
        type: 'wall',
      }
      this.currentDrawingId = newDrawingId
      return newDrawingId
    },
    addPointToShape(point: Vector3, shapeId: string, pointId = MathUtils.generateUUID()) {
      point.set(Math.round(point.x), Math.round(point.y), Math.round(point.z))

      this.canvasWalls[shapeId].controlPoints[pointId] = {position: point, type: 'controlPoint'}
      return {shapeId, pointId}
    },
    removePointFromShape(pointId: string, shapeId: string) {
      delete this.canvasWalls[shapeId].controlPoints[pointId]
      return {shapeId, pointId}
    },
    updatePointLocation(pointId: string, shapeId: string, newLocation: Vector3) {
      newLocation.set(Math.round(newLocation.x), Math.round(newLocation.y), Math.round(newLocation.z))
      this.canvasWalls[shapeId].controlPoints[pointId].position = newLocation
      return {shapeId, pointId}
    },
    updatePlayerLocation(playerId: string, newLocation: Vector3, networkUpdate = false) {
      newLocation.set(Math.round(newLocation.x), Math.round(newLocation.y), Math.round(newLocation.z))

      this.canvasPlayers[playerId] = {
        ...this.canvasPlayers[playerId],
        position: newLocation,
        networkUpdate,
      }
      return playerId
    },
    selectPlayer(currentPlayerId: string) {
      Object.keys(this.canvasPlayers).forEach((playerId) => {
        this.canvasPlayers[playerId].isActive = false
      })

      this.canvasPlayers[currentPlayerId].isActive = true
    },
    updateWall(shapeId: string, data: CanvasWallProperties, networkUpdate = false) {
      Object.assign(this.canvasWalls[shapeId], data)
      this.canvasWalls[shapeId].controlPoints.networkUpdate = networkUpdate
      return {shapeId}
    },
    async loadCanvas(newId: string) {
      const newCanvas = (await rtFetch({
        route: `/api/canvas/${newId}`,
        method: 'GET',
      })).data

      this.$patch((state) => {
        Object.assign(state, newCanvas)
      })
    },
    updatePlayer(playerId: string, data: CanvasPlayerProperties, networkUpdate = false) {
      this.canvasPlayers[playerId] = data
      this.canvasPlayers[playerId].networkUpdate = networkUpdate
      return playerId
    },
    updateLight(lightId: string, data: CanvasLightParams, networkUpdate = false) {
      this.canvasLights[lightId] = data
      this.canvasLights[lightId].networkUpdate = networkUpdate
      return lightId
    },
  },
  getters: {
    getLightProps: (state) => (id: string): CanvasLightProperties=> {
      return state.canvasLights[id]
    },
    getActivePlayer: (state) => {
      return Object.entries(state.canvasPlayers).find(([, value]) => value.isActive) ?? []
    },
    getCurrentPlayerPosition: (state) => {
      const activeId = Object.entries(state.canvasPlayers).find(([, value]) => value.isActive)
      if (!activeId) return
      const position = state.canvasPlayers[activeId[0]].position
      return new Vector3(position.x, position.y, position.z)
    },
    getNetworkPlayer: (state) => (playerId: string) => {
      return {
        position: state.canvasPlayers[playerId].position,
        type: state.canvasPlayers[playerId].type,
      }
    },
    getNetworkLight: (state) => (lightId: string) => {
      const {position, distance, intensity, decay, color, indicatorId, type} = state.canvasLights[lightId]
      return {
        position,
        distance,
        intensity,
        decay,
        color,
        indicatorId,
        type,
      }
    },
    getNetworkCanvas: (state) => {
      return {
        groundDimension: state.groundDimension,
        gridSize: state.gridSize,
        canvasLights: state.canvasLights,
        canvasWalls: state.canvasWalls,
        canvasPlayers: state.canvasPlayers,
      }
    },
    getNetworkWall: (state) => (wallId: string) => {
      const {type, closed, concaveHull, controlPoints, filled, tension} = state.canvasWalls[wallId]
      return {
        type,
        closed,
        concaveHull,
        controlPoints,
        filled,
        tension,
      }
    },
  },
  persist: true,
})
