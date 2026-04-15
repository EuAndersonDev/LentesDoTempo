document.addEventListener("DOMContentLoaded", () => {
    // Verifica se veio de um zoom na página anterior
    if (sessionStorage.getItem('zoomedTransition') !== 'true') {
        return;
    }

    sessionStorage.removeItem('zoomedTransition');

    const overlay = document.createElement('div');
    overlay.className = 'zoom-transition-overlay';
    document.body.appendChild(overlay);

    // Forca o primeiro paint com o overlay totalmente escuro antes do fade.
    void overlay.offsetHeight;

    window.setTimeout(() => {
        overlay.classList.add('is-opening');
    }, 20);

    overlay.addEventListener('transitionend', () => {
        overlay.remove();
    }, { once: true });

    window.setTimeout(() => {
        if (overlay.isConnected) {
            overlay.remove();
        }
    }, 2400);
});
