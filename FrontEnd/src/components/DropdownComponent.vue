<script setup lang="ts">
import {onMounted, Ref, ref} from 'vue'

export interface DropdownProps {
    options: string[],
    initial: string,
}

const props = withDefaults(defineProps<DropdownProps>(), {
    options: () => [],
    initial: () => 'Enter your selection',
})

const emit = defineEmits<{(e: 'change', selected: string): string }>()

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
            <span>
                {{ selectedOption }}
            </span>
            <span :class="isVisible ? 'dropdown-icon-rotate dropdown-icon': 'dropdown-icon'">
                <font-awesome-icon icon="fa-solid fa-caret-up" />
            </span>
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
    cursor: pointer;
    user-select: none;
    display: flex;
    justify-content: space-between;
}

.dropdown-options {
    position: absolute;
    background: $tertiary;
    width: 100%;
    border-radius: 12px;
    border: 1px solid $secondary;
    margin-top: 2px;
    z-index: 10;
}

.option {
    border-radius: 12px;
    padding: 16px;
    transition: background 0.2s ease-in;
    cursor: pointer;

    &:hover {
        background: $secondary;
    }
}

.is-hidden {
    display: none;
}

.dropdown-icon {
    transition: transform 0.2s ease-in-out;
}

.dropdown-icon-rotate {
    transform: rotate(180deg);
}
</style>
