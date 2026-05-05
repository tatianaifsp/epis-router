<template>
  <div class="pagina-entrega">
    <h1>Registrar Entrega de EPI</h1>
    
    <!-- FORMULÁRIO PARA REGISTRAR/EDITAR ENTREGA -->
    <div class="card">
      <h2>{{ editandoId ? 'Editar Entrega' : 'Nova Entrega de EPI' }}</h2>
      <form @submit.prevent="salvarEntrega" class="formulario">
        <div class="form-group">
          <label>Selecione o Funcionário</label>
          <select 
            v-model="novaEntrega.funcionario_id" 
            required
          >
            <option value="">-- Selecione um funcionário --</option>
            <option v-for="func in funcionarios" :key="func.id" :value="func.id">
              {{ func.nome }} ({{ func.cargo }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>EPI Entregue</label>
          <select 
            v-model="novaEntrega.epi" 
            required
          >
            <option value="">-- Selecione um EPI --</option>
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

        <div class="form-group">
          <label>Data da Entrega</label>
          <input 
            v-model="novaEntrega.data_entrega" 
            type="datetime-local"
            required 
          />
        </div>

        <div class="botoes-formulario">
          <button type="submit" class="btn btn-primario">
            {{ editandoId ? 'Atualizar Entrega' : 'Registrar Entrega' }}
          </button>
          <button v-if="editandoId" @click="cancelarEdicao" type="button" class="btn btn-secundario">
            Cancelar Edição
          </button>
        </div>
      </form>
    </div>

    <!-- LISTA DE ENTREGAS -->
    <div class="card">
      <h2>Histórico de Entregas</h2>
      
      <!-- Mensagem de carregando -->
      <div v-if="carregando" class="mensagem-info">
        <i class="fas fa-spinner"></i> Carregando entregas...
      </div>
      
      <!-- Mensagem se não houver dados -->
      <div v-else-if="entregas.length === 0" class="mensagem-info">
        <i class="fas fa-info-circle"></i> Nenhuma entrega registrada ainda.
      </div>
      
      <!-- TABELA COM OS DADOS -->
      <table v-else class="tabela">
        <thead>
          <tr>
            <th>Funcionário</th>
            <th>EPI</th>
            <th>Data da Entrega</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entrega in entregas" :key="entrega.id">
            <td>{{ entrega.funcionario_nome }}</td>
            <td>
              <span class="badge-epi">{{ entrega.epi }}</span>
            </td>
            <td>{{ formatarDataHora(entrega.data_entrega) }}</td>
            <td class="acoes">
              <!-- Botão EDITAR -->
              <button 
                @click="prepararEdicao(entrega)" 
                class="btn-icone btn-editar" 
                title="Editar entrega"
              >
                <i class="fas fa-edit"></i> Editar
              </button>
              
              <!-- Botão EXCLUIR -->
              <button 
                @click="excluirEntrega(entrega.id)" 
                class="btn-icone btn-excluir" 
                title="Excluir entrega"
              >
                <i class="fas fa-trash-alt"></i> Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// ===== IMPORTAÇÕES =====
// Importar ref do Vue para criar variáveis reativas
// ref() = cria uma variável que, quando muda, atualiza a tela automaticamente
import { ref, onMounted } from 'vue'

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
// Usamos isso para preencher o select de funcionários no formulário
const funcionarios = ref([])

// Boolean que indica se está carregando dados do banco
// true = está carregando (mostra spinner)
// false = terminou de carregar (mostra tabela)
const carregando = ref(true)

// ID da entrega que está sendo editada
// null = está adicionando uma nova entrega
// número = está editando a entrega com este ID
// Usamos isso para saber se é CREATE (novo) ou UPDATE (editar)
const editandoId = ref(null)

// ===== OBJETO DO FORMULÁRIO =====
// Objeto que guarda os dados do formulário enquanto o usuário está digitando
// v-model vincula cada select/input com uma propriedade deste objeto
// Quando o usuário digita, o objeto é atualizado automaticamente
const novaEntrega = ref({
  funcionario_id: '',     // ID do funcionário selecionado
  epi: '',                // Nome do EPI selecionado
  data_entrega: ''        // Data e hora da entrega
})

// ===== FUNÇÃO: CARREGAR FUNCIONÁRIOS DO SUPABASE =====
// Esta função busca todos os funcionários para preencher o select
// async = pode fazer operações que demoram (como chamar o Supabase)
// await = espera a operação terminar antes de continuar
async function carregarFuncionarios() {
  try {
    // ===== PASSO 1: BUSCAR FUNCIONÁRIOS =====
    // supabase.from('funcionarios') = acessa a tabela 'funcionarios' no banco
    // .select('id, nome, cargo') = seleciona apenas essas 3 colunas (não precisa de todas)
    // .order('nome', { ascending: true }) = ordena por nome em ordem alfabética
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
// Ela também busca o nome do funcionário para cada entrega (JOIN)
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
    const { data, error } = await supabase
      .from('entregas')
      .select('*')
      .order('data_entrega', { ascending: false })

    // ===== PASSO 3: VERIFICAR SE HOUVE ERRO =====
    if (error) throw error
    
    // ===== PASSO 4: BUSCAR NOMES DOS FUNCIONÁRIOS (JOIN MANUAL) =====
    // Para cada entrega, precisamos buscar o nome do funcionário
    // Usamos Promise.all() para fazer todas as buscas em paralelo (mais rápido)
    // map() transforma cada entrega em uma Promise
    // async (entrega) => {...} = função que busca o nome para cada entrega
    const entregasComNomes = await Promise.all(
      (data || []).map(async (entrega) => {
        // ===== BUSCAR NOME DO FUNCIONÁRIO =====
        // supabase.from('funcionarios') = acessa a tabela 'funcionarios'
        // .select('nome') = seleciona apenas o nome
        // .eq('id', entrega.funcionario_id) = filtra por ID (equal)
        // .single() = retorna um único resultado (não um array)
        const { data: func } = await supabase
          .from('funcionarios')
          .select('nome')
          .eq('id', entrega.funcionario_id)
          .single()
        
        // ===== RETORNAR ENTREGA COM NOME =====
        // ...entrega = copia todos os dados da entrega original
        // funcionario_nome: func?.nome || 'Desconhecido' = adiciona o nome do funcionário
        // func?.nome = se func existe, pega o nome; senão usa 'Desconhecido'
        return {
          ...entrega,
          funcionario_nome: func?.nome || 'Desconhecido'
        }
      })
    )

    // ===== PASSO 5: SALVAR NA VARIÁVEL =====
    // Salva os dados na variável para mostrar na tabela
    entregas.value = entregasComNomes
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

// ===== FUNÇÃO: SALVAR OU ATUALIZAR ENTREGA =====
// Esta função é chamada quando o usuário clica no botão "Registrar" ou "Atualizar"
// Ela verifica se é um novo registro (CREATE) ou uma edição (UPDATE)
async function salvarEntrega() {
  try {
    // ===== PASSO 1: VALIDAR SE OS CAMPOS ESTÃO PREENCHIDOS =====
    // Verificar se o usuário preencheu todos os campos obrigatórios
    // !novaEntrega.value.funcionario_id = se o funcionário está vazio
    // || = OU (se algum campo está vazio)
    if (!novaEntrega.value.funcionario_id || !novaEntrega.value.epi || !novaEntrega.value.data_entrega) {
      // Se algum campo está vazio, mostrar alerta e parar
      alert('Por favor, preencha todos os campos.')
      return
    }

    // ===== PASSO 2: VERIFICAR SE É EDIÇÃO OU NOVO =====
    // if (editandoId.value) = se há um ID sendo editado
    // Significa que é uma edição (UPDATE)
    if (editandoId.value) {
      // ===== MODO EDIÇÃO (UPDATE) =====
      // Atualizar uma entrega existente no banco de dados
      
      // supabase.from('entregas') = acessa a tabela 'entregas'
      // .update({...}) = atualiza os campos com os novos valores
      // .eq('id', editandoId.value) = mas APENAS a entrega com este ID
      // eq = "equal" (igual) - filtra por ID
      const { error } = await supabase
        .from('entregas')
        .update({
          // Atualiza cada campo com o novo valor do formulário
          funcionario_id: novaEntrega.value.funcionario_id,
          epi: novaEntrega.value.epi,
          data_entrega: novaEntrega.value.data_entrega
        })
        .eq('id', editandoId.value)  // Filtra por ID

      // Verificar se houve erro na atualização
      if (error) throw error
      
      // Mostrar mensagem de sucesso
      alert('Entrega atualizada com sucesso!')
    } else {
      // ===== MODO NOVO (CREATE) =====
      // Inserir uma nova entrega no banco de dados
      
      // supabase.from('entregas') = acessa a tabela 'entregas'
      // .insert([{...}]) = insere um novo registro
      // O array pode ter vários registros, mas aqui tem só um
      const { error } = await supabase
        .from('entregas')
        .insert([{
          // Insere uma nova entrega com os dados do formulário
          funcionario_id: novaEntrega.value.funcionario_id,
          epi: novaEntrega.value.epi,
          data_entrega: novaEntrega.value.data_entrega
          // O Supabase gera automaticamente o ID
        }])

      // Verificar se houve erro na inserção
      if (error) throw error
      
      // Mostrar mensagem de sucesso
      alert('Entrega registrada com sucesso!')
    }

    // ===== PASSO 3: LIMPAR O FORMULÁRIO =====
    // Depois de salvar, limpar os campos para a próxima entrega
    novaEntrega.value = { funcionario_id: '', epi: '', data_entrega: '' }
    
    // ===== PASSO 4: SAIR DO MODO EDIÇÃO =====
    // Muda editandoId para null para voltar ao modo "novo"
    editandoId.value = null
    
    // ===== PASSO 5: RECARREGAR A LISTA =====
    // Busca os dados novos do banco para mostrar na tabela
    // Assim a nova entrega aparece na lista ou a edição é refletida
    carregarEntregas()

  } catch (error) {
    // ===== CAPTURAR ERROS =====
    // Se houver um erro ao salvar, mostrar no console (para debug)
    console.error('Erro ao salvar:', error)
    // Mostrar um alerta para o usuário
    alert('Erro ao salvar no banco de dados. Tente novamente.')
  }
}

// ===== FUNÇÃO: PREPARAR PARA EDIÇÃO =====
// Esta função é chamada quando o usuário clica no botão "Editar"
// Ela coloca os dados da entrega no formulário para edição
function prepararEdicao(entrega) {
  // ===== PASSO 1: COPIAR OS DADOS PARA O FORMULÁRIO =====
  // Copia todos os dados da entrega para o objeto novaEntrega
  // Isso preenche os campos do formulário com os dados atuais
  novaEntrega.value = {
    funcionario_id: entrega.funcionario_id,  // Copia o ID do funcionário
    epi: entrega.epi,                        // Copia o EPI
    data_entrega: entrega.data_entrega       // Copia a data
  }
  
  // ===== PASSO 2: GUARDAR O ID PARA EDIÇÃO =====
  // Muda editandoId para o ID da entrega sendo editada
  // Isso faz com que salvarEntrega() saiba que é uma edição (UPDATE)
  // Em vez de um novo registro (CREATE)
  editandoId.value = entrega.id
  
  // ===== PASSO 3: SCROLL PARA O FORMULÁRIO =====
  // Leva o usuário para o topo da página para ver o formulário
  // behavior: 'smooth' = faz um scroll suave (não pula direto)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ===== FUNÇÃO: CANCELAR EDIÇÃO =====
// Esta função é chamada quando o usuário clica no botão "Cancelar Edição"
// Ela limpa o formulário e volta ao modo "novo"
function cancelarEdicao() {
  // Limpa todos os campos do formulário
  novaEntrega.value = { funcionario_id: '', epi: '', data_entrega: '' }
  
  // Muda editandoId para null para voltar ao modo "novo"
  // Assim o botão volta a dizer "Registrar Entrega" em vez de "Atualizar"
  editandoId.value = null
}

// ===== FUNÇÃO: EXCLUIR ENTREGA =====
// Esta função é chamada quando o usuário clica no botão "Excluir"
// Ela remove uma entrega do banco de dados
async function excluirEntrega(id) {
  // ===== PASSO 1: PEDIR CONFIRMAÇÃO =====
  // confirm() = mostra uma caixa de diálogo pedindo confirmação
  // Se o usuário clicar "OK", retorna true
  // Se o usuário clicar "Cancelar", retorna false
  if (!confirm('Tem certeza que deseja excluir esta entrega? Esta ação não pode ser desfeita.')) {
    // Se o usuário clicou "Cancelar", parar a função
    return
  }

  try {
    // ===== PASSO 2: EXCLUIR DO BANCO DE DADOS =====
    // supabase.from('entregas') = acessa a tabela 'entregas'
    // .delete() = deleta registros
    // .eq('id', id) = mas APENAS a entrega com este ID
    const { error } = await supabase
      .from('entregas')
      .delete()
      .eq('id', id)  // Filtra por ID

    // Verificar se houve erro na exclusão
    if (error) throw error
    
    // ===== PASSO 3: MOSTRAR MENSAGEM DE SUCESSO =====
    alert('Entrega excluída com sucesso!')
    
    // ===== PASSO 4: RECARREGAR A LISTA =====
    // Busca os dados novos do banco para atualizar a tabela
    // A entrega excluída desaparecerá da lista
    carregarEntregas()
  } catch (error) {
    // ===== CAPTURAR ERROS =====
    // Se houver um erro ao excluir, mostrar no console (para debug)
    console.error('Erro ao excluir:', error)
    // Mostrar um alerta para o usuário
    alert('Erro ao excluir do banco de dados. Tente novamente.')
  }
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
  const d = new Date(data)
  
  // ===== PASSO 3: FORMATAR PARA PORTUGUÊS =====
  // toLocaleDateString('pt-BR') = converte a data para o formato brasileiro (15/01/2024)
  // toLocaleTimeString('pt-BR', {...}) = converte a hora para o formato brasileiro (14:30)
  // Resultado: "15/01/2024 14:30"
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// ===== EXECUTAR AO MONTAR O COMPONENTE =====
// onMounted() = função do Vue que executa quando o componente é carregado
// Isso significa que quando a página abre, carrega os dados automaticamente
onMounted(() => {
  // Chamar a função para carregar os funcionários
  carregarFuncionarios()
  // Chamar a função para carregar as entregas
  carregarEntregas()
})
</script>

<style scoped>
/* ===== ESTILOS GERAIS ===== */
.pagina-entrega {
  padding: 30px;
  max-width: 1000px;
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

.formulario {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
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

.form-group select,
.form-group input {
  padding: 10px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  font-size: 14px;
  color: #1A1A1A;
}

.form-group select:focus,
.form-group input:focus {
  outline: none;
  border-color: #003D99;
  box-shadow: 0 0 0 3px rgba(0, 61, 153, 0.1);
}

.botoes-formulario {
  display: flex;
  gap: 10px;
  grid-column: 1 / -1;
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

.btn-primario {
  background-color: #003D99;
  color: #FFFFFF;
}

.btn-primario:hover {
  background-color: #002D73;
}

.btn-secundario {
  background-color: #E2E8F0;
  color: #003D99;
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

.acoes {
  display: flex;
  gap: 8px;
}

.btn-icone {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.btn-editar {
  background-color: #3B82F6;
  color: #FFFFFF;
}

.btn-editar:hover {
  background-color: #2563EB;
}

.btn-excluir {
  background-color: #EF4444;
  color: #FFFFFF;
}

.btn-excluir:hover {
  background-color: #DC2626;
}

@media (max-width: 768px) {
  .formulario {
    grid-template-columns: 1fr;
  }

  .botoes-formulario {
    grid-column: 1;
  }

  .tabela {
    font-size: 12px;
  }

  .tabela th,
  .tabela td {
    padding: 8px;
  }

  .acoes {
    flex-direction: column;
  }

  .btn-icone {
    width: 100%;
    justify-content: center;
  }
}
</style>
