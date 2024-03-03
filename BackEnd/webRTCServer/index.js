const {Peer} = require('./peerjs');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const WebRTC = require('werift');
const FileReader = require('filereader');
const axios = require("axios");
const FormData = require('form-data');

const polyfills = {fetch, WebSocket, WebRTC, FileReader};

const ServerPeer = new Peer('server', {
  polyfills,
  host: 'localhost',
  port: 9000,
  path: '/',
  secure: false,
  config: {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  }
});

let serverId
let serverConnections = {}

let socketConnections = {}

ServerPeer.on('open', id => {
  console.log('Server: peer id ', id);
  serverId = id;
});

const messageFormat = (body, bodyType) => {
  switch (bodyType) {
    case 'application/json':
      return JSON.stringify(body)
      break;
    case 'multipart/form-data':
      const formatted = new FormData();

      formatted.append('message', body.message)
      body.images.forEach((image) => {
        formatted.append('images', Buffer.from(image.split('data:image/png;base64,')[1], 'base64'))
      })

      return formatted

      break;
  }
}

const replaceAsync = async (string, regexp, replacerFunction) => {
  const replacements = await Promise.all(
    Array.from(string.matchAll(regexp),
      match => replacerFunction(...match)));
  let i = 0;
  return string.replace(regexp, () => replacements[i++]);
}

const getBase64 = (url) => {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => 'data:image/png;base64,' + Buffer.from(response.data, 'binary').toString('base64'))
    .catch(() => '')
}

const formatResponseData = async (data) => {
  const strinfiedData = JSON.stringify(data)

  const formatted = await replaceAsync(strinfiedData, /\.(\/[A-z0-9/]+.[A-z]+)/g, async (_, url) => {
    return getBase64(`http://localhost:8000${url}`)
  })

  return JSON.parse(formatted)
}

const HTTPSend = (connection, message) => {
  connection.send(JSON.stringify({
    protocol: 'http',
    data: message
  }))
}

const HTTPServerRequest = (data) => {
  return axios({
    url: `http://localhost:8000${data.route}`,
    method: data.method,
    headers: {
      "Content-Type": data.contentType,
      Cookie: `accessToken=${data.authToken}`,
    },
    data: messageFormat(data.body, data.contentType)
  })
}

const extractCookies = (fetchRes) => {
  const cookie = fetchRes?.headers?.['set-cookie']?.[0]

  if (cookie) {
    return cookie.match(/accessToken=([A-z0-9._-]+);/)[1]
  }

  return ''
}

const sendSysSocketMessage = (connection, message) => {
  connection.send(JSON.stringify({
    protocol: 'websocket',
    data: {
      event: 'sys',
      payload: message
    }
  }))
}

const sendSocketMessage = (connection, event, data) => {
  connection.send(JSON.stringify({
    protocol: 'websocket',
    data: {
      event: event,
      payload: data
    }
  }))
}

const initWebSocket = (data, connection) => {
  socketConnections[connection.id] = new WebSocket(`ws://localhost:8000${data.route}`, [], {
    headers: {
      Cookie: `accessToken=${data.authToken}`,
    }
  })

  console.log(socketConnections[connection.id])
  socketConnections[connection.id].on('open', () => {
    console.log('open')
    sendSysSocketMessage(connection, {status: 'open'})
  })
  socketConnections[connection.id].on('error', (err) => {
    console.error(Buffer.from(err).toString())
    sendSysSocketMessage(connection, {status: 'error', details: Buffer.from(err).toString()})
  })
  socketConnections[connection.id].on('close', () => {
    sendSysSocketMessage(connection, {status: 'close'})
  })
  socketConnections[connection.id].on('message', (messageEvent) => {
    console.log(Buffer.from(messageEvent).toString())
    const {event, payload} = JSON.parse(Buffer.from(messageEvent).toString())
    sendSocketMessage(connection, event, payload)
  })
}

const handleHTTPMessage = async (data, connection) => {
  if (data.contentType === 'socket-init') return initWebSocket(data, connection)

  try {
    const fetchRes = (await HTTPServerRequest(data))

    const parsedCookie = extractCookies(fetchRes)

    HTTPSend(connection, {
      data: await formatResponseData(fetchRes.data),
      status: fetchRes.status,
      sourceRoute: data.route,
      setCookie: parsedCookie,
      isOk: true
    })

  } catch (e) {
    console.error(data.route, e)
    HTTPSend(connection, {
      data: {
        message: e.statusText,
      },
      status: e.status,
      sourceRoute: data.route,
      isOk: false,
    })
  }
}

ServerPeer.on("connection", (connection) => {
  console.log(`Server: ${connection.peer} connected`)
  serverConnections[connection.peer] = connection;

  connection.on("data", async (data) => {
    console.log(`Server: ${connection.peer} send: ${data}`)

    let parsedData = JSON.parse(data)

    if (parsedData.protocol === 'http') {
      await handleHTTPMessage(parsedData.data, connection)
    } else if (parsedData.protocol === 'websocket') {
      console.log("socketing...")
    } else {
      console.error("unknown protocol")
    }
  })
})
