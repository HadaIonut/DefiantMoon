<script setup lang="ts">
import {computed, ref} from 'vue'

const isMoving = ref(false)
const hasMoved = ref(false)
let windowLocation = {startX: 0, startY: 0, stopX: 0, stopY: 0}
let windowElement: HTMLElement | null

const startWindowMove = (event: PointerEvent) => {
    windowLocation = {
        ...windowLocation,
        startX: event.clientX,
        startY: event.clientY,
    }

    isMoving.value = true
    windowElement = (event?.target as HTMLElement)?.parentElement

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

    if (!windowElement) return

    windowElement.style.top = (windowElement.offsetTop - windowLocation.stopY) + 'px'
    windowElement.style.left = (windowElement.offsetLeft - windowLocation.stopX) + 'px'
}

const stopWindowMove = (event: PointerEvent) => {
    isMoving.value = false
    document.removeEventListener('mousemove', windowMove)
}
</script>

<template>
    <div class="draggable-window">
        <div class="draggable-window-header" @mousedown="startWindowMove" @mouseup="stopWindowMove">
            header
        </div>
        <div class="draggable-window-content">
            big content energy
        </div>
    </div>
</template>

<style scoped lang="scss">
.draggable-window {
    position: absolute;
    top: 50%;
    left: 50%;
}

.draggable-window-content {
    background-color: $secondary;
    color: $text-dark;
    padding: 20px;
}

.draggable-window-header {
    background-color: $tertiary;
    color: $text;
    padding: 10px;
    z-index: 100;
}
</style>
