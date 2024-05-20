<script setup lang="ts">
import {computed, ref} from 'vue'

export interface ContextMenuProps {
  options: Array<{ displayedText: string, onClickFunction: () => void }>,
  visible: boolean,
}
const props = defineProps<ContextMenuProps>()
const conextRef = ref(null)

const visibility = computed(() => props.visible ? 'contextMenu--visible' : '')

</script>
<template>
  <div :class="`contextMenu ${visibility}`" ref="conextRef">
    <div class="option-container">
      <div class="element" v-for="(option, index) in props.options" :key="index"
        @click="() => option.onClickFunction()">
        {{ option.displayedText }}
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.contextMenu {
  position: absolute;
  top: 30px;
  left: 50%;
  background: $tertiary;
  border: 1px solid $accent;
  border-radius: 6px;
  transform: translateX(-50%) scaleY(0);
  transform-origin: top;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;

  &--visible {
    transform: translateX(-50%) scaleY(1);
  }
}

.option-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 5px;
  margin-bottom: 5px;

  &>div {
    cursor: pointer;
    padding: 3px 10px;
    border-radius: 6px;
  }

  &> :hover {
    background: mix($tertiary, $secondary, 50%);
    transition: background-color 0.2s ease-in-out;
  }

}
</style>
