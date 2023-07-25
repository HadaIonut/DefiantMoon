export interface TypeObject {
    type: string,
    tags: string[]
}

export type AC = {
    value: number;
};

export type MonsterAC = {
    value: number;
    source: string[];
    condition: string; // TODO could be an item, update when that is ready
};

/**
 * value: total HP, contains stat modifiers
 * rawValue: diceRolled HP
 */
export type HP = {
    value: number;
    rawValue: number;
};

export type MonsterHP = {
    average: number;
    formula: string;
};

export type Speed = {
    walk: SpeedValue;
    fly: SpeedValue;
    climb: SpeedValue;
    swim: SpeedValue;
    borrow: SpeedValue;
    canHover: boolean;
};

export type SpeedValue = {
    value: number;
    condition: string; // TODO could be an item, update when that is ready
};

export type Save = {
    str: boolean;
    dex: boolean;
    con: boolean;
    int: boolean;
    wis: boolean;
    cha: boolean;
};

/**
 * 0 - no proficiency;
 * 1 - half proficiency;
 * 2 - normal proficiency;
 * 3 - expertise;
 */
export type Skill = {
    perception: 0 | 1 | 2 | 3;
    stealth: 0 | 1 | 2 | 3;
    athletics: 0 | 1 | 2 | 3;
    arcana: 0 | 1 | 2 | 3;
    persuasion: 0 | 1 | 2 | 3;
    survival: 0 | 1 | 2 | 3;
    deception: 0 | 1 | 2 | 3;
    history: 0 | 1 | 2 | 3;
    intimidation: 0 | 1 | 2 | 3;
    insight: 0 | 1 | 2 | 3;
    medicine: 0 | 1 | 2 | 3;
    religion: 0 | 1 | 2 | 3;
    nature: 0 | 1 | 2 | 3;
    investigation: 0 | 1 | 2 | 3;
    performance: 0 | 1 | 2 | 3;
    acrobatics: 0 | 1 | 2 | 3;
    other: 0 | 1 | 2 | 3;
    'sleight of hand': 0 | 1 | 2 | 3;
    'animal handling': 0 | 1 | 2 | 3;
};

export type Actor = {
    id: string;
    name: string;
    source: string;
    size: string[];
    type: string | TypeObject;
    alignment: string[];
    ac: MonsterAC[] | AC[];
    hp: MonsterHP ;
    speed: Speed;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    save: Save;
    skill: Skill;
    senses: string[];
    passivePerception: number;
    proficiency: number;
    resistances: MonsterResistance[] | Resistance[];
    immunity: MonsterResistance[] | Resistance[];
    conditionImmunity: string[];
    languages: string[];
    cr: string;
    trait: Trait[];
    hasLegendaryActions: boolean;
    hasLegendaryResistance: boolean;
    legendaryResistanceCount: number;
    legendaryActionCount: number;
    spellcasting: MonsterSpellcasting[] | null;
    overrides: {
        saves: MonsterSaveOverride;
        skills: MonsterSkillOverride;
    } | null;
    items: Item[];
    isPlayer: boolean;
}
