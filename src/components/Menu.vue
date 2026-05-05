<template>
  <header class="navbar">
    <div class="navbar__container">
      <div class="navbar__marca">
                <span class="navbar__brand-name">SGE EPI </span>
      </div>

      <nav class="navbar__nav" aria-label="Menu principal">
        <ul class="navbar__lista">
          <li>
            <RouterLink to="/" class="navbar__link">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/login" class="navbar__link">Dashboard</RouterLink>
          </li>
          <li>
            <RouterLink to="/login" class="navbar__link">Equipamentos</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="navbar__actions">
            <RouterLink to="/login" class="navbar__btn-container">
          <button type="button" class="navbar__btn">Começar agora</button>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Menu'
}
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar__container {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__marca {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.navbar__logo {
  height: 32px; /* Logo mais discreta e elegante */
  width: auto;
}

.navbar__brand-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.navbar__brand-name span {
  color: #2563eb;
}

.navbar__lista {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar__link {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
}

.navbar__link:hover {
  color: #0f172a;
  background: #f1f5f9;
}

/* Estado ativo do link */
.navbar__link.router-link-active {
  color: #2563eb;
  background: #eff6ff;
  font-weight: 600;
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.navbar__login-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.navbar__login-link:hover {
  color: #2563eb;
}

.navbar__btn-container {
  text-decoration: none;
}

.navbar__btn {
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: #0f172a; /* Botão escuro para contraste profissional */
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.navbar__btn:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.navbar__btn:active {
  transform: translateY(0);
}

/* Responsividade */
@media (max-width: 768px) {
  .navbar__nav {
    display: none; /* Em sistemas reais, aqui entraria um menu hamburguer */
  }
}
</style>