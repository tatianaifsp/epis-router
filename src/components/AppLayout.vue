<template>
  <div class="shell">
    <!-- BARRA LATERAL (SIDEBAR) -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-icon">
          <i class="fas fa-shield-halved"></i>
        </div>
        <div class="brand-info">
          <span class="brand-name">Sistema EPI</span>
          <span class="brand-status">Gestão de Segurança</span>
        </div>
      </div>

      <nav class="menu">
        <small class="menu-label">Operacional</small>
        <RouterLink to="/AppLayout/Funcionarios" class="menu-item" active-class="active">
          <i class="fas fa-users-viewfinder"></i>
          <span>Funcionários</span>
        </RouterLink>
        <RouterLink to="/AppLayout/Epi" class="menu-item" active-class="active">
          <i class="fas fa-helmet-safety"></i>
          <span>Equipamentos</span>
        </RouterLink>
        <RouterLink to="/AppLayout/EntregaEpi" class="menu-item" active-class="active">
          <i class="fas fa-truck-ramp-box"></i>
          <span>Entregas</span>
        </RouterLink>
        
        <small class="menu-label">Administrativo</small>
        <RouterLink to="/AppLayout/Estoque" class="menu-item" active-class="active">
          <i class="fas fa-boxes-stacked"></i>
          <span>Estoque</span>
        </RouterLink>
        <RouterLink to="/AppLayout/MovimentacaoEpis" class="menu-item" active-class="active">
          <i class="fas fa-chart-pie"></i>
          <span>Relatórios</span>
        </RouterLink>
      </nav>

      <!-- RODAPÉ DA SIDEBAR COM BOTÃO SAIR -->
      <div class="sidebar-footer">
        <button @click="sair" class="botao-sair">
          <i class="fas fa-right-from-bracket"></i>
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>

    <!-- ÁREA DE CONTEÚDO PRINCIPAL -->
    <main class="conteudo">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSupabase } from '@/composables/useSupabase'

// Inicializa as ferramentas necessárias
const { supabase } = useSupabase()
const router = useRouter()

/**
 * Função para encerrar a sessão
 */
async function sair() {
  try {
    // 1. Encerra a sessão no Supabase
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // 2. Redireciona para a tela de login
    // Certifique-se que a rota no seu router se chama '/login' ou '/'
    router.push('/') 
  } catch (err) {
    console.error('Erro ao sair:', err.message)
    alert('Erro ao sair do sistema. Tente novamente.')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ===== ESTRUTURA PRINCIPAL ===== */
.shell {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 260px;
  background-color: #0f172a; /* Slate 900 */
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-header {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  background: #38bdf8;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
}

.brand-info { display: flex; flex-direction: column; }
.brand-name { font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em; }
.brand-status { font-size: 10px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

/* ===== MENU DE NAVEGAÇÃO ===== */
.menu { flex-grow: 1; padding: 12px; display: flex; flex-direction: column; gap: 4px; }

.menu-label { 
  color: #475569; 
  font-size: 11px; 
  font-weight: 700; 
  text-transform: uppercase; 
  margin: 20px 0 8px 12px; 
  letter-spacing: 0.1em;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: #94a3b8;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.menu-item i { width: 20px; font-size: 18px; text-align: center; }

.menu-item:hover { 
  background: rgba(255, 255, 255, 0.05); 
  color: #ffffff; 
}

/* ESTADO ATIVO (IGUAL AO HOVER DO SAIR) */
.menu-item.active {
  background: #38bdf8; 
  color: #0f172a;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.2);
}

/* ===== RODAPÉ E BOTÃO SAIR ===== */
.sidebar-footer { 
  padding: 20px; 
  border-top: 1px solid rgba(255, 255, 255, 0.05); 
}

.botao-sair {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* HOVER AZUL IGUAL A NAVEGAÇÃO */
.botao-sair:hover { 
  background: #38bdf8; 
  color: #0f172a;
  border-color: #38bdf8;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
}

.botao-sair:active {
  transform: translateY(0);
}

/* ===== CONTEÚDO ===== */
.conteudo {
  flex-grow: 1;
  margin-left: 260px;
  background-color: #ffffff;
  height: 100vh;
  overflow-y: auto;
  padding: 0;
}

/* Scrollbar personalizada para a sidebar */
.sidebar::-webkit-scrollbar {
  width: 4px;
}
.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
}
</style>