<script setup lang="ts">
import {computed, onMounted, Ref, ref} from 'vue'
import {Window} from 'types/windows'
import {useWindowsStore} from '../stores/windows'
import {Motion} from 'motion/vue'

interface WindowProps {
    windowData: Window,
    windowKey: string
}

const props = defineProps<WindowProps>()

const RIGHT_MARGIN_OFFSET = 0
const WINDOW_HEADER_HEIGHT = '30px'
const SHADOW_MARGIN_OFFSET = '2px'

let lastHeightBeforeMinimize = '0px'

const windowStore = useWindowsStore()
const windowObject = windowStore.$state

const isMoving: Ref<boolean> = ref(false)
const windowRef: Ref<HTMLElement | null> = ref(null)
const shadowWindowRef: Ref<HTMLElement | null> = ref(null)
const windowHeaderRef: Ref<HTMLElement | null> = ref(null)
const windowHitEdgeX: Ref<boolean> = ref(false)
const windowHitEdgeY: Ref<boolean> = ref(false)

const getSnapLocation = () => {
  if (!windowRef.value) return

  if (windowHitEdgeY.value && windowHitEdgeX.value) {
    const leftVal = windowRef.value.style.left === '0px' ? '0px' : `${document.body.clientWidth/2}px`
    const topVal = windowRef.value.style.top === '0px' ? '0px' : `${document.body.clientHeight/2}px`

    return {top: topVal, left: leftVal, width: document.body.clientWidth/2 + 'px', height: document.body.clientHeight/2 + 'px'}
  }
  if (windowHitEdgeY.value && !windowHitEdgeX.value) {
    return {top: '0px', left: '0px', width: document.body.clientWidth + 'px', height: document.body.clientHeight + 'px'}
  }
  if (!windowHitEdgeY.value && windowHitEdgeX.value) {
    const leftCenter = document.body.clientWidth / 2
    const leftVal = windowRef.value?.style.left === '0px' ? '0px' : `${leftCenter}px`

    return {top: '0px', left: leftVal, height: document.body.clientHeight + 'px', width: document.body.clientWidth/2 + 'px'}
  }
  return {
    top: windowRef.value?.style.top,
    left: windowRef.value?.style.left,
  }
}

const initWindowMove = (event: MouseEvent) => {
  pullFocus(event)

  let windowLocation = {startX: 0, startY: 0, stopX: 0, stopY: 0}
  let windowMoveOffset = {x: 0, y: 0}

  if (!windowRef.value || !windowHeaderRef.value) return
  windowLocation = {
    ...windowLocation,
    startX: event.clientX,
    startY: event.clientY,
  }

  isMoving.value = true
  if (windowRef.value) windowRef.value.style.userSelect = 'none'

  windowMoveOffset = {
    x: event.pageX - windowRef.value.offsetLeft,
    y: event.pageY - windowRef.value.offsetTop,
  }

  const getLimitedXMovement = (clientX: number): number => {
    if (!windowRef.value) return 0

    const windowX = parseInt(
      document?.defaultView?.getComputedStyle?.(windowRef?.value)?.width ?? '',
      10,
    )

    if (clientX - windowMoveOffset.x < 0) return 0
    else if (clientX - windowMoveOffset.x + windowX > document.body.clientWidth) {
      return document.body.clientWidth - windowX - RIGHT_MARGIN_OFFSET
    } else return clientX - windowMoveOffset.x
  }

  const getLimitedYMovement = (clientY: number): number => {
    if (!windowRef.value) return 0

    const windowY = parseInt(
      document?.defaultView?.getComputedStyle?.(windowRef?.value)?.height ?? '',
      10,
    )

    if (clientY - windowMoveOffset.y < 0) return 0
    else if (clientY - windowMoveOffset.y + windowY > document.body.clientHeight) {
      return document.body.clientHeight - windowY - RIGHT_MARGIN_OFFSET
    } else return clientY - windowMoveOffset.y
  }

  const detectEdgeHits = () => {
    if (!windowRef?.value) return

    const windowWidth = parseInt(
      document?.defaultView?.getComputedStyle?.(windowRef?.value)?.width ?? '',
      10,
    )
    const windowHeight = parseInt(
      document?.defaultView?.getComputedStyle?.(windowRef?.value)?.height ?? '',
      10,
    )

    windowHitEdgeX.value = windowLocation.stopX === 0 || windowLocation.stopX + windowWidth >= document.body.clientWidth
    windowHitEdgeY.value = windowLocation.stopY === 0|| windowLocation.stopY + windowHeight >= document.body.clientHeight
  }

  const windowMove = (event: MouseEvent) => {
    if (!isMoving.value || !windowRef.value || !shadowWindowRef.value) return

    windowLocation = {
      stopX: getLimitedXMovement(event.clientX),
      stopY: getLimitedYMovement(event.clientY),
      startX: event.clientX,
      startY: event.clientY,
    }

    detectEdgeHits()

    windowRef.value.style.top = windowLocation.stopY + 'px'
    windowRef.value.style.left = windowLocation.stopX + 'px'


    if (windowHitEdgeX.value || windowHitEdgeY.value) return

    shadowWindowRef.value.style.left = windowLocation.stopX + 'px'
    shadowWindowRef.value.style.top = windowLocation.stopY + parseInt(windowRef.value?.style.height ?? '0') /2 + 'px'
  }

  const stopWindowMove = () => {
    isMoving.value = false
    if (!windowRef.value) return

    const windowData = getSnapLocation()

    if (windowData) {
      windowStore.setWindowLocation(props.windowKey, windowData.top, windowData.left)

      if (windowData.width && windowData.height) {
        windowStore.setWindowSize(props.windowKey, windowData.width, windowData.height)
        windowStore.setMinimizeStatus(props.windowKey, false)
      }
    }


    windowHitEdgeY.value = false
    windowHitEdgeX.value = false

    windowRef.value.style.userSelect = ''

    document.removeEventListener('mousemove', windowMove)
    document.body.removeEventListener('mouseleave', stopWindowMove)
  }

  document.addEventListener('mousemove', windowMove)
  document.body.addEventListener('mouseleave', stopWindowMove)
  windowHeaderRef.value.addEventListener('mouseup', stopWindowMove)
}

