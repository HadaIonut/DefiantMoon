<script setup lang="ts">
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
</script>

<template>
    <div class="chat">
        <div class="chat-content">

        </div>
        <div class="chat-input">
            <QuillEditor theme="bubble"/>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat {
    height: 100%;
}
.chat-content {
    border: 1px solid $background;
    margin-bottom: 15px;
}
.chat-input {
    width: 100%;
    border: 1px solid $background;
    background: $darker-secondary;
    border-radius: 10px;
}
</style>
