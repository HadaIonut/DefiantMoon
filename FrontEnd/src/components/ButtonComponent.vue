<script setup lang="ts">
interface ButtonProps {
    content: string
}

const props = defineProps<ButtonProps>()

const emit = defineEmits<{(e: 'click'): void}>()

const onClick = () => emit('click')
</script>

<template>
    <button class="button" @click="onClick">{{ props.content }}</button>
</template>

<style scoped lang="scss">
.button {
    padding: 16px;
    background: $primary;
    color: $text;
    border-radius: 12px;
    cursor: pointer;
    border: 1px solid $primary;
    font-weight: bold;
    transition: background-color 90ms ease-in-out, color 0.2s ease-in;

    &:hover {
        background-color: $brighter-primary;
    }

    &:active {
        background-color: $tertiary;
        color: $text;
    }
}
</style>
