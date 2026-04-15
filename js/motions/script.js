document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById('museum-video');
    const scrollBound = document.querySelector('.scroll-bound');
    const menuOverlay = document.getElementById('menu-overlay');
    const container = document.getElementById('video-container');
    const hotspots = document.querySelectorAll('.hotspot');

    // Função que inicia o ouvinte de scroll
    function initScrollEngine() {
        let currentProgress = 0;
        let targetProgress = 0;
        let rafId = null;

        function getMaxScroll() {
            return Math.max(scrollBound.offsetHeight - window.innerHeight, 1);
        }

        function renderFrame() {
            const smoothing = 0.085;
            currentProgress += (targetProgress - currentProgress) * smoothing;

            if (Math.abs(targetProgress - currentProgress) < 0.0005) {
                currentProgress = targetProgress;
            }

            if (video.duration && Number.isFinite(video.duration)) {
                video.currentTime = video.duration * currentProgress;
            }

            menuOverlay.classList.toggle('visible', currentProgress > 0.95);

            if (Math.abs(targetProgress - currentProgress) > 0.0005) {
                rafId = window.requestAnimationFrame(renderFrame);
            } else {
                rafId = null;
            }
        }

        window.addEventListener('scroll', () => {
            const scrollPercentage = Math.max(0, Math.min(window.scrollY / getMaxScroll(), 1));
            targetProgress = scrollPercentage;

            if (rafId === null) {
                rafId = window.requestAnimationFrame(renderFrame);
            }
        }, { passive: true });

        window.addEventListener('resize', () => {
            targetProgress = Math.max(0, Math.min(window.scrollY / getMaxScroll(), 1));
            if (rafId === null) {
                rafId = window.requestAnimationFrame(renderFrame);
            }
        });

        targetProgress = Math.max(0, Math.min(window.scrollY / getMaxScroll(), 1));
        currentProgress = targetProgress;
        renderFrame();
    }

    // Aguarda os metadados do vídeo carregarem para sabermos a duração exata
    if (video.readyState >= 1) {
        initScrollEngine();
    } else {
        video.addEventListener('loadedmetadata', initScrollEngine);
    }

    // Lógica de Zoom Direcionado
    hotspots.forEach(spot => {
        spot.addEventListener('click', function (e) {
            e.preventDefault();

            // Captura as coordenadas X e Y e a URL de destino
            const targetX = this.getAttribute('data-x');
            const targetY = this.getAttribute('data-y');
            const targetUrl = this.getAttribute('data-target');

            // Define a origem do zoom para o ponto exato onde houve o clique
            container.style.transformOrigin = `${targetX}% ${targetY}%`;

            // Oculta os hotspots instantaneamente para um visual mais limpo
            menuOverlay.style.opacity = '0';
            menuOverlay.style.pointerEvents = 'none';

            // Salva no sessionStorage que houve um zoom para a próxima página
            sessionStorage.setItem('zoomedTransition', 'true');

            // Dispara a animação no CSS
            container.classList.add('zoomed');

            // Aguarda o zoom ficar completo e depois redireciona para a próxima página
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 2200);
        });
    });
});