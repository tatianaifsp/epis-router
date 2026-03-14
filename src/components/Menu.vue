<template>
  <header class="navbar">
    <div class="navbar__marca">
      <img
        src="../assets/logo_episuse.svg"
        alt="Logo EPI"
        class="navbar__logo"
      />
    </div>

    <nav aria-label="Menu principal">
      <ul class="navbar__lista">
        <li><RouterLink to="/" class="navbar__link">Dashboard</RouterLink></li>
        <li><RouterLink to="/colaboradores" class="navbar__link">Colaboradores</RouterLink></li>
        <li><RouterLink to="/equipamentos" class="navbar__link">Equipamentos</RouterLink></li>
        <li><RouterLink to="/entregas" class="navbar__link">Entregas</RouterLink></li>
        <li><RouterLink to="/relatorios" class="navbar__link">Relatórios</RouterLink></li>
      </ul>
    </nav>

    <RouterLink to="/login" class="navbar__login">
      <button type="button" class="navbar__btn">Entrar</button>
    </RouterLink>
  </header>
</template>

<script>
export default {
  name: 'Menu'
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 58px;
  background: #ffffff;
  border-bottom: 1px solid #f0ede8;
  gap: 1rem;
}

.navbar__marca {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.navbar__logo {
  height: 80px;
  width: auto;
  display: block;
}

.navbar__lista {
  display: flex;
  align-items: center;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar__link {
  display: block;
  padding: 6px 12px;
  border-radius: 7px;
  font-size: 13.5px;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.navbar__link:hover {
  background: #fef3ea;
  color: #c2500a;
}

.navbar__link.router-link-active {
  background: #fff4ed;
  color: #ea5b0c;
  font-weight: 600;
}

.navbar__login {
  text-decoration: none;
  flex-shrink: 0;
}

.navbar__btn {
  padding: 7px 18px;
  border-radius: 8px;
  border: none;
  background: #ea5b0c;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.navbar__btn:hover {
  background: #d14e09;
}

.navbar__btn:active {
  transform: scale(0.97);
}
</style>