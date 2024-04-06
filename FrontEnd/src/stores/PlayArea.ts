import {defineStore} from 'pinia'
import {DraggablePoint} from 'src/components/canvas/adjustableShape'
import {MathUtils, PointLight, Vector3} from 'three'

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
      this.targetedObject?.parent?.removeFromParent?.()
    },
    addPointsToObject() {
      setTimeout(() => {
        this.drawMode = true
        this.currentDrawingId = this.targetedObject?.parent?.uuid ?? ''
      }, 0)
    },
    setCurrentShape(value: any) {
      this.shapes[this.currentDrawingId] = value
    },
    setDrawingId(id: string) {
      this.currentDrawingId = id
    },
    addPointToCurrentShape(newPoint: DraggablePoint) {
      this.shapes[this.currentDrawingId].object.add(newPoint)
      this.shapes[this.currentDrawingId].updateShape()
    },
    handleContextMenu(position: PositionObject, targetedObject?: DraggablePoint, visibility?: string) {
      if (visibility) this.contextMenu.display = visibility
      else {
        if (this.contextMenu.display === 'none') this.contextMenu.display = 'block'
        else this.contextMenu.display = 'none'
      }
      if (targetedObject) this.setTargetObject(targetedObject)
      this.contextMenu.top = position.top
      this.contextMenu.left = position.left
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
    updateLightLocation(light: PointLight, newPosition: Vector3) {
      this.canvasLights[light.uuid].position = newPosition
    },
  },
  getters: {
    getLightProps: (state) => (id: string): CanvasLightProperties=> {
      return state.canvasLights[id]
    },
  },
  persist: true,
})
