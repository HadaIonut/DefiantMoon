import {defineStore} from 'pinia'
import {rtFetch} from 'src/utils/fetchOverRTC'

type CanvasName = {
  id: string,
  name: string
}

export type CanvasCollectionStore = {
  canvasList: CanvasName[]
  active: string
}

export const useCanvasCollectionStore = defineStore('canvasCollection', {
  state: (): CanvasCollectionStore => {
    return {
      canvasList: [],
      active: '',
    }
  },
  actions: {
    async getCanvasList() {
      this.canvasList = (await rtFetch({
        route: '/api/canvas',
        method: 'GET',
      })).data
      this.active = this.canvasList[0].id
    },
    changeActiveCanvas(newId: string) {
      this.active = newId
    },
  },
})
