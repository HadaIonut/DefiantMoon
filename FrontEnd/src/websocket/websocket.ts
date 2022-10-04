const ws = new WebSocket(`ws://127.0.0.1:8000/api/websocket`);

const WEBSOCKET_DEBUG = true;
const ws_log = (...message: any) => {
    if(WEBSOCKET_DEBUG) {
        console.log(...message)
    }
}

ws.onopen = () => {
    ws_log("[WS]: socket connected")
}

ws.onclose = () => {
    ws_log("[WS]: socket disconnected")
}

const sendMessage = (event: string, payload: Object | string) => {
    ws_log(`[WS]: sending event "${event}" payload "${payload}"`)
    ws.send(JSON.stringify({event, payload}));
};

const eventsMap: WebsocketEvents = {};


ws.onmessage = (messageEvent: MessageEvent) => {
    const {event, payload} = JSON.parse(messageEvent.data);
    ws_log(`[WS]: event received event: "${event}" payload: ${JSON.stringify(payload)}`)
    if (eventsMap[event]) {
        eventsMap[event].forEach((cb) => cb(payload));
    }
};

const addEventListener = (event: string, callback: WebsocketMessageCallback) => {
    if (eventsMap[event]) {
        eventsMap[event].push(callback);
    } else {
        eventsMap[event] = [callback];
    }
};

const removeEventListener = (event: string, callback: WebsocketMessageCallback) => {
    if (!eventsMap[event]) {
        return
    }
    eventsMap[event] = eventsMap[event].filter((cb) => cb !== callback);
};

const removeEventListeners = (event: string) => {
    // TODO: poate fece bug, vedem
    delete eventsMap[event];
};

export const websocket = {
    sendMessage,
    addEventListener,
    removeEventListener,
    removeEventListeners,
};
