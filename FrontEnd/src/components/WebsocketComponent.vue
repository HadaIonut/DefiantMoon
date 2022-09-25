<script setup lang="ts">
    import {websocket} from "../websocket/websocket";
    import {ref} from "vue";
    import {WEBSOCKET_EVENTS} from "../websocket/events";

    const onClick = () => {
        websocket.sendMessage(WEBSOCKET_EVENTS.MESSAGE, "claudiu")
    };

    const chat = ref("");

    const onChatMessage: WebsocketMessageCallback = (message) => {
        console.log(message);
        chat.value += message + " ";
    };

    websocket.addEventListener(WEBSOCKET_EVENTS.MESSAGE, onChatMessage);
</script>

<template>
    <div>
        {{chat}}
        <button @click="onClick">Send message</button>
    </div>
</template>

<style scoped lang="scss">

</style>
