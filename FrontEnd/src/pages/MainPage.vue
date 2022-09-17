<script setup lang="ts">
import DropdownComponent from '../components/DropdownComponent.vue'
import InputComponent from '../components/InputComponent.vue'
import ButtonComponent from '../components/ButtonComponent.vue'
import {onMounted, ref} from 'vue'
import {apiClient} from '../api/index'
import {DropdownOption} from 'types/Dropdown'
import {LoginRequest} from 'api/generated'
import {useUsersStore} from '../stores/users'
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'

const players = ref<DropdownOption[]>([])
const loginData = ref<LoginRequest>({username: '', password: ''})
const usersStore = useUsersStore()
const router = useRouter()
const toast = useToast()

onMounted(() => usersStore.clearUser())

apiClient.getAvailableUsers().then(({data}) => {
    players.value = data?.users?.map?.((user) => ({optionName: user.username, id: user._id})) ?? []
})

const onDropdownChange = (newValue: DropdownOption) => loginData.value.username = newValue.optionName
const onInputChange = (newValue: string) => loginData.value.password = newValue
const login = async () => {
    const loginResult = await usersStore.loginUser(loginData.value)

    if (loginResult) await router.push('/game')
}

const testButton = () => {
    toast('poggers', {
        toastClassName: 'my-custom-toast-class',
    })
    toast.info('poggers', {
        toastClassName: 'my-custom-toast-class',
    })
    toast.success('poggers', {
        toastClassName: 'my-custom-toast-class',
    })
    toast.error('poggers', {
        toastClassName: 'my-custom-toast-class',
    })
    toast.warning('poggers', {
        toastClassName: 'my-custom-toast-class',
    })
}
</script>

<template>
    <div class="page-container">
        <div class="login-form-container">
            <div class="form-option">
                <span class="form-label">Select user</span>
                <DropdownComponent :options="players" :initial="players[0]" @change="onDropdownChange"/>
            </div>

            <div class="form-option">
                <span class="form-label">User Password</span>
                <InputComponent type="password" @change="onInputChange"/>
            </div>

            <div class="join-container">
                <ButtonComponent content="Join the game" @click="login"/>
            </div>
        </div>

        <button @click="testButton">test</button>
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
    border: 1px solid $accent;
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
</style>
