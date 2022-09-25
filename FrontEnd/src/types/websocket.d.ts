type WebsocketMessageCallback = (message: object | string) => any

type WebsocketEvents = {
    [key: string]: MessageCallback[]
};
