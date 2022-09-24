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

    document.addEventListener('mousemove', doDrag)
    document.addEventListener('mouseup', stopDrag)
}

const doDrag = (event: MouseEvent) => {
    if (!window.value) return

    window.value.style.width = dragWindowLocation.startWidth + event.clientX - dragWindowLocation.startX + 'px'
    window.value.style.height = dragWindowLocation.startHeight + event.clientY - dragWindowLocation.startY + 'px'
}

const stopDrag = (event: MouseEvent) => {
    document.removeEventListener('mousemove', doDrag)
    document.removeEventListener('mouseup', stopDrag)
}
</script>

<template>
    <div class="draggable-window" ref="window">
        <div class="draggable-window-header" @mousedown="startWindowMove" @mouseup="stopWindowMove">
            header
        </div>
        <div class="draggable-window-content">
            <span>
                big content energy
            </span>
            <span class="resizer-right" @mousedown="initDrag"/>
            <span class="resizer-bottom" @mousedown="initDrag"/>
            <span class="resizer-both" @mousedown="initDrag"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
.draggable-window {
    position: absolute;
    top: 50%;
    left: 50%;
}

.draggable-window-header {
    background-color: $tertiary;
    color: $text;
    height: 30px;
    z-index: 100;
    cursor: move;
    user-select: none;
}

.draggable-window-content {
    background-color: $secondary;
    color: $text-dark;
    position: relative;
    height: calc(100% - 30px);
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
    z-index: 10;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: nw-resize;
}
</style>
