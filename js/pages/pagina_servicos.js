const imageContainer = document.querySelector('.image-container');
const handle = document.querySelector('.slider-handle');

function setPosition(clientX) {
    const rect = imageContainer.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.min(Math.max(pct, 0), 100);
    imageContainer.style.setProperty('--position', pct + '%');
}

handle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', function() {
        document.removeEventListener('mousemove', onMouseMove);
    }, { once: true });
});

function onMouseMove(e) {
    setPosition(e.clientX);
}

handle.addEventListener('touchstart', function(e) {
    e.preventDefault();
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', function() {
        document.removeEventListener('touchmove', onTouchMove);
    }, { once: true });
});

function onTouchMove(e) {
    e.preventDefault();
    setPosition(e.touches[0].clientX);
}

document.getElementById("btnEnviar").addEventListener("click", function(e) {
  e.preventDefault();

  document.getElementById("mensagem-sucesso").style.display = "block";

  document.getElementById("nome").value = "";
  document.getElementById("instituicao").value = "";
  document.getElementById("email").value = "";
  document.getElementById("mensagem").value = "";
});