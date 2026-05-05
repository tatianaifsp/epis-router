<template>
  <div class="layout-container">
    <!-- Cabeçalho -->
    <header class="header-section flex-between">
      <div>
        <h1>Controle de Estoque</h1>
        <p>Gerencie o saldo e a disponibilidade de cada EPI.</p>
      </div>
      <button class="btn btn-outline flex-center" @click="carregar" :disabled="loading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 8px;">
          <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
        Atualizar
      </button>
    </header>

    <!-- Ajuste de Estoque -->
    <div class="card-form">
      <div class="card-header">
        <h2>Ajustar Quantidade</h2>
      </div>
      
      <div class="main-form">
        <div class="form-row">
          <div class="form-group">
            <label>EPI</label>
            <select v-model="form.epi_id" class="custom-select">
              <option value="">Selecione um EPI...</option>
              <option v-for="item in estoque" :key="item.id" :value="item.id">
                {{ item.epis?.nome }} (Atual: {{ item.quantidade }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Nova Quantidade em Estoque</label>
            <input type="number" v-model.number="form.quantidade" min="0" placeholder="0" />
          </div>
        </div>

        <div class="action-bar">
          <button 
            class="btn btn-primary" 
            @click="atualizar" 
            :disabled="!form.epi_id || loading"
          >
            Salvar Alteração
          </button>
        </div>

        <p class="error-msg" v-if="erro">⚠ {{ erro }}</p>
        <p class="success-msg" v-if="ok">✓ Estoque atualizado com sucesso!</p>
      </div>
    </div>

    <!-- Tabela de Saldo -->
    <div class="card-table">
      <div class="card-header flex-between">
        <h2>Itens em Estoque</h2>
        <span class="badge badge-blue">{{ estoque.length }} itens catalogados</span>
      </div>

      <div v-if="loading" class="text-center" style="padding: 40px;">
        <div class="spinner"></div> Carregando estoque...
      </div>
      
      <div v-else class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>EPI / CA</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th class="text-center">Situação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in estoque" :key="item.id">
              <td>
                <div class="text-bold">{{ item.epis?.nome }}</div>
                <div class="cargo-text">CA: {{ item.epis?.ca }}</div>
              </td>
              <td class="cargo-text">{{ item.epis?.descricao || '—' }}</td>
              <td>
                <span class="text-bold" style="font-family: monospace; font-size: 1.1rem;">
                  {{ item.quantidade }}
                </span>
              </td>
              <td class="text-center">
                <span :class="badgeClass(item.quantidade)">
                  {{ item.quantidade === 0 ? 'Sem estoque' : item.quantidade < 10 ? 'Estoque Baixo' : 'Estoque OK' }}
                </span>
              </td>
            </tr>
            <tr v-if="estoque.length === 0">
              <td colspan="4" class="text-center cargo-text" style="padding: 40px;">
                Nenhum item encontrado no estoque.
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
import { useSupabase } from '../composables/useSupabase';

const { supabase } = useSupabase();
const estoque = ref([])
const loading = ref(true)
const erro = ref('')
const ok = ref(false)
const form = ref({ epi_id: '', quantidade: 0 })

async function carregar() {
  loading.value = true
  erro.value = ''
  
  const { data, error } = await supabase
    .from('estoque')
    .select('id, quantidade, updated_at, epi_id, epis!estoque_epi_id_fkey(id, nome, ca, descricao)')
    .order('updated_at', { ascending: false })

  if (error) {
    erro.value = 'Erro ao carregar: ' + error.message
  } else {
    estoque.value = data || []
  }
  loading.value = false
}

async function atualizar() {
  erro.value = ''
  ok.value = false
  
  const { error } = await supabase
    .from('estoque')
    .update({ 
      quantidade: form.value.quantidade, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', form.value.epi_id)

  if (error) {
    erro.value = 'Erro: ' + error.message
    return
  }
  
  ok.value = true
  form.value = { epi_id: '', quantidade: 0 }
  await carregar()
  setTimeout(() => ok.value = false, 3000)
}

function badgeClass(qtd) {
  if (qtd === 0) return 'badge badge-danger'
  if (qtd < 10) return 'badge badge-warn'
  return 'badge badge-ok'
}

onMounted(carregar)
</script>

<style scoped>
/* 1. Fundo totalmente branco no container principal */
.layout-container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 10px 20px 20px 20px; /* Reduzi o padding superior de 20px para 10px */
  font-family: sans-serif; 
  background: #ffffff; /* Fundo totalmente branco */
  min-height: 100vh; 
}

/* 2. Ajuste do cabeçalho para subir o texto */
.header-section { 
  margin-bottom: 20px; 
  margin-top: 0; /* Garante que não haja margem externa no topo */
}

.header-section h1 {
  margin-top: 0; /* Remove o espaço padrão acima do título h1 */
  padding-top: 0;
  font-size: 1.8rem;
}

.header-section p {
  margin-top: -5px; /* Puxa o subtítulo levemente para mais perto do título */
  color: #64748b;
}

/* 3. Ajuste nos Cards para destacar no fundo branco */
.card { 
  background: white; 
  border: 1px solid #f1f5f9; /* Borda mais clara */
  border-radius: 12px; 
  padding: 20px; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); /* Sombra leve para não "sumir" no fundo branco */
}

.info-banner { 
  background: #f0f9ff; 
  color: #0369a1; 
  padding: 8px; 
  border-radius: 8px; 
  margin-bottom: 15px; 
  font-size: 0.8rem; 
  text-align: center; 
  border: 1px solid #e0f2fe;
}

/* Mantendo os demais estilos */
.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 25px; }
.chart-box { height: 250px; position: relative; }
.filter-card { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; font-size: 0.8rem; font-weight: bold; color: #475569; }
input, select { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
.action-bar { margin-top: 15px; display: flex; gap: 10px; }
.btn { padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; transition: 0.2s; }
.btn-primary { background: #2563eb; color: white; }
.btn-pdf { background: #10b981; color: white; }
.btn:disabled { background: #cbd5e1; cursor: not-allowed; }
.styled-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; }
.styled-table th { background: #f8fafc; padding: 12px; text-align: left; font-size: 0.75rem; color: #64748b; text-transform: uppercase; border-bottom: 1px solid #edf2f7; }
.styled-table td { padding: 12px; border-top: 1px solid #f1f5f9; font-size: 0.9rem; }
.badge { padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; }
.badge-ok { background: #dcfce7; color: #166534; }
.badge-warn { background: #fee2e2; color: #991b1b; }
.text-center { text-align: center; }
.placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
</style>