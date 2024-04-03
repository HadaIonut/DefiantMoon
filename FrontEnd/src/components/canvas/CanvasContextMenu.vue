<script setup lang="ts">

import {usePlayAreaStore} from 'src/stores/PlayArea'
import {computed, ref} from 'vue'
import {onClickOutside} from '@vueuse/core'

const playAreaStore = usePlayAreaStore()

const contextMenuRef = ref(null)

// @ts-ignore
const drawModeToggleFunction = (event: MouseEvent) => {
  event.stopPropagation()
  playAreaStore.toggleDrawMode()
}

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

  const workingShape = playAreaStore.shapes[workingShapeId]
  playAreaStore.targetedObject?.removeFromParent()
  workingShape.updateShape()
  playAreaStore.handleContextMenu({})
}

const contextMenuStyle = computed(() => {
  return `
    display: ${playAreaStore.contextMenu.display};
    top: ${playAreaStore.contextMenu.top}px;
    left: ${playAreaStore.contextMenu.left}px;
  `
})

onClickOutside(contextMenuRef, () => playAreaStore.handleContextMenu({}, undefined, 'none'))

</script>

<template>
  <div>
    <div
      :style="`position: absolute; top: 100px; color: white; background:${playAreaStore.drawMode ? 'pink' : 'darkslategray'} `"
      @click="drawModeToggleFunction">test
    </div>
    <div class="contextMenu" :style="contextMenuStyle" ref="contextMenuRef">
      <div style="cursor: pointer;" @click="addPointsToObject">add points</div>
      <div style="cursor: pointer;" @click="removePointFromObject"
           v-if="playAreaStore.targetedObject?.name === 'controlPoint'">remove point
      </div>
      <div style="cursor: pointer;" @click="objectDelete">delete object</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contextMenu {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  background: #888888;
  transform: translateX(-50%)
}
</style>
