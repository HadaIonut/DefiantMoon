type WebsocketMessageCallback = (payload: any) => any

type WebsocketEvents = {
    [key: string]: MessageCallback[]
};
