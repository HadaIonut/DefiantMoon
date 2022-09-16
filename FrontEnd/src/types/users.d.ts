export type User = {
    name: string,
    id: string
}

export type UsersStore = {
    currentUser: User,
    loggedInUsers: User[] | [],
    allUsers: User[] | [],
}
