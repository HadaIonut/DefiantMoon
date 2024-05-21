<script setup lang="ts">
import {useCanvasCollectionStore} from 'src/stores/CanvasCollection'
import {computed, ref} from 'vue'
import {usePlayAreaStore} from 'src/stores/PlayArea'
import {useWindowsStore} from 'src/stores/windows'
import {getCenteredWindow} from 'src/utils/utils'
import {onClickOutside} from '@vueuse/core'
import {rtFetch} from 'src/utils/fetchOverRTC'
import {websocket} from 'src/websocket/websocket'
import {WEBSOCKET_RECEIVABLE_EVENTS} from 'src/websocket/events'
import {useUsersStore} from 'src/stores/users'
import {generateUUID} from 'three/src/math/MathUtils'

const canvasCollectionStore = useCanvasCollectionStore()
const playerAreaStore = usePlayAreaStore()
const windowStore = useWindowsStore()
const activeClass = computed(() => (currentId: string) => {
  return currentId === canvasCollectionStore.active ? 'marker-active' : 'marker-inactive'
})
const activeIndex = ref(-1)
const contextRef = ref(null)
const userStore = useUsersStore()

const handleCanvasRemove = async (index: number) => {
  await rtFetch({
    route: `/api/canvas/${canvasCollectionStore.canvasList[index].id}`,
    method: 'DELETE',
  })
  canvasCollectionStore.canvasList.splice(index, 1)
}
const handleCanvasUpdate = (index: number) => {
  const canvasId = canvasCollectionStore.canvasList[index].id
  rtFetch({
    route: `/api/canvas/${canvasId}`,
    method: 'GET',
  }).then(({data}) => {
    console.log(data)
    windowStore.addNewWindow(`configCanvas-${generateUUID()}`,
      {
        componentType: 'SimpleHeader',
        componentData: 'Configure Canvas',
      },
      {
        componentType: 'NewCanvasConfig',
        componentData: {
          initialName: data.name,
          initialGroundDimension: data.groundDimension,
          initialGridSize: data.initialGridSize,
          bodyId: canvasId,
        },
      },
      {
        icon: 'shirt', actionName: 'NewCanvasConfig',
      },
      getCenteredWindow(500, 300),
    )
  })
}
const canvasActions = [{
  displayedText: 'Update Canvas',
  onClickFunction: handleCanvasUpdate,
}, {
  displayedText: 'Delete Canvas',
  onClickFunction: handleCanvasRemove,
}]
const handleCanvasChange = async (newId: string) => {
  await playerAreaStore.loadCanvas(newId)

  canvasCollectionStore.changeActiveCanvas(newId)
}

const handleCanvasCreation = () => {
  windowStore.addNewWindow(`newCanvasConfig`,
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
    getCenteredWindow(500, 300),
  )
}
const handleRightClick = (index: number) => {
  if (activeIndex.value === index) activeIndex.value = -1
  else activeIndex.value = index
}
onClickOutside(contextRef, () => {
  activeIndex.value = -1
})
websocket.addEventListener(WEBSOCKET_RECEIVABLE_EVENTS.CANVAS_LIST_UPDATE, (message) => {
  if (message.source === userStore.currentUser.id) return
  console.log('here', userStore.currentUser.id, message.source)
  canvasCollectionStore.canvasList = message.data
})
</script>

<template>
  <div class="clickable selection-bar">
    <div class="element-container" v-for="(canvas, index) in canvasCollectionStore.canvasList" :key="canvas.id">
      <div class="element" @click="() => handleCanvasChange(canvas.id)" @contextmenu="() => handleRightClick(index)">
        {{ canvas.name }}
        <span :class="`activity-marker ${activeClass(canvas.id)}`" />
      </div>
      <contextMenu :tabIndex="index" :options="canvasActions" :visible="index === activeIndex" ref="contextRef" />
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

.element-container {
  position: relative
}

.element {
  position: relative;
  width: fit-content;
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

.contextMenuContainer {
  position: relative;
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
