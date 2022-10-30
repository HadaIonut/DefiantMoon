export type OriginalRarity = "rare" | "none" | "uncommon" | "very rare" | "legendary" | "artifact" | "unknown" | "common" | "unknown (magic)" | "varies"

export type OriginalPackContents = {
    item: string,
    quanity: number
}

/**
 * Overrides existing ability score
 */
export type OriginalItemAbilityStaticMod = {
    str?: number,
    con?: number,
    dex?: number,
    int?: number,
    cha?: number,
    wis?: number,
}

/**
 * Addes modifier to current score
 */
export type OriginalItemAbilityModifier = {
    str?: number,
    con?: number,
    dex?: number,
    int?: number,
    cha?: number,
    wis?: number,
    static?: OriginalItemAbilityStaticMod
}

export type OriginalAttackedSpells = string[]

export type OriginalRechargeOptions = "round" | "restShort" | "restLong" | "dawn" | "dusk" | "midnight"

export type OriginalSpecificSpellcastingFocus = 'arcane' | "holy" | "druid"

export type OriginalDmgType = "A" | "B" | "C" | "F" | "O" | "L" | "N" | "P" | "I" | "Y" | "R" | "S" | "T" 

export type OriginalPropertiesType = "T" | "V" | "H" | "2H" | "F" | "F" | "L" | "R" | "A" | "LD" | "S" | "AF" | "RLD" | "BF"

export type OriginalEntries = {
    type: string,
    name: string,
    entries: (OriginalEntries | string)[]
}

export type OrigianlItem = {
    name: string,
    type?: string,
    rarity: OriginalRarity,
    source?: string,
    entries?: OriginalEntries[],
    weight: number,
    weaponCategory?: string,
    property?: OriginalPropertiesType[],
    range?: string,
    reload?: number,
    dmg1?: string,
    dmg2?: string,
    dmgType?: OriginalDmgType,
    weapon?: boolean,
    ammoType?: string,
    value?: number,
    packContents?: (OriginalPackContents | string)[],
    axe?: boolean,
    ability?: OriginalItemAbilityModifier,
    attachedSpells?: OriginalAttackedSpells,
    bonusAC?: string,
    bonusWeapon?: string,
    bonusWeaponAttack?: string,
    bonusWeaponDamage?: string,
    bonusSpellAttack?: string,
    bonusSavingThrow?: string,
    charges?: number,
    recharge?: OriginalRechargeOptions,
    reqAttune?: boolean | string,
    sfcType?: OriginalSpecificSpellcastingFocus,
    focus?: boolean | string[],
    speed?: number,
    wonderous?: boolean,
    ac?: number | string,
    acSpecial?: string,
    stealth?: boolean,
    strength?: number,
    ammunition?: boolean
}