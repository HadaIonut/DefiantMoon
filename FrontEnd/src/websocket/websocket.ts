import {initWebSocket} from '../utils/fetchOverRTC'

// const ws = new WebSocket(`ws://localhost:5173/api/websocket`)
const ws = initWebSocket('/api/websocket')
const WEBSOCKET_DEBUG = true
const eventsMap: WebsocketEvents = {}

ws.onopen = () => {
  wsLog('[WS]: socket connected')
}

ws.onclose = () => {
  wsLog('[WS]: socket disconnected')
}

ws.onmessage = (messageEvent: MessageEvent) => {
  const {event, payload} = JSON.parse(messageEvent.data)
  wsLog(`[WS]: event received event: "${event}" payload: ${JSON.stringify(payload)}`)
  if (eventsMap[event]) {
    eventsMap[event].forEach((cb) => cb(payload))
  }
}

const wsLog = (...message: any) => {
  if (WEBSOCKET_DEBUG) {
    console.log(...message)
  }
}

const sendMessage = (event: string, payload: Object | string) => {
  wsLog(`[WS]: sending event "${event}" payload "${payload}"`)
  ws.send(JSON.stringify({event, payload})) // TODO implement this eventually
}

const addEventListener = (event: string, callback: WebsocketMessageCallback) => {
  if (eventsMap[event]) {
    eventsMap[event].push(callback)
  } else {
    eventsMap[event] = [callback]
  }
}

const removeEventListener = (event: string, callback: WebsocketMessageCallback) => {
  if (!eventsMap[event]) {
    return
  }
  eventsMap[event] = eventsMap[event].filter((cb) => cb !== callback)
}

const removeEventListeners = (event: string) => {
  // TODO: poate fece bug, vedem
  delete eventsMap[event]
}

export const websocket = {
  sendMessage,
  addEventListener,
  removeEventListener,
  removeEventListeners,
}
