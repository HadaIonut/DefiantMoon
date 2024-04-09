import {defineStore} from 'pinia'
import {DraggablePoint} from 'src/components/canvas/adjustableShape'
import {MathUtils, Object3D, PointLight, Scene, Vector3} from 'three'
import {toRaw} from 'vue'
import {pointsAreEqual} from 'src/utils/CanvasUtils'

type CanvasLightProperties = {
  position: Vector3,
  distance: number,
  intensity: number,
  decay: number,
  color: number,
  indicatorId: string,
  type: 'light'
}

type CanvasLightParams = {
  position: Vector3,
  distance?: number,
  intensity?: number,
  decay?: number,
  color?: number,
  indicatorId?: string,
}

export type ControlPoint = {
  position: Vector3,
  type: 'controlPoint'
}


type CanvasWallProperties = {
  controlPoints: Record<string, ControlPoint>,
  tension: number,
  filled: boolean,
  closed: boolean,
  concaveHull: boolean,
  type: 'wall'
}

type CanvasPlayerProperties = {
  position: Vector3,
  isActive: boolean
  type: 'player' | 'enemy'
}

type PlayAreaStore = {
  drawMode: boolean
  currentDrawingId: string,
  shapes: Record<string, any>
  targetedObject?: DraggablePoint
  contextMenu: {
    top?: number,
    left?: number,
    display?: string,
  }
  canvasLights: Record<string, CanvasLightProperties>
  canvasWalls: Record<string, CanvasWallProperties>
  canvasPlayers: Record<string, CanvasPlayerProperties>
}

export type PositionObject = {
  top?: number | string
  left?: number | string
}

export const usePlayAreaStore = defineStore('playArea', {
  state: (): PlayAreaStore => {
    return {
      drawMode: false,
      currentDrawingId: '',
      shapes: {},
      contextMenu: {},
      canvasLights: {},
      canvasWalls: {},
      canvasPlayers: {},
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
      this.canvasLights[light.uuid].position = newPosition
    },
    createNewWall(originPoint: Vector3, tension: number, filled: boolean, closed: boolean, concaveHull: boolean) {
      this.currentDrawingId = MathUtils.generateUUID()
      this.canvasWalls[this.currentDrawingId] = {
        controlPoints: {[MathUtils.generateUUID()]: {position: originPoint, type: 'controlPoint'}},
        tension,
        closed,
        concaveHull,
        filled,
        type: 'wall',
      }
    },
    addPointToShape(point: Vector3, shapeId: string) {
      this.canvasWalls[shapeId].controlPoints[MathUtils.generateUUID()] = {position: point, type: 'controlPoint'}
    },
    removePointFromShape(pointId: string, shapeId: string) {
      delete this.canvasWalls[shapeId].controlPoints[pointId]
    },
    updatePointLocation(pointId: string, shapeId: string, newLocation: Vector3) {
      this.canvasWalls[shapeId].controlPoints[pointId].position = newLocation
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
  },
  persist: true,
})
