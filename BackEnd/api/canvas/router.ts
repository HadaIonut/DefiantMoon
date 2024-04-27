import {Router} from "https://deno.land/x/oak@v11.1.0/router.ts";
import {createCanvas, getCanvasById, getCanvasNameIdList, updateCanvas} from "../../database/repos/canvas.ts";
import {Canvas} from "../../database/schemas/canvas.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/deps.ts";
import {broadcastEvent} from "../websocket/utils.ts";
import {WEBSOCKET_EMITABLE_EVENTS} from "../websocket/events.ts";
import {getCurrentUserId} from "../../auth/index.ts";

const canvasRouter = new Router()

canvasRouter.get('/', async (context) => {
  context.response.body = await getCanvasNameIdList()
  context.response.status = 200
})

canvasRouter.get('/:canvasId', async (context) => {
  context.response.body = await getCanvasById(context.params.canvasId);
  context.response.status = 200
})

canvasRouter.post('/', async (context) => {
  const canvasData = await context.request.body({type: 'json'}).value as unknown as Canvas

  const canvasId = await createCanvas(canvasData)

  context.response.body = {
    canvasId
  }
  context.response.status = 200
})

canvasRouter.put('/:canvasId', async (context) => {
  const userId = await getCurrentUserId(context);
  const canvasData = await context.request.body({type: 'json'}).value as unknown as Canvas

  console.log(context.params.canvasId)

  await updateCanvas(new ObjectId(context.params.canvasId), canvasData)

  broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CANVAS_UPDATE, {
    source: userId,
    id:context.params.canvasId,
    data: canvasData
  });

  context.response.status = 200
})

export default canvasRouter