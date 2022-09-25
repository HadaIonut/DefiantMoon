<script setup lang="ts">
import {useUsersStore} from '../stores/users'
import ActionsSidebar from '../components/ActionsSidebar.vue'
import WindowComponent from '../components/WindowComponent.vue'
import {useWindowsStore} from '../stores/windows'
import WindowHeaderRenderer from '../components/windowHeaders/WindowHeaderRender.vue'
import WindowBodyRenderer from '../components/windowBodies/WindowBodyRenderer.vue'

const usersStore = useUsersStore()
const windowStore = useWindowsStore()
const stuff = []
</script>

<template>
    <div class="page-container">
        <span style="user-select: none">
            you are now logged in, poggers {{ usersStore.currentUser.name }}
        </span>

        <ActionsSidebar/>

        <WindowComponent v-for="(window, key) in windowStore.$state" :key="key" :windowData="window">
            <template v-slot:header>
                <WindowHeaderRenderer :componentToRender="window.header.componentType"
                                      :headerData="window.header.componentData"/>
            </template>
            <template v-slot:body>
                <WindowBodyRenderer :componentToRender="window.body.componentType"/>
            </template>
        </WindowComponent>
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
    overflow: hidden;
}
</style>
