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
            const authApi = typeof window.getAuthApi === "function" ? window.getAuthApi() : null;
            if (!authApi) {
                throw new Error("API de autenticação indisponível. Recarregue a página e tente novamente.");
            }

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
