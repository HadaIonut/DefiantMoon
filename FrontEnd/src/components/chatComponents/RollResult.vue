<script setup lang="ts">
import {ParseResultType} from 'dice-parsering-library/dist/types'

const props = defineProps<{
  roll: ParseResultType
}>()
</script>

<template>
  <div style=" display: flex; flex-direction: column; gap: 10px">
      <div class="roll">
        {{roll?.original.replace('/r', '')}}
      </div>
      <div class="result">
        {{roll?.parsed}}
      </div>
  </div>
</template>

<style scoped lang="scss">
.roll,.result {
  width: 100%;
  display: flex;
  justify-content: space-around;
  border: 1px solid $secondary;
  border-radius: 6px;
  padding: 5px 2px;
  text-align: center;
  background: $darker-tertiary;
}
.roll {
  cursor: pointer;
}
</style>
