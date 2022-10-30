import { MonsterSkill } from "../types/Monster.d.ts"
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

export const getEmptySkillsObject = (): MonsterSkill => {
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