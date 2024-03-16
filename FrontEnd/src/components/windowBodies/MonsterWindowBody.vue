<script setup lang="ts">

import {Actor, Speed, Save, Skill, Resistance, MonsterResistance} from '../../types/Actors'
import {CrToXpMap, skillModifierMap, skillToAbilityMap} from '../../constants/gameMaps'
import {getSignedNumber} from '../../utils/utils'

export interface MonsterWindowProps {
  bodyData: Actor
}

const props = defineProps<MonsterWindowProps>()
console.log(props.bodyData)
const displayedAcSource = props.bodyData?.ac?.[0]?.source?.length > 0 ? `(${props.bodyData?.ac?.[0]?.source.join(', ')})` : ''
const getSpeedText = (speedObject: Speed) => {
  const walkSpeed = `${speedObject.walk.value} ft,`
  const otherSpeeds = Object.keys(speedObject).reduce((acc: string, cur: string) => {
    if (cur === 'walk') return acc
    const speedValue = speedObject[cur as keyof Speed]

    if (typeof speedValue === 'boolean') return `${acc} Can Hover`
    if (speedValue.value === 0) return acc

    return `${acc} ${cur} ${speedValue.value} ft,`
  }, '')

  return `${walkSpeed} ${otherSpeeds}`
}

const getSavingThrows = (saves: Save, actor: Actor) => {
  return Object.keys(saves).reduce((acc, cur) => {
    if (!saves[cur as keyof Save]) return acc

    return `${acc} ${cur} +${(actor[cur as keyof Actor] as number) + actor.proficiency}, `
  }, '')
}

const getSkills = (skills: Skill, actor: Actor) => {
  return Object.keys(skills).reduce((acc: string, cur: string) => {
    if (skills[cur as keyof Skill] === 0) return acc

    const skillValue = skills[cur as keyof Skill]
    const skillModifier = skillModifierMap[skillValue]
    const skillAbility = skillToAbilityMap[cur as keyof typeof skillToAbilityMap]
    const abilityValue = (actor[skillAbility as keyof Actor] as number - 10) / 2

    return `${acc} ${cur} ${getSignedNumber(abilityValue + skillModifier * actor.proficiency)}, `
  }, '')
}

const getResistance = (resistances: Resistance[] | MonsterResistance[]) =>
  resistances.reduce((acc: string, cur: { value: string[] }) =>
    `${acc} ${cur.value.join(', ')},`
  , '')


</script>

<template>
  <div style="overflow: auto; margin-top: 5px; margin-bottom: 5px">
    <HeaderDisplay :actor="props.bodyData"/>

    <div class="abilityGroup">
      <AbilityEntry :sourceMonster="props.bodyData.name" title="AC" :description="`${props.bodyData.ac[0].value} ${displayedAcSource}`"/>
      <AbilityEntry :sourceMonster="props.bodyData.name" title="HP" :description="`${props.bodyData.hp.average} (${props.bodyData.hp.formula})`"/>
      <AbilityEntry :sourceMonster="props.bodyData.name" title="Speed" :description="getSpeedText(props.bodyData.speed)"/>
    </div>

    <AbilitiesDisplay :actor="props.bodyData"/>

    <div class="abilityGroup">
      <AbilityEntry :sourceMonster="props.bodyData.name" title="Proficiency" :description="props.bodyData.proficiency"/>
      <AbilityEntry :sourceMonster="props.bodyData.name" title="Skills" :description="getSkills(props.bodyData.skill, props.bodyData)"/>
      <AbilityEntry :sourceMonster="props.bodyData.name" title="Damage Resistances" :description="getResistance(props.bodyData.resistances)"/>
      <AbilityEntry :sourceMonster="props.bodyData.name" title="Damage Immunities" :description="getResistance(props.bodyData.immunity)"/>
      <AbilityEntry :sourceMonster="props.bodyData.name" title="Condition Immunities" :description="props.bodyData.conditionImmunity.join(', ')"/>
      <AbilityEntry :sourceMonster="props.bodyData.name" title="Senses" :description="props.bodyData.senses.join(', ')"/>
      <AbilityEntry :sourceMonster="props.bodyData.name" title="Languages" :description="props.bodyData.languages.join(', ')"/>
    </div>

    <TraitsDisplay :sourceMonster="props.bodyData.name" :traits="props.bodyData.trait"/>
  </div>
</template>

<style>
.abilityGroup {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
</style>
