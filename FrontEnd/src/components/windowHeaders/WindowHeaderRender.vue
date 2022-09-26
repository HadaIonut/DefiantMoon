<script setup lang="ts">
import VSwitch from '@lmiller1990/v-switch'
import SimpleWindowHeader from './SimpleWindowHeader.vue'

export interface WindowHeaderRendererProps {
    componentToRender: string,
    headerData: any
}
const props = defineProps<WindowHeaderRendererProps>()
</script>

<template>
    <v-switch :case="props.componentToRender">
        <template #SimpleHeader>
            <SimpleWindowHeader :headerText="props.headerData"/>
        </template>
    </v-switch>
</template>

<style scoped lang="scss">

</style>
