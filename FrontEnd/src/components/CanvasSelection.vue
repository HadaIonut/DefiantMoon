<script setup lang="ts">
import {useCanvasCollectionStore} from 'src/stores/CanvasCollection'
import {computed} from 'vue'
import {rtFetch} from 'src/utils/fetchOverRTC'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {useWindowsStore} from 'src/stores/windows'
import {getCenteredWindow} from 'src/utils/utils'

const canvasCollectionStore = useCanvasCollectionStore()
const playerAreaStore = usePlayAreaStore()
const windowStore = useWindowsStore()

const activeClass = computed(() => (currentId: string) => {
  return currentId === canvasCollectionStore.active ? 'marker-active' : 'marker-inactive'
})

const handleCanvasChange = async (newId: string) => {
  await playerAreaStore.loadCanvas(newId)

  canvasCollectionStore.changeActiveCanvas(newId)
}

const handleCanvasCreation = () => {
  windowStore.addNewWindow('newCanvasConfig',
    {
      componentType: 'SimpleHeader',
      componentData: 'New Canvas Window',
    },
    {
      componentType: 'NewCanvasConfig',
      componentData: {},
    },
    {
      icon: 'shirt', actionName: 'NewCanvasConfig',
    },
    getCenteredWindow(500, 500),
  )
}
</script>

<template>
  <div class="clickable selection-bar">
    <div class="element" v-for="canvas in canvasCollectionStore.canvasList" :key="canvas.id"
      @click="() => handleCanvasChange(canvas.id)">
      {{ canvas.name }}
      <span :class="`activity-marker ${activeClass(canvas.id)}`" />
    </div>
    <div class="element" @click="() => handleCanvasCreation()">
      +
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
  background: $tertiary;
  border: 1px solid $accent;
  border-radius: 6px;
  position: relative;

  &:hover {
    background: mix($tertiary, $secondary, 50%);
    transition: background-color 0.1s ease-in-out;
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
