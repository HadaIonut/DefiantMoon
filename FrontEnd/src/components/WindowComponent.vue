<script setup lang="ts">
import {Ref, ref} from 'vue'

const isMoving = ref(false)
const window: Ref<HTMLElement | null> = ref(null)
let windowLocation = {startX: 0, startY: 0, stopX: 0, stopY: 0}
const dragWindowLocation = {startX: 0, startY: 0, startWidth: 0, startHeight: 0}
let windowMoveOffset = {x: 0, y: 0}

const RIGHT_MARGIN_OFFSET = 0

const startWindowMove = (event: PointerEvent) => {
    if (!window.value) return
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

    document.addEventListener('mousemove', windowMove)
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

const initDrag = (event: MouseEvent) => {
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

    document.addEventListener('mousemove', doDrag)
    document.addEventListener('mouseup', stopDrag)
}

const doDrag = (event: MouseEvent) => {
    if (!window.value) return

    window.value.style.width = dragWindowLocation.startWidth + event.clientX - dragWindowLocation.startX + 'px'
    window.value.style.height = dragWindowLocation.startHeight + event.clientY - dragWindowLocation.startY + 'px'
}

const stopDrag = () => {
    if (window.value) window.value.style.userSelect = ''

    document.removeEventListener('mousemove', doDrag)
    document.removeEventListener('mouseup', stopDrag)
}
</script>

<template>
    <div class="draggable-window" ref="window">
        <div class="draggable-window-header" @mousedown="startWindowMove" @mouseup="stopWindowMove">
            <div class="window-header-content">
                header
            </div>
        </div>
        <div class="draggable-window-body">
            <div class="window-body-content">
                <span>
                    big content energy
                </span>
            </div>
        </div>
        <span class="resizer-right" @mousedown="initDrag"/>
        <span class="resizer-bottom" @mousedown="initDrag"/>
        <span class="resizer-both" @mousedown="initDrag"/>
    </div>
</template>

<style scoped lang="scss">
.draggable-window {
    position: absolute;
    top: $window-default-location-top;
    left: $window-default-location-left;
}

.draggable-window-header {
    background-color: $tertiary;
    color: $text;
    height: $window-height;
    z-index: $window-z-index;
    cursor: move;
    display: flex;
}

.draggable-window-body {
    background-color: $secondary;
    color: $text-dark;
    position: relative;
    height: calc(100% - #{$window-height});
    display: flex;
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
