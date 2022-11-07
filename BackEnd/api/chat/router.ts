import { Timestamp } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getCurrentUserId } from "../../auth/index.ts";
import { getChatMessages, saveChatMessage } from "../../database/repos/chatMessages.ts";
import { getUserById } from "../../database/repos/users.ts";
import { ChatMessageSchema } from "../../database/schemas/chatMessage.ts";
import { thowBadRequest } from "../utils.ts";
import { WEBSOCKET_EMITABLE_EVENTS } from "../websocket/events.ts";
import { broadcastEvent } from "../websocket/utils.ts";

const chatRouter = new Router();

const chatMessageMapper = (chatMessage: ChatMessageSchema) => {
    return {
        ...chatMessage,
        id: chatMessage._id,
        _id: undefined,
    };
};

chatRouter.get("/messages", async (context) => {
    const timestamp = Number(context.request.url.searchParams.get("timestamp"));
    const chatMessages = await getChatMessages(timestamp);
    context.response.body = chatMessages.map(chatMessageMapper);
    context.response.status = 200;
});

chatRouter.post("/messages", async (context) => {
    const userId = await getCurrentUserId(context);
    const user = await getUserById(userId);
    if (!user) {
        thowBadRequest(context.response, "UserNotFound");
        return;
    }
    const body = await context.request.body({ type: "form-data" });
    const data = await body.value.read({ outPath: "./cdn/images" });
    const message = data.fields.message;
    const images = data.files?.map((file) => file.filename || "") ?? [];

    saveChatMessage([message], images, user._id);

    broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CHAT_MESSAGE, { images, content: [message], from: userId });
    context.response.status = 200;
    context.response.body = {};
});

export default chatRouter;
