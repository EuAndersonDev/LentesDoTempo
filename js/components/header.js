class Header extends HTMLElement {
    connectedCallback() {
        const currentPage = this.getCurrentPage();

        this.innerHTML = `
            <header class="header">
                <div class="header__container">
                    <img class="header__logo" alt="Logo Lentes do Tempo"  src="/assets/icons/logo.svg"/>
                    <div class="header__brand">
                        <i class="header__title">Lentes do Tempo</i>
                    </div>
                    <nav class="header__nav">
                        <div class="nav__item ${currentPage === 'servicos' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="../pages/servicos.html">Serviços</a>
                        </div>
                        <div class="nav__item ${currentPage === 'galeria' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="../pages/galeria.html">Portfolio</a>
                        </div>
                        <div class="nav__item ${currentPage === 'parcerias' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="../pages/parcerias.html">Parcerias</a>
                        </div>
                        <div class="nav__item ${currentPage === 'sobrenos' ? 'nav__item--active' : ''}">
                            <a class="nav__link" href="../pages/sobrenos.html">Sobre nós</a>
                        </div>
                        <div class="nav__item">
                            <a class="nav__link" href="#vr-simulator">VR Simulator</a>
                        </div>
                    </nav>
                </div>
            </header>
        `;
    }

    getCurrentPage() {
        const path = window.location.pathname;

        if (path.includes('servicos')) return 'servicos';
        if (path.includes('galeria')) return 'galeria';
        if (path.includes('parcerias')) return 'parcerias';
        if (path.includes('sobrenos')) return 'sobrenos';
        if (path.includes('eventos')) return 'eventos';
        if (path.includes('historia')) return 'historia';
        if (path.includes('acervo')) return 'acervo';

        return null;
    }
}

customElements.define("header-component", Header);