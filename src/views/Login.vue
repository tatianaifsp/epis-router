<template>
  <!-- Container principal da tela de login -->
  <div class="container-login">
    <!-- Caixa do formulário -->
    <div class="form-box">
      <!-- Título da página -->
      <h1 class="titulo">Sistema de EPI</h1>
      <p class="subtitulo">Faça login para acessar o sistema</p>

      <!-- Formulário de login -->
      <!-- @submit.prevent="fazerLogin" = quando o usuário clica em "Entrar", chama a função fazerLogin() -->
      <form @submit.prevent="fazerLogin" class="formulario">
        <!-- Campo de e-mail -->
        <!-- v-model="email" = vincula o valor do input com a variável email -->
        <!-- Quando o usuário digita, a variável email é atualizada automaticamente -->
        <div class="form-group">
          <label for="email" class="label">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            class="input"
            required
          />
        </div>

        <!-- Campo de senha -->
        <!-- v-model="senha" = vincula o valor do input com a variável senha -->
        <div class="form-group">
          <label for="senha" class="label">Senha</label>
          <input
            id="senha"
            v-model="senha"
            type="password"
            placeholder="Digite sua senha"
            class="input"
            required
          />
        </div>

        <!-- Mensagem de erro -->
        <!-- v-if="erro" = só mostra a mensagem se houver um erro -->
        <div v-if="erro" class="mensagem-erro">
          <i class="fas fa-exclamation-circle"></i>
          {{ erro }}
        </div>

        <!-- Botão de envio -->
        <!-- :disabled="carregando" = desabilita o botão enquanto está fazendo login -->
        <!-- Isso evita que o usuário clique múltiplas vezes -->
        <button
          type="submit"
          class="botao-entrar"
          :disabled="carregando"
        >
          <!-- Mostra um spinner enquanto está carregando -->
          <i v-if="carregando" class="fas fa-spinner fa-spin"></i>
          <!-- Mostra o texto normal quando não está carregando -->
          <span v-else>Entrar</span>
        </button>
      </form>

      <!-- Dica para o usuário -->
      <p class="dica">
        <strong>Dica:</strong> Use um e-mail e senha válidos cadastrados no Supabase.
      </p>
    </div>
  </div>
</template>

<script setup>
// ===== IMPORTAÇÕES =====
// Importar a função ref do Vue para criar variáveis reativas
// ref() = cria uma variável que, quando muda, atualiza a tela automaticamente
import { ref } from 'vue'

// Importar o composable do Supabase que já está configurado no projeto
// useSupabase() = retorna o cliente Supabase pronto para usar
import { useSupabase } from '@/composables/useSupabase'

// Importar o router do Vue Router para navegar entre páginas
// useRouter() = permite usar router.push() para ir para outras páginas
import { useRouter } from 'vue-router'

// ===== CONFIGURAÇÃO =====
// Pegar o cliente Supabase já configurado
// supabase = objeto que tem os métodos para autenticação, banco de dados, etc
const { supabase } = useSupabase()

// Pegar o router para navegar entre páginas
// router = objeto que permite router.push('/pagina') para navegar
const router = useRouter()

// ===== VARIÁVEIS REATIVAS =====
// Essas variáveis são "reativas", ou seja, quando mudam, a tela atualiza automaticamente

// Variável que guarda o e-mail digitado pelo usuário
// ref('') = começa vazia
// email.value = para acessar o valor dentro do script
// {{ email }} = para usar no template
const email = ref('')

// Variável que guarda a senha digitada pelo usuário
// ref('') = começa vazia
const senha = ref('')

// Variável que guarda a mensagem de erro (se houver)
// Quando tem um erro, mostra na tela
// Quando não tem erro, a mensagem fica vazia e não aparece
const erro = ref('')

// Variável que indica se o login está em progresso
// Usamos isso para:
// 1. Desabilitar o botão enquanto aguarda a resposta do Supabase
// 2. Mostrar um spinner de carregamento
// 3. Evitar que o usuário clique múltiplas vezes
const carregando = ref(false)

