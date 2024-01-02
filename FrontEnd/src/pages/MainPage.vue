<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {apiClient} from '../api/index'
import {DropdownOption} from 'types/Dropdown'
import {LoginRequest} from 'api/generated'
import {useUsersStore} from '../stores/users'
import {useRouter} from 'vue-router'
import {useToast} from 'vue-toastification'
import {useI18n} from 'vue-i18n'
import {Peer} from 'peerjs'

const players = ref<DropdownOption[]>([])
const loginData = ref<LoginRequest>({username: '', password: ''})
const usersStore = useUsersStore()
const router = useRouter()
const toast = useToast()
const {t} = useI18n()

onMounted(() => usersStore.clearUser())

// apiClient.getAvailableUsers().then(({data}) => {
//   players.value = data?.users?.map?.((user) => ({optionName: user.username, id: user.id})) ?? []
// })

const onDropdownChange = (newValue: DropdownOption) => loginData.value.username = newValue.optionName
const onInputChange = (newValue: string) => loginData.value.password = newValue
const login = async () => {
  if (loginData.value.username === '') return toast.error(t('notifications.noUser'))
  const loginResult = await usersStore.loginUser(loginData.value)

  try {
    console.log(await apiClient.getUserProfile())
  } catch (e) {
    console.log(e)
  }

  if (loginResult) return await router.push('/game')
  toast.error(t('notifications.wrongPassword'))
}

const dropdownInitialValue = computed(() => {
  return {
    optionName: t('login.userDropdown.initialValue'),
    id: '0',
  } as DropdownOption
})

const initPeer = () => {
  const peer = new Peer('', {
    debug: 3,
    config: {
      'iceServers': [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'TURN:freeturn.net:3478', username: 'free', credential: 'free'},
      ],
    },
    host: 'ionut.xeosmarthome.com',
    port: 80,
    path: '/',
    secure: false,
  })

  peer.on('open', (id) => {
    console.log(id)

    const conn = peer.connect('server', {serialization: 'raw'})

    conn.on('open', () => {
      console.log('sent')
      conn.send('hello from the browser side')
    })

    conn.on('data', function(data) {
      // Will print 'hi!'
      console.log(data)
    })
  })
}

initPeer()

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
