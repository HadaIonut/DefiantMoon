import {Peer} from 'peerjs'
import type {DataConnection} from 'peerjs'
import {getCookie} from '../utils/utils'
import axios from 'axios'

export let clientConnection: DataConnection
export let usesWebRTC = false
export let myId: string = ''

type WebRTCRequest = {
  method: 'GET' | 'POST',
  route: string,
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

const sendMessage = ({method, route, body}: WebRTCRequest): Promise<WebRTCResponse> => {
  return new Promise((resolve, reject) => {
    const message = {
      method,
      route,
      body,
      authToken: getCookie('accessToken')}
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
          isOk: false})
        clientConnection.off('data', dataCallback)
      }, 10000)
    }

    clientConnection.send(JSON.stringify(message))

    clientConnection.on('data', dataCallback)
  })
}

export const rtFetch = (params: WebRTCRequest) => {
  if (usesWebRTC) return sendMessage(params)

  return axios({
    method: params.method,
    url: params.route,
    data: params.body,
  })
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
