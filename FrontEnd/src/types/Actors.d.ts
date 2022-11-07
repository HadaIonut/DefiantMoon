export type Actor = {
    id: string;
    name: string;
    source: string;
    size: string[];
    type: string;
    alignment: string[];
    ac: MonsterAC[] | AC[];
    hp: MonsterHP | HP;
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
    cr: number;
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
