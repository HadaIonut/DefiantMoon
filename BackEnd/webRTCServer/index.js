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
    } catch (e) {
      // console.log(e)
    }

    if (fetchRes.statusText !== 'OK') {
      connection.send(JSON.stringify(
        {
          data: {
            message: fetchRes.statusText,
          },
          status: fetchRes.status,
          sourceRoute: parsedData.route,
          isOk: false,
        }))
      return;
    }

    const cookie = fetchRes?.headers?.['set-cookie']?.[0]
    let parsedCookie
    if (cookie) {
      parsedCookie = cookie.match(/accessToken=([A-z0-9._-]+);/)[1]
    }

    connection.send(JSON.stringify(
      {
        data: fetchRes.data,
        status: fetchRes.status,
        sourceRoute: parsedData.route,
        setCookie: parsedCookie,
        isOk: true
      }))
  })
})
