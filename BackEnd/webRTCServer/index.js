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
      const formatted =  new FormData();

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

ServerPeer.on("connection", (connection) => {
  console.log(`Server: ${connection.peer} connected`)
  serverConnections[connection.peer] = connection;

  connection.on("data", async (data) => {
    console.log(`Server: ${connection.peer} send: ${data}`)

    let parsedData = JSON.parse(data)
    let fetchRes
    try {
      fetchRes = (await axios({
        url: `http://localhost:8000${parsedData.route}`,
        method: parsedData.method,
        headers: {
          "Content-Type": parsedData.contentType,
          Cookie: `accessToken=${parsedData.authToken}`,
        },
        data: messageFormat(parsedData.body, parsedData.contentType)
      }))

      const cookie = fetchRes?.headers?.['set-cookie']?.[0]
      let parsedCookie
      if (cookie) {
        parsedCookie = cookie.match(/accessToken=([A-z0-9._-]+);/)[1]
      }

      connection.send(JSON.stringify(
        {
          data: await formatResponseData(fetchRes.data),
          status: fetchRes.status,
          sourceRoute: parsedData.route,
          setCookie: parsedCookie,
          isOk: true
        }))

    } catch (e) {
      console.error(parsedData.route, e)
      connection.send(JSON.stringify(
        {
          data: {
            message: e.statusText,
          },
          status: e.status,
          sourceRoute: parsedData.route,
          isOk: false,
        }))
    }
  })
})
