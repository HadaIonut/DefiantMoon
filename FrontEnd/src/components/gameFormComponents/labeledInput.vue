<script setup lang="ts">

export interface InputProps {
  labelText: string,
  inputType: 'text' | 'number',
  value?: any
}

const props = defineProps<InputProps>()
const model = defineModel()
</script>
<template>
  <div class="element">
    <span>
      {{ props.labelText }}
    </span>
    <input v-if="model !== undefined" v-model="model" :type="props.inputType">
    <input v-else :type="props.inputType" :value="props.value">
  </div>
</template>
<style lang="scss">
.element {
  display: flex;
  align-items: center;

  &>span {
    width: 40%;
  }

  &>input {
    width: 60%;
    padding: 10px;
    background: $darker-secondary;
    border: 1px solid $darker-tertiary;
    border-radius: 6px;
    color: $tertiary;

    &:focus {
      outline: none;
      border: 1px solid lighten($darker-tertiary, 20%);
      transition: border-color 0.2s ease-in-out;
    }

    &[type="color"] {
      padding: 0;
      width: 64%;
      padding-left: 10px;
      padding-right: 10px;
      height: 37px;
    }
  }

  &:not(:last-child) {
    padding-bottom: 10px;
  }
}
</style>
