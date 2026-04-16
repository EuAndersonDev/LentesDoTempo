// Verificar se email e código foram verificados
const resetEmail = localStorage.getItem('resetEmail');
const codeVerified = localStorage.getItem('codeVerified');

if (!resetEmail || codeVerified !== 'true') {
    window.location.href = 'forgot-password.html';
}

// Mostrar código armazenado (para debug em desenvolvimento)
console.log('Reset password for:', resetEmail);

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
            if (authApi && typeof authApi.resetPassword === "function") {
                return authApi;
            }
        } catch (error) {
            console.warn("Falha ao obter API de autenticacao global:", error);
        }
    }

    return createAuthApiFallbackClient();
}

document
    .getElementById("reset-password-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const errorDiv = document.getElementById("reset-error");
        const successDiv = document.getElementById("reset-success");
        const submitButton = document.getElementById("reset-submit-button");

        // Reset mensagens
        errorDiv.classList.remove("visible");
        successDiv.classList.remove("visible");
        errorDiv.textContent = "";

        // Validações
        if (newPassword.length < 6) {
            errorDiv.textContent = "A senha deve ter pelo menos 6 caracteres";
            errorDiv.classList.add("visible");
            return;
        }

        if (newPassword !== confirmPassword) {
            errorDiv.textContent = "As senhas não coincidem";
            errorDiv.classList.add("visible");
            return;
        }

        // Desabilitar botão
        submitButton.disabled = true;
        submitButton.textContent = "Redefinindo...";

        try {
            // Obter código do localStorage (para desenvolvimento)
            const code = localStorage.getItem('resetCode') || '';

            const authApi = getAuthApiClient();

            await authApi.resetPassword({
                email: resetEmail,
                code,
                newPassword,
            });

            successDiv.classList.add("visible");

            // Limpar dados do localStorage
            localStorage.removeItem('resetEmail');
            localStorage.removeItem('codeVerified');
            localStorage.removeItem('resetCode');

            // Redirecionar para login
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add("visible");
            submitButton.disabled = false;
            submitButton.textContent = "Redefinir senha";
        }
    });
