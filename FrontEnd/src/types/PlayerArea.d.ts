import {MathUtils, Vector2, Vector3} from 'three'
import {DraggablePoint} from 'src/components/canvas/adjustableShape'
import {ComputedRef, Ref} from 'vue'

export type CanvasLightProperties = {
  position: Vector3,
  distance: number,
  intensity: number,
  decay: number,
  color: number,
  indicatorId: string,
  type: 'light',
  networkUpdate?: boolean
}

export type CanvasLightParams = {
  position: Vector3,
  distance?: number,
  intensity?: number,
  decay?: number,
  color?: number,
  indicatorId?: string,
  lightId?: string,
}

export type ControlPoint = {
  position: Vector3,
  type: 'controlPoint'
}


export type CanvasWallProperties = {
  controlPoints: Record<string, ControlPoint> & { networkUpdate?: boolean },
  tension: number,
  filled: boolean,
  closed: boolean,
  concaveHull: boolean,
  type: 'wall'
  networkUpdate?: boolean
}

export type CanvasPlayerProperties = {
  position: Vector3,
  isActive: boolean
  type: 'player' | 'enemy'
  networkUpdate?: boolean
}

export type ContextMenu = {
  top?: number,
  left?: number,
  display?: string,
}

export type NetworkLight = {
  position: Vector3,
  distance: number,
  intensity: number,
  decay: number,
  color: number,
  indicatorId: string,
  type: 'light',
}

export type NetworkWall = {
  controlPoints: Record<string, ControlPoint> & { networkUpdate?: boolean },
  tension: number,
  filled: boolean,
  closed: boolean,
  concaveHull: boolean,
  type: 'wall'
}

export type NetworkPlayer = {
  position: Vector3
  type: 'player' | 'enemy'
}

export type NetworkCanvas = {
  groundDimension: number
  gridSize: number
  canvasLights: Record<string, CanvasLightProperties>
  canvasWalls: Record<string, CanvasWallProperties>
  canvasPlayers: Record<string, CanvasPlayerProperties>
}

export type LightsStore = {
  canvasLights: Ref<Record<string, CanvasLightProperties>>
  getLightProps: ComputedRef<(id: string) => CanvasLightProperties>
  getNetworkLight: ComputedRef<(lightId: string) => NetworkLight>
  addLightToCanvas(params: CanvasLightParams): string
  updateLightLocation(lightId: string, newPosition: Vector3, networkUpdate = false): string | undefined
  updateLight(lightId: string, data: CanvasLightProperties, networkUpdate = false): string
}

export type WallStore = {
  canvasWalls: Ref<Record<string, CanvasWallProperties>>
  currentDrawingId: Ref<string>,
  createNewWall: (originPoint: Vector3, tension: number, filled: boolean, closed: boolean, concaveHull: boolean, wallId ?: string, objectId ?: string) => void
  addPointToShape: (point: Vector3, shapeId: string, pointId = MathUtils.generateUUID()) => void
  removePointFromShape: (pointId: string, shapeId: string) => void
  updatePointLocation: (pointId: string, shapeId: string, newLocation: Vector3) => void
  updateWall: (shapeId: string, data: CanvasWallProperties, networkUpdate = false) => { shapeId: string }
  getNetworkWall: ComputedRef<(wallId: string) => NetworkWall>
}

export type PlayerStore = {
  canvasPlayers: Ref<Record<string, CanvasPlayerProperties>>
  addPlayerToCanvas: (position: Vector3, playerId = MathUtils.generateUUID()) => void
  updatePlayerLocation: (playerId: string, newLocation: Vector3, networkUpdate = false) => void
  selectPlayer: (currentPlayerId: string) => void
  updatePlayer: (playerId: string, data: CanvasPlayerProperties, networkUpdate = false) => string
  getActivePlayer: ComputedRef<never[] | [string, CanvasPlayerProperties]>
  getCurrentPlayerPosition: ComputedRef<Vector3 | undefined>
  getNetworkPlayer: ComputedRef<(playerId: string) => NetworkPlayer>
}

export type PlayAreaStore = {
  drawMode: Ref<boolean>
  groundDimension: Ref<number>
  gridSize: Ref<number>
  targetedObject?: DraggablePoint
  contextMenu: Ref<ContextMenu>
  id: Ref<string>
  toggleDrawMode: () => void
  setTargetObject: (newValue: DraggablePoint) => void
  deleteTargetObject: () => void
  addPointsToObject: () => void
  handleContextMenu: (position: PositionObject, targetedObject ?: DraggablePoint, visibility ?: string) => void
  loadCanvas: (newId: string) => void
  getNetworkCanvas: ComputedRef<NetworkCanvas>
} & WallStore & LightsStore & PlayerStore

export type PositionObject = {
  top?: number | string
  left?: number | string
}
