// Verificar se email foi fornecido
const resetEmail = localStorage.getItem('resetEmail');
if (!resetEmail) {
    window.location.href = 'forgot-password.html';
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
        const authApi = typeof window.getAuthApi === "function" ? window.getAuthApi() : null;
        if (!authApi) {
            throw new Error("API de autenticação indisponível. Recarregue a página e tente novamente.");
        }

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
            const authApi = typeof window.getAuthApi === "function" ? window.getAuthApi() : null;
            if (!authApi) {
                throw new Error("API de autenticação indisponível. Recarregue a página e tente novamente.");
            }

            await authApi.verifyCode({ email: resetEmail, code });

            // Sucesso - armazenar que código foi verificado
            localStorage.setItem("codeVerified", "true");

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
