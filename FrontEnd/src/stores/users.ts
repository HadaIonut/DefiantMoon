import {defineStore} from 'pinia'
import {AvailableUser, LoginRequest} from 'api/generated'
import {apiClient} from '../api/index'
import {User, UsersStore} from 'types/users'

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
                const {data} = await apiClient.login(loginData)
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
            const users = (await apiClient.getAvailableUsers()).data.users ?? []
            this.allUsers = users.map((user: AvailableUser) => ({id: user.id, name: user.username}))
        },
    },
    persist: true,
})
