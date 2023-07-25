<script setup lang="ts">

import {Actor, Speed, Save} from '../../types/Actors'
import {CrToXpMap} from '../../constants/crMaps'

export interface MonsterWindowProps {
    bodyData: Actor
}

const props = defineProps<MonsterWindowProps>()
console.log(props.bodyData)
const monsterType = typeof props.bodyData?.type === 'string' ? props.bodyData?.type : props.bodyData?.type?.type
const displayedAcSource = props.bodyData?.ac?.[0]?.source?.length > 0 ? `(${props.bodyData?.ac?.[0]?.source.join(', ')})` : ''

const getSpeedText = (speedObject: Speed) => {
  const walkSpeed = `${speedObject.walk.value} ft`
  const otherSpeeds = Object.keys(speedObject).reduce((acc: string, cur: string) => {
    if (cur === 'walk') return acc
    const speedValue = speedObject[cur as keyof Speed]

    if (typeof speedValue === 'boolean') return `${acc}, Can Hover`
    if (speedValue.value === 0) return acc

    return `${acc}, ${cur} ${speedValue.value} ft`
  }, '')

  return `${walkSpeed} ${otherSpeeds}`
}

const getSavingThrows = (saves: Save, actor: Actor) => {
  return Object.keys(saves).reduce((acc, cur) => {
    if (!saves[cur as keyof Save]) return acc

    return `${acc}, ${cur} +${(actor[cur as keyof Actor] as number) + actor.proficiency}`
  }, '')
}

</script>

<template>
    <div>
        <div style="display: flex; justify-content: space-between">
            <div>
                <div>{{ props.bodyData.name }}</div>
                <div>{{ props.bodyData.size[0] }} {{ monsterType }}</div>
            </div>
            <div>
                <div>Challange {{props.bodyData.cr}}</div>
                <div>{{CrToXpMap[props.bodyData.cr]}} XP</div>
            </div>
        </div>
        <div>
            AC {{props.bodyData.ac[0].value}} {{displayedAcSource}}
        </div>
        <div>
            HP {{props.bodyData.hp.average}} ({{props.bodyData.hp.formula}})
        </div>
        <div>
            Speed {{ getSpeedText(props.bodyData.speed) }}
        </div>
        <AbilitiesDisplay :actor="props.bodyData"/>
        <div>
            Proficiency {{props.bodyData.proficiency}}
        </div>
        <div>
            Saving Throws {{getSavingThrows(props.bodyData.save, props.bodyData)}}
        </div>
    </div>
</template>

<style>

</style>
