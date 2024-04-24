<script setup lang="ts">
import {onBeforeMount, onMounted} from 'vue'
import {useUsersStore} from 'src/stores/users'
import {useWindowsStore} from 'src/stores/windows'
import {WindowStore} from 'src/types/windows'
import {initWebRTCClient} from 'src/utils/fetchOverRTC'

const usersStore = useUsersStore()
const windowStore = useWindowsStore()
const windowObject: WindowStore = windowStore.$state

onBeforeMount(async () => {
  await initWebRTCClient('server')

  await usersStore.getWorldUsers()
})
</script>

<template>
  <div class="page-container">
    <PlayArea/>

    <ActionsSidebar/>

    <div class="windows-container">
      <div v-auto-animate>
        <WindowComponent v-for="(window, key) in windowObject" :key="key" :windowData="window"
                         :windowKey="key">
          <template #header>
            <WindowHeaderRenderer :componentToRender="window.header.componentType"
                                  :headerData="window.header.componentData"/>
          </template>
          <template #header-actions>
            <WindowActionsRender :componentToRender="window.headerActions.componentType"
                                 :headerData="window.headerActions.componentData"
                                 :windowKey="key"/>
          </template>
          <template #body>
            <WindowBodyRenderer :componentToRender="window.body.componentType" :windowData="window"
                                :bodyData="window.body.componentData"/>
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
