const storedResetEmail = (localStorage.getItem('resetEmail') || '').trim();
const codeVerified = localStorage.getItem('codeVerified');

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

const verificationCodeInput = document.getElementById('verificationCode');
const storedResetCode = (localStorage.getItem('resetCode') || '').trim();
const resetEmailInput = document.getElementById('resetEmail');

if (resetEmailInput) {
    resetEmailInput.value = storedResetEmail;
}

if (verificationCodeInput) {
    verificationCodeInput.value = storedResetCode;
    verificationCodeInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });
}

document
    .getElementById("reset-password-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = resetEmailInput ? resetEmailInput.value.trim() : '';
        const codeInputValue = verificationCodeInput
            ? verificationCodeInput.value.trim()
            : '';
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

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorDiv.textContent = "Informe um e-mail valido";
            errorDiv.classList.add("visible");
            return;
        }

        if (!/^[0-9]{6}$/.test(codeInputValue)) {
            errorDiv.textContent = "Informe um codigo de verificacao valido com 6 digitos";
            errorDiv.classList.add("visible");
            return;
        }

        // Desabilitar botão
        submitButton.disabled = true;
        submitButton.textContent = "Redefinindo...";

        try {
            const code = codeInputValue;

            localStorage.setItem('resetEmail', email);
            localStorage.setItem('resetCode', code);

            if (codeVerified === 'true') {
                localStorage.setItem('codeVerified', 'true');
            }

            const authApi = getAuthApiClient();

            await authApi.resetPassword({
                email,
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
