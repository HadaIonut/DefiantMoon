<script setup lang="ts">
import {Ref, ref} from 'vue'

const isMoving = ref(false)
const window: Ref<HTMLElement | null> = ref(null)
let windowLocation = {startX: 0, startY: 0, stopX: 0, stopY: 0}
const dragWindowLocation = {startX: 0, startY: 0, startWidth: 0, startHeight: 0}

const startWindowMove = (event: PointerEvent) => {
    windowLocation = {
        ...windowLocation,
        startX: event.clientX,
        startY: event.clientY,
    }

    isMoving.value = true
    if (window.value) window.value.style.userSelect = 'none'

    document.addEventListener('mousemove', windowMove)
}

const windowMove = (event: MouseEvent) => {
    if (!isMoving.value) return

    windowLocation = {
        stopX: windowLocation.startX - event.clientX,
        stopY: windowLocation.startY - event.clientY,
        startX: event.clientX,
        startY: event.clientY,
    }

    if (!window.value) return

    window.value.style.top = (window.value.offsetTop - windowLocation.stopY) + 'px'
    window.value.style.left = (window.value.offsetLeft - windowLocation.stopX) + 'px'
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

const stopDrag = (event: MouseEvent) => {
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
            <span class="resizer-right" @mousedown="initDrag"/>
            <span class="resizer-bottom" @mousedown="initDrag"/>
            <span class="resizer-both" @mousedown="initDrag"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
$window-height: 30px;
$window-default-location-top: 50%;
$window-default-location-left: 50%;

.draggable-window {
    position: absolute;
    top: $window-default-location-top;
    left: $window-default-location-left;
}

.draggable-window-header {
    background-color: $tertiary;
    color: $text;
    height: $window-height;
    z-index: 100;
    cursor: move;
}

.draggable-window-body {
    background-color: $secondary;
    color: $text-dark;
    position: relative;
    height: calc(100% - #{$window-height});
}

.window-header-content {
    height: 100%;
    padding: 5px;
}

.window-body-content {
    height: 100%;
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
    z-index: 100;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: nw-resize;
}
</style>
