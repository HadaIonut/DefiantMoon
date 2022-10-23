
export type OriginalAC = {
    ac: number,
    from?: string[],
    condition?: string,
    braces?: boolean
}

export type OriginalSpeedWithCondition = {
    number: number,
    condition: string,
}

export type OriginalSpeed = {
    walk?: number | OriginalSpeedWithCondition,
    fly?: number | OriginalSpeedWithCondition,
    climb?: number | OriginalSpeedWithCondition,
    swim?: number | OriginalSpeedWithCondition,
    borrow?: number | OriginalSpeedWithCondition, 
    canHover?: boolean
}

export type OriginalSave = {
    str?: string,
	dex?: string,
	con?: string,
	int?: string,
	wis?: string,
	cha?: string,
}

export type OriginalSkill = {
    perception?: string,
    stealth?: string,
    athletics?: string,
    arcana?: string,
    persuasion?: string,
    survival?: string,
    deception?: string,
    history?: string,
    intimidation?: string,
    insight?: string,
    medicine?: string,
    religion?: string,
    nature?: string,
    investigation?: string,
    performance?: string,
    acrobatics?: string,
    other?: string,
    "sleight of hand"?: string,
    "animal handling"?: string,
}

export type OriginalResistance = {
    resist: string[],
    preNode?: string,
    note?: string,
    cond?: boolean,
}

export type OriginalImmunity = {
    immune: string[],
    preNode?: string,
    note?: string,
    cond?: boolean,
}

export type OriginalTrait = {
    name: string,
    entries: string[],
}

export type OriginalAction = {
    name: string,
    entries: string[],
}

export type OriginalLegendaryAction = {
    name: string,
    entries: string[],
}

export type OriginalSpellcasting = {
    name: string,
    headerEntries: string[],
    will?: string[],
    daily?: {},
    ability: string,
}

export type OriginalMonster = {
    name: string,
    source: string,
    size: string[],
    type: string,
    alignment: string[],
    ac: (number | OriginalAC)[],
    hp: {
        average: number | string,
        formula: string,
    },
    speed?: OriginalSpeed,
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
    save?: OriginalSave,
    skill?: OriginalSkill,
    senses?: string[],
    passive: number,
    resist?: (string | OriginalResistance)[],
    immune?: (string | OriginalImmunity)[],
    conditionImmune?: string[]
    languages?: string[],
    cr: string | number,
    trait?: OriginalTrait[],
    action?: OriginalAction[],
    reaction?: OriginalAction[]
    legendary?: OriginalLegendaryAction[],
    spellcasting?: OriginalSpellcasting[]
    hasToken: boolean,
    hasFluff: boolean,
    hasFluffImages: boolean,
}

export type Monster = {

}