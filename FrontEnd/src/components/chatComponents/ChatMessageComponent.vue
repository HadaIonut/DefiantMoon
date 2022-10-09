<script setup lang="ts">
import {ChatMessage} from 'types/ChatMessage'

const props = defineProps<{
    message: ChatMessage
}>()

</script>

<template>
    <div class="message-row" :key="message.timestamp">
        <div class="message message-right">
            <div class="message-sender">
                {{props.message.from ?? 'undefined'}}
            </div>

            <div class="message-content " v-html="props.message.text"></div>

            <img class="chat-image" v-for="image in message.images" :src="image" alt="">
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-image {
    width: 50%;
}

.message-row {
    margin-bottom: 6px;
    display: flex;
    flex-direction: column;
}

.message {
    background-color: $lighter-secondary;
    max-width: 70%;
    padding: 10px;
    border-radius: 12px;
}

.message-right {
    align-self: end;
    background-color: $primary;
    color: $secondary;
}

.message-sender {
    font-size: 13px;
    font-weight: bold;
    margin-bottom: 5px;
}

.message-content {
    &::v-deep(*) {
        margin: 0;
        padding: 0;
    }
}
</style>
