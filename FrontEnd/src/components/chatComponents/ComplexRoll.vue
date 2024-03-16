<script setup lang="ts">
import {RolledTraitAction} from 'types/Actors'

const props = defineProps<{
  roll: RolledTraitAction
}>()

</script>

<template>
  <div v-if="(roll.complexRoll)">
    <div class="roll-description" v-html="roll.description"/>
    <div class="roll toHit-roll" v-if="roll.toHit.parsed">
      <div>To Hit</div>
      <div>{{roll.toHit.parsed}}</div>
    </div>
    <div :class="` toHit-roll ${roll.toHit.parsed ? 'result' : 'only-damage'}`">
      <div>Damage </div>
      <span class="damage-container">
          <span class="damage-result" :key="index" v-for="(damage, index) in roll.damage" v-tooltip="{
            content: `${damage.roll.original.slice(3)}`,
            theme: 'info-tooltip'
          }">
            <span>
              {{damage.roll.parsed}}
            </span>
            <span>
              {{damage.damageType}}
            </span>
          </span>
        </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.roll, .result {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 8px 2px;
  text-align: center;
  background: $darker-tertiary;
}

.roll {
  cursor: pointer;
  border-top: 1px solid $secondary;
  border-left: 1px solid $secondary;
  border-right: 1px solid $secondary;
  border-radius: 6px 6px 0 0;
}

.only-damage {
  border-radius: 6px;

  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 8px 2px;
  text-align: center;
  background: $darker-tertiary;

  border: 1px solid $secondary;

}

.toHit-roll {
  flex-direction: column;
  min-width: 150px;
  gap: 3px;
}


.damage-result {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &:not(:last-child) {
    padding-right: 3px;
    border-right: 1px solid $secondary;
  }
}

.damage-container {
  display: flex;
  gap: 3px;
}

.result {
  border: 1px solid $secondary;
  border-radius: 0 0 6px 6px;
}

.roll-description {
  margin-bottom: 3px;
}

</style>
