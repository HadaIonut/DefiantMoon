<script setup lang="ts">
import {ParsedResult, RolledTraitAction} from 'types/Actors'

const props = defineProps<{
  roll: ParsedResult | RolledTraitAction
}>()

</script>

<template>
  <div>
    <ComplexRoll :roll="roll" v-if="(roll.complexRoll)"/>
    <SimpleRoll :roll="roll" v-else-if="typeof roll.parsed === 'number'"/>
    <div v-else>
      <InlineRoll :roll="roll" theme="dark" :isInChat="true"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
