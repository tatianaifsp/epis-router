<template>
  <div class="layout-container">
    <Menu />

    <main class="home">
      <!-- Hero Section -->
      <section class="home__hero">
        <div class="home__hero-content">
          <div class="home__hero-texto">
            <h1>Gestão de EPI</h1>
            <p>Controle de inventário, monitoramento de validades e conformidade legal em uma única plataforma.</p>
            <button class="btn-primary">Acessar Painel</button>
          </div>

          <div class="home__hero-carousel">
            <transition-group name="fade" tag="div" class="carousel-container">
              <div 
                v-for="(img, index) in imagensEpi" 
                :key="img" 
                v-show="index === currentImage"
                class="carousel-item"
              >
                <img :src="img" alt="Equipamento de Proteção" class="carousel-img" />
              </div>
            </transition-group>
            
            <div class="carousel-dots">
              <span 
                v-for="(_, index) in imagensEpi" 
                :key="index"
                :class="['dot', { active: index === currentImage }]"
              ></span>
            </div>
          </div>
        </div>
      </section>

      <!-- Indicadores -->
      <section class="home__cards">
        <div class="card">
          <div class="card__header">
            <span class="card__icone">🛡️</span>
            <span class="card__label">Total EPIs</span>
          </div>
          <span class="card__numero">124</span>
        </div>

        <div class="card">
          <div class="card__header">
            <span class="card__icone">👥</span>
            <span class="card__label">Colaboradores</span>
          </div>
          <span class="card__numero">48</span>
        </div>

        <div class="card">
          <div class="card__header">
            <span class="card__icone">📝</span>
            <span class="card__label">Entregas</span>
          </div>
          <span class="card__numero">89</span>
        </div>

        <div class="card card--alerta">
          <div class="card__header">
            <span class="card__icone">⚠️</span>
            <span class="card__label">Vencendo</span>
          </div>
          <span class="card__numero">07</span>
        </div>
      </section>

      <!-- Fluxo -->
      <section class="home__instrucoes">
        <h2 class="home__section-title">Fluxo de Trabalho</h2>
        <div class="home__passos">
          <div class="passo" v-for="(passo, idx) in passos" :key="idx">
            <span class="passo__numero">{{ idx + 1 }}</span>
            <h3>{{ passo.titulo }}</h3>
            <p>{{ passo.desc }}</p>
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
  components: { Menu, Footer },
  data() {
    return {
      currentImage: 0,
      timer: null,
      // Lista de imagens corrigida
      imagensEpi: [
        'https://images.unsplash.com/photo-1513624954087-ca7109c0f710?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=600&q=80',
        
              ],
      passos: [
        { titulo: 'Time', desc: 'Registre colaboradores e setores.' },
        { titulo: 'Estoque', desc: 'Gestão de CAs e validades.' },
        { titulo: 'Entrega', desc: 'Controle de fichas e protocolos.' },
        { titulo: 'Auditoria', desc: 'Relatórios e BI de segurança.' }
      ]
    }
  },
  mounted() {
    this.startCarousel();
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
    startCarousel() {
      this.timer = setInterval(() => {
        this.currentImage = (this.currentImage + 1) % this.imagensEpi.length;
      }, 5000);
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.home {
  flex: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
}

/* Hero */
.home__hero {
  background: #0f172a;
  border-radius: 20px;
  padding: 3rem;
  color: #ffffff;
  margin-bottom: 2.5rem;
}

.home__hero-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  align-items: center;
  gap: 3rem;
}

.home__hero-texto h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.home__hero-texto p {
  color: #94a3b8;
  line-height: 1.6;
}

/* Carrossel */
.home__hero-carousel {
  width: 320px;
  height: 220px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #1e293b;
}

.carousel-container {
  width: 100%;
  height: 100%;
}

.carousel-item {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  background: rgba(255,255,255,0.3);
  border-radius: 50%;
}

.dot.active {
  background: #ffffff;
  width: 14px;
  border-radius: 3px;
}

/* Cards */
.home__cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  margin-bottom: 3.5rem;
}

.card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card__numero {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  margin-top: 0.5rem;
  color: #0f172a;
}

.card--alerta { border-top: 4px solid #f59e0b; }

/* Passos */
.home__section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #0f172a;
}

.home__passos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.passo__numero {
  display: inline-block;
  background: #2563eb;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.btn-primary {
  margin-top: 1.5rem;
  padding: 0.8rem 2rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

/* Animação */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .home__hero-content { grid-template-columns: 1fr; text-align: center; }
  .home__hero-carousel { display: none; }
  .home__cards, .home__passos { grid-template-columns: repeat(2, 1fr); }
}
</style>