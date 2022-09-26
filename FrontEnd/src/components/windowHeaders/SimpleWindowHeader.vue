<script setup lang="ts">

export interface SimpleHeaderProps {
    headerText: string
}

const props = defineProps<SimpleHeaderProps>()
</script>

<template>
    <div>
        {{props.headerText}}
    </div>
</template>

<style scoped lang="scss">

</style>
