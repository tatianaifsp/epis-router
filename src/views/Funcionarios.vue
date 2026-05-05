<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Controle de Efetivo</h1>
      <p>Gerencie o cadastro de colaboradores e organize por setores.</p>
    </header>

    <main class="content">
      <!-- Seção de Formulário -->
      <section class="card card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Alterar Registro' : 'Novo Funcionário' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome Completo</label>
              <input v-model="form.nome" type="text" id="nome" placeholder="Digite o nome" required>
            </div>
            <div class="form-group">
              <label for="matricula">Nº Matrícula</label>
              <input v-model="form.matricula" type="text" id="matricula" placeholder="Ex: 5542" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="setor">Setor</label>
              <input v-model="form.setor" type="text" id="setor" placeholder="Ex: Manutenção" required>
            </div>
            <div class="form-group">
              <label for="cargo">Cargo</label>
              <input v-model="form.cargo" type="text" id="cargo" placeholder="Ex: Pedreiro" required>
            </div>
          </div>
          
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Atualizar Dados' : 'Finalizar Cadastro' }}
            </button>
            <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <!-- Seção de Tabela -->
      <section class="card card-table">
        <div class="table-container">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Matrícula</th>
                <th>Setor / Cargo</th>
                <th class="text-center">Gerenciar</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="f in funcionarios" :key="f.id">
                <td><span class="text-bold">{{ f.nome }}</span></td>
                <td>{{ f.matricula }}</td>
                <td>
                  <span class="badge badge-ok">{{ f.setor }}</span>
                  <span class="cargo-text">{{ f.cargo }}</span>
                </td>
                <td class="text-center">
                  <button @click="prepararEdicao(f)" class="btn-action edit" title="Editar">
                    Editar
                  </button>
                  <button @click="excluir(f.id)" class="btn-action delete" title="Excluir">
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSupabase } from '../composables/useSupabase';
const { supabase } = useSupabase();

const funcionarios = ref([]);
const editandoId = ref(null);
const form = reactive({ 
  nome: '', 
  matricula: '', 
  setor: '', 
  cargo: '' 
});

const carregar = async () => {
  const { data, error } = await supabase.from('funcionarios').select('*').order('nome');
  if (error) console.error("Erro ao carregar:", error.message);
  else funcionarios.value = data || [];
};

const salvar = async () => {
  if (editandoId.value) {
    await supabase.from('funcionarios').update(form).eq('id', editandoId.value);
  } else {
    await supabase.from('funcionarios').insert([form]);
  }
  cancelarEdicao();
  carregar();
};

const prepararEdicao = (f) => {
  editandoId.value = f.id;
  Object.assign(form, { 
    nome: f.nome, 
    matricula: f.matricula, 
    setor: f.setor, 
    cargo: f.cargo 
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const excluir = async (id) => {
  if (confirm('Deseja realmente remover este registro?')) {
    await supabase.from('funcionarios').delete().eq('id', id);
    carregar();
  }
};

const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome: '', matricula: '', setor: '', cargo: '' });
};

onMounted(carregar);
</script>

<style scoped>
/* 1. Fundo totalmente branco no container principal e Reset */
.layout-container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 10px 20px 20px 20px; 
  font-family: 'Inter', sans-serif; 
  background: #ffffff; 
  min-height: 100vh; 
}

/* 2. Ajuste do cabeçalho para subir o texto */
.header-section { 
  margin-bottom: 20px; 
  margin-top: 0; 
}

.header-section h1 {
  margin-top: 0; 
  padding-top: 0;
  font-size: 1.8rem;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.header-section p {
  margin-top: -5px; 
  color: #64748b;
  font-size: 0.9rem;
}

/* 3. Cards Estilizados */
.card { 
  background: white; 
  border: 1px solid #f1f5f9; 
  border-radius: 12px; 
  margin-bottom: 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
  overflow: hidden;
}

.card-header {
  background-color: #f8fafc;
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.card-header h3 {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin: 0;
}

.main-form { padding: 20px; }

/* 4. Grid e Formulários */
.form-row { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 15px; 
  margin-bottom: 15px;
}

.form-group { 
  display: flex; 
  flex-direction: column; 
  gap: 5px; 
}

label {
  font-size: 0.8rem; 
  font-weight: bold; 
  color: #475569; 
}

input { 
  padding: 10px; 
  border: 1px solid #cbd5e1; 
  border-radius: 6px; 
  font-size: 0.9rem;
  transition: 0.2s;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* 5. Botões */
.action-bar { margin-top: 15px; display: flex; gap: 10px; }

.btn { 
  padding: 10px 20px; 
  border-radius: 6px; 
  border: none; 
  cursor: pointer; 
  font-weight: bold; 
  transition: 0.2s; 
  font-size: 0.85rem;
}

.btn-primary { background: #2563eb; color: white; }
.btn-primary:hover { background: #1d4ed8; }

.btn-outline { 
  background: white; 
  color: #64748b; 
  border: 1px solid #cbd5e1; 
}
.btn-outline:hover { background: #f8fafc; }

/* 6. Tabela Profissional */
.table-container { width: 100%; overflow-x: auto; }

.styled-table { 
  width: 100%; 
  border-collapse: collapse; 
  background: white; 
}

.styled-table th { 
  background: #f8fafc; 
  padding: 12px 20px; 
  text-align: left; 
  font-size: 0.75rem; 
  color: #64748b; 
  text-transform: uppercase; 
  border-bottom: 1px solid #edf2f7; 
}

.styled-table td { 
  padding: 14px 20px; 
  border-top: 1px solid #f1f5f9; 
  font-size: 0.9rem; 
  color: #334155;
}

.text-bold { font-weight: 600; color: #0f172a; }

/* 7. Badges e Textos */
.badge { 
  padding: 4px 10px; 
  border-radius: 12px; 
  font-size: 0.7rem; 
  font-weight: bold; 
  margin-right: 8px;
}

.badge-ok { background: #dcfce7; color: #166534; }

.cargo-text { color: #64748b; font-size: 0.85rem; }

/* 8. Ações da Tabela */
.btn-action {
  background: none;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.85rem;
  transition: 0.2s;
}

.edit { color: #2563eb; margin-right: 12px; }
.edit:hover { text-decoration: underline; }

.delete { color: #be123c; }
.delete:hover { text-decoration: underline; }

.text-center { text-align: center; }

@media (max-width: 600px) {
  .layout-container { padding: 10px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>