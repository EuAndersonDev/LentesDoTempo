# Rotas de Autenticacao - Frontend

Este documento consolida o fluxo de autenticacao usado nas paginas do frontend e as rotas do backend correspondentes.

## Paginas implementadas

### 1) Login
- URL: /pages/login.html
- Script: /js/pages/login.js
- Estilo: /css/pages/login.css
- API: POST /api/auth/login
- Objetivo: autenticar usuario e salvar token.

### 2) Registro
- URL: /pages/register.html
- Script: /js/pages/register.js
- Estilo: /css/pages/register.css
- API: POST /api/auth/register
- Objetivo: criar conta com validacoes de nome, email e senha.

### 3) Esqueceu a senha
- URL: /pages/forgot-password.html
- Script: /js/pages/forgot-password.js
- Estilo: /css/pages/forgot-password.css
- API: POST /api/auth/forgot-password
- Objetivo: enviar codigo de 6 digitos por email.

### 4) Verificar codigo
- URL: /pages/verify-code.html
- Script: /js/pages/verify-code.js
- Estilo: /css/pages/verify-code.css
- API: POST /api/auth/verify-code
- Objetivo: validar codigo recebido por email.

### 5) Redefinir senha
- URL: /pages/reset-password.html
- Script: /js/pages/reset-password.js
- Estilo: /css/pages/reset-password.css
- API: POST /api/auth/reset-password
- Objetivo: definir nova senha apos verificacao.

## Fluxo de recuperacao de senha

1. forgot-password.html
   - Usuario informa email
   - Backend envia codigo
   - Frontend salva resetEmail (e resetCode em desenvolvimento)
   - Redireciona para verify-code.html

2. verify-code.html
   - Usuario informa codigo
   - Backend valida codigo
   - Frontend salva codeVerified=true
   - Redireciona para reset-password.html

3. reset-password.html
   - Usuario informa nova senha
   - Frontend envia email + codigo + newPassword
   - Backend atualiza senha
   - Frontend limpa dados de recuperacao
   - Redireciona para login.html

## LocalStorage e SessionStorage

Chaves usadas durante autenticacao:

| Chave | Armazenamento | Descricao |
|---|---|---|
| authToken | localStorage ou sessionStorage | JWT de autenticacao |
| user | localStorage ou sessionStorage | dados basicos do usuario |
| resetEmail | localStorage | email em fluxo de recuperacao |
| resetCode | localStorage | codigo de validacao (somente dev) |
| codeVerified | localStorage | controle de etapa validada |

## Endpoints usados no frontend

### Registro
POST /api/auth/register

Body JSON:
{
  "name": "Joao Silva",
  "email": "joao@email.com",
  "password": "senha123"
}

### Login
POST /api/auth/login

Body JSON:
{
  "email": "joao@email.com",
  "password": "senha123"
}

### Solicitar codigo
POST /api/auth/forgot-password

Body JSON:
{
  "email": "joao@email.com"
}

### Verificar codigo
POST /api/auth/verify-code

Body JSON:
{
  "email": "joao@email.com",
  "code": "123456"
}

### Redefinir senha
POST /api/auth/reset-password

Body JSON:
{
  "email": "joao@email.com",
  "code": "123456",
  "newPassword": "novaSenha123"
}

## Observacoes importantes

- Em desenvolvimento, o backend pode retornar o codigo no forgot-password para facilitar testes.
- Em producao, o codigo nao deve ser retornado na resposta.
- Os scripts de autenticacao atuais usam fetch direto com API_URL local; para padronizacao, migrar chamadas para /api/config.js.
