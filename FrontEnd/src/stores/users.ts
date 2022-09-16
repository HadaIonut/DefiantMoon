import {defineStore} from 'pinia'
import {LoginRequest} from 'api/generated'
import {apiClient} from '../api/index'
import {UsersStore} from 'types/users'

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
        async updateCurrentUser(loginData: LoginRequest) {
            this.currentUser.name = loginData.username ?? ''

            try {
                const {data} = await apiClient.login(loginData)
                this.currentUser.id = data.accessToken

                return this.currentUser
            } catch (e) {
                console.log('login failed')
                return
            }
        },
    },
    persist: true,
})
