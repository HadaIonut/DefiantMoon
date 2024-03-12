import {ParseResultType} from 'dice-parsering-library/dist/types'

type ChatMessage = {
    id: string;
    content: Array<string | ParseResultType>
    timestamp: number
    from: string;
    images: Array<string>;
}
