<script setup lang="ts">
export interface AbilityEntryProps {
    title: string
    description: string | number
}

const props = defineProps<AbilityEntryProps>()

</script>

<template>
    <div v-if="props.description !== '' && props.description !== 0">
        <span class="title">
            {{ props.title }}
        </span>
        <span>
            {{ props.description }}
        </span>
    </div>
</template>

<style scoped lang="scss">
.title {
    font-weight: bold;
    margin-right: 10px;
}
</style>
