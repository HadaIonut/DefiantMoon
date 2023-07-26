<script setup lang="ts">
import {Trait} from '../../types/Actors'

export interface TraitsProps {
  traits: Trait[]
}

const props = defineProps<TraitsProps>()

const actions = props.traits.filter((trait) => trait.isAction)
const legendaryActions = props.traits.filter((trait) => trait.isLegendary)
const reactions = props.traits.filter((trait) => trait.isReaction)

const normalTraits = props.traits.filter((trait) => !trait.isAction && !trait.isLegendary && !trait.isReaction)

</script>

<template>
  <div class="abilityGroup">
    <div v-for="(action, index) in normalTraits" :key=index>
      <AbilityEntry :title="action.name" :description="action.description"/>
    </div>
  </div>
  <div v-if="actions.length !== 0">
    <div class="traitTitle">Actions</div>
    <div class="abilityGroup">
      <div v-for="(action, index) in actions" :key=index>
        <AbilityEntry :title="action.name" :description="action.description"/>
      </div>
    </div>
  </div>
  <div v-if="reactions.length !== 0">
    <div class="traitTitle">Reactions</div>
    <div class="abilityGroup">
      <div v-for="(action, index) in reactions" :key=index>
        <AbilityEntry :title="action.name" :description="action.description"/>
      </div>
    </div>
  </div>
  <div v-if="legendaryActions.length !== 0">
    <div class="traitTitle">Legendary Actions</div>
    <div class="abilityGroup">
      <div v-for="(action, index) in legendaryActions" :key=index>
        <AbilityEntry :title="action.name" :description="action.description"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.abilityGroup {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.traitTitle {
  margin-top: 5px;
  font-weight: bold;
  font-size: 18px;
  background: $darker-secondary;
  padding-top: 3px;
  padding-bottom: 3px;
  border-top: 2px solid $darker-accent;
  color: $primary;

}
</style>
