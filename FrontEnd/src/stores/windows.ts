import {defineStore} from 'pinia'
import {WindowStore} from 'types/windows'

export const useWindowsStore = defineStore('counter', {
    state: (): WindowStore => {
        return {
            'chat': {
                action: {icon: 'comment', actionName: 'Chat'},
                status: 'closed',
            },
            'actorList': {
                action: {icon: 'users', actionName: 'Actor list'},
                status: 'closed',
            },
            'itemList': {
                action: {icon: 'shirt', actionName: 'Item list'},
                status: 'closed',
            },
        }
    },
    actions: {
        openWindow(key: string) {
            this[key].status = 'focused'
        },
        closeWindow(key: string) {
            this[key].status = 'closed'
        },
        handleActionBarClick(key: string) {
            if (this[key].status === 'focused') this.closeWindow(key)
            else this.openWindow(key)
        },
    },
})
