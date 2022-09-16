import {defineStore} from 'pinia'
import {NotificationMessage, NotificationStore} from 'types/Notifications'
import {getRandomString} from 'utils/utils'

export const useNotificationsStore = defineStore('notifications', {
    state: (): NotificationStore => {
        return {
            temporary: [],
            permanent: {},
        }
    },
    actions: {
        addNewNotification({type, message, neverDisappear = false}: NotificationMessage): string | null {
            const notificationId = getRandomString()

            if (neverDisappear) {
                this.permanent[notificationId] = {type, message, neverDisappear, id: notificationId}
                return notificationId
            } else {
                this.temporary.unshift({type, message, neverDisappear, id: notificationId})
                return null
            }
        },
        removeTemporary(id: string | undefined) {
            if (id) {
                this.temporary.pop()
            } else {
                this.temporary = this.temporary.filter((notification) => notification.id !== id)
            }
        },
        removePermanent(notificationId: string): NotificationMessage {
            const {[notificationId]: deletedValue, ...newObject} = this.permanent
            this.permanent = newObject
            return deletedValue
        },
        clearPermanent() {
            this.permanent = {}
        },
        clearTemporary() {
            this.temporary = []
        },
    },
})
