<script setup lang="ts">
import {Actor, Save} from '../../types/Actors'
import {getSignedNumber} from '../../utils/utils'
import {sendChatMessage, sendSimpleDiceRoll} from '../../utils/diceUtils'

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

const abilityCheck = async (ability: string) => {
  const rollModifier = (props.actor[ability.toLowerCase() as keyof Actor] as number - 10) / 2

  await sendSimpleDiceRoll(
    `1d20 ${getSignedNumber(rollModifier, true)}`,
    `<b>${props.actor.name}</b> rolled a <b>${ability}</b> check: `,
  )
}

const savingThrow = async (ability: string) => {
  const rollModifier = (props.actor[ability.toLowerCase() as keyof Actor] as number - 10) / 2
  const hasProficiency = props.actor.save[ability.toLowerCase() as keyof Save]
  const proficiency = hasProficiency ? props.actor.proficiency : 0

  await sendSimpleDiceRoll(
    `1d20${getSignedNumber(rollModifier)}${getSignedNumber(proficiency, true)}`,
    `<b>${props.actor.name}</b> rolled a <b>${ability}</b> saving throw: `,
  )
}

</script>

<template>
  <div class="abilityContainer">
    <div v-for="ability in abilties" :key=ability>
      <div style="font-weight: bold; text-align: center">
        {{ ability }}
      </div>
      <div style="text-align: center">
        <span class="clickable" @click="abilityCheck(ability)">
          {{ props.actor[ability.toLowerCase()] }}
        </span>
        <span class="clickable" style="margin-left: 2px" @click="savingThrow(ability)">
          ({{ getSignedNumber(getSavingThrow(ability, actor)) }})
        </span>
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

.clickable {
  &:hover {
    color: $primary;
  }
}
</style>