// ===== FUNÇÃO PRINCIPAL: FAZER LOGIN =====
// Esta função é chamada quando o usuário clica no botão "Entrar"
// async = significa que essa função pode fazer operações que demoram (como chamar o Supabase)
// await = espera a operação terminar antes de continuar
async function fazerLogin() {
  // ===== PASSO 1: LIMPAR ERROS ANTERIORES =====
  // Se havia uma mensagem de erro da tentativa anterior, apagar
  // Assim a tela fica limpa para a nova tentativa
  erro.value = ''

  // ===== PASSO 2: VALIDAR SE OS CAMPOS ESTÃO PREENCHIDOS =====
  // Verificar se o usuário digitou algo nos campos
  // Se não digitou nada, mostrar erro e parar a função
  if (!email.value || !senha.value) {
    // !email.value = se email está vazio (falsy)
    // || = OU (se email está vazio OU senha está vazia)
    // Se algum estiver vazio, entra neste if
    erro.value = 'Por favor, preencha todos os campos'
    // Mostra a mensagem de erro na tela
    return
    // return = para a execução da função aqui
    // Não continua para o Supabase se os campos estão vazios
  }

  // ===== PASSO 3: MOSTRAR QUE ESTÁ CARREGANDO =====
  // Muda carregando para true
  // Isso faz com que:
  // 1. O botão fica desabilitado (não pode clicar de novo)
  // 2. Aparece um spinner de carregamento
  carregando.value = true

  try {
    // ===== PASSO 4: TENTAR FAZER LOGIN COM O SUPABASE =====
    // supabase.auth.signInWithPassword() = função do Supabase que autentica o usuário
    // Recebe um objeto com email e password
    // Retorna um objeto com { data, error }
    // - data = informações do usuário se o login funcionou
    // - error = mensagem de erro se o login falhou
    const { error } = await supabase.auth.signInWithPassword({
      // email: email.value = envia o e-mail que o usuário digitou
      email: email.value,
      // password: senha.value = envia a senha que o usuário digitou
      password: senha.value
    })
    // await = espera o Supabase responder antes de continuar

    // ===== PASSO 5: VERIFICAR SE HOUVE ERRO =====
    // Se o Supabase retornou um erro, significa que:
    // - O e-mail não existe
    // - A senha está incorreta
    // - Algum outro problema de autenticação
    if (error) {
      // if (error) = se houve erro
      // O Supabase retorna um erro se o e-mail ou senha estiverem incorretos
      // Mostrar a mensagem de erro para o usuário
      erro.value = 'E-mail ou senha incorretos. Tente novamente.'
      // Desabilitar o carregamento (botão volta ao normal)
      carregando.value = false
      // return = para a função aqui, não continua
      return
    }

    // ===== PASSO 6: LOGIN BEM-SUCEDIDO - REDIRECIONAR =====
    // Se chegou aqui, significa que o login funcionou!
    // Não houve erro, então o usuário está autenticado
    // Agora precisamos levar o usuário para a página principal
    // router.push('/') = navega para a página inicial
    // '/' = rota raiz (onde está o AppLayout com a Sidebar)
    // Isso acontece sem recarregar a página (SPA - Single Page Application)
       router.push('/AppLayout')
    // Depois que router.push() é executado, o usuário é levado para a página inicial
  }
  // ===== PASSO 7: CAPTURAR ERROS INESPERADOS =====
  // Se houver um erro que não foi previsto (erro de rede, erro do servidor, etc)
  // Este catch captura e trata
  catch (err) {
    // err = objeto com informações do erro
    // Mostrar uma mensagem genérica para o usuário
    // Não mostramos o erro técnico para não assustar o usuário
    erro.value = 'Erro ao fazer login. Tente novamente mais tarde.'
    // Mostrar o erro completo no console do navegador (para debug)
    // Isso ajuda o desenvolvedor a entender o que deu errado
    console.error('Erro ao fazer login:', err)
    // Desabilitar o carregamento (botão volta ao normal)
    carregando.value = false
  }
}
</script>

<style scoped>
/* Importação da fonte Inter - Padrão para sistemas profissionais */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ===== CONTAINER PRINCIPAL ===== */
.container-login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* Gradiente sutil em vez de branco chapado */
  background: radial-gradient(circle at top left, #f8fafc, #f1f5f9);
  padding: 24px;
  font-family: 'Inter', sans-serif;
}

/* ===== CAIXA DO FORMULÁRIO (CARD) ===== */
.form-box {
  width: 100%;
  max-width: 420px;
  padding: 48px;
  border-radius: 16px; /* Bordas mais arredondadas são mais modernas */
  background-color: #ffffff;
  /* Sombra multicamada para parecer "real" */
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* ===== TÍTULOS ===== */
.titulo {
  font-size: 28px;
  /* Slate 900: um tom de cinza quase preto, mais elegante que azul puro */
  color: #0f172a; 
  font-weight: 700;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: -0.025em;
}

.subtitulo {
  font-size: 15px;
  color: #64748b; /* Slate 500 */
  text-align: center;
  margin-bottom: 32px;
}

/* ===== FORMULÁRIO ===== */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: #334155; /* Slate 700 */
  margin-left: 2px;
}

/* ===== INPUTS ===== */
.input {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #1e293b;
  background-color: #f8fafc;
  transition: all 0.2s ease-in-out;
}

.input::placeholder {
  color: #94a3b8;
}

.input:focus {
  outline: none;
  border-color: #2563eb; /* Azul Royal */
  background-color: #ffffff;
  /* Anel de foco suave */
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

/* ===== MENSAGEM DE ERRO ===== */
.mensagem-erro {
  padding: 12px;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 8px;
  color: #b91c1c;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  /* Animação de "shake" ao aparecer */
  animation: shake 0.4s ease-in-out;
}

/* ===== BOTÃO DE ENTRAR ===== */
.botao-entrar {
  margin-top: 8px;
  padding: 12px;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.botao-entrar:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-1px); /* Leve elevação ao passar o mouse */
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
}

.botao-entrar:active:not(:disabled) {
  transform: translateY(0);
}

.botao-entrar:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.7;
}

/* ===== DICA ===== */
.dica {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

/* Animação de erro */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 480px) {
  .form-box {
    padding: 32px 24px;
    box-shadow: none; /* Em telas muito pequenas, o design flat funciona melhor */
    border: none;
    background: transparent;
  }
  .container-login {
    background: #ffffff;
  }
}
</style>
