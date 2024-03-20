import {defineStore} from 'pinia'
import {WindowBody, WindowDisplay, WindowHeader, WindowStore} from 'src/types/windows'
import {Action} from 'src/types/actions'

export const useWindowsStore = defineStore('windows', {
  state: (): WindowStore => {
    return {
      'chat': {
        action: {icon: 'comment', actionName: 'Chat'},
        status: 'closed',
        header: {
          componentType: 'SimpleHeader',
          componentData: 'Chat',
        },
        headerActions: {
          componentType: 'SimpleClose',
        },
        body: {
          componentType: 'Chat',
        },
        display: {},
        startingDisplay: {
          top: '20px',
          left: '20px',
          width: '400px',
          height: '500px',
        },
        isMinimized: false,
        minimumSize: {
          width: '280px',
          height: '240px',
        },
      },
      'actorList': {
        action: {icon: 'users', actionName: 'Actor list'},
        status: 'closed',
        header: {
          componentType: 'SimpleHeader',
          componentData: 'Actors',
        },
        headerActions: {
          componentType: 'SimpleClose',
        },
        body: {
          componentType: 'ActorList',
        },
        display: {},
        startingDisplay: {
          top: '20px',
          left: '20px',
          width: '400px',
          height: '500px',
        },
        isMinimized: false,
        minimumSize: {
          width: '10px',
          height: '10px',
        },
      },
      'itemList': {
        action: {icon: 'shirt', actionName: 'Item list'},
        status: 'closed',
        header: {
          componentType: 'SimpleHeader',
          componentData: 'Items',
        },
        headerActions: {
          componentType: 'SimpleClose',
        },
        body: {
          componentType: 'ItemList',
        },
        startingDisplay: {
          top: '20px',
          left: '20px',
          width: '400px',
          height: '500px',
        },
        display: {},
        isMinimized: false,
        minimumSize: {
          width: '10px',
          height: '10px',
        },
      },
    }
  },
  actions: {
    addNewWindow(id: string, header:WindowHeader, body:WindowBody, action:Action, display: WindowDisplay ) {
      this.$patch({
        [id]: {
          status: 'focused',
          header,
          headerActions: {
            componentType: 'RemoveClose',
          },
          body,
          action,
          isMinimized: false,
          minimumSize: {
            width: '10px',
            height: '10px',
          },
          startingDisplay: {
            top: '20px',
            left: '20px',
            width: '400px',
            height: '500px',
          },
          display,
        },
      })
    },
    openWindow(key: string) {
      this.$state[key].status = 'opened'
      this.focusWindow(key)
    },
    closeWindow(key: string) {
      this.$state[key].status = 'closed'
    },
    removeWindow(key: string) {
      this.$patch((state) => {
        delete state[key]
      })
    },
    focusWindow(key: string) {
      Object.keys(this.$state).forEach((key) => {
        if (this.$state[key].status === 'focused') this.$state[key].status = 'opened'
      })
      this.$state[key].status = 'focused'
    },
    setWindowLocation(key: string, top: string, left: string) {
      this.$state[key].display.top = top
      this.$state[key].display.left = left
    },
    setWindowSize(key: string, width: string, height: string) {
      this.$state[key].display.width = width
      this.$state[key].display.height = height
    },
    toggleMinimize(key: string) {
      this.$state[key].isMinimized = !this[key].isMinimized
    },
    setSnap(key: string) {
      this.$state[key].snapData = {
        isSnapped: true,
        previousHeight: this.$state[key].display.height ?? '',
        previousWidth: this.$state[key].display.width ?? '',
      }
    },
    unSnap(key: string) {
      this.$state[key].display.height = this.$state[key].snapData?.previousHeight
      this.$state[key].display.width = this.$state[key].snapData?.previousWidth
      this.$state[key].snapData = {
        isSnapped: false,
        previousHeight: '',
        previousWidth: '',
      }
    },
    setMinimizeStatus(key:string, value: boolean) {
      this.$state[key].isMinimized = value
    },
    applyWindowStartingData(key: string) {
      this.$state[key].display = {...this[key].startingDisplay}
    },
  },
  getters: {
    hasDisplaySet: (state: any) => (key: string): boolean => {
      const display = (state.$state as WindowStore)[key].display
      return !(!display.top && !display.left && !display.height && !display.width)
    },
  },
  persist: true,
})
