import {db} from "../connection.ts";
import {Canvas, CanvasSchema} from "../schemas/canvas.ts";
import {ObjectId} from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";

const canvasCollection = db.collection<CanvasSchema>("Canvas");

type CanvasName = {
  id: string,
  name: string
}

export const updateCanvas = (id: ObjectId, newData: Canvas) => {
  return canvasCollection.updateOne({_id: id}, {$set: newData});
}

export const createCanvas = async (schema: Canvas): Promise<ObjectId> => {
  return await canvasCollection.insertOne(schema)
}

export const getCanvasNameIdList = async (): Promise<CanvasName[]> => {
  const queryResult = (await canvasCollection.find({}).toArray())

  return queryResult.reduce<CanvasName[]>((acc: CanvasName[], cur: CanvasSchema) => {
    return [...acc, {
      id: cur._id.toString(),
      name: cur.name
    }]
  }, [])
}

export const getCanvasById = async (id: string): Promise<CanvasSchema | null> => {
  const canvas = await canvasCollection.findOne({
    _id: new ObjectId(id)
  })

  if (!canvas) return null

  return {
    ...canvas,
    id: canvas._id
  }
}
export const deleteCanvasById = async (id: string) => {
  const result = await canvasCollection.deleteOne({
    _id: new ObjectId(id)
  })

  return result
}
