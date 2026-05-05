import { createRouter, createWebHistory } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'
import LoginView from '@/views/LoginView.vue'
import AppLayout from '@/components/AppLayout.vue'
import FuncionariosView from '@/views/FuncionariosView.vue'
import EntregaEpiView from '@/views/EntregaEpiView.vue'
import RelatorioView from '@/views/RelatorioView.vue'

// ===== DEFINIÇÃO DAS ROTAS =====
// Array com todas as rotas da aplicação
// Cada rota tem: path (URL), component (componente Vue), children (rotas filhas)
const routes = [
  // ===== ROTA 1: LOGIN =====
  // Esta é a página de login (sem proteção)
  // Qualquer pessoa pode acessar
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },

  // ===== ROTA 2: LAYOUT PRINCIPAL (COM SIDEBAR) =====
  // Esta é a rota raiz (/)
  // Contém a Sidebar e as rotas filhas
  // Rotas filhas (children) aparecem dentro do RouterView da AppLayout
  {
    path: '/',
    component: AppLayout,
    // meta: { requiresAuth: true } = esta rota precisa de autenticação
    // O navigation guard verifica isso
    meta: { requiresAuth: true },
    
    // ===== ROTAS FILHAS (CHILDREN) =====
    // Estas rotas aparecem dentro do AppLayout
    // Quando o usuário clica no menu, essas páginas aparecem no conteúdo
    children: [
      // ===== ROTA FILHA 1: FUNCIONÁRIOS =====
      {
        path: 'funcionarios',
        name: 'Funcionarios',
        component: FuncionariosView
      },

      // ===== ROTA FILHA 2: ENTREGAS =====
      {
        path: 'entregas',
        name: 'Entregas',
        component: EntregaEpiView
      },

      // ===== ROTA FILHA 3: RELATÓRIO =====
      {
        path: 'relatorio',
        name: 'Relatorio',
        component: RelatorioView
      },

      // ===== ROTA PADRÃO (REDIRECT) =====
      // Se o usuário acessar apenas /, redirecionar para /funcionarios
      {
        path: '',
        redirect: 'funcionarios'
      }
    ]
  },

  // ===== ROTA CORINGA: 404 =====
  // Se o usuário acessar uma URL que não existe, mostrar erro
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

// ===== CRIAR O ROUTER =====
// createRouter = cria o roteador com as rotas definidas
// history: createWebHistory() = usa o histórico do navegador
// routes = array com todas as rotas
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ===== NAVIGATION GUARD (PROTEÇÃO DE ROTAS) =====
// beforeEach = executa ANTES de cada navegação
// to = rota para onde o usuário quer ir
// from = rota de onde o usuário vem
// next = função para continuar a navegação
router.beforeEach(async (to, from, next) => {
  // ===== PASSO 1: VERIFICAR SE A ROTA PRECISA DE AUTENTICAÇÃO =====
  // to.meta.requiresAuth = verifica se a rota tem meta.requiresAuth = true
  // Se não tem, significa que é uma rota pública (como login)
  const requiresAuth = to.meta.requiresAuth

  // ===== PASSO 2: VERIFICAR SE O USUÁRIO ESTÁ AUTENTICADO =====
  // Pegar o cliente Supabase
  const { supabase } = useSupabase()

  // Verificar a sessão do usuário
  // getSession() = retorna a sessão atual do usuário
  // Se não há sessão, o usuário não está autenticado
  const { data: { session } } = await supabase.auth.getSession()

  // ===== PASSO 3: LÓGICA DE PROTEÇÃO =====
  // Se a rota precisa de autenticação
  if (requiresAuth) {
    // E o usuário NÃO está autenticado
    if (!session) {
      // Redirecionar para login
      next('/login')
    } else {
      // Usuário está autenticado, permitir acesso
      next()
    }
  } else {
    // Rota não precisa de autenticação
    // Se o usuário está autenticado E está tentando acessar login
    if (session && to.path === '/login') {
      // Redirecionar para a página inicial
      next('/')
    } else {
      // Permitir acesso
      next()
    }
  }
})

// ===== EXPORTAR O ROUTER =====
// Exportar o router para usar em main.js
export default router


