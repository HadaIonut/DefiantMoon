<script setup lang="ts">
import {onBeforeMount, onMounted} from 'vue'
import {initWebRTCClient} from 'src/utils/fetchOverRTC'

onBeforeMount(async () => {
  await initWebRTCClient('server')
})

</script>

<template>
    <router-view></router-view>
</template>

<style scoped>

</style>
