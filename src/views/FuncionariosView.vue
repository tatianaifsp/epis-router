<template>
  <div class="pagina-funcionarios">
    <h1>Gerenciar Funcionários</h1>
    
    <!-- FORMULÁRIO PARA ADICIONAR/EDITAR FUNCIONÁRIO -->
    <div class="card">
      <h2>{{ editandoId ? 'Editar Funcionário' : 'Adicionar Novo Funcionário' }}</h2>
      <form @submit.prevent="salvarFuncionario" class="formulario">
        <div class="form-group">
          <label>Nome do Funcionário</label>
          <input 
            v-model="novoFunc.nome" 
            type="text" 
            placeholder="Ex: João Silva"
            required 
          />
        </div>

        <div class="form-group">
          <label>Cargo</label>
          <input 
            v-model="novoFunc.cargo" 
            type="text" 
            placeholder="Ex: Operador de Máquina"
            required 
          />
        </div>

        <div class="form-group">
          <label>Data de Admissão</label>
          <input 
            v-model="novoFunc.data_admissao" 
            type="date"
            required 
          />
        </div>

        <div class="botoes-formulario">
          <button type="submit" class="btn btn-primario">
            {{ editandoId ? 'Atualizar Funcionário' : 'Salvar Novo Funcionário' }}
          </button>
          <button v-if="editandoId" @click="cancelarEdicao" type="button" class="btn btn-secundario">
            Cancelar Edição
          </button>
        </div>
      </form>
    </div>

    <!-- LISTA DE FUNCIONÁRIOS -->
    <div class="card">
      <h2>Lista de Funcionários</h2>
      
      <!-- Mostra mensagem de carregamento -->
      <div v-if="carregando" class="carregando">
        <i class="fas fa-spinner fa-spin"></i> Carregando...
      </div>

      <!-- Mostra a tabela se não está carregando -->
      <div v-else-if="funcionarios.length > 0" class="tabela-container">
        <table class="tabela">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Data de Admissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="func in funcionarios" :key="func.id">
              <td>{{ func.nome }}</td>
              <td>{{ func.cargo }}</td>
              <td>{{ formatarData(func.data_admissao) }}</td>
              <td class="acoes">
                <button @click="prepararEdicao(func)" class="btn btn-pequeno btn-editar">
                  <i class="fas fa-edit"></i> Editar
                </button>
                <button @click="excluirFuncionario(func.id)" class="btn btn-pequeno btn-excluir">
                  <i class="fas fa-trash"></i> Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mostra mensagem se não há funcionários -->
      <div v-else class="vazio">
        <i class="fas fa-inbox"></i>
        <p>Nenhum funcionário cadastrado ainda. Adicione um novo!</p>
      </div>
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

// Array que guarda a lista de todos os funcionários
// ref([]) = começa como um array vazio
// Será preenchido quando carregarFuncionarios() buscar do banco
const funcionarios = ref([])

// Boolean que indica se está carregando dados do banco
// true = está carregando (mostra spinner)
// false = terminou de carregar (mostra tabela)
const carregando = ref(true)

// ID do funcionário que está sendo editado
// null = está adicionando um novo funcionário
// número = está editando o funcionário com este ID
// Usamos isso para saber se é CREATE (novo) ou UPDATE (editar)
const editandoId = ref(null)

// ===== OBJETO DO FORMULÁRIO =====
// Objeto que guarda os dados do formulário enquanto o usuário está digitando
// v-model vincula cada input com uma propriedade deste objeto
// Quando o usuário digita, o objeto é atualizado automaticamente
const novoFunc = ref({
  nome: '',           // Campo de nome (começa vazio)
  cargo: '',          // Campo de cargo (começa vazio)
  data_admissao: ''   // Campo de data (começa vazio)
})

