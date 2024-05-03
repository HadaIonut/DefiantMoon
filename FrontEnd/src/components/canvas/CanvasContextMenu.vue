<script setup lang="ts">

import {usePlayAreaStore} from 'src/stores/PlayArea'
import {computed, ref} from 'vue'
import {onClickOutside} from '@vueuse/core'
import {getRandomInt} from 'src/utils/CanvasUtils'
import {Vector3} from 'three'

const playAreaStore = usePlayAreaStore()

const contextMenuRef = ref(null)

const objectDelete = () => {
  if (playAreaStore.targetedObject?.parent?.name === 'adjustableShape') playAreaStore.deleteTargetObject()

  playAreaStore.handleContextMenu({})
}

const addPointsToObject = () => {
  if (playAreaStore.targetedObject?.parent?.name === 'adjustableShape') {
    playAreaStore.addPointsToObject()
  }
  playAreaStore.handleContextMenu({})
}

const removePointFromObject = () => {
  const workingShapeId = playAreaStore.targetedObject?.parent?.uuid
  if (!workingShapeId) return
  if (!playAreaStore.targetedObject) return
  playAreaStore.removePointFromShape(playAreaStore.targetedObject?.uuid, workingShapeId)
  playAreaStore.handleContextMenu({})
}

const contextMenuStyle = computed(() => {
  return `
    top: ${playAreaStore.contextMenu.top}px;
    left: ${playAreaStore.contextMenu.left}px;
  `
})

const visibility = computed(() => {
  if (playAreaStore.contextMenu.display === 'block') return 'contextMenu--visible'
  return ''
})

onClickOutside(contextMenuRef, () => {
  playAreaStore.handleContextMenu({}, undefined, 'none')
})

</script>

<template>
  <div>
    <div :class="`contextMenu ${visibility}`" :style="contextMenuStyle" ref="contextMenuRef">
      <div class="option-container">
        <div @click="addPointsToObject">add points</div>
        <div @click="removePointFromObject"
             v-if="playAreaStore.targetedObject?.name === 'controlPoint'">remove point
        </div>
        <div @click="objectDelete">delete object</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contextMenu {
  position: absolute;
  top: 0;
  left: 0;
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

  & > div {
    cursor: pointer;
    padding: 3px 10px;
    border-radius: 6px;
  }
  & > :hover {
    background: mix($tertiary, $secondary, 50%);
    transition: background-color 0.2s ease-in-out;
  }

}
</style>