const initResize = (event: MouseEvent) => {
  pullFocus(event)
  const resizeType = (event.target as HTMLElement).classList.value

  const dragWindowLocation = {startX: 0, startY: 0, startWidth: 0, startHeight: 0}

  dragWindowLocation.startX = event.clientX
  dragWindowLocation.startY = event.clientY
  if (!windowRef.value) return

  dragWindowLocation.startWidth = parseInt(
    document?.defaultView?.getComputedStyle?.(windowRef.value)?.width ?? '',
    10,
  )
  dragWindowLocation.startHeight = parseInt(
    document?.defaultView?.getComputedStyle?.(windowRef.value)?.height ?? '',
    10,
  )

  windowRef.value.style.userSelect = 'none'
  windowRef.value.style.transition = 'none'

  const doResize = (event: MouseEvent) => {
    if (!windowRef.value) return

    switch (resizeType) {
    case 'resizer-both':
      windowRef.value.style.width = dragWindowLocation.startWidth + event.clientX - dragWindowLocation.startX + 'px'
      windowRef.value.style.height = dragWindowLocation.startHeight + event.clientY - dragWindowLocation.startY + 'px'
      break
    case 'resizer-bottom':
      windowRef.value.style.height = dragWindowLocation.startHeight + event.clientY - dragWindowLocation.startY + 'px'
      break
    case 'resizer-right':
      windowRef.value.style.width = dragWindowLocation.startWidth + event.clientX - dragWindowLocation.startX + 'px'
      break
    }
  }

  const stopResize = () => {
    if (!windowRef.value) return
    const windowSize = {
      width: windowRef.value?.style.width,
      height: windowRef.value?.style.height,
    }

    windowRef.value.style.userSelect = ''
    windowRef.value.style.transition = ''

    document.removeEventListener('mousemove', doResize)
    document.removeEventListener('mouseup', stopResize)

    windowStore.setWindowSize(props.windowKey, windowSize.width, windowSize.height)
  }

  document.addEventListener('mousemove', doResize)
  document.addEventListener('mouseup', stopResize)
}

const minimize = () => {
  if (!windowRef.value) return

  windowStore.toggleMinimize(props.windowKey)

  if (windowObject[props.windowKey].isMinimized) {
    lastHeightBeforeMinimize = windowRef.value?.style.height

    windowRef.value.style.height = WINDOW_HEADER_HEIGHT
  } else windowRef.value.style.height = lastHeightBeforeMinimize
}

onMounted(() => {
  if (lastHeightBeforeMinimize === '0px') {
    lastHeightBeforeMinimize = windowObject[props.windowKey].display.height ?? '0px'
  }

  if (!windowStore.hasDisplaySet(props.windowKey)) {
    windowStore.applyWindowStartingData(props.windowKey)
  }
})

const windowPosition = computed(() => {
  const storeData = windowObject[props.windowKey].display
  const minStoreData = windowObject[props.windowKey].minimumSize
  const height = windowObject[props.windowKey].isMinimized ? WINDOW_HEADER_HEIGHT : storeData.height
  const minText = `min-width: ${minStoreData.width}; min-height: ${minStoreData.height}`

  return `width: ${storeData.width}; height: ${height}; top: ${storeData.top}; left: ${storeData.left}; ${!windowObject[props.windowKey].isMinimized ? minText : ''}`
})

