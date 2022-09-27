<script setup lang="ts">

export interface SimpleHeaderProps {
    headerText: string
}

const props = defineProps<SimpleHeaderProps>()
</script>

<template>
    <div class="window-title">
        {{props.headerText}}
    </div>
</template>

<style scoped lang="scss">
    .window-title {
        margin: auto;
    }
</style>
