<script setup lang="ts">
import {Ref, ref} from 'vue'

const props = defineProps<{
    options: string[],
    initial: string,
}>()

const emit = defineEmits<{(e: 'change', selected: string): void }>()

const selectedOption: Ref<string> = ref(props.initial)
const isVisible: Ref<boolean> = ref(false)

const toggleDropdown = () => {
    isVisible.value = !isVisible.value
}

const closeDropdown = () => {
    isVisible.value = false
}

const selectOption = (option: string) => {
    selectedOption.value = option
    isVisible.value = false
    emit('change', selectedOption.value)
}

</script>

<template>
    <div class="dropdown" v-click-away="closeDropdown">
        <div class="dropdown-header" @click="toggleDropdown">
            {{ selectedOption }}
        </div>
        <div class="dropdown-options" v-if="isVisible">
            <div class="option" v-for="option in props.options" :key="option" @click="() => selectOption(option)">
                {{ option }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.dropdown {
    width: 100%;
    position: relative;
    color: $text;
}

.dropdown-header {
    padding: 16px;
    background: transparent;
    border-radius: 12px;
    border: 1px solid $secondary;
}

.dropdown-options {
    position: absolute;
    background: $tertiary;
    width: 100%;
    border-radius: 12px;
    border: 1px solid $secondary;
    margin-top: 2px;
}

.option {
    border-radius: 12px;
    padding: 16px;
    transition: background 0.2s ease-in;

    &:hover {
        background: $secondary;
    }
}

.is-hidden {
    display: none;
}
</style>
