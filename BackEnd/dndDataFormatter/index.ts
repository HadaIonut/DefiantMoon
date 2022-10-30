import { skillToAbilityMap, getEmptySkillsObject, attackShortHandMap, boldText } from "./constants/constants.ts"
import { LimitedUsage, limitedUsageRechargeAtDiceRoll, limitedUsageRechargeInTime, multiRange, shapeRange, shapeTypes, simpleRange, Trait } from "./types/Items.d.ts"
import { Monster, MonsterAC, MonsterHP, MonsterResistance, MonsterSave, MonsterSkill, MonsterSpeed, MonsterSpeedValue } from "./types/Monster.d.ts"
import { OriginalAC, OriginalAction, OriginalAttackType, OriginalImmunity, OriginalLegendaryAction, OriginalMonster, OriginalResistance, OriginalSave, OriginalSkill, OriginalSpeed, OriginalSpeedWithCondition, OriginalTrait } from "./types/OriginalMonster.d.ts"

const bestiaryDir = Deno.readDir('./data/bestiary')
let types = new Set()
let mods = new Set()
let everything: [] = []

const parseMonsterAC = (originalAc: (OriginalAC | number)[]): MonsterAC[] => {
    const out: MonsterAC[] = []
    
    originalAc?.forEach?.((ac: OriginalAC | number) => {
        if (typeof ac === 'number') {
            out.push({
                value: ac,
                source: [],
                condition: ''
            })
        } else {
            out.push({
                value: ac.ac,
                source: ac.from ?? [],
                condition: ac.condition ?? ''
            })
        }
    })

    return out
}

const parseMonsterHP = (originalHp: {average: number | string, formula: string}): MonsterHP => {
    return {
        average: Number(originalHp?.average ?? 0),
        formula: originalHp?.formula ?? ''
    }
}

const parseMonsterSpeed = (originalSpeed?: OriginalSpeed): MonsterSpeed => {
    const speedTypes = ['walk', 'fly', 'climb', 'swim', 'borrow']
    const out: {
        [key: string]: MonsterSpeedValue | boolean
    } = {}

    speedTypes.forEach((type) => {
        const speedValue = originalSpeed?.[type as keyof OriginalSpeed]

        out[type] = {
            value: (speedValue as OriginalSpeedWithCondition)?.number ?? speedValue ?? 0,
            condition: (speedValue as OriginalSpeedWithCondition)?.condition ?? ''
        }
    })

    out.canHover = originalSpeed?.canHover ?? false

    return out as MonsterSpeed
}

const parseMonsterSave = (originalSave: OriginalSave = {}): MonsterSave => {
    return {
        str: !!originalSave?.str,
        dex: !!originalSave?.dex,
        con: !!originalSave?.con,
        int: !!originalSave?.int,
        wis: !!originalSave?.wis,
        cha: !!originalSave?.cha,
    }
}

const statToModifier = (stat: number):number => Math.floor((stat - 10) / 2)

const getProficiencyScore = (monster: OriginalMonster): number => {
    const saves = monster?.save ?? {}

    const saveSkill = Object.keys(saves)[0] ?? 'str'
    const saveSkillValue = monster?.save?.[saveSkill as keyof OriginalSave] ?? '+0'
    const statValue: number = monster[saveSkill as keyof OriginalMonster] as number ?? 10
    const statModifier = statToModifier(statValue)

    return Math.abs(Number(saveSkillValue) - statModifier)
}

const parseMonsterSkills = (originalSkill: OriginalSkill | undefined, proficiency: number, monster: OriginalMonster): MonsterSkill => {
    const out = getEmptySkillsObject()

    Object.entries(originalSkill ?? {}).forEach(([skill, value]) => {
        const skillAbility = skillToAbilityMap[skill as keyof typeof skillToAbilityMap]
        const abilityValue = statToModifier(monster[skillAbility as keyof OriginalMonster] as number)
        const profMultiplier = (Number(value) - abilityValue) / proficiency

        if (profMultiplier == 0.5) out[skill as keyof MonsterSkill] = 1
        else if (profMultiplier == 1) out[skill as keyof MonsterSkill] = 2
        else if (profMultiplier == 2) out[skill as keyof MonsterSkill] = 3
        else out[skill as keyof MonsterSkill] = 0
    })

    return out
}

