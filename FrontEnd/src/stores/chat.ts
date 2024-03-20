import {defineStore} from 'pinia'
import {ChatMessage} from 'types/ChatMessage'

type ChatStore = {
 chat: ChatMessage[]
}

export const useChatStore = defineStore('chat', {
  state: (): ChatStore => {
    return {chat: []}
  },
  actions: {
    pushMessage(message: ChatMessage) {
      this.chat.push(message)
    },
    pushMessages(message: ChatMessage[]) {
      this.chat.push(...message)
    },
    unshiftMessage(messages: ChatMessage[]) {
      this.chat.unshift(...messages)
    },
  },
  getters: {
    getLatestTimestamp: (state:any) => () => {
      return (state.$state as ChatStore).chat[0].timestamp
    },
  },
})
