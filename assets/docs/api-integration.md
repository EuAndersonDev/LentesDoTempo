# Integracao Frontend com Backend

Este documento descreve como o frontend deve se conectar ao backend.

## Arquivo central de conexao

Arquivo: /api/config.js

Este e o modulo de integracao direta com o backend e deve ser a fonte unica para requests HTTP do frontend.

## Configuracao atual

- API_BASE_URL definido como [http://localhost:3000/api](http://localhost:3000/api) em local e [https://backend-4scx.onrender.com/api](https://backend-4scx.onrender.com/api) em produção
- Helpers globais expostos em window:
  - window.api
  - window.apiRequest
  - window.getAuthToken
  - window.getCurrentUser
  - window.isAuthenticated
  - window.logout
  - window.API_BASE_URL

## Como o modulo funciona

1. Le token em localStorage/sessionStorage.
2. Injeta Authorization: Bearer token quando houver token.
3. Faz parse de JSON na resposta.
4. Em 401, executa logout automatico e redireciona para login.

## Metodos disponiveis no modulo

Auth:

- api.auth.register(data)
- api.auth.login(data)
- api.auth.getProfile()
- api.auth.forgotPassword(data)
- api.auth.verifyCode(data)
- api.auth.resetPassword(data)

Images:

- api.images.getAll()
- api.images.getById(id)
- api.images.create(formData)
- api.images.update(id, data)
- api.images.delete(id)

## Alinhamento com backend

Rotas reais no backend de imagens:

- POST /api/images/upload
- GET /api/images
- GET /api/images/:id
- DELETE /api/images/:id

Atencao: no config.js, update usa PUT /api/images/:id, mas nao existe rota PUT no backend.

## Recomendacao de padronizacao

- Migrar scripts de autenticacao para usar window.api em vez de fetch hardcoded.
- api.images.create usa POST /images/upload.
- Remover ou implementar rota de update de imagens para manter consistencia.

## CORS e ambiente

Para desenvolvimento local:

- Frontend e backend podem rodar em portas diferentes.
- O backend ja usa cors() globalmente.

Para producao:

- Definir API_BASE_URL por ambiente.
- Evitar URL fixa em codigo de pagina.
