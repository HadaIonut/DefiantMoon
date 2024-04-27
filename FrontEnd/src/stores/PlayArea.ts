import {defineStore} from 'pinia'
import {DraggablePoint} from 'src/components/canvas/adjustableShape'
import {MathUtils, PointLight, Vector2, Vector3} from 'three'
import {CanvasLightParams, CanvasLightProperties, PlayAreaStore, PositionObject} from 'src/types/PlayerArea'
import {rtFetch} from 'src/utils/fetchOverRTC'
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
      this.contextMenu.top = Number(position.top)
      this.contextMenu.left = Number(position.left)
    },
    addLightToScene({
      decay = 1,
      distance = 300,
      intensity = 1000,
      color = 0xffffff,
      position,
      indicatorId = MathUtils.generateUUID(),
    }: CanvasLightParams) {
      this.canvasLights[MathUtils.generateUUID()] = {
        decay: decay,
        distance: distance,
        intensity: intensity,
        color: color,
        position: position,
        indicatorId: indicatorId,
        type: 'light',
      }
    },
    addPlayerToScene(position: Vector3) {
      const playerId = MathUtils.generateUUID()
      this.canvasPlayers[playerId] = {
        isActive: true,
        position,
        type: 'player',
      }
      this.selectPlayer(playerId)
    },
    updateLightLocation(light: PointLight, newPosition: Vector3) {
      this.canvasLights[light.uuid] = {
        ...this.canvasLights[light.uuid],
        position: newPosition,
      }
    },
    createNewWall(originPoint: Vector3, tension: number, filled: boolean, closed: boolean, concaveHull: boolean) {
      const newDrawingId = MathUtils.generateUUID()
      this.canvasWalls[newDrawingId] = {
        controlPoints: {[MathUtils.generateUUID()]: {position: originPoint, type: 'controlPoint'}},
        tension,
        closed,
        concaveHull,
        filled,
        type: 'wall',
      }
      this.currentDrawingId = newDrawingId
    },
    addPointToShape(point: Vector3, shapeId: string) {
      this.canvasWalls[shapeId].controlPoints[MathUtils.generateUUID()] = {position: point, type: 'controlPoint'}
    },
    removePointFromShape(pointId: string, shapeId: string) {
      delete this.canvasWalls[shapeId].controlPoints[pointId]
    },
    updatePointLocation(pointId: string, shapeId: string, newLocation: Vector3) {
      this.canvasWalls[shapeId].controlPoints[pointId] = {
        ...this.canvasWalls[shapeId].controlPoints[pointId],
        position: newLocation,
      }
    },
    updatePlayerLocation(playerId: string, newLocation: Vector3) {
      this.canvasPlayers[playerId] = {
        ...this.canvasPlayers[playerId],
        position: newLocation,
      }
    },
    selectPlayer(currentPlayerId: string) {
      Object.keys(this.canvasPlayers).forEach((playerId) => {
        this.canvasPlayers[playerId].isActive = false
      })
      this.canvasPlayers[currentPlayerId].isActive = true
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
  },
  getters: {
    getLightProps: (state) => (id: string): CanvasLightProperties=> {
      return state.canvasLights[id]
    },
    getCurrentPlayerPosition: (state) => {
      const activeId = Object.entries(state.canvasPlayers).find(([key, value]) => value.isActive)
      if (!activeId) return
      const position = state.canvasPlayers[activeId[0]].position
      return new Vector3(position.x, position.y, position.z)
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
  },
  persist: true,
})