// ===== FUNÇÃO: CARREGAR FUNCIONÁRIOS DO SUPABASE =====
// Esta função busca todos os funcionários do banco de dados
// async = pode fazer operações que demoram (como chamar o Supabase)
// await = espera a operação terminar antes de continuar
async function carregarFuncionarios() {
  // ===== PASSO 1: MOSTRAR QUE ESTÁ CARREGANDO =====
  // Muda carregando para true
  // Isso faz aparecer o spinner de carregamento na tela
  carregando.value = true

  try {
    // ===== PASSO 2: BUSCAR DADOS DO SUPABASE =====
    // supabase.from('funcionarios') = acessa a tabela 'funcionarios' no banco
    // .select('*') = seleciona todas as colunas (*)
    // .order('id', { ascending: false }) = ordena por ID em ordem decrescente (mais recentes primeiro)
    // await = espera o Supabase responder
    // Retorna um objeto com { data, error }
    // - data = array com os funcionários se funcionou
    // - error = mensagem de erro se falhou
    const { data, error } = await supabase
      .from('funcionarios')
      .select('*')
      .order('id', { ascending: false })

    // ===== PASSO 3: VERIFICAR SE HOUVE ERRO =====
    // if (error) = se houve um erro na busca
    // throw error = lança o erro para o catch capturar
    if (error) throw error
    
    // ===== PASSO 4: SALVAR OS DADOS NA VARIÁVEL =====
    // funcionarios.value = data || [] = salva os dados na variável
    // || [] = se data for null ou undefined, usa um array vazio
    // Isso atualiza a tela automaticamente com a nova lista
    funcionarios.value = data || []
  } catch (error) {
    // ===== CAPTURAR ERROS =====
    // Se houver um erro, mostrar no console (para debug)
    console.error('Erro ao carregar funcionários:', error)
    // Mostrar um alerta para o usuário
    alert('Erro ao carregar dados do banco. Tente novamente.')
  } finally {
    // ===== PASSO 5: ESCONDER O CARREGAMENTO =====
    // finally = sempre executa, mesmo se houve erro ou não
    // Muda carregando para false
    // Isso faz desaparecer o spinner de carregamento
    carregando.value = false
  }
}

