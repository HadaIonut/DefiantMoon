<script setup lang="ts">
import {ParsedResult} from 'types/Actors'

const props = defineProps<{
  roll: ParsedResult
}>()

</script>

<template>
  <div class="roll-container"  >
    <div class="roll-description" v-html="roll.description"/>
    <div class="roll">
      {{ roll?.original.replace('/r', '') }}
    </div>
    <div class="result">
      {{ roll?.parsed }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.roll-container {
  display: flex;
  flex-direction: column;
}

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

.result {
  border: 1px solid $secondary;
  border-radius: 0 0 6px 6px;
}
.roll-description {
  margin-bottom: 3px;
}

</style>
