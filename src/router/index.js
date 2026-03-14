import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Cadastro from '../views/Cadastro.vue'
import Relatorio from '../views/Relatorio.vue'

const routes = [
{ path: '/', component: Home },
{ path: '/Login', component: Login },
{ path: '/Cadastro', component: Cadastro },
{ path: '/Relatorio', component: Relatorio }
]

const router = createRouter({
history: createWebHistory(),
routes
})
export default router