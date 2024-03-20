import {ParseResultType} from 'dice-parsering-library/dist/types'
import {TraitAction} from 'types/Actors'

type ChatMessage = {
    id: string;
    content: Array<string | ParseResultType | TraitAction>
    timestamp: number
    from: string;
    images: Array<string>;
}
