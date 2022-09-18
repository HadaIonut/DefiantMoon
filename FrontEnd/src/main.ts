import {createApp} from 'vue'
import './style.scss'
import App from './App.vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'
import FontAwesomeIcon from './font-awsome'
import VueClickAwayPlugin from 'vue3-click-away'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Toast, {POSITION} from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './styles/toastNotifications.scss'
import {createI18n} from 'vue-i18n'
import {translations} from './translations/translations'

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

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: translations,
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

const toastOptions = {
    position: POSITION.TOP_LEFT,
    hideProgressBar: true,
    transition: 'Vue-Toastification__slideBlurred',
    toastClassName: 'notification',
}

app.use(pinia)
app.use(router)
app.use(VueClickAwayPlugin)
app.use(Toast, toastOptions)
app.use(i18n)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#app')
