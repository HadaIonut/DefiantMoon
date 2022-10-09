import { getUserById } from "../../../database/repos/users.ts";
import { websocketClients } from "../clients.ts";
import { WEBSOCKET_EMITABLE_EVENTS } from "../events.ts";
import { broadcastEvent } from "../utils.ts";

export const onChatMessage = async (websocket: WebSocket, payload: Record<string, unknown>) => {
    const userId = Object.keys(websocketClients).find(wsId => websocketClients[wsId] === websocket) ?? "";
    const user = await getUserById(userId);
    if (!user) {
        return;
    }
    broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CHAT_MESSAGE, { ...payload, userId, username: user.username });
};
