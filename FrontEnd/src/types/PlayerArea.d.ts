import {Vector2, Vector3} from 'three'
import {DraggablePoint} from 'src/components/canvas/adjustableShape'

export type CanvasLightProperties = {
    position: Vector3,
    distance: number,
    intensity: number,
    decay: number,
    color: number,
    indicatorId: string,
    type: 'light'
}

export type CanvasLightParams = {
    position: Vector3,
    distance?: number,
    intensity?: number,
    decay?: number,
    color?: number,
    indicatorId?: string,
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
    networkUpdate?: boolean
}

export type PlayAreaStore = {
    drawMode: boolean
    currentDrawingId: string,
    groundDimension: number
    gridSize: number
    targetedObject?: DraggablePoint
    contextMenu: {
        top?: number,
        left?: number,
        display?: string,
    }
    canvasLights: Record<string, CanvasLightProperties>
    canvasWalls: Record<string, CanvasWallProperties>
    canvasPlayers: Record<string, CanvasPlayerProperties>
    id: string
}

export type PositionObject = {
    top?: number | string
    left?: number | string
}
