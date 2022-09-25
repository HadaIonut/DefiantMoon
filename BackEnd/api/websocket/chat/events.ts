import { WEBSOCKET_EVENTS } from "../events.ts";
import { broadcastEvent } from "../utils.ts";

// deno-lint-ignore no-unused-vars
export const onChatMessage = (websocket: WebSocket, message: string | Record<string, unknown>) => {
    broadcastEvent(WEBSOCKET_EVENTS.CHAT, { from: "user", message: message });
};
