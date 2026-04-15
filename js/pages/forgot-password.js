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
            const data = await window.api.auth.forgotPassword({ email });

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
