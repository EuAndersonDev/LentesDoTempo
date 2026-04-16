class Header extends HTMLElement {
    async connectedCallback() {
        const currentPage = this.getCurrentPage();
        const session = await this.resolveSession();
        const authActionsMarkup = this.getAuthActionsMarkup(session);

        this.innerHTML = `
            <header class="header">
                <div class="header__container">
                    <a href="/index.html" aria-label="Ir para a página inicial">
                        <img class="header__logo" alt="Logo Lentes do Tempo" src="/assets/icons/Logo.svg"/>
                    </a>
                    <div class="header__brand">
                        <i class="header__title">Lentes do Tempo</i>
                    </div>
                    <button class="header__menu-toggle" aria-label="Abrir menu" aria-expanded="false">
                        <span class="hamburger"></span>
                        <span class="hamburger"></span>
                        <span class="hamburger"></span>
                    </button>
                    <nav class="header__nav">
                        <div class="nav__item ${currentPage === 'servicos' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="/pages/main/servicos.html">Serviços</a>
                        </div>
                        <div class="nav__item ${currentPage === 'galeria' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="/pages/main/galeria.html">Portfolio</a>
                        </div>
                        <div class="nav__item ${currentPage === 'parcerias' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="/pages/main/parcerias.html">Parcerias</a>
                        </div>
                        <div class="nav__item ${currentPage === 'sobrenos' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="/pages/main/sobrenos.html">Sobre nós</a>
                        </div>
                        <div class="nav__item ${currentPage === 'eventos' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="/pages/main/eventos.html">Eventos</a>
                        </div>
                        <div class="nav__item ${currentPage === 'reloadpage' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="/pages/main/reloadpage.html">Reconstrução cenário</a>
                        </div>
                    </nav>
                    <div class="header__actions">
                        ${authActionsMarkup}
                    </div>
                </div>
            </header>
        `;

        this.setupMobileMenu();
        this.setupAuthActions();
    }

    async resolveSession() {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const user = this.getStoredUser();
        const apiBaseUrl = this.resolveApiBaseUrl();

        if (!token) {
            return { isAuthenticated: false, user: null };
        }

        try {
            if (window.validateJwtSession) {
                const isValid = await window.validateJwtSession();
                if (!isValid) {
                    return { isAuthenticated: false, user: null };
                }
            } else {
                const response = await fetch(`${apiBaseUrl}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    this.clearStoredSession();
                    return { isAuthenticated: false, user: null };
                }
            }

            return { isAuthenticated: true, user };
        } catch (error) {
            // Em falha de rede, mantem estado local para nao quebrar navegacao.
            return { isAuthenticated: true, user };
        }
    }

    resolveApiBaseUrl() {
        if (window.API_BASE_URL && typeof window.API_BASE_URL === 'string') {
            return window.API_BASE_URL;
        }

        const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        return isLocalHost
            ? 'http://localhost:3000/api'
            : 'https://SEU-BACKEND.onrender.com/api';
    }

    getStoredUser() {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');

        if (!userStr) {
            return null;
        }

        try {
            return JSON.parse(userStr);
        } catch (error) {
            return null;
        }
    }

    clearStoredSession() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
    }

    getAuthActionsMarkup(session) {
        if (!session.isAuthenticated) {
            return '<a class="header__auth-btn" href="/pages/auth/login.html">Entrar</a>';
        }

        const userName = session.user && session.user.name ? session.user.name : 'Conta';
        return `
            <button class="header__user-btn" type="button" title="Usuário autenticado">${userName}</button>
            <button class="header__logout-btn" type="button">Sair</button>
        `;
    }

    setupAuthActions() {
        const logoutButton = this.querySelector('.header__logout-btn');

        if (!logoutButton) {
            return;
        }

        logoutButton.addEventListener('click', () => {
            if (window.logout) {
                window.logout();
                return;
            }

            this.clearStoredSession();
            window.location.href = '/pages/auth/login.html';
        });
    }

    setupMobileMenu() {
        const toggle = this.querySelector('.header__menu-toggle');
        const nav = this.querySelector('.header__nav');

        if (toggle && nav) {
            toggle.addEventListener('click', () => {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!isExpanded));
                toggle.setAttribute('aria-label', isExpanded ? 'Abrir menu' : 'Fechar menu');
                nav.classList.toggle('header__nav--open');
                toggle.classList.toggle('header__menu-toggle--active');
            });

            // Fechar menu ao clicar em um link
            nav.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.setAttribute('aria-label', 'Abrir menu');
                    nav.classList.remove('header__nav--open');
                    toggle.classList.remove('header__menu-toggle--active');
                });
            });
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;

        if (path.includes('servicos')) return 'servicos';
        if (path.includes('galeria')) return 'galeria';
        if (path.includes('parcerias')) return 'parcerias';
        if (path.includes('sobrenos')) return 'sobrenos';
        if (path.includes('reloadpage')) return 'reloadpage';
        if (path.includes('eventos')) return 'eventos';
        if (path.includes('historia')) return 'historia';
        if (path.includes('acervo')) return 'acervo';

        return null;
    }
}

customElements.define("header-component", Header);