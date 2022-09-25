import { Middleware } from "https://deno.land/x/oak@v11.1.0/middleware.ts";
import { websocketClients } from "./clients.ts";
import { getSocketHandler } from "./router.ts";

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
    };
    websocket.onclose = () => {
        websocketClients.splice(websocketClients.indexOf(websocket));
    };

    websocket.onmessage = getSocketHandler(websocket);
}
