<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__content">
        <!-- Coluna Institucional -->
        <div class="footer__brand">
          <span class="footer__logo">SGE<span>EPI</span></span>
          <p class="footer__description">
            Solução completa para controle e monitoramento de Equipamentos de Proteção Individual.
          </p>
        </div>

        <!-- Coluna Contato -->
        <div class="footer__section">
          <h4 class="footer__title">Suporte</h4>
          <a href="mailto:suporte@epi.com" class="footer__link">suporte@epi.com</a>
          <p class="footer__text">Seg — Sex, 08h às 18h</p>
        </div>

        <!-- Coluna Redes -->
        <div class="footer__section">
          <h4 class="footer__title">Social</h4>
          <nav class="footer__social">
            <a href="https://br.linkedin.com/" target="_blank" class="footer__link">LinkedIn</a>
            <a href="https://www.instagram.com/" target="_blank" class="footer__link">Instagram</a>
            <a href="https://pt-br.facebook.com/" target="_blank" class="footer__link">Facebook</a>
          </nav>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© 2026 Sistema de Gestão de EPI — Todos os direitos reservados</p>
        <div class="footer__legal">
          <a href="#">Termos</a>
          <a href="#">Privacidade</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #0f172a; /* Navy muito escuro (Slate 900) */
  color: #f8fafc;
  padding: 4rem 2rem 2rem;
  margin-top: auto;
  border-top: 1px solid #1e293b;
  width: 100%;
}

.footer__container {
  max-width: 1100px;
  margin: 0 auto;
}

.footer__content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer__brand {
  max-width: 300px;
}

.footer__logo {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  display: block;
  margin-bottom: 1rem;
}

.footer__logo span {
  color: #3b82f6; /* Azul destaque suave */
}

.footer__description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #94a3b8;
}

.footer__title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ffffff;
  margin-bottom: 1.25rem;
}

.footer__section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__link {
  font-size: 0.9rem;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer__link:hover {
  color: #3b82f6;
}

.footer__text {
  font-size: 0.85rem;
  color: #64748b;
}

.footer__social {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Bottom Bar */
.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid #1e293b;
  font-size: 0.8rem;
  color: #64748b;
}

.footer__legal {
  display: flex;
  gap: 1.5rem;
}

.footer__legal a {
  color: #64748b;
  text-decoration: none;
}

.footer__legal a:hover {
  text-decoration: underline;
}

/* Responsividade */
@media (max-width: 768px) {
  .footer__content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }

  .footer__brand {
    max-width: 100%;
  }

  .footer__bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>