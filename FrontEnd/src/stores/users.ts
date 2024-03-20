import {defineStore} from 'pinia'
import {User, UsersStore} from 'src/types/users'
import {rtFetch} from 'src/utils/fetchOverRTC'

export const useUsersStore = defineStore('users', {
  state: (): UsersStore => {
    return {
      currentUser: {
        name: '',
        id: '',
      },
      loggedInUsers: [],
      allUsers: [],
    }
  },
  actions: {
    async loginUser(loginData: LoginRequest): Promise<User | null> {
      this.currentUser.name = loginData.username ?? ''

      try {
        const {data} = await rtFetch({
          route: '/api/auth/login',
          method: 'POST',
          body: loginData,
        })
        // @ts-ignore
        this.currentUser.id = data.accessToken

        return this.currentUser
      } catch (e) {
        return null
      }
    },
    clearUser() {
      this.currentUser.name = ''
      this.currentUser.id = ''
    },
    async getWorldUsers() {
      const users = (await rtFetch({
        route: '/api/users',
        method: 'GET',
      })).data.users ?? []
      this.allUsers = users.map((user: AvailableUser) => ({id: user.id, name: user.username}))
    },
  },
  persist: true,
})
