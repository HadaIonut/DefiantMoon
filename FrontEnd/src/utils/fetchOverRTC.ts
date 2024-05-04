import type {DataConnection} from 'peerjs'
import {Peer} from 'peerjs'
import axios from 'axios'
import type {
  ChunkedData,
  ConnectedSocket,
  ResponseWaitList,
  SocketMessage,
  WebRTCRequest,
  WebRTCResponse,
  // @ts-ignore
} from 'src/utils/FetchOverRTC.d.ts'
import {getCookie, getRandomString, isArray, isFile, jsonToFormData, toBase64} from 'src/utils/utils'

let clientConnectionResolve: (value: (DataConnection | PromiseLike<DataConnection>)) => void
let clientConnectionReject: (value: unknown) => void
export const clientConnection = new Promise<DataConnection>((resolve, reject) => {
  clientConnectionReject = reject
  clientConnectionResolve = resolve
})
export let clientPeer: Peer | null = null

let usesWebRTCResolve: (value: unknown) => void
let usesWebRTCReject: (value: unknown) => void
export const usesWebRTC = new Promise((resolve, reject) => {
  usesWebRTCResolve = resolve
  usesWebRTCReject = reject
})
export let myId: string = ''
let connectedSocket: ConnectedSocket
const responseWaitList: ResponseWaitList = {}
const fileChunks: Record<string, string[]> = {}
const chunkCounter: Record<string, number> = {}
const receiveChunks = async (data: string) => {
  const message: ChunkedData = JSON.parse(data)
  if (!fileChunks[message.transferId]) fileChunks[message.transferId] = []
  fileChunks[message.transferId][message.index] = message.data

  if (message.total === chunkCounter[message.transferId] || message.total === 0) {
    const biteChunks: ArrayBuffer[] = []
    fileChunks[message.transferId].forEach((chunk) => biteChunks.push(Uint8Array.from(atob(chunk), (c) => c.charCodeAt(0))))
    const file = new Blob(biteChunks)
    handleDataChannel(await file.text())

    delete fileChunks[message.transferId]
    delete chunkCounter[message.transferId]
  } else {
    if (chunkCounter[message.transferId] === undefined) chunkCounter[message.transferId] = 1
    else chunkCounter[message.transferId]++
  }
}

const formatBodyRTC = async (body: any, bodyType: string) => {
  switch (bodyType) {
  case 'application/json':
    return body
  case 'multipart/form-data':
    const formatted: any = {}

    for (const [key, value] of Object.entries(body)) {
      if (isArray(value) && isFile((value as File[])[0])) {
        formatted[key] = [] as string[]
        for (const image of value as File[]) {
          formatted[key].push(await toBase64(image))
        }
      } else {
        formatted[key] = value
      }
    }

    return formatted
  }
}
const sendMessage = ({method, route, body, contentType}: WebRTCRequest): Promise<WebRTCResponse> => {
  return new Promise(async (resolve, reject) => {
    const message = {
      method,
      route,
      body,
      contentType: contentType ?? 'application/json',
      authToken: getCookie('accessToken'),
    }
    const formattedBody = await formatBodyRTC(message.body, message.contentType)
    const data = {...message, body: formattedBody, requestId: getRandomString()}

    responseWaitList[data.requestId] = [resolve, reject]

    clientConnection.then((connection) => connection.send(JSON.stringify({
      'protocol': 'http',
      data,
    })))
  })
}
const axiosWrapper = (params: WebRTCRequest) => {
  const formattedBody = params.contentType === 'multipart/form-data' ?
    jsonToFormData(params.body) :
    params.body

  return axios({
    method: params.method,
    headers: {
      'Content-Type': params.contentType,
    },
    url: params.route,
    data: formattedBody,
  })
}
export const rtFetch = async (params: WebRTCRequest) => {
  return usesWebRTC.then(() => sendMessage(params)).catch((e) => {
    console.error(e)
    return axiosWrapper(params)
  })
}
const handleSocketCommunications = (data: SocketMessage) => {
  if (data.event === 'sys') {
    switch (data.payload.status) {
    case 'open':
      connectedSocket?.onopen?.()
      break
    case 'close':
      connectedSocket?.onclose?.()
      break
    case 'error':
      connectedSocket?.onerror?.({data: JSON.stringify(data)})
      break
    }
  }
  connectedSocket?.onmessage?.({data: JSON.stringify(data)})
}

const handleHTTPCommunications = (data: WebRTCResponse) => {
  const [resolve, reject] = responseWaitList[data.requestId]

  if (data.isOk) {
    if (data.setCookie) {
      document.cookie = `accessToken=${data.setCookie}`
    }
    // @ts-ignore
    delete data.setCookie

    resolve(data)
  } else {
    reject(data)
  }

  delete responseWaitList[data.requestId]
}

const handleDataChannel = (message: string) => {
  const parsedMessage = JSON.parse(message)

  if (parsedMessage.protocol === 'websocket') handleSocketCommunications(parsedMessage.data)
  if (parsedMessage.protocol === 'http') handleHTTPCommunications(parsedMessage.data)
}

export const initWebSocket = (socketRoute: string) => {
  if (usesWebRTC) {
    const sockResponse = sendMessage({
      method: 'GET',
      route: socketRoute,
      contentType: 'socket-init',
    })

    connectedSocket = {
      socketId: getRandomString(),
    }

    return connectedSocket
  } else {
    return new WebSocket(`ws://localhost:5173${socketRoute}`)
  }
}

export const initWebRTCClient = (serverId: string) => {
  clientPeer = new Peer({
    host: 'localhost',
    port: 9000,
    path: '/',
    secure: false,
    config: {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    },
  })

  clientPeer.on('open', (id2) => {
    if (!clientPeer) return

    console.log('Client: peer id ', id2)
    myId = id2
    const connect = clientPeer.connect(serverId, {serialization: 'none', reliable: true})

    connect.on('open', async () => {
      connect.on('data', receiveChunks)
      connect.on('error', console.error)
      clientConnectionResolve(connect)

      usesWebRTCResolve(true)
    })
    connect.on('error', (err) => {
      clientConnectionReject(err)
      usesWebRTCReject(err)
    })
  })
  clientPeer.on('error', (err) => {
    usesWebRTCReject(err)
  })
  return usesWebRTC
}
