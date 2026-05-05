<template>
  <!-- Tela principal -->
  <div class="layout-container">

    <!-- Título da página -->
    <header class="header-section">
      <h1>Entregas de EPI</h1>
      <p>Registro de entrega de equipamentos aos funcionários</p>
    </header>

    <!-- Formulário de nova entrega -->
    <div class="card-form">
      <div class="card-header">
        <h2>Nova Entrega</h2>
      </div>

      <div class="main-form">

        <!-- Seleção de funcionário e EPI -->
        <div class="form-row">
          <div class="form-group">
            <label>Funcionário</label>

            <!-- Guarda o ID do funcionário selecionado -->
            <select v-model="form.funcionario_id" class="custom-select">
              <option value="">Selecione o funcionário...</option>

              <!-- Lista os funcionários cadastrados -->
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">
                {{ f.nome }} — {{ f.setor }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>EPI</label>

            <!-- Guarda o ID do EPI selecionado -->
            <select v-model="form.epi_id" class="custom-select">
              <option value="">Selecione o EPI...</option>

              <!-- Lista os EPIs com saldo disponível -->
              <option v-for="e in epis" :key="e.id" :value="e.id">
                {{ e.nome }} (Saldo: {{ estoqueMap[e.id] ?? 0 }})
              </option>
            </select>
          </div>
        </div>

        <!-- Dados da entrega -->
        <div class="form-row cols-3">
          <div class="form-group">
            <label>Quantidade</label>

            <!-- Quantidade entregue -->
            <input type="number" v-model.number="form.quantidade_entregue" min="1" />
          </div>

          <div class="form-group">
            <label>Data de Entrega</label>

            <!-- Data da entrega -->
            <input type="date" v-model="form.data_entrega" />
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">

              <!-- Confirma assinatura digital -->
              <input type="checkbox" v-model="form.assinatura_digital" />
              Assinatura digital confirmada
            </label>
          </div>
        </div>

        <!-- Botão de registro -->
        <div class="action-bar">
          <button 
            class="btn btn-primary" 
            @click="registrar" 
            :disabled="!form.funcionario_id || !form.epi_id || loading"
          >
            Registrar Entrega
          </button>
        </div>

        <!-- Mensagens do sistema -->
        <p class="error-msg" v-if="erro">⚠ {{ erro }}</p>
        <p class="success-msg" v-if="ok">✓ Entrega registrada com sucesso!</p>
      </div>
    </div>

    <!-- Histórico de entregas -->
    <div class="card-table">
      <div class="card-header flex-between">
        <h2>Histórico de Entregas</h2>

        <!-- Total de registros -->
        <span class="badge badge-blue">{{ entregas.length }} registros</span>
      </div>

      <!-- Carregamento -->
      <div v-if="loading" class="text-center-loading">Carregando dados...</div>
      
      <!-- Tabela de entregas -->
      <div v-else class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>EPI</th>
              <th>Qtd</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <!-- Lista cada entrega -->
            <tr v-for="e in entregas" :key="e.id">
              <td>
                <div class="text-bold">{{ e.funcionarios?.nome }}</div>
                <div class="cargo-text">{{ e.funcionarios?.setor }}</div>
              </td>

              <td>
                <div class="text-bold">{{ e.epis?.nome }}</div>
                <div class="cargo-text">CA: {{ e.epis?.ca }}</div>
              </td>

              <td class="text-bold">{{ e.quantidade_entregue }}</td>
              <td class="cargo-text">{{ formatarData(e.data_entrega) }}</td>

              <td>
                <!-- Status da assinatura -->
                <span :class="e.assinatura_digital ? 'badge badge-ok' : 'badge badge-warn'">
                  {{ e.assinatura_digital ? 'Confirmada' : 'Pendente' }}
                </span>
              </td>
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

// REATIVIDADE - Inicializando corretamente para evitar o erro "undefined"
const funcionarios = ref([])
const epis = ref([])
const entregas = ref([])
const estoqueMap = ref({})
const loading = ref(true)
const erro = ref('')
const ok = ref(false)

const hoje = new Date().toISOString().slice(0, 10)

// O objeto 'form' deve estar EXATAMENTE assim
const form = ref({ 
  funcionario_id: '', 
  epi_id: '', 
  quantidade_entregue: 1, 
  data_entrega: hoje, 
  assinatura_digital: false 
})

async function carregar() {
  loading.value = true
  try {
    const { data: funcs } = await supabase.from('funcionarios').select('*').order('nome')
    funcionarios.value = funcs || []

    const { data: episData } = await supabase.from('epis').select('*').order('nome')
    epis.value = episData || []

    const { data: estoqueData } = await supabase.from('estoque').select('epi_id, quantidade')
    if (estoqueData) {
      estoqueMap.value = Object.fromEntries(estoqueData.map(e => [e.epi_id, e.quantidade]))
    }

    const { data: entData } = await supabase
      .from('entregas')
      .select('*, funcionarios(nome, setor), epis(nome, ca)')
      .order('created_at', { ascending: false })
    entregas.value = entData || []
  } catch (e) {
    erro.value = e.message
  } finally {
    loading.value = false
  }
}

async function registrar() {
  erro.value = ''; ok.value = false
  const qtdEstoque = estoqueMap.value[form.value.epi_id] ?? 0
  
  if (form.value.quantidade_entregue > qtdEstoque) {
    erro.value = `Estoque insuficiente (${qtdEstoque} disponíveis)`; return
  }

  const { error } = await supabase.from('entregas').insert(form.value)
  if (error) { erro.value = error.message; return }

  // Baixa no estoque
  await supabase.from('estoque')
    .update({ quantidade: qtdEstoque - form.value.quantidade_entregue })
    .eq('epi_id', form.value.epi_id)

  ok.value = true
  form.value = { funcionario_id: '', epi_id: '', quantidade_entregue: 1, data_entrega: hoje, assinatura_digital: false }
  await carregar()
}

function formatarData(d) {
  if (!d) return '—'
  const [y, m, dia] = d.split('-')
  return `${dia}/${m}/${y}`
}

onMounted(carregar)
</script>

<style scoped>
.layout-container { width: 100%; padding: 20px 30px; background-color: #ffffff; min-height: 100vh; box-sizing: border-box; }
.header-section { margin-bottom: 25px; }
.header-section h1 { color: #0f172a; font-size: 1.5rem; font-weight: 700; margin: 0; }
.card-form, .card-table { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px; width: 100%; overflow: hidden; }
.card-header { background-color: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.main-form { padding: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.cols-3 { grid-template-columns: 1fr 1fr 1.2fr; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
label { font-size: 0.8rem; font-weight: 600; color: #334155; }
input, .custom-select { padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; }
.btn-primary { background: #0f172a; color: white; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; }
.table-container { width: 100%; overflow-x: auto; }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { background: #f8fafc; padding: 14px 20px; text-align: left; font-size: 0.75rem; color: #475569; border-bottom: 2px solid #f1f5f9; }
.styled-table td { padding: 14px 20px; border-top: 1px solid #f1f5f9; font-size: 0.875rem; }
.badge { padding: 3px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
.badge-blue { background: #e0f2fe; color: #0369a1; }
.badge-ok { background: #dcfce7; color: #166534; }
.badge-warn { background: #fef9c3; color: #854d0e; }
.text-bold { font-weight: 600; }
.cargo-text { color: #64748b; font-size: 0.8rem; }
.text-center-loading { padding: 40px; text-align: center; }
</style>
