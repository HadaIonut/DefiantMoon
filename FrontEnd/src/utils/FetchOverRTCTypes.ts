export type WebRTCMessage = {
  protocol: 'http' | 'websocket',
  data: WebRTCRequest | WebRTCResponse | SocketMessage
}
export type SocketMessage = {
  event: string,
  payload: any
}
export type UnparsedSocketMessage = { data: string }
export type WebRTCRequest = {
  method: 'GET' | 'POST',
  route: string,
  contentType?: 'application/json' | 'multipart/form-data' | 'socket-init'
  body?: any,
  authToken?: string
  requestId?: string
}
export type WebRTCResponse = {
  sourceRoute: string
  status: number
  setCookie: string
  data: any
  isOk: boolean
  requestId: string
}
export type ConnectedSocket = {
  socketId: string,
  onopen?: () => void,
  onclose?: () => void,
  onerror?: (socketMessage: UnparsedSocketMessage) => void
  onmessage?: (socketMessage: UnparsedSocketMessage) => void,
}
export type ChunkedData = {
  index: number,
  total: number,
  transferId: string,
  data: string
}
export type ResponseWaitList = {
  [key: string]: [(value: (WebRTCResponse | PromiseLike<WebRTCResponse>)) => void, (reason?: any) => void]
}
