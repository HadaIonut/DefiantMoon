import {defineStore} from 'pinia'
import {WindowStore} from 'types/windows'

export const useWindowsStore = defineStore('counter', {
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
            },
        }
    },
    actions: {
        openWindow(key: string) {
            this[key].status = 'opening'
            setTimeout(() => this[key].status = 'focused')
        },
        closeWindow(key: string) {
            this[key].status = 'closing'
            setTimeout(() => this[key].status = 'closed', 201)
        },
        handleActionBarClick(key: string) {
            if (this[key].status === 'focused') this.closeWindow(key)
            else this.openWindow(key)
        },
    },
})
