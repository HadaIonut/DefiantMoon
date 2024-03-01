const {Peer} = require('./peerjs');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const WebRTC = require('werift');
const FileReader = require('filereader');

const polyfills = {fetch, WebSocket, WebRTC, FileReader};

const ServerPeer = new Peer('server', {
  polyfills,
  // debug: 3,
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

const ClientPeer = new Peer({
  polyfills,
  // debug: 3,
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

let serverId, clientId;
let clientConnection;
let serverConnections = {}

ServerPeer.on('open', id => {
  console.log('Server: peer id ', id);
  serverId = id;
});

let clientOpen = false;
const sendMessage = (connection, {method, route, body, authToken}) => {
  return new Promise((resolve, reject) => {
    const message = {method, route, body, authToken}
    const dataCallback = (data) => {
      const parsedData = JSON.parse(data)

      if (parsedData.sourceRoute !== route) return;

      if (parsedData.isOk) {
        resolve(parsedData);
        connection.off("data", dataCallback)
      } else {
        reject(parsedData);
        connection.off("data", dataCallback)
      }

      setTimeout(() => {
        reject("timeout")
        connection.off("data", dataCallback)
      }, 10000)
    }

    connection.send(JSON.stringify(message))

    connection.on("data", dataCallback)
  })
}

ClientPeer.on('open', id2 => {
  console.log('Client: peer id ', id2);
  clientId = id2;
  clientConnection = ClientPeer.connect(serverId, {serialization: 'none'})

  clientConnection.on("open", async () => {
    clientOpen = true;

    try {
      const meRes = await sendMessage(clientConnection, {
        method: 'GET',
        route: '/users',
      })

      console.log(meRes)
    } catch (e) {
      console.log(e)
    }

  })

});

ServerPeer.on("connection", (connection) => {
  console.log(`Server: ${connection.peer} connected`)
  serverConnections[connection.peer] = connection;

  connection.on("data", async (data) => {
    console.log(`Server: ${connection.peer} send: ${data}`)

    let parsedData = JSON.parse(data)
    const fetchRes = (await fetch(`http://localhost:8000${parsedData.route}`, {
      method: parsedData.method,
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${parsedData.authToken}`,
      },
      body: JSON.stringify(parsedData.body)
    }))

    if (!fetchRes.ok) {
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

    const cookie = fetchRes.headers.get('set-cookie')
    let parsedCookie
    if (cookie) {
      parsedCookie = cookie.match(/accessToken=([A-z0-9._-]+);/)[1]
    }

    connection.send(JSON.stringify(
      {
        data: await fetchRes.json(),
        status: fetchRes.status,
        sourceRoute: parsedData.route,
        setCookie: parsedCookie,
        isOk: true
      }))
  })
})
