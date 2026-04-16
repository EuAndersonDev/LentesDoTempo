// Verificar se email foi fornecido
const resetEmail = localStorage.getItem('resetEmail');
if (!resetEmail) {
    window.location.href = 'forgot-password.html';
}

const FALLBACK_AUTH_API_BASE_URL = "https://backend-4scx.onrender.com/api";

function resolveAuthApiBaseUrl() {
    if (typeof window.API_BASE_URL === "string" && window.API_BASE_URL.trim()) {
        return window.API_BASE_URL.trim();
    }

    const metaTag = document.querySelector('meta[name="api-base-url"]');
    if (metaTag && typeof metaTag.content === "string" && metaTag.content.trim()) {
        return metaTag.content.trim();
    }

    return FALLBACK_AUTH_API_BASE_URL;
}

function createAuthApiFallbackClient() {
    const baseUrl = resolveAuthApiBaseUrl();

    const request = async (endpoint, data) => {
        let response;

        try {
            response = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            throw new Error("Nao foi possivel conectar ao servidor de autenticacao.");
        }

        const responseType = response.headers.get("content-type") || "";
        const payload = responseType.includes("application/json")
            ? await response.json()
            : null;

        if (!response.ok) {
            const errorMessage = payload && payload.error ? payload.error : "Erro na requisicao";
            throw new Error(errorMessage);
        }

        return payload;
    };

    return {
        login: (data) => request("/auth/login", data),
        register: (data) => request("/auth/register", data),
        forgotPassword: (data) => request("/auth/forgot-password", data),
        verifyCode: (data) => request("/auth/verify-code", data),
        resetPassword: (data) => request("/auth/reset-password", data),
    };
}

function getAuthApiClient() {
    if (typeof window.getAuthApi === "function") {
        try {
            const authApi = window.getAuthApi();
            if (authApi && typeof authApi.verifyCode === "function") {
                return authApi;
            }
        } catch (error) {
            console.warn("Falha ao obter API de autenticacao global:", error);
        }
    }

    return createAuthApiFallbackClient();
}

// Formatar input do código
const codeInput = document.getElementById('code');
codeInput.addEventListener('input', function (e) {
    // Remover caracteres não numéricos
    this.value = this.value.replace(/[^0-9]/g, '');
});

// Auto-submit quando preencher 6 dígitos
codeInput.addEventListener('input', function () {
    if (this.value.length === 6) {
        // Opcional: auto-submit
        // document.getElementById('verify-code-form').requestSubmit();
    }
});

// Reenviar código
document.getElementById('resend-link').addEventListener('click', async function (e) {
    e.preventDefault();

    const resendLink = this;
    resendLink.textContent = 'Enviando...';
    resendLink.style.pointerEvents = 'none';

    try {
        const authApi = getAuthApiClient();

        const data = await authApi.forgotPassword({ email: resetEmail });

        // Armazenar novo código se retornado
        if (data.code) {
            localStorage.setItem("resetCode", data.code);
            console.log("Novo código (dev):", data.code);
        }

        resendLink.textContent = 'Enviado!';
        setTimeout(() => {
            resendLink.textContent = 'Reenviar';
            resendLink.style.pointerEvents = 'auto';
        }, 3000);

    } catch (error) {
        resendLink.textContent = 'Erro ao reenviar';
        resendLink.style.pointerEvents = 'auto';
    }
});

document
    .getElementById("verify-code-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const code = document.getElementById("code").value;
        const errorDiv = document.getElementById("verify-error");
        const successDiv = document.getElementById("verify-success");
        const submitButton = document.getElementById("verify-submit-button");

        // Reset mensagens
        errorDiv.classList.remove("visible");
        successDiv.classList.remove("visible");
        errorDiv.textContent = "";

        // Validação
        if (code.length !== 6) {
            errorDiv.textContent = "O código deve ter 6 dígitos";
            errorDiv.classList.add("visible");
            return;
        }

        // Desabilitar botão
        submitButton.disabled = true;
        submitButton.textContent = "Verificando...";

        try {
            const authApi = getAuthApiClient();

            await authApi.verifyCode({ email: resetEmail, code });

            // Sucesso - armazenar que código foi verificado e preservar o codigo para o reset.
            localStorage.setItem("codeVerified", "true");
            localStorage.setItem("resetCode", code);

            successDiv.classList.add("visible");

            // Redirecionar para página de redefinir senha
            setTimeout(() => {
                window.location.href = "reset-password.html";
            }, 1000);

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add("visible");
            submitButton.disabled = false;
            submitButton.textContent = "Verificar código";
        }
    });
