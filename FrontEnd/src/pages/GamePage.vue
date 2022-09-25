<script setup lang="ts">
import {useUsersStore} from '../stores/users'
import ActionsSidebar from '../components/ActionsSidebar.vue'
import WindowComponent from '../components/WindowComponent.vue'
import WebsocketComponent from '../components/WebsocketComponent.vue';

const usersStore = useUsersStore()
const stuff = []
</script>

<template>
    <div class="page-container">
        <span style="user-select: none">
            you are now logged in, poggers {{usersStore.currentUser.name}}
        </span>

        <ActionsSidebar/>
        <WindowComponent/>
        <WindowComponent/>
        <WebsocketComponent/>
    </div>
</template>

<style scoped lang="scss">
.page-container {
    width: 100vw;
    height: 100vh;
    background: $background;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text;
    position: relative;
}
</style>
