<script setup lang="ts">

import {usePlayAreaStore} from 'src/stores/PlayArea'
import {computed, ref} from 'vue'
import {onClickOutside} from '@vueuse/core'
import {getRandomInt} from 'src/utils/CanvasUtils'
import {Vector3} from 'three'

const playAreaStore = usePlayAreaStore()

const contextMenuRef = ref(null)

// @ts-ignore
const drawModeToggleFunction = (event: MouseEvent) => {
  event.stopPropagation()
  playAreaStore.toggleDrawMode()
}

const addRandomLight = () => {
  playAreaStore.addLightToCanvas({
    position: new Vector3(getRandomInt(500), 10, getRandomInt(500)),
  })
}

const addRandomPlayer = () => {
  playAreaStore.addPlayerToCanvas(new Vector3(getRandomInt(500), 10, getRandomInt(500)))
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
  if (!playAreaStore.targetedObject) return
  playAreaStore.removePointFromShape(playAreaStore.targetedObject?.uuid, workingShapeId)
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
      @click="drawModeToggleFunction">wall draw
    </div>
    <div
      :style="`position: absolute; top: 120px; color: white; background: darkslategray `"
      @click="addRandomLight">add random light
    </div>
    <div
      :style="`position: absolute; top: 140px; color: white; background: darkslategray `"
      @click="addRandomPlayer">add random player
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
