<script setup lang="ts">
import {Actor, Save} from '../../types/Actors'
import {getSignedNumber} from '../../utils/utils'

export interface AbilitiesDisplayProps {
  actor: Actor
}

const props = defineProps<AbilitiesDisplayProps>()
const abilties = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']
const getSavingThrow = (ability: string, actor: Actor) => {
  const abilityValue = Math.floor((actor[ability.toLowerCase() as keyof Actor] as number - 10) / 2)
  if (!actor.save[ability.toLowerCase() as keyof Save]) return abilityValue

  return abilityValue + actor.proficiency
}
</script>

<template>
  <div class="abilityContainer">
    <div v-for="ability in abilties" :key=ability>
      <div style="font-weight: bold; text-align: center">
        {{ ability }}
      </div>
      <div style="text-align: center">
        <span>{{ props.actor[ability.toLowerCase()] }}</span>
        <span style="margin-left: 2px">({{ getSignedNumber(getSavingThrow(ability, actor)) }})</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.abilityContainer {
  display: flex;
  justify-content: space-evenly;
  border-top: 2px solid $darker-accent;
  border-bottom: 2px solid $darker-accent;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
