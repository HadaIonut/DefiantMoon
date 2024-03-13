<script setup lang="ts">
import {ParseResultType} from 'dice-parsering-library/dist/types'
import {parse} from 'dice-parsering-library'
import {sendDiceRoll} from '../utils/routeUtils'

const props = defineProps<{
  roll?: ParseResultType
  text?: string
  theme: 'light' | 'dark'
  isInChat: boolean
}>()

// eslint-disable-next-line vue/no-setup-props-destructure
let roll: ParseResultType | undefined = props.roll

if (!roll) {
  roll = parse(props.text ?? '')
}

const originalTextArray = roll.original.split(/\[\[([0-9d+-\s]+)\]\]/g)
const parsedTextArray = roll.parsed.split(/\[\[([0-9d]+)\]\]/g)

const handleClick = (expression: string) => {
  console.log('clicked')
  sendDiceRoll(expression)
}

</script>

<template>
  <span>
    <span v-if="!isInChat">
      <span :key="text + index" v-for="(text, index) in originalTextArray">
        <span v-if="index % 2 === 0">{{ text }}</span>
        <span :class="`inlineRoll inlineRoll--${theme} clickable`" v-else  @click="() => handleClick(originalTextArray[index])">
          {{ text }}
        </span>
      </span>
    </span>
    <span v-else>
      <span :key="text + index" v-for="(text, index) in parsedTextArray">
        <span v-if="index % 2 === 0">{{ text }}</span>
        <span :class="`inlineRoll inlineRoll--${theme} chatRoll`" v-else v-tooltip="{
          content:originalTextArray[index],
          theme: 'info-tooltip'
        }">
          {{ text }}
        </span>
      </span>
    </span>
  </span>
</template>

<style scoped lang="scss">
.inlineRoll--dark {
  border: 1px solid $darker-secondary;
  background: $lighter-tertiary;
  color: $darker-accent;

  &:hover {
    border: 1px solid $darker2-secondary;
    background: $darker-tertiary;
    color: $accent;
    transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out, color 0.2s ease-in-out;
  }
}

.inlineRoll--light {
  border: 1px solid $darker-accent;
  background: $darker-secondary;
  color: $primary;

  &:hover {
    background: $darker2-secondary;
    color: $brighter-primary;
    transition: background-color 0.2s ease-in-out, border 0.2s ease-in-out, color 0.2s ease-in-out;
  }
}

.inlineRoll {
  padding: 2px 4px;
  word-break: normal;
}
.chatRoll {
  cursor: default;
}
</style>
