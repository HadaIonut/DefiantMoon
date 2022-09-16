<script setup lang="ts">
import {Ref, ref} from 'vue'
import {DropdownOption} from '../types/Dropdown'

interface DropdownProps {
    options: DropdownOption[],
    initial: DropdownOption,
}

const props = withDefaults(defineProps<DropdownProps>(), {
    options: () => [],
    initial: () => {
        return {
            optionName: 'Enter Your Selection',
            id: '0',
        } as DropdownOption
    },
})

const emit = defineEmits<{(e: 'change', selected: DropdownOption): void }>()

const selectedOption: Ref<DropdownOption> = ref(props.initial)
const isVisible: Ref<boolean> = ref(false)

const toggleDropdown = () => {
    isVisible.value = !isVisible.value
}

const closeDropdown = () => {
    isVisible.value = false
}

const selectOption = (option: DropdownOption) => {
    selectedOption.value = option
    isVisible.value = false
    emit('change', selectedOption.value)
}

</script>

<template>
    <div class="dropdown" v-click-away="closeDropdown">
        <div class="dropdown-header" @click="toggleDropdown">
            <span>
                {{ selectedOption.optionName }}
            </span>
            <span :class="isVisible ? 'dropdown-icon-rotate dropdown-icon': 'dropdown-icon'">
                <font-awesome-icon icon="fa-solid fa-caret-up" />
            </span>
        </div>
        <div class="dropdown-options" v-if="isVisible">
            <div class="option" v-for="option in props.options" :key="option.id" @click="() => selectOption(option)">
                {{ option.optionName }}
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
    border: 1px solid $accent;
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
    border: 1px solid $accent;
    margin-top: 2px;
    z-index: 10;
}

.option {
    border-radius: 12px;
    padding: 16px;
    transition: background 0.2s ease-in, color 0.2s ease-in;
    cursor: pointer;

    &:hover {
        background: $secondary;
        color: $text-dark;
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
