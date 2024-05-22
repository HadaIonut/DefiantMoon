import type { DataConnection } from "peerjs";
import { Peer } from "peerjs";
import axios from "axios";
import type {
	ChunkedData,
	ConnectedSocket,
	ResponseWaitList,
	SocketMessage,
	WebRTCRequest,
	WebRTCResponse,
} from "src/utils/FetchOverRTCTypes";
import {
	getCookie,
	getRandomString,
	isArray,
	isFile,
	jsonToFormData,
	toBase64,
} from "src/utils/utils";
import { spawnPromise } from "src/utils/promiseUtils";

let [clientConnectionResolve, clientConnectionReject, clientConnection] =
	spawnPromise<DataConnection>();
let [usesWebRTCResolve, usesWebRTCReject, usesWebRTC] = spawnPromise<unknown>();

let connectedSocket: ConnectedSocket;
const responseWaitList: ResponseWaitList = {};

export const rtFetch = async (params: WebRTCRequest) => {
	return usesWebRTC
		.then(() => sendMessage(params))
		.catch((e) => {
			console.error(e);
			console.trace();
			return axiosWrapper(params);
		});
};

export const initWebRTCClient = (serverId: string) => {
	const clientPeer = new Peer({
		host: "localhost",
		port: 9000,
		path: "/",
		secure: false,
		config: {
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		},
	});

	clientPeer.on("open", (peerId: string) =>
		handlePeerOpen(peerId, serverId, clientPeer),
	);
	clientPeer.on("error", (err) => {
		usesWebRTCReject(err);
	});

	return usesWebRTC;
};

const handlePeerOpen = (peerId: string, serverId: string, clientPeer: Peer) => {
	console.log("Client: peer id ", peerId);

	const connect = clientPeer.connect(serverId, {
		serialization: "none",
		reliable: true,
	});

	connect.on("open", async () => {
		const reader = chunkReader();
		connect.on("data", reader);
		connect.on("error", console.error);
		clientConnectionResolve(connect);

		usesWebRTCResolve(true);
	});

	connect.on("error", (err) => {
		clientConnectionReject(err);
		usesWebRTCReject(err);
	});
};

const chunkReader = () => {
	const fileChunks: Record<string, string[]> = {};
	const chunkCounter: Record<string, number> = {};

	return async (receivedChunk: string) => {
		const { transferId, index, total, data }: ChunkedData =
			JSON.parse(receivedChunk);

		if (!fileChunks[transferId]) fileChunks[transferId] = [];
		let currentFile = fileChunks[transferId];

		currentFile[index] = data;

		if (total === chunkCounter[transferId] || total === 0) {
			const biteChunks: ArrayBuffer[] = [];
			currentFile.forEach((fileChunk) => {
				const binaryChunk = atob(fileChunk);
				const chunkUint8 = Uint8Array.from(binaryChunk, (char) =>
					char.charCodeAt(0),
				);
				biteChunks.push(chunkUint8);
			});

			const file = new Blob(biteChunks);
			handleDataChannel(await file.text());

			delete fileChunks[transferId];
			delete chunkCounter[transferId];
		} else if (chunkCounter[transferId] === undefined) {
			chunkCounter[transferId] = 1;
		} else {
			chunkCounter[transferId]++;
		}
	};
};

const handleDataChannel = (message: string) => {
	const { protocol, data } = JSON.parse(message);

	if (protocol === "websocket") handleSocketCommunications(data);
	if (protocol === "http") handleHTTPCommunications(data);
};

const handleSocketCommunications = (data: SocketMessage) => {
	if (data.event === "sys") {
		switch (data.payload.status) {
			case "open":
				connectedSocket?.onopen?.();
				break;
			case "close":
				connectedSocket?.onclose?.();
				break;
			case "error":
				connectedSocket?.onerror?.({ data: JSON.stringify(data) });
				break;
		}
	}
	connectedSocket?.onmessage?.({ data: JSON.stringify(data) });
};

const handleHTTPCommunications = (data: WebRTCResponse) => {
	const [resolve, reject] = responseWaitList[data.requestId];

	if (data.isOk) {
		if (data.setCookie) document.cookie = `accessToken=${data.setCookie}`;
		//@ts-ignore
		delete data.setCookie;

		resolve(data);
	} else {
		reject(data);
	}

	delete responseWaitList[data.requestId];
};

const sendMessage = ({
	method,
	route,
	body,
	contentType,
}: WebRTCRequest): Promise<WebRTCResponse> => {
	return new Promise(async (resolve, reject) => {
		const formattedBody = await formatBodyRTC(
			body,
			contentType ?? "application/json",
		);

		const data = {
			method,
			route,
			body: formattedBody,
			contentType: contentType ?? "application/json",
			authToken: getCookie("accessToken"),
			requestId: getRandomString(),
		};

		responseWaitList[data.requestId] = [resolve, reject];

		clientConnection.then((connection) =>
			connection.send(
				JSON.stringify({
					protocol: "http",
					data,
				}),
			),
		);
	});
};

const formatBodyRTC = async (body: any, bodyType: string) => {
	switch (bodyType) {
		case "application/json":
			return body;
		case "multipart/form-data":
			return formatFormData(body);
	}
};

const formatFormData = async (body: any) => {
	const formatted: any = {};

	for (const [key, value] of Object.entries(body)) {
		if (isArray(value) && isFile((value as File[])[0])) {
			formatted[key] = [] as string[];
			for (const image of value as File[]) {
				formatted[key].push(await toBase64(image));
			}
		} else {
			formatted[key] = value;
		}
	}

	return formatted;
};

const axiosWrapper = (params: WebRTCRequest) => {
	const formattedBody =
		params.contentType === "multipart/form-data"
			? jsonToFormData(params.body)
			: params.body;

	return axios({
		method: params.method,
		headers: {
			"Content-Type": params.contentType,
		},
		url: params.route,
		data: formattedBody,
	});
};

export const initWebSocket = (socketRoute: string) =>
	usesWebRTC
		.then(() => {
			sendMessage({
				method: "GET",
				route: socketRoute,
				contentType: "socket-init",
			});

			connectedSocket = {
				socketId: getRandomString(),
			};

			return connectedSocket;
		})
		.catch(() => new WebSocket(`ws://localhost:5173${socketRoute}`));
