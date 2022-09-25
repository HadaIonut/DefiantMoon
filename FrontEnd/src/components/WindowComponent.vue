<script setup lang="ts">
import {onMounted, Ref, ref} from 'vue'

const RIGHT_MARGIN_OFFSET = 0
const WINDOW_HEADER_HEIGHT = '30px'

let lastHeightBeforeMinimize = '0px'

const isMoving: Ref<Boolean> = ref(false)
const window: Ref<HTMLElement | null> = ref(null)
const windowHeader: Ref<HTMLElement | null> = ref(null)
const isMinimized: Ref<Boolean> = ref(false)

const initWindowMove = (event: MouseEvent) => {
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
        if (window.value) window.value.style.userSelect = ''

        document.removeEventListener('mousemove', windowMove)
    }

    document.addEventListener('mousemove', windowMove)
    windowHeader.value.addEventListener('mouseup', stopWindowMove)
}

const initResize = (event: MouseEvent) => {
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

        window.value.style.width = dragWindowLocation.startWidth + event.clientX - dragWindowLocation.startX + 'px'
        window.value.style.height = dragWindowLocation.startHeight + event.clientY - dragWindowLocation.startY + 'px'
    }

    const stopResize = () => {
        if (!window.value) return

        window.value.style.userSelect = ''
        window.value.style.transition = ''

        document.removeEventListener('mousemove', doResize)
        document.removeEventListener('mouseup', stopResize)
    }

    document.addEventListener('mousemove', doResize)
    document.addEventListener('mouseup', stopResize)
}

const minimize = () => {
    if (!window.value) return

    isMinimized.value = !isMinimized.value

    if (isMinimized.value) {
        lastHeightBeforeMinimize = window.value?.style.height

        window.value.style.height = WINDOW_HEADER_HEIGHT
    } else window.value.style.height = lastHeightBeforeMinimize
}

onMounted(() => {
    if (!window.value) return

    const windowSizes = {
        x: document?.defaultView?.getComputedStyle?.(window?.value)?.width ?? '',
        y: document?.defaultView?.getComputedStyle?.(window?.value)?.height?? '',
    }

    window.value.style.height = windowSizes.y
    window.value.style.width = windowSizes.x
})
</script>

<template>
    <div class="draggable-window" ref="window">
        <div class="draggable-window-header" ref="windowHeader" @dblclick="minimize" @mousedown="initWindowMove">
            <div class="window-header-content">
                <slot name="header">header</slot>
            </div>
        </div>
        <div :class="`draggable-window-body ${isMinimized ? 'draggable-window-body--minimized' : ''}`">
            <div class="window-body-content">
                <span>
                    <slot name="body">big content energy</slot>
                </span>
            </div>
        </div>
        <span v-if="!isMinimized" class="resizer-right" @mousedown="initResize"/>
        <span v-if="!isMinimized" class="resizer-bottom" @mousedown="initResize"/>
        <span v-if="!isMinimized" class="resizer-both" @mousedown="initResize"/>
    </div>
</template>

<style scoped lang="scss">
.draggable-window {
    position: absolute;
    top: $window-default-location-top;
    left: $window-default-location-left;
    transition: height 0.2s ease-in-out;

}

.draggable-window-header {
    background-color: $tertiary;
    color: $text;
    height: $window-header-height;
    z-index: $window-z-index;
    cursor: move;
    display: flex;
}

.draggable-window-body {
    background-color: $secondary;
    color: $text-dark;
    position: relative;
    height: calc(100% - #{$window-header-height});
    display: flex;
    transition: height 0.2s ease-in-out;

    &--minimized {
        height: 0;
    }
}

.window-header-content {
    flex: 1;
    padding: 5px;
}

.window-body-content {
    flex: 1;
    padding: 5px;
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
