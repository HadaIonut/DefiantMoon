import { websocketClients } from "./clients.ts"

export const broadcastEvent = (event: string, message: string | Record<string, unknown>) => {
    websocketClients.forEach((ws) => {
        ws.send(
            JSON.stringify({
                event,
                message,
            })
        );
    });
};

export const emitEvent = (ws: WebSocket, event: string, message: string | Record<string, unknown>) => {
    ws.send(
        JSON.stringify({
            event,
            message,
        })
    );
};
