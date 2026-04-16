// Verificar se email e código foram verificados
const resetEmail = localStorage.getItem('resetEmail');
const codeVerified = localStorage.getItem('codeVerified');

if (!resetEmail || codeVerified !== 'true') {
    window.location.href = 'forgot-password.html';
}

// Mostrar código armazenado (para debug em desenvolvimento)
console.log('Reset password for:', resetEmail);

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

            const authApi = typeof window.getAuthApi === "function" ? window.getAuthApi() : null;
            if (!authApi) {
                throw new Error("API de autenticação indisponível. Recarregue a página e tente novamente.");
            }

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
