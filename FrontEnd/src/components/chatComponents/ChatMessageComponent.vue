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
        <span :key="message.timestamp">
            {{ getFormattedTextMessage(message) }}
            <img class="chat-image" v-for="image in message.images" :src="image" alt="">
        </span>
    </div>
</template>

<style scoped lang="scss">
.chat-image {
    width: 50%;
    aspect-ratio: 1;
}
</style>
