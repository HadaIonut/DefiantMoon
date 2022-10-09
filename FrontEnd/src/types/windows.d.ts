import {Action} from 'types/actions'

export type WindowStore = {
    [key: string]: Window
}

export type Window = {
    action: Action,
    status: 'closed' | 'opened' | 'focused',
    header: {
        componentType: string,
        componentData?: any
    },
    body: {
        componentType: string,
        componentData?: any
    },
    display: {
        top?: string | null,
        left?: string | null,
        width?: string | null,
        height?: string | null
    },
    isMinimized: boolean,
    startingDisplay?: {
        top: string,
        left: string,
        width: string,
        height: string
    }
}
