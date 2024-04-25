import {defineStore} from 'pinia'
import {rtFetch} from 'src/utils/fetchOverRTC'

type CanvasName = {
  id: string,
  name: string
}

export type CanvasCollectionStore = {
  canvasList: CanvasName[]
}

export const useCanvasCollectionStore = defineStore('canvasCollection', {
  state: (): CanvasCollectionStore => {
    return {
      canvasList: [],
    }
  },
  actions: {
    async getCanvasList() {
      this.canvasList = (await rtFetch({
        route: '/api/canvas',
        method: 'GET',
      })).data
    },
  },
})
