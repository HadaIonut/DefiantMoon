<script setup lang="ts">
import {useWindowsStore} from '../stores/windows'
import {WindowStore} from 'types/windows'

const windowStore = useWindowsStore()
const windowObject:WindowStore = windowStore.$state

const actionClick = (windowKey: string) => {
    if (windowStore[windowKey].action.isActive) {
        windowStore.closeWindow(windowKey)
    } else {
        windowStore.openWindow(windowKey)
    }
}
</script>

<template>
    <div class="sidebar">
        <perfect-scrollbar>
            <div class="icon-container" v-for="(item, key) in windowObject" :key="item.action.icon" @click="() => actionClick(key)">
                <font-awesome-icon :icon="`fa-solid fa-${item.action.icon}`" size="3x" />
                <span :class="`active-marker ${item.action.isActive ? 'marker-selected' : ''}`"></span>
            </div>
        </perfect-scrollbar>
    </div>
</template>

<style scoped lang="scss">
.sidebar {
    position: absolute;
    width: 100px;
    height: 50vh;
    background: rgba($tertiary, 0.5);
    border-radius: 12px;
    border: 1px solid $accent;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.ps {
    width: 100%;
}

.icon-container {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 16px;
    aspect-ratio: 2/1;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    position: relative;

    &:first-child {
        margin-top: 5px;
    }

    &:not(:last-child) {
        margin-bottom: 5px;
    }

    &:hover {
        background: rgba($secondary, 0.5);
    }
}

.active-marker {
    position: absolute;
    height: 0;
    width: 3px;
    background-color: $text;
    border-radius: 12px;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);

    transition: height 0.2s ease-in-out;
}

.marker-selected {
    height: 60%;
}
</style>
