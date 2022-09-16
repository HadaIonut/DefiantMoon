<script setup lang="ts">
import NotificationComponent from 'components/NotificationComponent.vue'


</script>

<template>
    <div class="notification-container">
        <NotificationComponent v-for="notification in props.notifications" :key="notification.message" :type="notification.type" :message="notification.message" :neverDisappear="notification.neverDisappear"/>
    </div>
</template>

<style scoped lang="scss">

</style>