// ===== FUNÇÃO: SALVAR OU ATUALIZAR FUNCIONÁRIO =====
// Esta função é chamada quando o usuário clica no botão "Salvar" ou "Atualizar"
// Ela verifica se é um novo funcionário (CREATE) ou uma edição (UPDATE)
async function salvarFuncionario() {
  try {
    // ===== PASSO 1: VALIDAR SE OS CAMPOS ESTÃO PREENCHIDOS =====
    // Verificar se o usuário preencheu todos os campos obrigatórios
    // !novoFunc.value.nome = se o nome está vazio
    // || = OU (se algum campo está vazio)
    if (!novoFunc.value.nome || !novoFunc.value.cargo || !novoFunc.value.data_admissao) {
      // Se algum campo está vazio, mostrar alerta e parar
      alert('Por favor, preencha todos os campos.')
      return
    }

    // ===== PASSO 2: VERIFICAR SE É EDIÇÃO OU NOVO =====
    // if (editandoId.value) = se há um ID sendo editado
    // Significa que é uma edição (UPDATE)
    if (editandoId.value) {
      // ===== MODO EDIÇÃO (UPDATE) =====
      // Atualizar um funcionário existente no banco de dados
      
      // supabase.from('funcionarios') = acessa a tabela 'funcionarios'
      // .update({...}) = atualiza os campos com os novos valores
      // .eq('id', editandoId.value) = mas APENAS o funcionário com este ID
      // eq = "equal" (igual) - filtra por ID
      const { error } = await supabase
        .from('funcionarios')
        .update({
          // Atualiza cada campo com o novo valor do formulário
          nome: novoFunc.value.nome,
          cargo: novoFunc.value.cargo,
          data_admissao: novoFunc.value.data_admissao
        })
        .eq('id', editandoId.value)  // Filtra por ID

      // Verificar se houve erro na atualização
      if (error) throw error
      
      // Mostrar mensagem de sucesso
      alert('Funcionário atualizado com sucesso!')
    } else {
      // ===== MODO NOVO (CREATE) =====
      // Inserir um novo funcionário no banco de dados
      
      // supabase.from('funcionarios') = acessa a tabela 'funcionarios'
      // .insert([{...}]) = insere um novo registro
      // O array pode ter vários registros, mas aqui tem só um
      const { error } = await supabase
        .from('funcionarios')
        .insert([{
          // Insere um novo funcionário com os dados do formulário
          nome: novoFunc.value.nome,
          cargo: novoFunc.value.cargo,
          data_admissao: novoFunc.value.data_admissao
          // O Supabase gera automaticamente o ID
        }])

      // Verificar se houve erro na inserção
      if (error) throw error
      
      // Mostrar mensagem de sucesso
      alert('Novo funcionário salvo com sucesso!')
    }

    // ===== PASSO 3: LIMPAR O FORMULÁRIO =====
    // Depois de salvar, limpar os campos para o próximo funcionário
    novoFunc.value = { nome: '', cargo: '', data_admissao: '' }
    
    // ===== PASSO 4: SAIR DO MODO EDIÇÃO =====
    // Muda editandoId para null para voltar ao modo "novo"
    editandoId.value = null
    
    // ===== PASSO 5: RECARREGAR A LISTA =====
    // Busca os dados novos do banco para mostrar na tabela
    // Assim o novo funcionário aparece na lista ou a edição é refletida
    carregarFuncionarios()

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
// Ela coloca os dados do funcionário no formulário para edição
function prepararEdicao(func) {
  // ===== PASSO 1: COPIAR OS DADOS PARA O FORMULÁRIO =====
  // Copia todos os dados do funcionário para o objeto novoFunc
  // Isso preenche os campos do formulário com os dados atuais
  novoFunc.value = {
    nome: func.nome,              // Copia o nome
    cargo: func.cargo,            // Copia o cargo
    data_admissao: func.data_admissao  // Copia a data
  }
  
  // ===== PASSO 2: GUARDAR O ID PARA EDIÇÃO =====
  // Muda editandoId para o ID do funcionário sendo editado
  // Isso faz com que salvarFuncionario() saiba que é uma edição (UPDATE)
  // Em vez de um novo funcionário (CREATE)
  editandoId.value = func.id
  
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
  novoFunc.value = { nome: '', cargo: '', data_admissao: '' }
  
  // Muda editandoId para null para voltar ao modo "novo"
  // Assim o botão volta a dizer "Salvar Novo Funcionário" em vez de "Atualizar"
  editandoId.value = null
}

// ===== FUNÇÃO: EXCLUIR FUNCIONÁRIO =====
// Esta função é chamada quando o usuário clica no botão "Excluir"
// Ela remove um funcionário do banco de dados
async function excluirFuncionario(id) {
  // ===== PASSO 1: PEDIR CONFIRMAÇÃO =====
  // confirm() = mostra uma caixa de diálogo pedindo confirmação
  // Se o usuário clicar "OK", retorna true
  // Se o usuário clicar "Cancelar", retorna false
  if (!confirm('Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.')) {
    // Se o usuário clicou "Cancelar", parar a função
    return
  }

  try {
    // ===== PASSO 2: EXCLUIR DO BANCO DE DADOS =====
    // supabase.from('funcionarios') = acessa a tabela 'funcionarios'
    // .delete() = deleta registros
    // .eq('id', id) = mas APENAS o funcionário com este ID
    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id', id)  // Filtra por ID

    // Verificar se houve erro na exclusão
    if (error) throw error
    
    // ===== PASSO 3: MOSTRAR MENSAGEM DE SUCESSO =====
    alert('Funcionário excluído com sucesso!')
    
    // ===== PASSO 4: RECARREGAR A LISTA =====
    // Busca os dados novos do banco para atualizar a tabela
    // O funcionário excluído desaparecerá da lista
    carregarFuncionarios()
  } catch (error) {
    // ===== CAPTURAR ERROS =====
    // Se houver um erro ao excluir, mostrar no console (para debug)
    console.error('Erro ao excluir:', error)
    // Mostrar um alerta para o usuário
    alert('Erro ao excluir do banco de dados. Tente novamente.')
  }
}

// ===== FUNÇÃO: FORMATAR DATA =====
// Esta função converte uma data do formato ISO (2024-01-15)
// Para o formato brasileiro (15/01/2024)
// Isso torna a data mais legível para o usuário
function formatarData(data) {
  // ===== PASSO 1: VERIFICAR SE A DATA EXISTE =====
  // if (!data) = se a data é null ou undefined
  if (!data) return '-'  // Retorna um hífen se não há data
  
  // ===== PASSO 2: CRIAR UM OBJETO DATE =====
  // new Date(data + 'T00:00:00') = cria um objeto Date
  // data = string no formato ISO (ex: "2024-01-15")
  // 'T00:00:00' = adiciona a hora (00:00:00) para evitar problemas de fuso horário
  const d = new Date(data + 'T00:00:00')
  
  // ===== PASSO 3: FORMATAR PARA PORTUGUÊS =====
  // toLocaleDateString('pt-BR') = converte para o formato brasileiro
  // Resultado: "15/01/2024"
  return d.toLocaleDateString('pt-BR')
}

// ===== EXECUTAR AO MONTAR O COMPONENTE =====
// onMounted() = função do Vue que executa quando o componente é carregado
// Isso significa que quando a página abre, carrega os funcionários automaticamente
onMounted(() => {
  // Chamar a função para carregar os funcionários
  carregarFuncionarios()
})
</script>

<style scoped>
/* Estilos CSS para a página de funcionários */
.pagina-funcionarios {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #003D99;
  margin-bottom: 30px;
  font-size: 32px;
}

h2 {
  color: #003D99;
  margin-bottom: 20px;
  font-size: 24px;
}

.card {
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.formulario {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
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

.form-group input {
  padding: 10px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 4px;
  font-size: 14px;
  color: #1A1A1A;
}

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

.btn-pequeno {
  padding: 6px 12px;
  font-size: 12px;
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

.carregando {
  text-align: center;
  padding: 40px;
  color: #003D99;
  font-size: 16px;
}

.tabela-container {
  overflow-x: auto;
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

.acoes {
  display: flex;
  gap: 8px;
}

.vazio {
  text-align: center;
  padding: 60px 20px;
  color: #6B7280;
}

.vazio i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  color: #D1D5DB;
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

  .btn-pequeno {
    width: 100%;
  }
}
</style>
