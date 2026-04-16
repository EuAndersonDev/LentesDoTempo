function setupPasswordToggle(button) {
    const input = document.getElementById(button.dataset.target);

    if (!input) {
        return;
    }

    button.addEventListener("click", () => {
        const isHidden = input.type === "password";

        input.type = isHidden ? "text" : "password";
        button.setAttribute("aria-pressed", String(isHidden));
        button.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
    });
}

document.querySelectorAll(".password-toggle").forEach(setupPasswordToggle);

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
            if (authApi && typeof authApi.register === "function") {
                return authApi;
            }
        } catch (error) {
            console.warn("Falha ao obter API de autenticacao global:", error);
        }
    }

    return createAuthApiFallbackClient();
}

document
    .getElementById("register-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const termsAccepted = document.getElementById("terms").checked;

        const errorDiv = document.getElementById("register-error");
        const successDiv = document.getElementById("register-success");
        const submitButton = document.getElementById("register-button");

        // Reset mensagens
        errorDiv.classList.remove("visible");
        successDiv.classList.remove("visible");
        errorDiv.textContent = "";

        // Validações
        if (!termsAccepted) {
            errorDiv.textContent = "Você precisa aceitar os Termos de Uso e Política de Cookies";
            errorDiv.classList.add("visible");
            return;
        }

        if (password.length < 6) {
            errorDiv.textContent = "A senha deve ter pelo menos 6 caracteres";
            errorDiv.classList.add("visible");
            return;
        }

        if (password !== confirmPassword) {
            errorDiv.textContent = "As senhas não coincidem";
            errorDiv.classList.add("visible");
            return;
        }

        // Desabilitar botão
        submitButton.disabled = true;
        submitButton.textContent = "Criando conta...";

        try {
            const authApi = getAuthApiClient();

            const data = await authApi.register({ name, email, password });

            // Sucesso
            successDiv.classList.add("visible");

            // Armazenar token se necessário
            if (data.data.token) {
                window.setAuthSession(data.data, { remember: true });
            }

            // Redirecionar após sucesso
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add("visible");
            submitButton.disabled = false;
            submitButton.textContent = "Criar conta";
        }
    });
