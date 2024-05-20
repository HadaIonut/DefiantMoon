import { defineStore } from 'pinia'
import { rtFetch } from 'src/utils/fetchOverRTC'

type CanvasName = {
  id: string;
  name: string;
};

export type CanvasCollectionStore = {
  canvasList: CanvasName[];
  active: string;
};

export const useCanvasCollectionStore = defineStore('canvasCollection', {
  state: (): CanvasCollectionStore => {
    return {
      canvasList: [],
      active: '',
    }
  },
  actions: {
    async getCanvasList() {
      this.canvasList = (
        await rtFetch({
          route: '/api/canvas',
          method: 'GET',
        })
      ).data
      this.active = this.canvasList[0]?.id ?? ''
    },
    changeActiveCanvas(newId: string) {
      this.active = newId
    },
    async createNewCanvas(name: string, groundDimension: number, gridSize: number) {
      const result = (await rtFetch({
        route: '/api/canvas',
        method: 'POST',
        body: {
          name,
          groundDimension,
          gridSize,
          canvasLights: {},
          canvasWalls: {},
          canvasPlayers: {},
        },
      })).data.canvasId
      this.canvasList.push({ id: result, name })
      this.active = result
    },
    async updateCanvas(id: string, name: string, groundDimension: number, gridSize: number) {
      const changedCanvasIndex = this.canvasList.findIndex((canvas) => canvas.id === id)
      this.canvasList[changedCanvasIndex].name = name
      rtFetch({
        route: `/api/canvas/${id}`,
        method: 'PATCH',
        body: {
          name,
          groundDimension,
          gridSize,
        },
      })
    },
  },
})
