<script setup lang="ts">

import {ref, watch} from 'vue'
import {usePlayAreaStore} from 'src/stores/PlayArea'

const playAreaStore = usePlayAreaStore()

const contextMenuRef = ref(null)

// @ts-ignore
watch(contextMenuRef, (newValue: HTMLElement) => playAreaStore.setContextMenuRef(newValue))
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
</script>

<template>
<div >
  <div :style="`position: absolute; top: 100px; color: white; background:${playAreaStore.drawMode ? 'pink' : 'darkslategray'} `"
       @click="drawModeToggleFunction">test
  </div>
  <div ref="contextMenuRef"
       style="display: none; position: absolute; top: 0; left: 0; background: #888888; transform: translateX(-50%)">
    <div style="cursor: pointer;" @click="addPointsToObject">add points</div>
    <div style="cursor: pointer;" @click="removePointFromObject"
         v-if="playAreaStore.targetedObject?.name === 'controlPoint'">remove point
    </div>
    <div style="cursor: pointer;" @click="objectDelete">delete object</div>
  </div>
</div>
</template>

<style scoped lang="scss">

</style>
