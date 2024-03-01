import {Peer} from 'peerjs'
import type {DataConnection} from 'peerjs'
import {getCookie, getFormData, isArray, isFile, jsonToFormData, toBase64} from '../utils/utils'
import axios from 'axios'

export let clientConnection: DataConnection
export let usesWebRTC = false
export let myId: string = ''

type WebRTCRequest = {
  method: 'GET' | 'POST',
  route: string,
  contentType?: 'application/json' | 'multipart/form-data'
  body?: any,
  authToken?: string
}

type WebRTCResponse = {
  sourceRoute: string
  status: number
  setCookie: string
  data: any
  isOk: boolean
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
    const dataCallback = (data: string) => {
      const parsedData: WebRTCResponse = JSON.parse(data)

      if (parsedData.sourceRoute !== route) return

      if (parsedData.isOk) {
        if (parsedData.setCookie) {
          document.cookie = `accessToken=${parsedData.setCookie}`
        }
        // @ts-ignore
        delete parsedData.setCookie

        resolve(parsedData)

        clientConnection.off('data', dataCallback)
      } else {
        reject(parsedData)
        clientConnection.off('data', dataCallback)
      }

      setTimeout(() => {
        reject({
          sourceRoute: route,
          status: 500,
          body: {
            message: 'Request timed-out',
          },
          isOk: false,
        })
        clientConnection.off('data', dataCallback)
      }, 10000)
    }

    const formattedBody = await formatBodyRTC(message.body, message.contentType)

    clientConnection.send(JSON.stringify({...message, body: formattedBody}))

    clientConnection.on('data', dataCallback)
  })
}

const axiosWrapper = (params: WebRTCRequest) => {
  const formattedBody = params.contentType === 'multipart/form-data' ? jsonToFormData(params.body) : params.body

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

export const initWebRTCClient = (serverId: string) => {
  return new Promise((resolve, reject) => {
    const ClientPeer = new Peer({
      // debug: 3,
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
      clientConnection = ClientPeer.connect(serverId, {serialization: 'none'})

      clientConnection.on('open', async () => {
        usesWebRTC = true
        resolve(true)
      })
    })
  })
}
