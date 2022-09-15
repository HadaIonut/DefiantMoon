<script setup lang="ts">
import DropdownComponent from '../components/DropdownComponent.vue'
import InputComponent from '../components/InputComponent.vue'
import {ref} from 'vue'
import {apiClient} from '../api/index'
import {AvailableUser} from '../api/generated'

const players = ref(['Ionut', 'Claudiu', 'Marian', 'Bogdan', 'Ana', 'Cristi'])

apiClient.getAvailableUsers()
    .then(({data}) => {
        players.value = (data.users || []).map((user: AvailableUser) => user.username)
        console.log(players)
    })

const onDropdownChange = (newValue: string) => console.log(newValue)
</script>

<template>
    <div class="page-container">
        <div class="login-form-container">
            <div class="form-option">
                <span class="form-label">Select user</span>
                <DropdownComponent :options="players" @change="onDropdownChange"/>
            </div>

            <div class="form-option">
                <span class="form-label">User Password</span>
                <InputComponent type="password"/>
            </div>

            <div class="join-container">
                <button class="button">Join Game</button>
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

}

.login-form-container {
    width: 70%;
    background: $tertiary;
    border: 1px solid $secondary;
    padding: 16px;
    border-radius: 16px;
}

.join-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}

.form-option {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .form-label {
        width: 30%;
    }
}

.button {
    padding: 16px;
    background: $primary;
    color: $text;
    border-radius: 12px;
    cursor: pointer;
    border: 1px solid $primary;
    font-weight: bold;
    transition: background-color 90ms ease-in-out, color 0.2s ease-in;

    &:hover {
        background-color: $brighter-primary;
    }

    &:active {
        background-color: $tertiary;
        color: $text;
    }
}
</style>
