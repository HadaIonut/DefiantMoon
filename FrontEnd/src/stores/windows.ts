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
            setTimeout(() => {
                this[key].status = 'opened'
                this.focusWindow(key)
            })
        },
        closeWindow(key: string) {
            this[key].status = 'closing'
            setTimeout(() => this[key].status = 'closed', 201)
        },
        focusWindow(key: string) {
            Object.keys(this.$state).forEach((key) => {
                if (this[key].status === 'focused') this[key].status = 'opened'
            })
            this[key].status = 'focused'
            console.log('focused', key)
        },
    },
})
