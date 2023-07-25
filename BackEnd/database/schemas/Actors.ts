import {ObjectId} from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import {Item, Spell, Trait} from "./Items.ts";

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

export type SpeedValue = {
  value: number;
  condition: string; // TODO could be an item, update when that is ready
};

export type Speed = {
  walk: SpeedValue;
  fly: SpeedValue;
  climb: SpeedValue;
  swim: SpeedValue;
  borrow: SpeedValue;
  canHover: boolean;
};

/**
 * field indicates proficiency
 */
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
  "sleight of hand": 0 | 1 | 2 | 3;
  "animal handling": 0 | 1 | 2 | 3;
};

export type Resistance = {
  value: string[];
};

export type MonsterResistance = {
  value: string[];
  condition: string; //TODO could be an item, update when that is ready
};

export type MonsterSpellcasting = {
  name: string;
  descriptions: string[];
  atWill: Spell[];
  withRecharge: {
    [quantity: string]: {
      spells: Spell[];
      rechargeCondition: string;
      rechargeQuantity: number;
      remaining: number;
    };
  };
  rituals: Spell[];
  leveledSpells: {
    [slotLevel: number]: {
      slots: number;
      spells: Spell[];
    };
  };
  spellcastingAbility: string;
};

export type MonsterSaveOverride = {
  str?: number;
  dex?: number;
  con?: number;
  int?: number;
  wis?: number;
  cha?: number;
};

export type MonsterSkillOverride = {
  perception?: number;
  stealth?: number;
  athletics?: number;
  arcana?: number;
  persuasion?: number;
  survival?: number;
  deception?: number;
  history?: number;
  intimidation?: number;
  insight?: number;
  medicine?: number;
  religion?: number;
  nature?: number;
  investigation?: number;
  performance?: number;
  acrobatics?: number;
  other?: number;
  "sleight of hand"?: number;
  "animal handling"?: number;
};

export interface TypeObject {
  type: string,
  tags: string[]
}

export interface ActorSchema {
  _id: ObjectId;
  name: string;
  source: string;
  size: string[];
  type: string | TypeObject;
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

export type ActorTransport = Omit<ActorSchema, "_id">

export type Actor = ActorTransport & {
  id: string;
};
