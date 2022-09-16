<script setup lang="ts">
import {useUsersStore} from '../stores/users'

const usersStore = useUsersStore()

</script>

<template>
    <div class="page-container">
        you are now logged in, poggers {{usersStore.currentUser.name}}
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
}
</style>
