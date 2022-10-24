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
    walk: MonsterSpeedValue,
    fly: MonsterSpeedValue,
    climb: MonsterSpeedValue,
    swim: MonsterSpeedValue,
    borrow: MonsterSpeedValue, 
    canHover: boolean
}
/**
 * field indicates proficiency
 */
export type MonsterSave = {
    str: boolean,
    dex: boolean,
	con: boolean,
	int: boolean,
	wis: boolean,
	cha: boolean,
}

/**
 * 0 - no proficiency;
 * 1 - half proficiency;
 * 2 - normal proficiency;
 * 3 - expertise;
 */
export type MonsterSkill = {
    perception: 0 | 1 | 2 | 3,
    stealth: 0 | 1 | 2 | 3,
    athletics: 0 | 1 | 2 | 3,
    arcana: 0 | 1 | 2 | 3,
    persuasion: 0 | 1 | 2 | 3,
    survival: 0 | 1 | 2 | 3,
    deception: 0 | 1 | 2 | 3,
    history: 0 | 1 | 2 | 3,
    intimidation: 0 | 1 | 2 | 3,
    insight: 0 | 1 | 2 | 3,
    medicine: 0 | 1 | 2 | 3,
    religion: 0 | 1 | 2 | 3,
    nature: 0 | 1 | 2 | 3,
    investigation: 0 | 1 | 2 | 3,
    performance: 0 | 1 | 2 | 3,
    acrobatics: 0 | 1 | 2 | 3,
    other: 0 | 1 | 2 | 3,
    "sleight of hand": 0 | 1 | 2 | 3,
    "animal handling": 0 | 1 | 2 | 3,
}

export type MonsterResistance = {
    value: string[],
    note: string,
    condition: string
}

export type MonsterTrait = {
    name: string,
    descriptions: string[],
    action: string,
}

export type MonsterAction = {
    name: string,
    descriptions: string[],
    action: string,
}

export type Spell = {}

export type MonsterSpellcasting = {
    name: string,
    descriptions: string[],
    atWill: Spell[],
    withRecharge: {
        [quantity: string]: {
            spells: Spell[],
            rechargeCondition: string,
            rechargeQuantity: number,
            remaining: number
        }
    },
    rituals: Spell[],
    leveledSpells: {
        [slotLevel: number]: {
            slots: number,
            spells: Spell[]
        }
    },
    spellcastingAbility: string,
}

export type Monster = {
    name: string,
    source: string,
    size: string[],
    type: string,
    alignment: string[],
    ac: MonsterAC[],
    hp: MonsterHP,
    speed: MonsterSpeed,
    str: number,
    dex: number,
    con: number,
    int: number,
    wis: number,
    cha: number,
    save: MonsterSave,
    skill: MonsterSkill,
    senses: string[],
    passivePerception: number,
    proficiency: number,
    resistances: MonsterResistance[],
    immunity: MonsterResistance[],
    conditionImmunity: string[],
    languages: string[],
    cr: number,
    trait: MonsterTrait[],
    actions: MonsterAction[],
    legendaryActions: MonsterAction[],
    hasLegendaryActions: boolean,
    hasLegendaryResistance: boolean,
    legendaryResistanceCount: number,
    legendaryActionCount: number,
    spellcasting: MonsterSpellcasting[]
}