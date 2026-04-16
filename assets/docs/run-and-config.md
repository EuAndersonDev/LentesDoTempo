# Execucao e Configuracao - Frontend

## Pre-requisitos

- Navegador moderno
- Backend rodando e acessivel em http://localhost:3000

## Execucao

Opcao 1:
- Abrir index.html em um servidor local (recomendado).

Opcao 2:
- Abrir index.html diretamente no navegador (pode limitar alguns comportamentos).

## Integracao com backend

- As paginas de autenticacao chamam endpoints em /api/auth.
- O modulo /api/config.js resolve API_BASE_URL dinamicamente:
	- localhost/127.0.0.1 -> http://localhost:3000/api
	- demais dominios -> https://SEU-BACKEND.onrender.com/api
- Em producao, recomenda-se definir explicitamente a URL da API:
	- Meta tag no HTML: <meta name="api-base-url" content="https://seu-backend.onrender.com/api">
	- Ou global antes do config.js: window.__API_BASE_URL__ = 'https://seu-backend.onrender.com/api';

## Checklist rapido

1. Backend em execucao.
2. Banco conectado.
3. Variaveis SMTP configuradas para fluxo de senha.
4. Testar login, registro e recuperacao de senha fim a fim.
5. Em deploy, configurar CORS_ORIGINS/FRONTEND_URL no backend com o dominio do frontend.
