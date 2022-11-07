import { abilityModifiers, damageType, weaponProprieties } from "../../database/schemas/Items.ts"
import { Skill } from "../../database/schemas/Actors.ts"
import { OriginalDmgType, OriginalPropertiesType } from "../types/OriginalItems.d.ts"
import { AttackType, OriginalAttackType } from "../types/OriginalMonster.d.ts"

export const attackShortHandMap: {[key in OriginalAttackType]: AttackType} = {
    m: 'Melee Weapon Attack',
    mw: 'Melee Weapon Attack',
    ms: 'Melee Spell Attack',
    rw: 'Ranged Weapon Attack',
    rs: 'Ranged Spell Attack'
}

export const boldText = (text: string): string => `<b>${text}</b>`

export const skillToAbilityMap = {
    perception: 'wis',
    stealth: 'dex',
    athletics: 'str',
    arcana: 'int',
    persuasion: 'cha',
    survival: 'wis',
    deception: 'cha',
    history: 'int',
    intimidation: 'cha',
    insight: 'wis',
    medicine: 'int',
    religion: 'int',
    nature: 'int',
    investigation: 'int',
    performance: 'cha',
    acrobatics: 'dex',
    "sleight of hand": 'dex',
    "animal handling": 'wis',
}

export const getEmptySkillsObject = (): Skill => {
    return {
        perception: 0,
        stealth: 0,
        athletics: 0,
        arcana: 0,
        persuasion: 0,
        survival: 0,
        deception: 0,
        history: 0,
        intimidation: 0,
        insight: 0,
        medicine: 0,
        religion: 0,
        nature: 0,
        investigation: 0,
        performance: 0,
        acrobatics: 0,
        "sleight of hand": 0,
        "animal handling": 0,
        other: 0,
    }
}

export const getEmptyAbilityMap = ():abilityModifiers => {
    return {
        str: null,
        dex: null,
        con: null,
        int: null,
        wis: null,
        cha: null,
    }
}

export const damageTypeConversionMap: {[key in OriginalDmgType]: damageType } = {
    "A": "Acid",
    "B": "Bludgeoning",
    "C": "Cold",
    "F": "Fire",
    "O": "Force",
    "L": "Lightning",
    "N": "Necrotic",
    "P": "Piercing",
    "I": "Poison",
    "Y": "Psychic",
    "R": "Radiant",
    "S": "Slashing",
    "T": "Thunder",
}

export const propertyTypeConversionMap: {[key in OriginalPropertiesType]: weaponProprieties} = {
    "T": 'Thrown',
    "V": 'Versatile',
    "H": 'Heavy',
    "2H": 'Two-Handed',
    "F": 'Finesse', 
    "L": 'Light',
    "R": 'Reach', 
    "A": 'Ammunition',
    "LD": 'Loading',
    "S": 'Special',
    "AF": 'Ammunition (futuristic)', 
    "RLD": 'Reload', 
    "BF": 'Burst Fire'
}

export const classes = ['barbarian', 'bard', 'cleric', 'druid', 'fighter', 'monk', 'paladin', 'rogue', 'ranger', 'sorcerer', 'warlock', 'wizard']