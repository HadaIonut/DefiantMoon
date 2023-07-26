<script setup lang="ts">
import {Actor} from '../../types/Actors'

export interface AbilitiesDisplayProps {
  actor: Actor
}

const props = defineProps<AbilitiesDisplayProps>()
const abilties = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

</script>

<template>
  <div class="abilityContainer">
    <div v-for="ability in abilties" :key=ability>
      <div style="font-weight: bold">
        {{ ability }}
      </div>
      <div style="text-align: center">
        {{ props.actor[ability.toLowerCase()] }}
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
