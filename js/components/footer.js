class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="footer">
            <div class="footer__top">
                <div class="logo-title">
                    <img src="../../assets/icons/Logo.svg" alt="" />
                    <h2 class="footer__title">Lentes do Tempo</h2>
                </div>
                <div class="footer__location">
                    <img
                        class="footer__location-icon"
                        src="../../assets/icons/Footer/Location.svg"
                        alt="Ícone de localização"
                    />
                    <span class="footer__location-text">Brasil</span>
                </div>
            </div>

            <hr class="footer__separator" />

            <nav class="footer__nav">
                <section class="footer__section">
                    <h3 class="footer__section-title">Sobre nós</h3>
                    <ul class="footer__list">
                        <li>
                            <a href="/pages/main/sobrenos.html" class="footer__link">Nossa empresa</a>
                        </li>
                        <li><a href="/pages/main/sobrenos.html" class="footer__link">História</a></li>
                    </ul>
                </section>

                <section class="footer__section">
                    <h3 class="footer__section-title">Precisa de ajuda?</h3>
                    <ul class="footer__list">
                        <li>
                            <a href="/pages/secondary/perguntas-frequentes.html" class="footer__link"
                                >Perguntas frequentes</a
                            >
                        </li>
                        <li>
                            <a href="/pages/secondary/contato.html" class="footer__link">Contate-nos</a>
                        </li>
                    </ul>
                </section>

                <section class="footer__section">
                    <h3 class="footer__section-title">Legal</h3>
                    <ul class="footer__list">
                        <li>
                            <a href="/pages/secondary/termos-uso.html" class="footer__link">Termos de uso</a>
                        </li>
                        <li>
                            <a href="/pages/secondary/cookies.html" class="footer__link"
                                >Configuração de cookies</a
                            >
                        </li>
                    </ul>
                </section>
            </nav>

            <div class="footer__social">
                <a href="#" class="footer__social-link" aria-label="Instagram">
                    <img src="../../assets/icons/Footer/Instagram.svg" alt="" />
                </a>
                <a href="#" class="footer__social-link" aria-label="YouTube">
                    <img src="../../assets/icons/Footer/Youtube.svg" alt="" />
                </a>
                <a href="#" class="footer__social-link" aria-label="Facebook">
                    <img src="../../assets/icons/Footer/Linkedin.svg" alt="" />
                </a>
                <button class="footer__theme-toggle" aria-label="Alternar tema">
                    <img src="../../assets/icons/Footer/Acessibilidade.svg" alt="" />
                </button>
            </div>

            <hr class="footer__separator" />

            <div class="footer__bottom">
                <p class="footer__copyright">© 2026 Lentes do Tempo</p>
            </div>
        </footer>
        `;
    }
}

customElements.define('footer-component', Footer);