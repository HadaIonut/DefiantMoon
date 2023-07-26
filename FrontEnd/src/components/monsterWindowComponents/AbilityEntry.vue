<script setup lang="ts">
export interface AbilityEntryProps {
  title: string
  description: string | number
  sendMessage: boolean
}

const props = defineProps<AbilityEntryProps>()

</script>

<template>
  <div v-if="props.description !== '' && props.description !== 0">
    <span :class="`title ${props.sendMessage ? 'clickable' : ''}`">
      {{ props.title }}
    </span>
    <span>
      {{ props.description }}
    </span>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-weight: bold;
  margin-right: 10px;
}
.clickable {
  &:hover {
    color: $primary;
  }
}
</style>
