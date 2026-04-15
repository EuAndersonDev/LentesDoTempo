document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector('.carousel-foto');
    const next = document.querySelector('.next');
    const prev = document.querySelector('.prev');

    next.addEventListener('click', () => {
        slider.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });

    prev.addEventListener('click', () => {
        slider.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });
});