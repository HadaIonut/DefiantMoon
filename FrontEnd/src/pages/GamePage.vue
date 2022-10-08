<script setup lang="ts">
import {useUsersStore} from '../stores/users'
import {useWindowsStore} from '../stores/windows'

const usersStore = useUsersStore()
const windowStore = useWindowsStore()
</script>

<template>
    <div class="page-container">
        <span style="user-select: none">
            you are now logged in, poggers {{ usersStore.currentUser.name }}
        </span>

        <ActionsSidebar/>

        <div class="windows-container">
            <div v-auto-animate>
                <WindowComponent v-for="(window, key) in windowStore.$state" :key="key" :windowData="window"
                                 :windowKey="key">
                    <template #header>
                        <WindowHeaderRenderer :componentToRender="window.header.componentType"
                                              :headerData="window.header.componentData"/>
                    </template>
                    <template #body>
                        <WindowBodyRenderer :componentToRender="window.body.componentType" :windowData="window"/>
                    </template>
                </WindowComponent>
            </div>
        </div>
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

.windows-container {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;

    & > * {
        pointer-events: all;
    }
}
</style>
