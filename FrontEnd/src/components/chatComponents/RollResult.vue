<script setup lang="ts">
import {ParseResultType} from 'dice-parsering-library/dist/types'

const props = defineProps<{
  roll: ParseResultType
}>()

</script>

<template>
  <div>
    <div style=" display: flex; flex-direction: column; " v-if="typeof roll.parsed === 'number'">
      <div class="roll">
        {{ roll?.original.replace('/r', '') }}
      </div>
      <div class="result">
        {{ roll?.parsed }}
      </div>
    </div>
    <div v-else>
      <InlineRoll :roll="roll" theme="dark" :isInChat="true"/>
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

.result {
  border: 1px solid $secondary;
  border-radius: 0 0 6px 6px;
}
</style>