const shadowWindowPosition = computed(() => {
  const storeData = windowObject[props.windowKey].display

  if (windowHitEdgeY.value && windowHitEdgeX.value && windowRef.value) {
    const leftVal = windowRef.value.style.left === '0px' ? `left: ${SHADOW_MARGIN_OFFSET}` : `left: ${document.body.clientWidth/2}px`
    const topVal = windowRef.value.style.top === '0px' ? `top: ${SHADOW_MARGIN_OFFSET}` : `top: ${document.body.clientHeight/2}px`

    return `${topVal}; ${leftVal}; width: calc(50vw - 2 * ${SHADOW_MARGIN_OFFSET}); height:calc(50vh - 2* ${SHADOW_MARGIN_OFFSET}); z-index:10`
  }

  if (windowHitEdgeY.value && !windowHitEdgeX.value) {
    return `top: ${SHADOW_MARGIN_OFFSET}; left: ${SHADOW_MARGIN_OFFSET}; width: calc(100vw - 2 * ${SHADOW_MARGIN_OFFSET}); height:calc(100vh - 2* ${SHADOW_MARGIN_OFFSET}); z-index:10`
  }

  if (windowHitEdgeX.value && windowRef.value) {
    const leftVal = windowRef.value.style.left === '0px' ? `left: ${SHADOW_MARGIN_OFFSET}` : `left: ${document.body.clientWidth/2}px`

    return `top: ${SHADOW_MARGIN_OFFSET}; ${leftVal}; width: calc(50vw - 2 * ${SHADOW_MARGIN_OFFSET}); height:calc(100vh - 2 * ${SHADOW_MARGIN_OFFSET}); z-index:10`
  }

  return `top: calc(${storeData.top} + (${storeData.height} / 2)); left: ${storeData.left}; transform: translateY(-50%) }`
})

const windowClasses = computed((): string => {
  if (props.windowData.status === 'focused') return 'draggable-window--focused'

  return ''
})

const pullFocus = (event: Event) => {
  if ((event.target as HTMLElement).closest('.action')) return

  windowStore.focusWindow(props.windowKey)
}

const closeWindow = () => {
  windowStore.closeWindow(props.windowKey)
}
</script>

<template>
    <div
        :class="`draggable-window ${windowClasses}`"
        ref="windowRef" v-if="props.windowData.status !== 'closed'"
        @click="pullFocus"
        :style="windowPosition">
        <div class="draggable-window-header" ref="windowHeaderRef" @dblclick="minimize" @mousedown="initWindowMove">
            <div class="window-header-content">
                <slot name="header">
                    header
                </slot>
                <slot name="header-actions">
                    <div class="action close-button" @click="closeWindow">
                        <font-awesome-icon icon="fa-solid fa-xmark"/>
                    </div>
                </slot>
            </div>
        </div>
        <div class="draggable-window-body">
            <Motion v-show="!windowObject[props.windowKey].isMinimized" style="height: 100%" :animate="{scaleY: 1}"
                    :exit="{scaleY: 0}">
                <div class="window-body-content">
                    <slot name="body">big content energy</slot>
                </div>
            </Motion>
        </div>
        <span v-if="!windowObject[props.windowKey].isMinimized" class="resizer-right" @mousedown="initResize"/>
        <span v-if="!windowObject[props.windowKey].isMinimized" class="resizer-bottom" @mousedown="initResize"/>
        <span v-if="!windowObject[props.windowKey].isMinimized" class="resizer-both" @mousedown="initResize"/>
    </div>
    <div class="shadow-window" :style="shadowWindowPosition" ref="shadowWindowRef" v-if="props.windowData.status !== 'closed'"></div>
</template>

<style scoped lang="scss">
.draggable-window {
    position: absolute;
    top: $window-default-location-top;
    left: $window-default-location-left;
    z-index: $window-z-index;
    transition: height 0.2s ease-in-out, scale 0.2s ease-in-out;
    border-radius: 6px;
    box-shadow: -2px 5px 10px $background;
    border: 1px solid $accent;
    display: flex;
    flex-direction: column;

    &--focused {
        z-index: $window-z-index + 1;
    }
}

.shadow-window-container {
  position: relative
}

.shadow-window {
  width: 10px;
  height: 10px;
  background-color: rgba($secondary,0.3);
  position: absolute;
  z-index: -1;
  transition: all, 0.2s ease-in-out;
  border: 1px solid $secondary;
  border-radius: 8px;
}

.draggable-window-header {
    background-color: rgba($tertiary, 1);
    backdrop-filter: blur(6px);
    color: $text;
    height: $window-header-height;
    cursor: move;
    display: flex;
    border-radius: 6px 6px 0 0;
    flex: 0 0 30px;
}

.draggable-window-body {
    background-color: rgba($secondary, 1);
    backdrop-filter: blur(6px);
    color: $text-dark;
    position: relative;
    height: calc(100% - #{$window-header-height});
    border-radius: 0 0 6px 6px;
    flex: 1;
    display: flex;
    flex-direction: column;

    &--minimized {

        & > .window-body-content {
            display: none;
        }
    }
}

.window-header-content {
    flex: 1;
    padding: 5px;
    display: flex;
    justify-content: space-between;
}

.window-body-content {
    padding: 5px;
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
}

.close-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-right: 5px;
}

.resizer-right {
    width: 5px;
    height: 100%;
    background: transparent;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: e-resize;
}

.resizer-bottom {
    width: 100%;
    height: 5px;
    background: transparent;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: n-resize;
}

.resizer-both {
    width: 5px;
    height: 5px;
    background: transparent;
    z-index: $window-z-index;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: nw-resize;
}
</style>
