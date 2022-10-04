import { Middleware } from "https://deno.land/x/oak@v11.1.0/middleware.ts";
import { websocketClients } from "./clients.ts";
import { WEBSOCKET_EMITABLE_EVENTS } from "./events.ts";
import { getSocketHandler } from "./router.ts";
import { broadcastEvent } from "./utils.ts";

export const websocketServer: Middleware = (context) => {

    if (!context.isUpgradable) {
        context.throw(501);
    }

    const websocket = context.upgrade();

    if (!websocket) {
        return
    }

    websocket.onopen = () => {
        websocketClients.push(websocket);
        broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CHAT_PLAYER_JOIN, { playerId: "null" })
    };
    websocket.onclose = () => {
        websocketClients.splice(websocketClients.indexOf(websocket));
        broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CHAT_PLAYER_LEFT, { playerId: "null" })
    };

    websocket.onmessage = getSocketHandler(websocket);
}