const parseMonsterResistance = (originalResistance?: (string | OriginalResistance | OriginalImmunity)[]): MonsterResistance[] => {
    const out: MonsterResistance[] = []

    originalResistance?.forEach?.((resistace: string | OriginalResistance | OriginalImmunity) => {
        if (typeof resistace === 'string') {
            out.push({
                value: [resistace],
                condition: 'false'
            })
        } else {
            out.push({
                value: (resistace as OriginalResistance)?.resist ?? (resistace as OriginalImmunity)?.immune,
                condition: resistace?.note ?? ''
            })
        }
    })

    return out
}

const extractDataFromTraitName = (name: string): [string, LimitedUsage | null] => {
    const splitted = [...name.matchAll(/([\w ]+)(?:\((\d+)\/(\w+)\)?\))?(?:{@recharge (\d)+})?\s?/g)][0]

    const hasDiceRecharge = !!splitted?.[4] ?? false
    const hasDayRehcarge = !!splitted?.[3] ?? false
    const hasLimitedUsage = hasDiceRecharge || hasDayRehcarge
    let rechargeObject: limitedUsageRechargeInTime | limitedUsageRechargeAtDiceRoll | null = null

    if (hasDiceRecharge) {
        rechargeObject = {
            diceValue: Number(splitted?.[4]),
            usages: 1,
        }
    } else if (hasDayRehcarge) {
        rechargeObject = {
            timeUnit: splitted?.[3],
            usages: Number(splitted[2])
        }
    }

    return [
        splitted?.[1] ?? '',
        hasLimitedUsage ? {
            cost: 1,
            recharge: rechargeObject,
        } : null
    ]
}

const extractTraitDebug = (monster: OriginalMonster) => {
    let debugText = ''
    const rextractEverything = false

    if (rextractEverything) {
        monster.trait?.forEach((trait: OriginalTrait) => {
            trait.entries.forEach((entry: string) => {
                if (entry?.includes?.("{@")) {
                    debugText += `\n${entry}`
                }
            })
        })
    
        monster.action?.forEach((action: OriginalAction) => {
            action.entries.forEach((entry: string) => {
                if (entry?.includes?.("{@")) {
                    debugText += `\n${entry}`
                }
            })
        })
    
        monster.legendary?.forEach((legendary: OriginalLegendaryAction) => {
            legendary.entries.forEach((entry: string) => {
                if (entry?.includes?.("{@")) {
                    debugText += `\n${entry}`
                }
            })
        })
    
        let text = Deno.readTextFileSync('./debug.txt')
        Deno.writeTextFileSync(`./debug.txt`, text + debugText)
    }

    const toIterate = [...monster?.trait ?? [], ...monster.action ?? [], ...monster.legendary ?? []]
    toIterate.forEach((trait) => {
        trait?.entries?.forEach?.(entry => {
            if (typeof entry !== 'string') return

            let matched = [...entry?.matchAll?.(/{@([a-z0-9A-z]+)([a-z0-9A-z ]+)?}/g)][0]
            
            if(!matched) return

            types.add(matched[1])
            mods.add(matched[2])
            everything.push({value: matched[0], source: monster.name})
        })
    })
}

const parseDescription = (entries: string[]): string => {
    return entries.join("\n")
        .replace(/{@atk (\w+)}/g, (_, attackType: OriginalAttackType): string => attackShortHandMap[attackType] || attackType)
        .replace(/{@hit (\d+)}/g, (_, averageRoll: string): string => averageRoll)
        .replace(/{@h}(\d+)/g, (_, averageDamage: string): string => `Hit: ${averageDamage}`)
        .replace(/{@damage (.+?)}/g, (_, diceRoll: string): string => `[[${diceRoll}]]`)
        .replace(/{@dice (.+?)}/g, (_, diceRoll: string): string => `[[${diceRoll}]]`)
        .replace(/{@dc (.+?)}/g, (_, dc: string): string => boldText(dc))
}

const parseRange = (entries: string[]): simpleRange | multiRange | shapeRange | null => {
    const mergedEntries = entries.join("\n")
    const matches = [...mergedEntries.matchAll(/(?:reach|range)?\s?(\d+(?:\/\d+)?)(?:[ -])([\w.]+)\s?(sphere|cube|cone|line)?(?:\sthat is (\d) (\w+)? (?:wide))?/g)][0]

    if (!matches) return null

    const range = matches[1]
    const width = matches[4]
    const unit = matches[2]
    const shape = matches[3]

    if (range.search(/(\d+\/\d+)/g) !== -1) {
        const splitted = range.split('/')

        return {
            low: Number(splitted[0]),
            heigh: Number(splitted[1]),
            unit: unit
        } as multiRange
    }

    if (shape) {
        let out = {}

        switch (shape) {
            case "shape":
                out = {radious: Number(range)}
                break
            case "cube":
                out = {length: Number(range)}
                break
            case "cone":
                out = {length: Number(range)}
                break
            case "line":
                out = {length: Number(range), width: Number(width)}
                break
        }

        return {
            shape: shape as shapeTypes,
            unit: unit,
            ...out
        }
    }

    if (range) {
        return {
            value: Number(range),
            unit: unit
        }
    }

    return null
}

