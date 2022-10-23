export type MonsterAC = {
    value: number,
    source: string[],
    condition: string
}

export type MonsterHP = {
    average: number,
    formula: string
}

export type MonsterSpeedValue = {
    
        value: number,
        condition: string,
    
}

export type MonsterSpeed = {
    walk: {
        value: number,
        condition: string,
    },
    fly: OriginalSpeedWithCondition,
    climb: OriginalSpeedWithCondition,
    swim: OriginalSpeedWithCondition,
    borrow: OriginalSpeedWithCondition, 
    canHover: boolean
}

export type Monster = {
    name: string,
    source: string,
    size: string[],
    type: string,
    alignment: string[],
    ac: MonsterAC[],
    hp: MonsterHP,
    speed: 
}