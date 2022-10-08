<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {apiClient} from '../api/index'
import {DropdownOption} from 'types/Dropdown'
import {LoginRequest} from 'api/generated'
import {useUsersStore} from '../stores/users'
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'
import {useI18n} from 'vue-i18n'

const players = ref<DropdownOption[]>([])
const loginData = ref<LoginRequest>({username: '', password: ''})
const usersStore = useUsersStore()
const router = useRouter()
const toast = useToast()
const {t} = useI18n()

onMounted(() => usersStore.clearUser())

apiClient.getAvailableUsers().then(({data}) => {
    players.value = data?.users?.map?.((user) => ({optionName: user.username, id: user.id})) ?? []
})

const onDropdownChange = (newValue: DropdownOption) => loginData.value.username = newValue.optionName
const onInputChange = (newValue: string) => loginData.value.password = newValue
const login = async () => {
    if (loginData.value.username === '') return toast.error(t('notifications.noUser'))
    const loginResult = await usersStore.loginUser(loginData.value)
    console.log(await apiClient.getUserProfile())

    if (loginResult) return await router.push('/game')
    toast.error(t('notifications.wrongPassword'))
}
const dropdownInitialValue = computed(() => {
    return {
        optionName: t('login.userDropdown.initialValue'),
        id: '0',
    } as DropdownOption
})

</script>

<template>
    <div class="page-container">
        <div class="login-form-container">
            <FormOptionComponent :label="$t('login.userDropdown.label')">
                <DropdownComponent :options="players" :initial="dropdownInitialValue" @change="onDropdownChange"/>
            </FormOptionComponent>

            <FormOptionComponent :label="$t('login.userPassword.label')">
                <InputComponent type="password" :placeholder="$t('login.userPassword.placeholder')" @change="onInputChange"/>
            </FormOptionComponent>

            <div class="join-container">
                <ButtonComponent :content="$t('login.enterButton.label')" @click="login"/>
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
    border: 1px solid $accent;
    padding: 16px;
    border-radius: 16px;
}

.join-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
}
</style>
