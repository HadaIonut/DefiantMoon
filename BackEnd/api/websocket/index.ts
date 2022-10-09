import { Middleware } from "https://deno.land/x/oak@v11.1.0/middleware.ts";
import { getCurrentUserId } from "../../auth/index.ts";
import { getUserById } from "../../database/repos/users.ts";
import { websocketClients } from "./clients.ts";
import { WEBSOCKET_EMITABLE_EVENTS } from "./events.ts";
import { getSocketHandler } from "./router.ts";
import { broadcastEvent } from "./utils.ts";

export const websocketServer: Middleware = async (context) => {

    if (!context.isUpgradable) {
        context.throw(501);
    }

    const websocket = context.upgrade();

    if (!websocket) {
        return;
    }

    const userId = await getCurrentUserId(context);

    websocket.onopen = async () => {
        const user = await getUserById(userId);
        if (!user) {
            return
        }
        websocketClients[userId] = websocket;
        broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CHAT_PLAYER_JOIN, { user: { username: user.username, id: user._id } });
    };

    websocket.onclose = async () => {
        const user = await getUserById(userId);
        if (!user) {
            return
        }
        delete websocketClients[userId];
        broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CHAT_PLAYER_LEFT, { user: { username: user.username, id: user._id } });
    };

    websocket.onmessage = getSocketHandler(websocket);
}
