import {defineStore} from 'pinia'
import {WindowStore} from 'types/windows'

export const useWindowsStore = defineStore('counter', {
    state: (): WindowStore => {
        return {
            'chat': {
                action: {icon: 'comment', actionName: 'Chat', isActive: false},
            },
            'actorList': {
                action: {icon: 'users', actionName: 'Actor list', isActive: false},
            },
            'itemList': {
                action: {icon: 'shirt', actionName: 'Item list', isActive: false},
            },
        }
    },
    actions: {
        openWindow(key: string) {
            this[key].action.isActive = true
        },
        closeWindow(key: string) {
            this[key].action.isActive = false
        },
    },
})
