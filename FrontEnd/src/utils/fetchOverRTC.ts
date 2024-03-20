import type {DataConnection} from 'peerjs'
import {Peer} from 'peerjs'
import {getCookie, getRandomString, isArray, isFile, jsonToFormData, toBase64} from '../utils/utils'
import axios from 'axios'
import {
  ChunkedData,
  ConnectedSocket,
  ResponseWaitList,
  SocketMessage,
  WebRTCRequest,
  WebRTCResponse,
} from 'utils/FetchOverRTC'

export let clientConnection: DataConnection
export let usesWebRTC = false
export let myId: string = ''
let connectedSocket: ConnectedSocket
const responseWaitList: ResponseWaitList = {}
let fileChunks: string[] = []
const receiveChunks = async (data: string) => {
  const message: ChunkedData = JSON.parse(data)

  fileChunks[message.index] = message.data

  if (message.total === message.index) {
    const biteChunks: ArrayBuffer[] = []
    fileChunks.forEach((chunk) => biteChunks.push(Uint8Array.from(atob(chunk), (c) => c.charCodeAt(0))))
    const file = new Blob(biteChunks)
    handleDataChannel(await file.text())
    fileChunks = []
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

    clientConnection.send(JSON.stringify({
      'protocol': 'http',
      data,
    }))
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
export const rtFetch = (params: WebRTCRequest) => {
  if (usesWebRTC) return sendMessage(params)

  return axiosWrapper(params)
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
  return new Promise((resolve, reject) => {
    const ClientPeer = new Peer({
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

    ClientPeer.on('open', (id2) => {
      console.log('Client: peer id ', id2)
      myId = id2
      clientConnection = ClientPeer.connect(serverId, {serialization: 'none', reliable: true})

      clientConnection.on('open', async () => {
        usesWebRTC = true

        clientConnection.on('data', receiveChunks)
        clientConnection.on('error', console.error)

        resolve(true)
      })
    })
  })
}
