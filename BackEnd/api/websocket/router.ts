import { onChatMessage } from "./chat/events.ts";
import { WEBSOCKET_EVENTS } from "./events.ts";

const eventsMap = {
    [WEBSOCKET_EVENTS.CHAT]: onChatMessage,
}

export const getSocketHandler = (websocket: WebSocket) => (messageEvent: MessageEvent) => {
    const { event, message } = JSON.parse(messageEvent.data);
    eventsMap[event as WEBSOCKET_EVENTS]?.(websocket, message)
};