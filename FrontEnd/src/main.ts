import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import {createPinia} from 'pinia'

const MainPage = () => import('./pages/MainPage.vue')

const routes = [
  {path: '/', component: MainPage},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
