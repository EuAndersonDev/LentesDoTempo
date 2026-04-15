# Páginas de Autenticação - Lentes do Tempo

Este documento descreve as páginas de autenticação implementadas e seu fluxo de integração com o backend.

## Páginas Implementadas

### 1. Login (`login.html`)
- **URL:** `/pages/login.html`
- **Script:** `/js/pages/login.js`
- **Estilo:** `/css/pages/login.css`
- **API:** `POST /api/auth/login`
- **Descrição:** Página de login existente, agora integrada ao backend.

### 2. Registro (`register.html`)
- **URL:** `/pages/register.html`
- **Script:** `/js/pages/register.js`
- **Estilo:** `/css/pages/register.css`
- **API:** `POST /api/auth/register`
- **Descrição:** Nova página para criação de conta com validação de:
  - Nome completo
  - Email válido
  - Senha (mínimo 6 caracteres)
  - Confirmação de senha
  - Aceite dos Termos de Uso e Política de Cookies

### 3. Esqueceu a Senha (`forgot-password.html`)
- **URL:** `/pages/forgot-password.html`
- **Script:** `/js/pages/forgot-password.js`
- **Estilo:** `/css/pages/forgot-password.css`
- **API:** `POST /api/auth/forgot-password`
- **Descrição:** Primeira etapa do fluxo de recuperação de senha. Envia código de 6 dígitos para o email do usuário.

### 4. Verificar Código (`verify-code.html`)
- **URL:** `/pages/verify-code.html`
- **Script:** `/js/pages/verify-code.js`
- **Estilo:** `/css/pages/verify-code.css`
- **API:** `POST /api/auth/verify-code`
- **Descrição:** Segunda etapa do fluxo. Valida o código de 6 dígitos enviado por email.

### 5. Redefinir Senha (`reset-password.html`)
- **URL:** `/pages/reset-password.html`
- **Script:** `/js/pages/reset-password.js`
- **Estilo:** `/css/pages/reset-password.css`
- **API:** `POST /api/auth/reset-password`
- **Descrição:** Terceira e última etapa. Permite definir uma nova senha para a conta.

## Fluxo de Recuperação de Senha

```
1. forgot-password.html
   └─> Usuário informa email
   └─> Backend envia código por email
   └─> Redireciona para verify-code.html

2. verify-code.html
   └─> Usuário informa código de 6 dígitos
   └─> Backend valida código
   └─> Redireciona para reset-password.html

3. reset-password.html
   └─> Usuário informa nova senha
   └─> Backend atualiza senha
   └─> Redireciona para login.html
```

## Dados Armazenados no LocalStorage

Durante o fluxo de recuperação:

| Chave | Valor | Quando é criado | Quando é removido |
|-------|-------|-----------------|-------------------|
| `resetEmail` | Email do usuário | Após solicitar código | Após redefinir senha |
| `resetCode` | Código de verificação | Quando backend retorna (dev) | Após redefinir senha |
| `codeVerified` | `"true"` | Após verificar código | Após redefinir senha |
| `authToken` | Token JWT | Após login/registro | - |
| `user` | Dados do usuário | Após login/registro | - |

## Configuração do Backend

Para que o envio de emails funcione, configure o arquivo `.env` do backend:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-app-password
EMAIL_FROM=noreply@lentesdotempo.com.br
```

### Gmail App Password

Se usar Gmail, será necessário criar uma "App Password":
1. Acesse https://myaccount.google.com/security
2. Ative a verificação em duas etapas
3. Em "Senhas de app", gere uma nova senha
4. Use essa senha no `EMAIL_PASS`

## APIs do Backend

### Registro
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Solicitar Código
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "joao@email.com"
}
```

### Verificar Código
```
POST /api/auth/verify-code
Content-Type: application/json

{
  "email": "joao@email.com",
  "code": "123456"
}
```

### Redefinir Senha
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "joao@email.com",
  "code": "123456",
  "newPassword": "novaSenha123"
}
```

## Observações para Desenvolvimento

1. **Código no LocalStorage:** Em ambiente de desenvolvimento, o backend retorna o código na resposta da API `forgot-password`. Isso permite testar o fluxo sem configurar o SMTP.

2. **Produção:** Em produção, remova a exposição do código na resposta e certifique-se de que o SMTP esteja configurado corretamente.

3. **Links entre páginas:**
   - Login → Registro: "Ainda não tem uma conta? Cadastre-se"
   - Login → Forgot Password: "Esqueceu a senha?"
   - Forgot Password → Verify Code: Automático após enviar email
   - Verify Code → Reset Password: Automático após verificar código
   - Reset Password → Login: Automático após redefinir senha
