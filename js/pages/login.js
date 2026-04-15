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
    .getElementById("login-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const remember = document.getElementById("remember").checked;
        const errorDiv = document.getElementById("login-error");
        const submitButton = this.querySelector('button[type="submit"]');

        // Reset error
        errorDiv.classList.remove("visible");

        // Desabilitar botão
        submitButton.disabled = true;
        submitButton.textContent = "Entrando...";

        try {
            const data = await window.api.auth.login({ email, password });

            // Armazenar token e dados do usuário
            if (data.data.token) {
                window.setAuthSession(data.data, { remember });
            }

            // Redirecionar para dashboard ou home
            window.location.href = "/index.html";

        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add("visible");
            submitButton.disabled = false;
            submitButton.textContent = "Entrar";
        }
    });
