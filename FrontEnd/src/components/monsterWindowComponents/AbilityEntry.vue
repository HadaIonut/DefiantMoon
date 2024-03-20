<script setup lang="ts">
import {sendChatMessage, sendSimpleDiceRoll, sendTraitMessage} from '../../utils/diceUtils'
import {TraitAction} from 'types/Actors'

export interface AbilityEntryProps {
  sourceMonster: string,
  title: string
  description: string | number
  sendMessage?: boolean
  actionMessage?: string | TraitAction
}

const props = defineProps<AbilityEntryProps>()

const handleClick = async () => {
  if (!props.sendMessage) return

  if (props.actionMessage) {
    if (typeof props.actionMessage === 'string') return await sendChatMessage(props.actionMessage, [])

    return await sendTraitMessage({
      ...props.actionMessage,
      description: `<b>${props.sourceMonster}</b> used <b>${props.title}</b>`,
    })
  }

  await sendChatMessage(props.description as string, [])
}

</script>

<template>
  <div v-if="props.description !== '' && props.description !== 0">
    <span :class="`title ${props.sendMessage ? 'clickable' : ''}`" @click="handleClick">
      {{ props.title }}
    </span>
    <span>
      <InlineRoll :text="props.description" theme="light" :isInChat="false"/>
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
