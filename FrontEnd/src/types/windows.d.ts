import {Action} from 'types/actions'

export type WindowStore = {
    [key: string]: Window
}

export type WindowHeader = {
    title: string,
    actions: Action[]
}

export type Window = {
    action: Action,
    status: 'closed' | 'opened' | 'focused',
    header?: WindowHeader,
}
