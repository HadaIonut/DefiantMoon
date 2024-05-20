import { Router } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { createCanvas, deleteCanvasById, getCanvasById, getCanvasNameIdList, updateCanvas } from "../../database/repos/canvas.ts";
import {
  Canvas,
  CanvasLightProperties,
  CanvasPlayerProperties,
  CanvasWallProperties
} from "../../database/schemas/canvas.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/deps.ts";
import { broadcastEvent } from "../websocket/utils.ts";
import { WEBSOCKET_EMITABLE_EVENTS } from "../websocket/events.ts";
import { getCurrentUserId } from "../../auth/index.ts";

const canvasRouter = new Router()

canvasRouter.get('/', async (context) => {
  context.response.body = await getCanvasNameIdList()
  context.response.status = 200
})
canvasRouter.get('/:canvasId', async (context) => {
  context.response.body = await getCanvasById(context.params.canvasId);
  context.response.status = 200
})
canvasRouter.delete('/:canvasId', async (context) => {
  const userId = await getCurrentUserId(context);

  deleteCanvasById(context.params.canvasId)

  context.response.status = 200

  broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CANVAS_LIST_UPDATE, {
    source: userId,
    data: await getCanvasNameIdList()
  });
})
canvasRouter.patch('/:canvasId', async (context) => {
  console.log("canvas patch")
  const userId = await getCurrentUserId(context);
  const newCanvasData = await context.request.body({ type: 'json' }).value as unknown as Canvas
  const oldCanvasData = await getCanvasById(context.params.canvasId)
  updateCanvas(new ObjectId(context.params.canvasId), {...oldCanvasData, ...newCanvasData})

  broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CANVAS_LIST_UPDATE, {
    source: userId,
    data: await getCanvasNameIdList()
  });
})
canvasRouter.post('/', async (context) => {
  const canvasData = await context.request.body({ type: 'json' }).value as unknown as Canvas
  const userId = await getCurrentUserId(context);
  const canvasId = await createCanvas(canvasData)

  context.response.body = {
    canvasId
  }
  context.response.status = 200

  broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CANVAS_LIST_UPDATE, {
    source: userId,
    data: await getCanvasNameIdList()
  });
})
canvasRouter.patch('/:canvasId/player/:playerId', async (context) => {
  const userId = await getCurrentUserId(context);
  const playerData = await context.request.body({ type: 'json' }).value as unknown as CanvasPlayerProperties
  const canvasData = await getCanvasById(context.params.canvasId)
  if (!canvasData) return
  console.log(canvasData)
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
canvasRouter.patch('/:canvasId/light/:lightId', async (context) => {
  const userId = await getCurrentUserId(context);
  const lightData = await context.request.body({ type: 'json' }).value as unknown as CanvasLightProperties
  const canvasData = await getCanvasById(context.params.canvasId)
  if (!canvasData) return

  canvasData.canvasLights[context.params.lightId] = lightData

  console.log(`modify canvas: ${context.params.canvasId}`)
  console.log(`modify light: ${context.params.lightId}`)
  console.log(canvasData.canvasLights)

  await updateCanvas(new ObjectId(context.params.canvasId), canvasData)

  broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CANVAS_UPDATE, {
    source: userId,
    canvasId: context.params.canvasId,
    lightId: context.params.lightId,
    data: lightData
  });

  context.response.status = 200
})
canvasRouter.patch('/:canvasId/wall/:wallId', async (context) => {
  const userId = await getCurrentUserId(context);
  const wallData = await context.request.body({ type: 'json' }).value as unknown as CanvasWallProperties
  const canvasData = await getCanvasById(context.params.canvasId)
  if (!canvasData) return

  canvasData.canvasWalls[context.params.wallId] = wallData

  console.log(`modify canvas: ${context.params.canvasId}`)
  console.log(`modify wall: ${context.params.wallId}`)
  console.log(canvasData.canvasWalls)

  await updateCanvas(new ObjectId(context.params.canvasId), canvasData)

  broadcastEvent(WEBSOCKET_EMITABLE_EVENTS.CANVAS_UPDATE, {
    source: userId,
    canvasId: context.params.canvasId,
    wallId: context.params.wallId,
    data: wallData
  });

  context.response.status = 200
})

export default canvasRouter
