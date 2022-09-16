<script setup lang="ts">
interface NotificationProps {
    type: string,
    message: string,
    neverDisappear: boolean
}

const props = defineProps<NotificationProps>()
</script>

<template>
    <div class="notification">
        <div class="message">
            {{props.message}}
        </div>
        <div class="hide-button">
            X
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
