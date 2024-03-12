<script setup lang="ts">
import {sendChatMessage, sendDiceRoll} from '../../utils/routeUtils'

export interface AbilityEntryProps {
  title: string
  description: string | number
  sendMessage?: boolean
  actionMessage?: string
}

const props = defineProps<AbilityEntryProps>()

const handleClick = async () => {
  if (!props.sendMessage) return

  if (props.actionMessage) return await sendChatMessage(props.actionMessage, [])

  await sendDiceRoll(props.description as string)
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
