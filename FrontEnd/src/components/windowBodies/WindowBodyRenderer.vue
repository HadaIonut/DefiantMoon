<script setup lang="ts">
import VSwitch from '@lmiller1990/v-switch'
import ActorListWindowBody from './ActorListWindowBody.vue'
import ItemListWindowBody from './ItemListWindowBody.vue'
import ChatWindowBody from './ChatWindowBody.vue'

export interface WindowBodyRendererProps {
    componentToRender: string,
    bodyData?: any
}
const props = defineProps<WindowBodyRendererProps>()
</script>

<template>
    <v-switch :case="props.componentToRender">
        <template #Chat>
            <ChatWindowBody/>
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
