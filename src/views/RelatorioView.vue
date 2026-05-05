<template>
  <div class="pagina-relatorio">
    <h1>Relatório de Entregas de EPI</h1>
    
    <!-- FILTROS -->
    <div class="card">
      <h2>Filtros</h2>
      <div class="filtros">
        <div class="form-group">
          <label>Filtrar por Funcionário</label>
          <select v-model="filtroFuncionario">
            <option value="">Todos os funcionários</option>
            <option v-for="func in funcionarios" :key="func.id" :value="func.id">
              {{ func.nome }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Filtrar por EPI</label>
          <select v-model="filtroEpi">
            <option value="">Todos os EPIs</option>
            <option value="Capacete">Capacete</option>
            <option value="Luva">Luva</option>
            <option value="Colete">Colete de Segurança</option>
            <option value="Bota">Bota de Segurança</option>
            <option value="Óculos">Óculos de Proteção</option>
            <option value="Máscara">Máscara de Proteção</option>
            <option value="Protetor Auricular">Protetor Auricular</option>
            <option value="Cinto de Segurança">Cinto de Segurança</option>
          </select>
        </div>

        <button @click="limparFiltros" class="btn btn-secundario">
          <i class="fas fa-redo"></i> Limpar Filtros
        </button>
      </div>
    </div>

    <!-- RELATÓRIO -->
    <div class="card">
      <h2>Histórico de Entregas</h2>
      
      <!-- Mensagem de carregando -->
      <div v-if="carregando" class="mensagem-info">
        <i class="fas fa-spinner"></i> Carregando relatório...
      </div>
      
      <!-- Mensagem se não houver dados -->
      <div v-else-if="entregasFiltradas.length === 0" class="mensagem-info">
        <i class="fas fa-info-circle"></i> Nenhuma entrega encontrada com estes filtros.
      </div>
      
      <!-- TABELA COM OS DADOS -->
      <table v-else class="tabela">
        <thead>
          <tr>
            <th>Funcionário</th>
            <th>Cargo</th>
            <th>EPI</th>
            <th>Data da Entrega</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entrega in entregasFiltradas" :key="entrega.id">
            <td>{{ entrega.funcionario_nome }}</td>
            <td>{{ entrega.funcionario_cargo }}</td>
            <td>
              <span class="badge-epi">{{ entrega.epi }}</span>
            </td>
            <td>{{ formatarDataHora(entrega.data_entrega) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- RESUMO -->
      <div v-if="entregasFiltradas.length > 0" class="resumo">
        <p><strong>Total de entregas:</strong> {{ entregasFiltradas.length }}</p>
        <p><strong>Funcionários únicos:</strong> {{ funcionariosUnicos }}</p>
        <p><strong>EPIs únicos:</strong> {{ episUnicos }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// ===== IMPORTAÇÕES =====
// Importar ref e computed do Vue
// ref() = cria uma variável reativa
// computed() = cria uma variável calculada (atualiza automaticamente quando as dependências mudam)
import { ref, computed, onMounted } from 'vue'

// Importar o composable do Supabase que já está configurado no projeto
// useSupabase() = retorna o cliente Supabase pronto para usar
import { useSupabase } from '@/composables/useSupabase'

// ===== CONFIGURAÇÃO DO SUPABASE =====
// Pegar o cliente Supabase já configurado
// supabase = objeto que tem os métodos para banco de dados
const { supabase } = useSupabase()

// ===== VARIÁVEIS DE ESTADO (REATIVAS) =====
// Essas variáveis são "reativas", ou seja, quando mudam, a tela atualiza automaticamente

// Array que guarda a lista de todas as entregas
// Será preenchido quando carregarEntregas() buscar do banco
const entregas = ref([])

// Array que guarda a lista de funcionários
// Usamos isso para preencher o select de filtros
const funcionarios = ref([])

// Boolean que indica se está carregando dados do banco
// true = está carregando (mostra spinner)
// false = terminou de carregar (mostra tabela)
const carregando = ref(true)

// ===== VARIÁVEIS DE FILTRO =====

// ID do funcionário selecionado no filtro
// '' = mostra todos os funcionários
// número = mostra apenas entregas deste funcionário
const filtroFuncionario = ref('')

// Nome do EPI selecionado no filtro
// '' = mostra todos os EPIs
// string = mostra apenas entregas deste EPI
const filtroEpi = ref('')

// ===== VARIÁVEIS CALCULADAS (COMPUTED) =====
// Essas variáveis são calculadas automaticamente quando as dependências mudam
// Não precisamos atualizar manualmente

// ===== COMPUTED 1: ENTREGAS FILTRADAS =====
// Array com as entregas filtradas de acordo com os filtros selecionados
// Sempre que filtroFuncionario ou filtroEpi mudam, essa variável é recalculada automaticamente
const entregasFiltradas = computed(() => {
  // ===== PASSO 1: COMEÇAR COM TODAS AS ENTREGAS =====
  // resultado = cópia da lista de entregas
  // Vamos filtrar essa lista de acordo com os filtros
  let resultado = entregas.value

  // ===== PASSO 2: FILTRO 1 - POR FUNCIONÁRIO =====
  // Se o usuário selecionou um funcionário, filtrar por ele
  // filtroFuncionario.value = ID do funcionário selecionado
  // Se está vazio (''), não filtra (mostra todos)
  if (filtroFuncionario.value) {
    // .filter() = mantém apenas os itens que passam na condição
    // entrega.funcionario_id == filtroFuncionario.value = verifica se o ID é igual
    // == = compara os valores (ignora o tipo)
    resultado = resultado.filter(entrega => 
      entrega.funcionario_id == filtroFuncionario.value
    )
  }

  // ===== PASSO 3: FILTRO 2 - POR EPI =====
  // Se o usuário selecionou um EPI, filtrar por ele
  // filtroEpi.value = nome do EPI selecionado
  // Se está vazio (''), não filtra (mostra todos)
  if (filtroEpi.value) {
    // .filter() = mantém apenas os itens que passam na condição
    // entrega.epi == filtroEpi.value = verifica se o EPI é igual
    resultado = resultado.filter(entrega => 
      entrega.epi == filtroEpi.value
    )
  }

  // ===== PASSO 4: RETORNAR A LISTA FILTRADA =====
  // Retorna a lista filtrada (pode estar vazia se nenhum item passar nos filtros)
  return resultado
})

// ===== COMPUTED 2: FUNCIONÁRIOS ÚNICOS =====
// Número de funcionários únicos nas entregas filtradas
// Usa um Set para eliminar duplicatas
const funcionariosUnicos = computed(() => {
  // new Set() = cria um conjunto que não permite duplicatas
  // .map(e => e.funcionario_id) = extrai apenas os IDs dos funcionários de cada entrega
  // .size = retorna o número de itens únicos no conjunto
  // Exemplo: [1, 2, 1, 3, 2] vira Set{1, 2, 3} com size = 3
  return new Set(entregasFiltradas.value.map(e => e.funcionario_id)).size
})

// ===== COMPUTED 3: EPIS ÚNICOS =====
// Número de EPIs únicos nas entregas filtradas
// Usa um Set para eliminar duplicatas
const episUnicos = computed(() => {
  // new Set() = cria um conjunto que não permite duplicatas
  // .map(e => e.epi) = extrai apenas os nomes dos EPIs de cada entrega
  // .size = retorna o número de itens únicos no conjunto
  // Exemplo: ['Capacete', 'Luva', 'Capacete'] vira Set{'Capacete', 'Luva'} com size = 2
  return new Set(entregasFiltradas.value.map(e => e.epi)).size
})

// ===== FUNÇÃO: CARREGAR FUNCIONÁRIOS DO SUPABASE =====
// Esta função busca todos os funcionários para preencher o select de filtros
// async = pode fazer operações que demoram (como chamar o Supabase)
// await = espera a operação terminar antes de continuar
async function carregarFuncionarios() {
  try {
    // ===== PASSO 1: BUSCAR FUNCIONÁRIOS =====
    // supabase.from('funcionarios') = acessa a tabela 'funcionarios' no banco
    // .select('id, nome, cargo') = seleciona apenas essas 3 colunas (não precisa de todas)
    // .order('nome', { ascending: true }) = ordena por nome em ordem alfabética (A-Z)
    // await = espera o Supabase responder
    // Retorna um objeto com { data, error }
    // - data = array com os funcionários se funcionou
    // - error = mensagem de erro se falhou
    const { data, error } = await supabase
      .from('funcionarios')
      .select('id, nome, cargo')
      .order('nome', { ascending: true })

    // ===== PASSO 2: VERIFICAR SE HOUVE ERRO =====
    // if (error) = se houve um erro na busca
    // throw error = lança o erro para o catch capturar
    if (error) throw error
    
    // ===== PASSO 3: SALVAR NA VARIÁVEL =====
    // funcionarios.value = data || [] = salva os dados na variável
    // || [] = se data for null ou undefined, usa um array vazio
    // Isso atualiza a tela automaticamente com a nova lista
    funcionarios.value = data || []
  } catch (error) {
    // ===== CAPTURAR ERROS =====
    // Se houver um erro, mostrar no console (para debug)
    console.error('Erro ao carregar funcionários:', error)
    // Não mostrar alerta aqui porque é uma operação secundária
  }
}

// ===== FUNÇÃO: CARREGAR ENTREGAS DO SUPABASE =====
// Esta função busca todas as entregas do banco de dados
// Ela também busca o nome e cargo do funcionário para cada entrega (JOIN)
async function carregarEntregas() {
  // ===== PASSO 1: MOSTRAR QUE ESTÁ CARREGANDO =====
  // Muda carregando para true
  // Isso faz aparecer o spinner de carregamento na tela
  carregando.value = true

  try {
    // ===== PASSO 2: BUSCAR ENTREGAS =====
    // supabase.from('entregas') = acessa a tabela 'entregas' no banco
    // .select('*') = seleciona todas as colunas
    // .order('data_entrega', { ascending: false }) = ordena por data (mais recentes primeiro)
    // await = espera o Supabase responder
    // Retorna um objeto com { data, error }
    const { data, error } = await supabase
      .from('entregas')
      .select('*')
      .order('data_entrega', { ascending: false })

    // ===== PASSO 3: VERIFICAR SE HOUVE ERRO =====
    if (error) throw error
    
    // ===== PASSO 4: BUSCAR NOMES E CARGOS DOS FUNCIONÁRIOS (JOIN MANUAL) =====
    // Para cada entrega, precisamos buscar o nome e cargo do funcionário
    // Usamos Promise.all() para fazer todas as buscas em paralelo (mais rápido)
    // map() transforma cada entrega em uma Promise
    // async (entrega) => {...} = função que busca o nome para cada entrega
    const entregasComDados = await Promise.all(
      (data || []).map(async (entrega) => {
        // ===== BUSCAR DADOS DO FUNCIONÁRIO =====
        // supabase.from('funcionarios') = acessa a tabela 'funcionarios'
        // .select('nome, cargo') = seleciona nome e cargo
        // .eq('id', entrega.funcionario_id) = filtra por ID (equal)
        // .single() = retorna um único resultado (não um array)
        const { data: func } = await supabase
          .from('funcionarios')
          .select('nome, cargo')
          .eq('id', entrega.funcionario_id)
          .single()
        
        // ===== RETORNAR ENTREGA COM DADOS DO FUNCIONÁRIO =====
        // ...entrega = copia todos os dados da entrega original (spread operator)
        // funcionario_nome: func?.nome || 'Desconhecido' = adiciona o nome
        // func?.nome = se func existe, pega o nome; senão usa 'Desconhecido'
        // funcionario_cargo: func?.cargo || 'N/A' = adiciona o cargo
        return {
          ...entrega,
          funcionario_nome: func?.nome || 'Desconhecido',
          funcionario_cargo: func?.cargo || 'N/A'
        }
      })
    )

    // ===== PASSO 5: SALVAR NA VARIÁVEL =====
    // Salva os dados na variável para mostrar na tabela
    entregas.value = entregasComDados
  } catch (error) {
    // ===== CAPTURAR ERROS =====
    console.error('Erro ao carregar entregas:', error)
    alert('Erro ao carregar dados do banco. Tente novamente.')
  } finally {
    // ===== PASSO 6: ESCONDER O CARREGAMENTO =====
    // finally = sempre executa, mesmo se houve erro ou não
    // Muda carregando para false
    // Isso faz desaparecer o spinner de carregamento
    carregando.value = false
  }
}

// ===== FUNÇÃO: LIMPAR FILTROS =====
// Esta função é chamada quando o usuário clica no botão "Limpar Filtros"
// Ela reseta todos os filtros para mostrar todos os dados
function limparFiltros() {
  // ===== PASSO 1: RESETAR FILTRO DE FUNCIONÁRIO =====
  // Muda para vazio ('') para mostrar todos os funcionários
  filtroFuncionario.value = ''
  
  // ===== PASSO 2: RESETAR FILTRO DE EPI =====
  // Muda para vazio ('') para mostrar todos os EPIs
  filtroEpi.value = ''
  
  // ===== PASSO 3: TABELA ATUALIZA AUTOMATICAMENTE =====
  // A tabela é atualizada automaticamente porque usamos computed()
  // Quando as variáveis de filtro mudam, entregasFiltradas é recalculada
}

// ===== FUNÇÃO: FORMATAR DATA E HORA =====
// Esta função converte uma data do formato ISO (2024-01-15T14:30:00)
// Para o formato brasileiro (15/01/2024 14:30)
// Isso torna a data mais legível para o usuário
function formatarDataHora(data) {
  // ===== PASSO 1: VERIFICAR SE A DATA EXISTE =====
  // if (!data) = se a data é null ou undefined
  if (!data) return '-'  // Retorna um hífen se não há data
  
  // ===== PASSO 2: CRIAR UM OBJETO DATE =====
  // new Date(data) = cria um objeto Date a partir da string ISO
  // Exemplo: "2024-01-15T14:30:00" vira um objeto Date
  const d = new Date(data)
  
  // ===== PASSO 3: FORMATAR PARA PORTUGUÊS =====
  // toLocaleDateString('pt-BR') = converte a data para o formato brasileiro (15/01/2024)
  // toLocaleTimeString('pt-BR', {...}) = converte a hora para o formato brasileiro (14:30)
  // { hour: '2-digit', minute: '2-digit' } = mostra apenas hora e minuto (sem segundos)
  // Resultado: "15/01/2024 14:30"
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// ===== EXECUTAR AO MONTAR O COMPONENTE =====
// onMounted() = função do Vue que executa quando o componente é carregado
// Isso significa que quando a página abre, carrega os dados automaticamente
onMounted(() => {
  // ===== PASSO 1: CARREGAR FUNCIONÁRIOS =====
  // Busca todos os funcionários para preencher o select de filtros
  carregarFuncionarios()
  
  // ===== PASSO 2: CARREGAR ENTREGAS =====
  // Busca todas as entregas para mostrar na tabela
  carregarEntregas()
})
</script>

<style scoped>
/* ===== ESTILOS GERAIS ===== */
.pagina-relatorio {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  background-color: #FFFFFF;
}

h1 {
  color: #003D99;
  font-size: 32px;
  margin-bottom: 30px;
  font-weight: 700;
}

h2 {
  color: #003D99;
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 2px solid #F0F4F8;
  padding-bottom: 10px;
}

.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filtros {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #003D99;
  font-size: 14px;
}

.form-group select {
  padding: 10px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  font-size: 14px;
  color: #1A1A1A;
}

.form-group select:focus {
  outline: none;
  border-color: #003D99;
  box-shadow: 0 0 0 3px rgba(0, 61, 153, 0.1);
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-secundario {
  background-color: #E2E8F0;
  color: #003D99;
  height: fit-content;
}

.btn-secundario:hover {
  background-color: #CBD5E1;
}

.mensagem-info {
  text-align: center;
  padding: 30px;
  color: #6B7280;
  font-size: 16px;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.tabela thead {
  background-color: #F0F4F8;
  border-bottom: 2px solid #003D99;
}

.tabela th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #003D99;
}

.tabela td {
  padding: 12px;
  border-bottom: 1px solid #E2E8F0;
  color: #1A1A1A;
}

.tabela tbody tr:hover {
  background-color: #F9FAFB;
}

.badge-epi {
  display: inline-block;
  background-color: #E0F2FE;
  color: #003D99;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.resumo {
  margin-top: 20px;
  padding: 15px;
  background-color: #F0F4F8;
  border-radius: 4px;
  border-left: 4px solid #003D99;
}

.resumo p {
  color: #1A1A1A;
  font-size: 14px;
  margin: 8px 0;
}

.resumo strong {
  color: #003D99;
}

@media (max-width: 768px) {
  .filtros {
    grid-template-columns: 1fr;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .tabela {
    font-size: 12px;
  }

  .tabela th,
  .tabela td {
    padding: 8px;
  }
}
</style>
