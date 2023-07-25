<script setup lang="ts">
import VSwitch from '@lmiller1990/v-switch'
export interface WindowActionRendererProps {
    componentToRender: string,
    headerData: any
    windowKey: string
}

const props = defineProps<WindowActionRendererProps>()

</script>

<template>
    <v-switch :case="props.componentToRender">
        <template #SimpleClose>
            <SimpleCloseActions :windowKey="props.windowKey"/>
        </template>
        <template #RemoveClose>
            <RemoveCloseActions :windowKey="props.windowKey"/>
        </template>
    </v-switch>
</template>

<style scoped lang="scss">

</style>
