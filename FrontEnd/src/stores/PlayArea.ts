import {defineStore} from 'pinia'
import {DraggablePoint} from 'src/components/canvas/adjustableShape'
import {Ref} from 'vue'

type PlayAreaStore = {
  drawMode: boolean
  currentDrawingId: string,
  shapes: {
    [key: string]: any
  }
  targetedObject?: DraggablePoint
  contextMenu: {
    top?: number,
    left?: number,
    display?: string,
  }
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
  },
})
