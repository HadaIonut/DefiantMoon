const ws = new WebSocket(`ws://${window.location.origin}/api/websocket`);

const sendMessage = (event: string, message: Object | string) => {
    ws.send(JSON.stringify({event, message}));
};

const eventsMap: WebsocketEvents = {};

ws.onmessage = (messageEvent: MessageEvent) => {
    const {event, message} = JSON.parse(messageEvent.data);
    if (eventsMap[event]) {
        eventsMap[event].forEach((cb) => cb(message));
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
    eventsMap[event].filter((cb) => cb !== callback);
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
