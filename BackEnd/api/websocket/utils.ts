import { websocketClients } from "./clients.ts"
import { WEBSOCKET_EMITABLE_EVENTS } from "./events.ts";

export const broadcastEvent = (event: WEBSOCKET_EMITABLE_EVENTS, payload: string | Record<string, unknown>) => {
    Object.values(websocketClients).forEach((ws) => {
        ws.send(
            JSON.stringify({
                event,
                payload,
            })
        );
    });
};

export const emitEvent = (ws: WebSocket, event: string, payload: string | Record<string, unknown>) => {
    ws.send(
        JSON.stringify({
            event,
            payload,
        })
    );
};
