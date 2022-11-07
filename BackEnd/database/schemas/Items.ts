import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";
import { OriginalRechargeOptions } from "../../dndDataFormatter/types/OriginalItems.d.ts";

export type limitedUsageRechargeInTime = {
    timeUnit: string;
    usages: number;
    remainingUsages: number;
};

export type limitedUsageRechargeAtDiceRoll = {
    diceValue: number;
    usages: 1;
    remainingUsages: number;
};

export type LimitedUsage = {
    cost: number;
    recharge: limitedUsageRechargeInTime | limitedUsageRechargeAtDiceRoll | null;
};

export type multiRange = {
    low: number;
    high: number;
    unit: string;
};

export type shapeTypes = "sphere" | "cube" | "cone" | "line";

export type shapeRange = {
    shape: shapeTypes;
    lenght?: number;
    width?: number;
    radious?: number;
    unit: string;
};

export type simpleRange = {
    value: number;
    unit: string;
};

export type Trait = {
    name: string;
    description: string;
    action: string;
    image: string | null;
    limitedUsage: LimitedUsage | null;
    range: simpleRange | multiRange | shapeRange | null;
    isLegendary: boolean;
    isAction: boolean;
    isReaction: boolean;
};

export type damageType =
    | "Acid"
    | "Bludgeoning"
    | "Cold"
    | "Fire"
    | "Force"
    | "Lightning"
    | "Necrotic"
    | "Piercing"
    | "Poison"
    | "Psychic"
    | "Radiant"
    | "Slashing"
    | "Thunder";

export type weaponProprieties =
    | "Thrown"
    | "Versatile"
    | "Heavy"
    | "Two-Handed"
    | "Light"
    | "Finesse"
    | "Reach"
    | "Ammunition"
    | "Loading"
    | "Special"
    | "Ammunition (futuristic)"
    | "Reload"
    | "Burst Fire";

export type abilityModifiers = {
    str: number | null;
    con: number | null;
    dex: number | null;
    int: number | null;
    cha: number | null;
    wis: number | null;
};

export type armorAC = {
    value: number;
    condtion: string | null;
    value2: number | null;
};

export type itemBonuses = {
    ac: string;
    weaponAll: string;
    weaponAttack: string;
    weaponDamage: string;
    spellAttack: string;
    spellDamage: string;
    savingThrow: string;
};

export interface ItemSchema extends Trait {
    _id: ObjectId;
    quantity: number;
    weight: number;
    damage: string[] | null;
    damageType: damageType | null;
    isWeapon: boolean;
    isArmor: boolean;
    usesAmmunition: boolean;
    relatedSpells: Spell[];
    hasCharges: boolean;
    totalCharges: number;
    availableCharges: number;
    rechargeCharges: OriginalRechargeOptions | null;
    requiresAttunement: boolean;
    attunementConditions: string[];
    armorAC: armorAC | null;
    stealthDisatvantage: boolean;
    bonuses: itemBonuses;
    abilityModifiers: abilityModifiers;
    abilityOverrides: abilityModifiers;
    weaponProprieties: weaponProprieties[];
    isEquipped: boolean;
}

export interface SpellSchema extends ItemSchema {
    spellLevel: number;
}

export type ItemTransport = Omit<ItemSchema, "_id">;
export type SpellTransport = Omit<SpellSchema, "_id">;

export type Item = ItemSchema & {
    id: string;
};

export type Spell = SpellTransport & {
    spellLevel: number;
};
