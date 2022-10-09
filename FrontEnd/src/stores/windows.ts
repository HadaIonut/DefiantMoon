import {defineStore} from 'pinia'
import {WindowStore} from 'types/windows'

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
            },
            'actorList': {
                action: {icon: 'users', actionName: 'Actor list'},
                status: 'closed',
                header: {
                    componentType: 'SimpleHeader',
                    componentData: 'Actors',
                },
                body: {
                    componentType: 'ActorList',
                },
                display: {},
                isMinimized: false,
            },
            'itemList': {
                action: {icon: 'shirt', actionName: 'Item list'},
                status: 'closed',
                header: {
                    componentType: 'SimpleHeader',
                    componentData: 'Items',
                },
                body: {
                    componentType: 'ItemList',
                },
                display: {},
                isMinimized: false,
            },
        }
    },
    actions: {
        openWindow(key: string) {
            this[key].status = 'opened'
            this.focusWindow(key)
        },
        closeWindow(key: string) {
            this[key].status = 'closed'
        },
        focusWindow(key: string) {
            Object.keys(this.$state).forEach((key) => {
                if (this[key].status === 'focused') this[key].status = 'opened'
            })
            this[key].status = 'focused'
        },
        setWindowLocation(key: string, top: string, left: string) {
            this[key].display.top = top
            this[key].display.left = left
        },
        setWindowSize(key: string, width: string, height: string) {
            this[key].display.width = width
            this[key].display.height = height
        },
        toggleMinimize(key: string) {
            this[key].isMinimized = !this[key].isMinimized
        },
        applyWindowStartingData(key: string) {
            this[key].display = {...this[key].startingDisplay}
        },
    },
    getters: {
        hasDisplaySet: (state: WindowStore) => (key: string): boolean => {
            const display = state[key].display
            return !(!display.top && !display.left && !display.height && !display.width)
        },
    },
    persist: true,
})
