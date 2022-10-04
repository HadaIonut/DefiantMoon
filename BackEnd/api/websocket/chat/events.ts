import { WEBSOCKET_EMITABLE_EVENTS } from "../events.ts";
import { broadcastEvent } from "../utils.ts";

// deno-lint-ignore no-unused-vars
export const onChatMessage = (websocket: WebSocket, payload: string | Record<string, unknown>) => {
    console.log(payload)
    broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CHAT_MESSAGE, payload);
};
