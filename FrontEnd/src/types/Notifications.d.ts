export type NotificationMessage = {
    id: string,
    type: string,
    message: string,
    neverDisappear: boolean
}

export type NotificationStore = {
    temporary: NotificationMessage[],
    permanent: {
        [id: string]: NotificationMessage
    }
}

