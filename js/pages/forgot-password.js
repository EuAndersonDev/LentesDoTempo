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
            if (authApi && typeof authApi.forgotPassword === "function") {
                return authApi;
            }
        } catch (error) {
            console.warn("Falha ao obter API de autenticacao global:", error);
        }
    }

    return createAuthApiFallbackClient();
}

document
    .getElementById("forgot-password-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const errorDiv = document.getElementById("forgot-error");
        const successDiv = document.getElementById("forgot-success");
        const submitButton = document.getElementById("forgot-submit-button");

        // Reset mensagens
        errorDiv.classList.remove("visible");
        successDiv.classList.remove("visible");
        errorDiv.textContent = "";

        // Desabilitar botão
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";

        try {
            const authApi = getAuthApiClient();

            const data = await authApi.forgotPassword({ email });

            // Sucesso - armazenar email e código para próximas etapas
            localStorage.setItem("resetEmail", email);
            // Armazenar código se retornado (desenvolvimento)
            if (data.code) {
                localStorage.setItem("resetCode", data.code);
                console.log("Código de verificação (dev):", data.code);
            }

            // Redirecionar para página de verificar código
            setTimeout(() => {
                window.location.href = "verify-code.html";
            }, 1000);

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add("visible");
            submitButton.disabled = false;
            submitButton.textContent = "Enviar código";
        }
    });
