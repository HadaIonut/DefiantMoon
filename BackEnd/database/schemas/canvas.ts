import {ObjectId} from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";

export type Vector3 = {
  x: number
  y: number
  z: number
}

export type CanvasLightProperties = {
  position: Vector3,
  distance: number,
  intensity: number,
  decay: number,
  color: number,
  indicatorId: string,
  type: 'light'
}

export type ControlPoint = {
  position: Vector3,
  type: 'controlPoint'
}


export type CanvasWallProperties = {
  controlPoints: Record<string, ControlPoint>,
  tension: number,
  filled: boolean,
  closed: boolean,
  concaveHull: boolean,
  type: 'wall'
}

export type CanvasPlayerProperties = {
  position: Vector3,
  isActive: boolean
  type: 'player' | 'enemy'
}

export type CanvasSchema = Canvas & {
  _id: ObjectId;
}

export type Canvas = {
  name: string
  groundDimension: number
  gridSize: number
  canvasLights: Record<string, CanvasLightProperties>
  canvasWalls: Record<string, CanvasWallProperties>
  canvasPlayers: Record<string, CanvasPlayerProperties>
}
