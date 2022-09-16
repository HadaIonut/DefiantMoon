import {createApp} from 'vue'
import './style.scss'
import App from './App.vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import FontAwesomeIcon from './font-awsome'
import VueClickAwayPlugin from 'vue3-click-away'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const MainPage = () => import('./pages/MainPage.vue')
const GamePage = () => import('./pages/GamePage.vue')

const routes = [
    {path: '/', component: MainPage},
    {path: '/game', component: GamePage},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueClickAwayPlugin)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
