import {Action} from 'types/actions'

export type WindowStore = {
    [key: string]: Window
}

export type Window = {
    action: Action
}
