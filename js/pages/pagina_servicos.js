const imageContainer = document.querySelector('.image-container');
const handle = document.querySelector('.slider-handle');
const form = document.getElementById('service-request-form');
const submitButton = document.getElementById('btnEnviar');
const customAlert = document.getElementById('custom-alert');
const customAlertMessage = document.getElementById('custom-alert-message');
const customAlertCloseButton = document.getElementById('custom-alert-close');
const ALERT_DURATION_MS = 3000;
let customAlertTimeoutId = null;

function setPosition(clientX) {
    if (!imageContainer) {
        return;
    }

    const rect = imageContainer.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.min(Math.max(pct, 0), 100);
    imageContainer.style.setProperty('--position', pct + '%');
}

if (handle) {
    handle.addEventListener('mousedown', function (e) {
        e.preventDefault();
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', function () {
            document.removeEventListener('mousemove', onMouseMove);
        }, { once: true });
    });

    handle.addEventListener('touchstart', function (e) {
        e.preventDefault();
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', function () {
            document.removeEventListener('touchmove', onTouchMove);
        }, { once: true });
    });
}

function onMouseMove(e) {
    setPosition(e.clientX);
}

function onTouchMove(e) {
    e.preventDefault();
    setPosition(e.touches[0].clientX);
}

function showCustomAlert(message, type) {
    if (!customAlert || !customAlertMessage) {
        return;
    }

    customAlert.classList.remove('custom-alert--success', 'custom-alert--error', 'custom-alert--info');
    customAlert.classList.add(`custom-alert--${type}`);
    customAlertMessage.textContent = message;
    customAlert.hidden = false;

    if (customAlertTimeoutId) {
        clearTimeout(customAlertTimeoutId);
    }

    customAlertTimeoutId = setTimeout(function () {
        customAlert.hidden = true;
        customAlertTimeoutId = null;
    }, ALERT_DURATION_MS);
}

function hideCustomAlert() {
    if (!customAlert) {
        return;
    }

    if (customAlertTimeoutId) {
        clearTimeout(customAlertTimeoutId);
        customAlertTimeoutId = null;
    }

    customAlert.hidden = true;
}

if (customAlertCloseButton) {
    customAlertCloseButton.addEventListener('click', hideCustomAlert);
}

function validateServiceRequestPayload(payload) {
    if (!payload.name || payload.name.length < 2) {
        showCustomAlert('Informe um nome valido com pelo menos 2 caracteres.', 'error');
        return false;
    }

    if (!payload.institution || payload.institution.length < 2) {
        showCustomAlert('Informe uma instituicao valida com pelo menos 2 caracteres.', 'error');
        return false;
    }

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        showCustomAlert('Digite um e-mail valido.', 'error');
        return false;
    }

    if (!payload.message || payload.message.length < 10) {
        showCustomAlert('A mensagem precisa ter no minimo 10 caracteres.', 'error');
        return false;
    }

    return true;
}

if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const payload = {
            name: document.getElementById('nome').value.trim(),
            institution: document.getElementById('instituicao').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('mensagem').value.trim(),
        };

        if (!validateServiceRequestPayload(payload)) {
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'ENVIANDO...';
            showCustomAlert('Enviando sua solicitacao...', 'info');

            if (!window.api || !window.api.contact || typeof window.api.contact.serviceRequest !== 'function') {
                throw new Error('API de contato indisponivel no momento.');
            }

            await window.api.contact.serviceRequest(payload);
            form.reset();
            showCustomAlert('Recebemos sua solicitacao e entraremos em contato em breve.', 'success');
        } catch (error) {
            const fallbackMessage = 'Nao foi possivel enviar sua solicitacao. Tente novamente em instantes.';
            showCustomAlert(error && error.message ? error.message : fallbackMessage, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'ENVIAR';
        }
    });
}