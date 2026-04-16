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

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll('main section');
    const section2Items = document.querySelectorAll('#section2 .container');

    if (!sections.length) {
        return;
    }

    sections.forEach(section => {
        section.classList.add('scroll-reveal');
    });

    section2Items.forEach(item => {
        item.classList.add('section2-item-reveal');
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        sections.forEach(section => {
            section.classList.add('is-visible');
        });

        section2Items.forEach(item => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
    });

    sections.forEach(section => observer.observe(section));

    if (section2Items.length) {
        const section2Observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('is-visible', entry.isIntersecting);
            });
        }, {
            threshold: 0.35,
            rootMargin: '0px 0px -12% 0px',
        });

        section2Items.forEach(item => section2Observer.observe(item));
    }
});
