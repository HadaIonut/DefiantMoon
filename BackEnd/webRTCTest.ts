import {RTCPeerConnection} from 'https://dev.jspm.io/werift';
import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import {Buffer} from "https://deno.land/std@0.152.0/io/buffer.ts";

const wss = new WebSocketServer(8080);
wss.on("connection", function (ws: WebSocketClient) {
    ws.on("message", async function (message: string) {
        const offer = JSON.parse(message as string);
        console.log(offer);

        console.log("before peer conn")
        const pc = new RTCPeerConnection({});
        console.log("after peer con")
        // pc.iceConnectionStateChange.subscribe((v) =>
        //     console.log("pc.iceConnectionStateChange", v)
        // );
        pc.onDataChannel.subscribe((channel) => {
            console.log("like and sub")
            let index = 0;
            setInterval(() => {
                channel.send("caca");
            }, 1000);

            channel.message.subscribe((data) => {
                console.log("answer message", data.toString());
            });
            channel.stateChanged.subscribe((v) =>
                console.log("channel.stateChanged", v)
            );
        });

        console.log("before set remote desc 1")
        await pc.setRemoteDescription(offer);
        console.log("before set remote desc 2")
        await pc.setLocalDescription(await pc.createAnswer());
        console.log("before set remote desc 3")
        ws.send(JSON.stringify(pc.localDescription));
    });
});
// const handler = () => {
//     const config = {
//         iceServers: [{ urls: "stun:stun2.l.google.com:19302" }],
//     };
//
//     const peerConnection = new RTCPeerConnection(config)
//     const dataChannel = peerConnection.createDataChannel("MyChannel")
//
//     // dataChannel.onmessage = (event: MessageEvent) => {
//     //     console.log(event.data);
//     // }
//
// }

// Deno.serve({port: 7000}, handler)
