<script setup lang="ts">
import {ChatMessage} from 'types/ChatMessage'

const props = defineProps<{
    message: ChatMessage
}>()

const getFormattedTextMessage = (chatMessage: ChatMessage) => {
    return `${chatMessage.from}: ${chatMessage.text}`
}

</script>

<template>
    <div class="message-row" :key="message.timestamp">
        <div class="message">
            <span>{{props.message.from ?? 'undefined'}} </span>

            <div style="display:flex; align-items: center">
                <span class="message-content" v-html="props.message.text"></span>
            </div>
            <img class="chat-image" v-for="image in message.images" :src="image" alt="">
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-image {
    width: 50%;
    aspect-ratio: 1;
}

.message-row {
    margin-bottom: 6px;
    display: flex;
    flex-direction: column;
}

.message {
    background-color: $lighter-secondary;
    width: 70%;
    padding: 10px;
}

.message-right {
    justify-self: end;
}

.message-content {
    &::v-deep(*) {
        margin: 0;
        padding: 0;
    }
}
</style>
