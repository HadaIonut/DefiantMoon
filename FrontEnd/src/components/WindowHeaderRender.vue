<script setup lang="ts">
import VSwitch from '@lmiller1990/v-switch'
import TestHeader from './SimpleWindowHeader.vue'
import SimpleWindowHeader from '../components/SimpleWindowHeader.vue'

export interface WindowHeaderRendererProps {
    componentToRender: string,
    headerData: any
}
const props = defineProps<WindowHeaderRendererProps>()
console.log(props)
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
