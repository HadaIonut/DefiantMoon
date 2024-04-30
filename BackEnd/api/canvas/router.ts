import {Router} from "https://deno.land/x/oak@v11.1.0/router.ts";
import {createCanvas, getCanvasById, getCanvasNameIdList, updateCanvas} from "../../database/repos/canvas.ts";
import {Canvas, CanvasPlayerProperties} from "../../database/schemas/canvas.ts";
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

canvasRouter.patch('/:canvasId/player/:playerId', async (context) => {
  const userId = await getCurrentUserId(context);
  const playerData = await context.request.body({type: 'json'}).value as unknown as CanvasPlayerProperties
  const canvasData = await getCanvasById(context.params.canvasId)
  if (!canvasData) return

  canvasData.canvasPlayers[context.params.playerId] = playerData

  console.log(`modify canvas: ${context.params.canvasId}`)
  console.log(`modify player: ${context.params.playerId}`)
  console.log(canvasData.canvasPlayers)

  await updateCanvas(new ObjectId(context.params.canvasId), canvasData)

  broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CANVAS_UPDATE, {
    source: userId,
    canvasId: context.params.canvasId,
    playerId: context.params.playerId,
    data: playerData
  });

  context.response.status = 200
})

export default canvasRouter