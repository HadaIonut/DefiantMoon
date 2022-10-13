<script setup lang="ts">
import {Ref, ref} from 'vue'

const props = defineProps<{
    image: string,
    imageIndex: number,
    removeFunction: Function,
}>()

const isHovering: Ref<boolean> = ref(false)

const displayIcon = () => isHovering.value = true

const hideIcon = () => isHovering.value = false

</script>

<template>
    <div @mouseenter="displayIcon" @mouseleave="hideIcon">
        <img :src="props.image" alt="" class="uploaded-image">

        <div v-auto-animate class="wrapper">
            <div class="remove-button" v-if="isHovering" @click="removeFunction(props.image, props.imageIndex)">
                <font-awesome-icon icon="fa-solid fa-xmark" class="remove-button-icon"/>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.remove-button {
    position: absolute;
    top: 0;
    right: 0;
    color: $text;
    background-color: $background;
    border: 1px solid $accent;
    border-radius: 50%;
    z-index: 100;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.remove-button-icon {
    width: 15px;
    height: 15px;
}

.uploaded-image {
    height: 80px;
    aspect-ratio: 1/1;
    object-fit: cover;
}

.wrapper {
    position: unset !important;
}
</style>
