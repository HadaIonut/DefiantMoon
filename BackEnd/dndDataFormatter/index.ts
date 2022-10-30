import { skillToAbilityMap, getEmptySkillsObject} from "./constants/constants.ts"
import { parseMonsterTrait } from "./traitParser.ts"
import { Monster, MonsterAC, MonsterHP, MonsterResistance, MonsterSave, MonsterSkill, MonsterSpeed, MonsterSpeedValue } from "./types/Monster.d.ts"
import { OriginalAC, OriginalAction, OriginalImmunity, OriginalLegendaryAction, OriginalMonster, OriginalResistance, OriginalSave, OriginalSkill, OriginalSpeed, OriginalSpeedWithCondition, OriginalTrait } from "./types/OriginalMonster.d.ts"

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
            // @ts-ignore: this is debug stuff, it doesn't matter
            everything.push({value: matched[0], source: monster.name})
        })
    })
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
            hasLegendaryActions: (element?.legendary?.length ?? 0) > 0,
            hasLegendaryResistance: (element?.legendary?.length ?? 0) > 0,
            legendaryActionCount: (element?.legendary?.length ?? 0) > 0 ? 3 : 0,
            legendaryResistanceCount: (element?.legendary?.length ?? 0) > 0 ? 3 : 0,
            overrides: null,
        }

        parsedMonsterList.push(parsedMonster)
    });

    await Deno.writeTextFile(`./parsedMonsters/${file.name}`, JSON.stringify(parsedMonsterList))

    // everything.sort((a,b) => a.value.localeCompare(b.value))

    // Deno.writeTextFileSync(`./debugTypes.json`, JSON.stringify([...types]))
    // Deno.writeTextFileSync(`./debugMods.json`, JSON.stringify([...mods]))
    // Deno.writeTextFileSync(`./debugEverything.json`, JSON.stringify(everything))
}