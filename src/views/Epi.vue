<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Cadastro de EPIs</h1>
      <p>Gerencie o catálogo de equipamentos de proteção individual.</p>
    </header>

    <!-- CARD DE FORMULÁRIO -->
    <div class="card card-form">
      <div class="card-header">
        <h2>{{ editandoId ? 'Editar EPI' : 'Novo EPI' }}</h2>
      </div>
      
      <div class="main-form">
        <div class="form-row">
          <div class="form-group">
            <label>Nome do EPI</label>
            <input v-model="form.nome" placeholder="Ex: Capacete de Segurança" />
          </div>
          <div class="form-group">
            <label>Número CA</label>
            <input v-model="form.ca" placeholder="Ex: 12345" />
          </div>
        </div>

        <div class="form-row" :class="{ 'single-col': editandoId }">
          <div class="form-group">
            <label>Descrição</label>
            <input v-model="form.descricao" placeholder="Descrição do equipamento..." />
          </div>
          <div class="form-group" v-if="!editandoId">
            <label>Quantidade inicial</label>
            <input type="number" v-model.number="form.quantidade_inicial" min="0" />
          </div>
        </div>

        <div class="action-bar">
          <button 
            class="btn btn-primary" 
            @click="salvar" 
            :disabled="!form.nome || !form.ca"
          >
            {{ editandoId ? 'Salvar Alterações' : 'Cadastrar EPI' }}
          </button>
          
          <button v-if="editandoId" class="btn btn-outline" @click="cancelarEdicao">
            Cancelar
          </button>
        </div>

        <p class="msg erro-msg" v-if="erro">{{ erro }}</p>
        <p class="msg success-msg" v-if="ok">Operação realizada com sucesso!</p>
      </div>
    </div>

    <!-- CARD DE LISTAGEM -->
    <div class="card card-table">
      <div class="card-header">
        <h2>Equipamentos Cadastrados</h2>
      </div>
      
      <div class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CA</th>
              <th>Descrição</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="epi in epis" :key="epi.id">
              <td>
                <div class="td-name">
                  <span class="badge-blue">EPI</span>
                  <span class="text-bold">{{ epi.nome }}</span>
                </div>
              </td>
              <td><code class="ca-code">{{ epi.ca }}</code></td>
              <td class="cargo-text">{{ epi.descricao || '—' }}</td>
              <td class="text-center">
                <!-- TEXTO EDITAR E EXCLUIR FORÇADO AQUI -->
                <button class="btn-text edit" @click="prepararEdicao(epi)">
                  EDITAR
                </button>
                <button class="btn-text delete" @click="excluir(epi.id)">
                  EXCLUIR
                </button>
              </td>
            </tr>
            <tr v-if="epis.length === 0">
              <td colspan="4" class="text-center empty-state">Nenhum equipamento encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '@/composables/useSupabase'

const { supabase } = useSupabase()
const epis = ref([])
const loading = ref(true)
const erro = ref('')
const ok = ref(false)
const editandoId = ref(null)
const form = ref({ nome: '', ca: '', descricao: '', quantidade_inicial: 0 })

async function carregar() {
  loading.value = true
  const { data, error } = await supabase.from('epis').select('*').order('nome')
  if (error) erro.value = error.message
  else epis.value = data || []
  loading.value = false
}

function prepararEdicao(epi) {
  editandoId.value = epi.id
  form.value = { nome: epi.nome, ca: epi.ca, descricao: epi.descricao, quantidade_inicial: 0 }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelarEdicao() {
  editandoId.value = null
  form.value = { nome: '', ca: '', descricao: '', quantidade_inicial: 0 }
}

async function salvar() {
  erro.value = ''; ok.value = false
  if (editandoId.value) {
    const { error } = await supabase.from('epis').update({ 
      nome: form.value.nome, ca: form.value.ca, descricao: form.value.descricao 
    }).eq('id', editandoId.value)
    if (error) { erro.value = error.message; return }
  } else {
    const { data: novo, error: err } = await supabase.from('epis').insert({ 
      nome: form.value.nome, ca: form.value.ca, descricao: form.value.descricao 
    }).select().single()
    if (err) { erro.value = err.message; return }
    await supabase.from('estoque').insert({ epi_id: novo.id, quantidade: form.value.quantidade_inicial || 0 })
  }
  ok.value = true; cancelarEdicao(); await carregar()
  setTimeout(() => ok.value = false, 3000)
}

async function excluir(id) {
  if (confirm('Deseja excluir?')) {
    const { error } = await supabase.from('epis').delete().eq('id', id)
    if (error) erro.value = error.message
    else await carregar()
  }
}

onMounted(carregar)
</script>

<style scoped>
/* FUNDO BRANCO E TOPO */
.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #ffffff;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.header-section { margin-bottom: 20px; }
.header-section h1 { font-size: 1.8rem; color: #0f172a; margin: 0; }
.header-section p { color: #64748b; font-size: 0.9rem; margin-top: -5px; }
.header-section h1 { 
  color: #0f172a; 
  font-size: 1.5rem; 
  font-weight: 700;
  /* Ajuste o valor abaixo para aumentar ou diminuir o espaço */
  margin-bottom: 12px; 
}

/* CARDS */
.card {
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  overflow: hidden;
}

.card-header {
  background: #f8fafc;
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.card-header h2 { font-size: 0.75rem; color: #64748b; text-transform: uppercase; margin: 0; }

.main-form { padding: 20px; }

/* FORMULÁRIO */
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 0.8rem; font-weight: bold; color: #475569; }
input { padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem; }

/* BOTÕES DE FORMULÁRIO */
.action-bar { display: flex; gap: 10px; }
.btn { padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; border: none; font-size: 0.85rem; }
.btn-primary { background: #2563eb; color: white; }
.btn-outline { background: white; border: 1px solid #cbd5e1; color: #64748b; }

/* TABELA */
.table-container { width: 100%; overflow-x: auto; }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { background: #f8fafc; padding: 12px 20px; text-align: left; font-size: 0.75rem; color: #64748b; border-bottom: 1px solid #edf2f7; }
.styled-table td { padding: 14px 20px; border-top: 1px solid #f1f5f9; font-size: 0.9rem; color: #334155; }

/* BOTÕES EDITAR E EXCLUIR (TEXTO) */
.btn-text {
  background: none;
  border: none;
  font-weight: 800; /* Bem negrito */
  font-size: 0.75rem;
  cursor: pointer;
  padding: 5px 10px;
  transition: 0.2s;
  letter-spacing: 0.05em;
}

.edit { color: #2563eb; margin-right: 10px; }
.edit:hover { background: #eff6ff; border-radius: 4px; }

.delete { color: #be123c; }
.delete:hover { background: #fff1f2; border-radius: 4px; }

/* ELEMENTOS VISUAIS */
.td-name { display: flex; align-items: center; gap: 8px; }
.text-bold { font-weight: 600; color: #0f172a; }
.badge-blue { background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: bold; }
.ca-code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #0369a1; font-weight: bold; }
.text-center { text-align: center; }
</style>