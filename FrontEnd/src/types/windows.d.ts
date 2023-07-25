import {Action} from 'types/actions'

export type WindowStore = {
    [key: string]: Window
}

export type WindowHeader = {
    componentType: string,
    componentData?: any
}

export type WindowHeaderActions = {
    componentType: string,
    componentData?: any
}

export type WindowBody = {
    componentType: string,
    componentData?: any
}

export type WindowDisplay = {
    top?: string | null,
    left?: string | null,
    width?: string | null,
    height?: string | null
}

export type Window = {
    action: Action,
    status: 'closed' | 'opened' | 'focused',
    header: WindowHeader,
    headerActions: WindowHeaderActions,
    body: WindowBody,
    display: WindowDisplay,
    isMinimized: boolean,
    startingDisplay?: {
        top: string,
        left: string,
        width: string,
        height: string
    },
    minimumSize: {
        width: string,
        height: string
    }
}
