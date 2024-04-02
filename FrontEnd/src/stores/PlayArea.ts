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
  contextMenuRef?: Ref<HTMLElement | null>
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
    setContextMenuRef(ref: HTMLElement) {
      this.contextMenuRef = ref
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
      if (!this.contextMenuRef) return

      if (visibility) this.contextMenuRef.style.display = visibility
      else {
        if (this.contextMenuRef.style.display === 'none') this.contextMenuRef.style.display = 'block'
        else this.contextMenuRef.style.display = 'none'
      }
      if (targetedObject) this.setTargetObject(targetedObject)
      this.contextMenuRef.style.top = `${position.top}px`
      this.contextMenuRef.style.left = `${position.left}px`
    },
  },
})
