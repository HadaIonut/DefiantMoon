<script setup lang="ts">

import {useWindowsStore} from 'src/stores/windows'

interface ActionProps {
    windowKey: string
}

const props = defineProps<ActionProps>()
const windowStore = useWindowsStore()

const closeWindow = () => {
  windowStore.removeWindow(props.windowKey)
}
</script>

<template>
    <div class="action close-button" @click="closeWindow">
        <font-awesome-icon icon="fa-solid fa-xmark"/>
    </div>
</template>

<style scoped lang="scss">
.close-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin-right: 5px;
}
</style>
