import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AppLayout from '@/components/AppLayout.vue'
import Funcionarios from '@/views/Funcionarios.vue'
import EntregaEpi from '@/views/EntregaEpi.vue'
import Epi from '@/views/Epi.vue'
import { useSupabase } from '@/composables/useSupabase'
import MovimentacaoEpis from '../views/MovimentacaoEpis.vue'
import Estoque from '../views/Estoque.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/Login', component: Login },
  {
    path: '/AppLayout',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'Funcionarios', component: Funcionarios },
      { path: 'EntregaEpi', component: EntregaEpi },
     {
  path: '/AppLayout/MovimentacaoEpis',
  name: 'MovimentacaoEpis',
  component: MovimentacaoEpis // Deve ser o mesmo nome que você importou acima
},
      { path: 'Estoque', component: Estoque },
      { path: 'Epi', component: Epi },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
export default router