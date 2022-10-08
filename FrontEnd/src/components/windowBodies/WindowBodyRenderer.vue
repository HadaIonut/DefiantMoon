<script setup lang="ts">
import VSwitch from '@lmiller1990/v-switch'
import {Window} from 'types/windows'

export interface WindowBodyRendererProps {
    componentToRender: string,
    bodyData?: any,
    windowData?: Window
}
const props = defineProps<WindowBodyRendererProps>()
</script>

<template>
    <v-switch :case="props.componentToRender">
        <template #Chat>
            <ChatWindowBody :windowData="props.windowData"/>
        </template>
        <template #ActorList>
            <ActorListWindowBody/>
        </template>
        <template #ItemList>
            <ItemListWindowBody/>
        </template>
    </v-switch>
</template>

<style scoped lang="scss">

</style>
