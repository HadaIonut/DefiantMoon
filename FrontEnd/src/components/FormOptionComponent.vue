<script setup lang="ts">
const props = defineProps<{
    label: string
}>()
</script>

<template>
    <div class="form-option">
        <span class="form-label">{{ props.label }}</span>
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
.form-option {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .form-label {
        width: 30%;
    }
}
</style>
