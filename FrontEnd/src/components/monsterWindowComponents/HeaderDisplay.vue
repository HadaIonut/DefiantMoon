<script setup lang="ts">
import {CrToXpMap, sizeToNameMap} from '../../constants/gameMaps'
import {Actor} from '../../types/Actors'

export interface HeaderDisplayProps {
  actor: Actor
}

const props = defineProps<HeaderDisplayProps>()
const monsterType = typeof props.actor?.type === 'string' ? props.actor?.type : props.actor?.type?.type
console.log(props.actor)
const getMonsterCr = (cr: string | Record<string, string>) => {
  if (!cr) return '10'
  if (typeof cr === 'string') return cr

  return Object.keys(cr).reduce((acc, cur) => {
    if (cur === 'cr') return acc
    return `${acc}, ${cur}: ${cr[cur]}`
  }, cr.cr)
}

const getMonsterXp = (cr: string | Record<string, string>) => {
  if (!cr) return 'unknown'

  if (typeof cr === 'string') return CrToXpMap[cr]

  return CrToXpMap[cr.cr]
}


</script>

<template>
  <div class="header">
    <div class="name-container">
      <div class="monster-name">{{ props.actor.name }}</div>
      <div>{{ sizeToNameMap[props.actor.size?.[0]] }} {{ monsterType }}</div>
    </div>
    <div>
      <div>Challange {{ getMonsterCr(props.actor.cr) }}</div>
      <div>{{ getMonsterXp(props.actor.cr) }} XP</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  background: $darker-secondary;
  padding: 5px 8px;
  color: $primary;
  font-size: 16px;
  border-top: 2px solid $darker-accent;
  border-bottom: 2px solid $darker-accent;
  margin-bottom: 10px;
}

.monster-name {
  color: $primary;
  font-weight: bold;
  font-size: 20px;
}

.name-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
