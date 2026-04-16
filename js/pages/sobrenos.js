document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector('.carousel-foto');
    if (!slider) return;
    const teamCards = slider.querySelectorAll('.card-equipe');

    slider.style.scrollBehavior = 'auto';
    const speed = 0.09;
    let rafId = null;
    let lastTime = null;

    const getCardWidth = () => {
        const firstCard = slider.querySelector('.card-equipe');
        const gap = Number(getComputedStyle(slider).gap.replace('px', '')) || 0;
        return firstCard ? firstCard.offsetWidth + gap : 0;
    };

    const animate = (time) => {
        if (lastTime === null) {
            lastTime = time;
        }

        const delta = time - lastTime;
        lastTime = time;

        slider.scrollLeft += speed * delta;

        const cardWidth = getCardWidth();
        if (cardWidth > 0 && slider.scrollLeft >= cardWidth) {
            const firstCard = slider.querySelector('.card-equipe');
            if (firstCard) {
                slider.appendChild(firstCard);
                slider.scrollLeft -= cardWidth;
            }
        }

        rafId = requestAnimationFrame(animate);
    };

    const startAutoplay = () => {
        if (rafId) return;
        lastTime = null;
        rafId = requestAnimationFrame(animate);
    };

    const stopAutoplay = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
            lastTime = null;
        }
    };

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('focusin', stopAutoplay);
    slider.addEventListener('focusout', startAutoplay);

    teamCards.forEach((card) => {
        card.addEventListener('click', (event) => {
            if (event.target.closest('.card-social-link')) {
                return;
            }

            card.classList.toggle('is-flipped');
        });

        card.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }

            event.preventDefault();
            card.classList.toggle('is-flipped');
        });
    });

    startAutoplay();
});