const getToHitRoll = (modifier: string): string => `/r 1d20 + ${modifier}`
const getDamageRoll = (roll: string): string => `/r ${roll}`

const extractAction = (entries: string[]): string => {
    const mergedEntries = entries.join('\n')
    let actionText = ''
    const toHitRolls = mergedEntries.match(/{@hit (\d+)}/)
    const damageRolls = [...mergedEntries.matchAll(/{@damage (.+?)}/g)]
    const otherDice = [...mergedEntries.matchAll(/{@dice (.+?)}/g)]

    if (toHitRolls?.[1]) {
        actionText += 'To Hit: '
        actionText += getToHitRoll(toHitRolls[1])
    }

    if (damageRolls.length > 0) actionText += "\nDamage: "
    damageRolls.forEach(damageRoll => actionText += getDamageRoll(damageRoll[1]))

    if (otherDice?.length > 0) actionText += "\nOther: "
    otherDice.forEach(dice => actionText += getDamageRoll(dice[1]))

    return actionText
}

const createTraitObject = (trait: OriginalTrait, isAction: boolean, isLegendary: boolean, isReaction: boolean): Trait => {
    const [traitName, limitedUsage] = extractDataFromTraitName(trait.name ?? '')

    return {
        name: traitName,
        limitedUsage,
        description: parseDescription(trait.entries),
        range: parseRange(trait.entries),
        action: extractAction(trait.entries),
        image: null,
        isAction,
        isLegendary,
        isReaction
    }
}

const parseMonsterTrait = (monster: OriginalMonster): Trait[] => {
    const out: Trait[] = []

    monster.trait?.forEach((trait: OriginalTrait) => out.push(createTraitObject(trait, false, false, false)))
    monster.action?.forEach((trait: OriginalTrait) => out.push(createTraitObject(trait, true, false, false)))
    monster.reaction?.forEach((trait: OriginalTrait) => out.push(createTraitObject(trait, false, false, true)))
    monster.legendary?.forEach((trait: OriginalTrait) => out.push(createTraitObject(trait, true, true, false)))

    return out
}

for await (const file of bestiaryDir) {
    if (!file.isFile) continue

    const monsterList = JSON.parse(await Deno.readTextFile(`./data/bestiary/${file.name}`))

    if (!monsterList?.monster) continue

    const parsedMonsterList: Monster[] = []

    monsterList.monster.forEach((element: OriginalMonster) => {
        const proficiency = getProficiencyScore(element)
        // extractTraitDebug(element)

        const parsedMonster: Monster = {
            name: element.name,
            source: element.source,
            size: element.size,
            type: element.type,
            alignment: element.alignment,
            ac: parseMonsterAC(element.ac),
            hp: parseMonsterHP(element.hp),
            speed: parseMonsterSpeed(element?.speed),
            str: element.str,
            dex: element.dex,
            con: element.con,
            int: element.int,
            wis: element.wis,
            cha: element.cha,
            save: parseMonsterSave(element?.save),
            proficiency: proficiency,
            skill: parseMonsterSkills(element?.skill, proficiency, element),
            senses: element.senses ?? [],
            passivePerception: element.passive ?? 0,
            resistances: parseMonsterResistance(element?.resist),
            immunity: parseMonsterResistance(element?.immune),
            conditionImmunity: element?.conditionImmune ?? [],
            languages: element?.languages ?? [],
            cr: Number(element.cr),
            trait: parseMonsterTrait(element ?? []),
        }

        parsedMonsterList.push(parsedMonster)
    });

    await Deno.writeTextFile(`./parsedMonsters/${file.name}`, JSON.stringify(parsedMonsterList))

    // everything.sort((a,b) => a.value.localeCompare(b.value))

    // Deno.writeTextFileSync(`./debugTypes.json`, JSON.stringify([...types]))
    // Deno.writeTextFileSync(`./debugMods.json`, JSON.stringify([...mods]))
    // Deno.writeTextFileSync(`./debugEverything.json`, JSON.stringify(everything))
}