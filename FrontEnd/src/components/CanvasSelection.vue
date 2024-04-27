<script setup lang="ts">
import {useCanvasCollectionStore} from 'src/stores/CanvasCollection'
import {computed} from 'vue'
import {rtFetch} from 'src/utils/fetchOverRTC'
import {usePlayAreaStore} from 'src/stores/PlayArea'

const canvasCollectionStore = useCanvasCollectionStore()
const playerAreaStore = usePlayAreaStore()

const activeClass = computed(() => (currentId: string) => {
  return currentId === canvasCollectionStore.active ? 'marker-active' : 'marker-inactive'
})

const handleCanvasChange = async (newId: string) => {
  await playerAreaStore.loadCanvas(newId)

  canvasCollectionStore.changeActiveCanvas(newId)
}

</script>

<template>
  <div class="clickable selection-bar">
    <div class="element"
         v-for="canvas in canvasCollectionStore.canvasList"
         :key="canvas.id" @click="() => handleCanvasChange(canvas.id)">
      {{canvas.name}}
      <span :class="`activity-marker ${activeClass(canvas.id)}`"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.selection-bar {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.element {
  padding: 5px;
  background: $darker-tertiary;
  border: 1px solid $accent;
  border-radius: 6px;
  position: relative;

  &:hover {
    background: mix($darker-tertiary, $secondary, 50%);
  }
}

.activity-marker {
  position: absolute;
  width: 0;
  height: 2px;
  background-color: $text;
  border-radius: 12px;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);

  transition: width 0.2s ease-in-out;
}

.marker-active {
  width: 40%;
}

.marker-inactive {
  width: 3px;
}
</style>
