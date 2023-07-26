<script setup lang="ts">
import {apiClient} from '../../api'

export interface AbilityEntryProps {
  title: string
  description: string | number
  sendMessage?: boolean
  actionMessage?: string
}

const props = defineProps<AbilityEntryProps>()

const handleClick = async () => {
  if (!props.sendMessage) return

  if (props.actionMessage) return await apiClient.sendChatMessage(props.actionMessage, [])

  await apiClient.sendChatMessage(props.description as string, [])
}

</script>

<template>
  <div v-if="props.description !== '' && props.description !== 0">
    <span :class="`title ${props.sendMessage ? 'clickable' : ''}`" @click="handleClick">
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
