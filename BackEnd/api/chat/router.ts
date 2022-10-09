import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { getCurrentUserId } from "../../auth/index.ts";
import { getUserById } from "../../database/repos/users.ts";
import { thowBadRequest } from "../utils.ts";
import { WEBSOCKET_EMITABLE_EVENTS } from "../websocket/events.ts";
import { broadcastEvent } from "../websocket/utils.ts";

const chatRouter = new Router();

chatRouter.post("/message", async (context) => {
    const userId = await getCurrentUserId(context);
    const user = await getUserById(userId);
    if (!user) {
        thowBadRequest(context.response, "UserNotFound");
        return;
    }
    const body = await context.request.body({ type: 'form-data' })
    const data = await body.value.read({ outPath: "./cdn/images" })
    const message = data.fields.message
    const images = data.files?.map((file) => file.filename);

    broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CHAT_MESSAGE, { images, text: message, username: user.username, userId });
    context.response.status = 200;
    context.response.body = {}
})

export default chatRouter;