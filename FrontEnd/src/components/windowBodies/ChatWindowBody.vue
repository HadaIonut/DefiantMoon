<script setup lang="ts">
import {QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

const chatInputContent: string = ''
</script>

<template>
    <div class="chat">
        <div class="chat-content">

        </div>
        <div class="chat-input-container">
            <div class="chat-toolbar">
                a
            </div>
            <div class="chat-input">
                <QuillEditor theme="bubble" v-model="chatInputContent"/>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$chat-input-height: 80px;
$content-margin-bottom: 15px;
$parent-padding: 5px;

.chat {
    height: 100%;
}
.chat-content {
    border: 1px solid $background;
    margin-bottom: $content-margin-bottom;
    height: calc(100% - #{$chat-input-height} - #{$content-margin-bottom} - #{$parent-padding});
}
.chat-input-container {
    border: 1px solid $background;
    background: $darker-secondary;
    border-radius: 10px;
    height: $chat-input-height;
}

.ql-container {
    height: calc(100% - 36px);
}
</style>
