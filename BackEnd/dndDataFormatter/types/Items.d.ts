import { OriginalRechargeOptions } from "./OriginalItems.d.ts"

export type limitedUsageRechargeInTime = {
    timeUnit: string,
    usages: number,
    remainingUsages: number,
}

export type limitedUsageRechargeAtDiceRoll = {
    diceValue: number,
    usages: 1,
    remainingUsages: number,
}

export type LimitedUsage = {
    cost: number,
    recharge: limitedUsageRechargeInTime | limitedUsageRechargeAtDiceRoll | null,
}

export type multiRange = {
    low: number,
    heigh: number,
    unit: string
}

export type shapeTypes = 'sphere' | 'cube' | 'cone' | 'line'

export type shapeRange = {
    shape: shapeTypes,
    lenght?: number,
    width?: number,
    radious?: number,
    unit: string, 
}

export type simpleRange = {
    value: number,
    unit: string,
}

export type Trait = {
    name: string,
    description: string,
    action: string,
    image: string | null,
    limitedUsage: LimitedUsage | null,
    range: simpleRange | multiRange | shapeRange | null,
    isLegendary: boolean,
    isAction: boolean,
    isReaction: boolean,
}

export type damageType = "Acid" | "Bludgeoning" | "Cold" | "Fire" | "Force" | "Lightning" | "Necrotic" | "Piercing" | "Poison" | "Psychic" | "Radiant" | "Slashing" | "Thunder"

export type weaponProprieties = "Thrown" | "Versatile" | "Heavy" | "Two-Handed" | "Light" | "Finesse" | "Reach" | "Ammunition" | "Loading" | "Special" | "Ammunition (futuristic)" | "Reload" | "Burst Fire"

export type abilityModifiers = {
    str: number | null,
    con: number | null,
    dex: number | null,
    int: number | null,
    cha: number | null,
    wis: number | null,
}

export type Item = Trait & {
    quantity: number,
    weight: number,
    damage: string[] | null,
    damageType: damageType,
    isWeapon: boolean,
    isArmor: boolean
    usesAmmunition: boolean,
    relatedSpells: Spell[],
    hasCharges: boolean,
    totalCharges: number,
    availableCharges: number,
    rechargeCharges: OriginalRechargeOptions,
    requiresAttunement: boolean,
    attunementConditions: string[],
    armorAC: {
        value: number,
        condtion: string,
        value2: number,
    } | null,
    stealthDisatvantage: boolean,
    bonuses: {
        ac: string,
        weaponAll: string,
        weaponAttack: string,
        weaponDamage: string,
        spellAttack: string,
        spellDamage: string,
        savingThrow: string,
    } | null,
    abilityModifiers: abilityModifiers,
    abilityOverrides: abilityModifiers,
    weaponProprieties: weaponProprieties,
    isEquipped: boolean,
}

export type Spell = Item & {
    spellLevel: number,
}