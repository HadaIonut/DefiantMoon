<script setup lang="ts">
export interface InputProps {
    placeholder?: string,
    animate?: boolean,
    type?: string
}


const props = withDefaults(defineProps<InputProps>(), {
    placeholder: 'Type something',
    animate: true,
    type: 'text',
})
</script>

<template>
    <div class="input-wrapper">
        <input class="input" :type="props.type" :placeholder="props.placeholder">
        <div class="animation"></div>
    </div>
</template>

<style scoped lang="scss">
.input-wrapper {
    width: 100%;
    position: relative;

    .input:focus~.animation:after {
        width: 99%;
    }
}

.animation {
    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 5px;
        width: 0;
        height: 2px;
        background: $primary;
        transition: width 0.4s ease-in-out;
    }
}

.input {
    width: calc(100% - 16px);
    background: transparent;
    padding: 16px 0 16px 16px;
    border: 1px solid $secondary;
    font-weight: bold;
    border-radius: 12px;
    color: $text;
    margin-top: 8px;

    &:focus {
        outline: none;
    }
}
</style>
