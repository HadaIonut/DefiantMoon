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

let lastHeightBeforeMinimize = '0px'

const windowStore = useWindowsStore()

const isMoving: Ref<boolean> = ref(false)
const window: Ref<HTMLElement | null> = ref(null)
const windowHeader: Ref<HTMLElement | null> = ref(null)

const initWindowMove = (event: MouseEvent) => {
    pullFocus(event)

    let windowLocation = {startX: 0, startY: 0, stopX: 0, stopY: 0}
    let windowMoveOffset = {x: 0, y: 0}

    if (!window.value || !windowHeader.value) return
    windowLocation = {
        ...windowLocation,
        startX: event.clientX,
        startY: event.clientY,
    }

    isMoving.value = true
    if (window.value) window.value.style.userSelect = 'none'

    windowMoveOffset = {
        x: event.pageX - window.value.offsetLeft,
        y: event.pageY - window.value.offsetTop,
    }

    const getLimitedXMovement = (clientX: number): number => {
        if (!window.value) return 0

        const windowX = parseInt(
            document?.defaultView?.getComputedStyle?.(window?.value)?.width ?? '',
            10,
        )

        if (clientX - windowMoveOffset.x < 0) return 0
        else if (clientX - windowMoveOffset.x + windowX > document.body.clientWidth) {
            return document.body.clientWidth - windowX - RIGHT_MARGIN_OFFSET
        } else return clientX - windowMoveOffset.x
    }

    const getLimitedYMovement = (clientY: number): number => {
        if (!window.value) return 0

        const windowY = parseInt(
            document?.defaultView?.getComputedStyle?.(window?.value)?.height ?? '',
            10,
        )

        if (clientY - windowMoveOffset.y < 0) return 0
        else if (clientY - windowMoveOffset.y + windowY > document.body.clientHeight) {
            return document.body.clientHeight - windowY - RIGHT_MARGIN_OFFSET
        } else return clientY - windowMoveOffset.y
    }

    const windowMove = (event: MouseEvent) => {
        if (!isMoving.value || !window.value) return

        windowLocation = {
            stopX: getLimitedXMovement(event.clientX),
            stopY: getLimitedYMovement(event.clientY),
            startX: event.clientX,
            startY: event.clientY,
        }

        window.value.style.top = windowLocation.stopY + 'px'
        window.value.style.left = windowLocation.stopX + 'px'
    }

    const stopWindowMove = () => {
        isMoving.value = false
        if (!window.value) return
        const windowLocation = {
            top: window.value?.style.top,
            left: window.value?.style.left,
        }

        window.value.style.userSelect = ''

        document.removeEventListener('mousemove', windowMove)
        windowStore.setWindowLocation(props.windowKey, windowLocation.top, windowLocation.left)
    }

    document.addEventListener('mousemove', windowMove)
    windowHeader.value.addEventListener('mouseup', stopWindowMove)
}

const initResize = (event: MouseEvent) => {
    pullFocus(event)
    const resizeType = (event.target as HTMLElement).classList.value

    const dragWindowLocation = {startX: 0, startY: 0, startWidth: 0, startHeight: 0}

    dragWindowLocation.startX = event.clientX
    dragWindowLocation.startY = event.clientY
    if (!window.value) return

    dragWindowLocation.startWidth = parseInt(
        document?.defaultView?.getComputedStyle?.(window.value)?.width ?? '',
        10,
    )
    dragWindowLocation.startHeight = parseInt(
        document?.defaultView?.getComputedStyle?.(window.value)?.height ?? '',
        10,
    )

    window.value.style.userSelect = 'none'
    window.value.style.transition = 'none'

    const doResize = (event: MouseEvent) => {
        if (!window.value) return

        switch (resizeType) {
        case 'resizer-both':
            window.value.style.width = dragWindowLocation.startWidth + event.clientX - dragWindowLocation.startX + 'px'
            window.value.style.height = dragWindowLocation.startHeight + event.clientY - dragWindowLocation.startY + 'px'
            break
        case 'resizer-bottom':
            window.value.style.height = dragWindowLocation.startHeight + event.clientY - dragWindowLocation.startY + 'px'
            break
        case 'resizer-right':
            window.value.style.width = dragWindowLocation.startWidth + event.clientX - dragWindowLocation.startX + 'px'
            break
        }
    }

    const stopResize = () => {
        if (!window.value) return
        const windowSize = {
            width: window.value?.style.width,
            height: window.value?.style.height,
        }

        window.value.style.userSelect = ''
        window.value.style.transition = ''

        document.removeEventListener('mousemove', doResize)
        document.removeEventListener('mouseup', stopResize)

        windowStore.setWindowSize(props.windowKey, windowSize.width, windowSize.height)
    }

    document.addEventListener('mousemove', doResize)
    document.addEventListener('mouseup', stopResize)
}

const minimize = () => {
    if (!window.value) return

    windowStore.toggleMinimize(props.windowKey)

    if (windowStore[props.windowKey].isMinimized) {
        lastHeightBeforeMinimize = window.value?.style.height

        window.value.style.height = WINDOW_HEADER_HEIGHT
    } else window.value.style.height = lastHeightBeforeMinimize
}

onMounted(() => {
    if (lastHeightBeforeMinimize === '0px') {
        lastHeightBeforeMinimize = windowStore.$state[props.windowKey].display.height ?? '0px'
    }

    if (!windowStore.hasDisplaySet(props.windowKey)) {
        windowStore.applyWindowStartingData(props.windowKey)
    }
})

const windowPosition = computed(() => {
    const storeData = windowStore[props.windowKey].display
    const minStoreData = windowStore[props.windowKey].minimumSize
    const height = windowStore[props.windowKey].isMinimized ? WINDOW_HEADER_HEIGHT : storeData.height
    const minText = `min-width: ${minStoreData.width}; min-height: ${minStoreData.height}`

    return `width: ${storeData.width}; height: ${height}; top: ${storeData.top}; left: ${storeData.left}; ${!windowStore[props.windowKey].isMinimized ? minText : ''}`
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
        ref="window" v-if="props.windowData.status !== 'closed'"
        @click="pullFocus"
        :style="windowPosition">
        <div class="draggable-window-header" ref="windowHeader" @dblclick="minimize" @mousedown="initWindowMove">
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
            <Motion v-show="!windowStore[props.windowKey].isMinimized" style="height: 100%" :animate="{scaleY: 1}" :exit="{scaleY: 0}" >
                <div class="window-body-content">
                    <slot name="body">big content energy</slot>
                </div>
            </Motion>
        </div>
        <span v-if="!windowStore[props.windowKey].isMinimized" class="resizer-right" @mousedown="initResize"/>
        <span v-if="!windowStore[props.windowKey].isMinimized" class="resizer-bottom" @mousedown="initResize"/>
        <span v-if="!windowStore[props.windowKey].isMinimized" class="resizer-both" @mousedown="initResize"/>
    </div>
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
