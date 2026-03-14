<template>
  <div class="layout-container">
    <Menu />
    
    <main class="home">
      <section class="home__hero">
        <div class="home__hero-texto">
          <h1>Sistema de Gestão de EPI</h1>
          <p>Gerencie os EPIs dos seus colaboradores de forma simples e segura.</p>
        </div>

        <div class="home__hero-imagem">
          <img
            src="@/assets/hero.jpg"
            alt="Ilustração de gestão de EPI"
            class="home__hero-img"
          />
        </div>
      </section>

      <section class="home__cards">
        <div class="card">
          <span class="card__icone">🪖</span>
          <span class="card__numero">124</span>
          <span class="card__label">Total de EPIs</span>
        </div>

        <div class="card">
          <span class="card__icone">👷</span>
          <span class="card__numero">48</span>
          <span class="card__label">Colaboradores</span>
        </div>

        <div class="card">
          <span class="card__icone">📦</span>
          <span class="card__numero">89</span>
          <span class="card__label">Entregas realizadas</span>
        </div>

        <div class="card card--alerta">
          <span class="card__icone">⚠️</span>
          <span class="card__numero">7</span>
          <span class="card__label">EPIs vencendo</span>
        </div>
      </section>

      <section class="home__instrucoes">
        <h2 class="home__instrucoes-titulo">Como usar o sistema</h2>
        <div class="home__passos">
          <div class="passo">
            <span class="passo__numero">1</span>
            <h3>Cadastre os colaboradores</h3>
            <p>Acesse o menu Colaboradores e registre cada funcionário com seus dados.</p>
          </div>

          <div class="passo">
            <span class="passo__numero">2</span>
            <h3>Cadastre os EPIs</h3>
            <p>Vá em Equipamentos e adicione os EPIs disponíveis com validade e quantidade.</p>
          </div>

          <div class="passo">
            <span class="passo__numero">3</span>
            <h3>Registre as entregas</h3>
            <p>Em Entregas, vincule o EPI ao colaborador e registre a data de entrega.</p>
          </div>

          <div class="passo">
            <span class="passo__numero">4</span>
            <h3>Acompanhe os relatórios</h3>
            <p>Monitore validades e histórico de entregas pelo menu Relatórios.</p>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Home',
  components: {
    Menu,
    Footer
  }
}
</script>

<style scoped>
/* ───── Layout geral ───── */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.home {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

/* ───── Hero ───── */
.home__hero {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.home__hero-texto h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 0.5rem;
}

.home__hero-texto p {
  font-size: 1rem;
  color: #6b7280;
}

.home__hero-imagem {
  flex-shrink: 0;
}

.home__hero-img {
  width: 320px;
  max-width: 100%;
  border-radius: 12px;
}

/* ───── Cards ───── */
.home__cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 1.5rem 1rem;
  background: #ffffff;
  border: 1px solid #f0ede8;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.card--alerta {
  border-color: #fca97a;
  background: #fff7f2;
}

.card__icone {
  font-size: 2rem;
}

.card__numero {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e3a5f;
}

.card__label {
  font-size: 0.85rem;
  color: #6b7280;
}

/* ───── Instruções ───── */
.home__instrucoes {
  margin-bottom: 3rem;
}

.home__instrucoes-titulo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e3a5f;
  margin-bottom: 1.5rem;
}

.home__passos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.passo {
  background: #ffffff;
  border: 1px solid #f0ede8;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.passo__numero {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ea5b0c;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.passo h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1e3a5f;
  margin-bottom: 0.4rem;
}

.passo p {
  font-size: 0.85rem;
  color: #6b7280;
  line-height: 1.5;
}

/* ───── Responsivo ───── */
@media (max-width: 768px) {
  .home__hero {
    flex-direction: column;
  }

  .home__cards,
  .home__passos {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .home__cards,
  .home__passos {
    grid-template-columns: 1fr;
  }
}
</style>