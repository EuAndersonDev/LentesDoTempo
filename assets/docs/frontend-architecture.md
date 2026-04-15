# Arquitetura do Frontend

## Estrutura principal

- index.html: pagina inicial
- pages/: paginas internas do site
- js/components/: componentes compartilhados (header/footer)
- js/pages/: logica por pagina
- js/motions/: scripts de transicao e animacao
- css/components/: estilos de componentes
- css/pages/: estilos por pagina
- css/motions/: estilos de transicao
- api/config.js: camada de comunicacao HTTP com backend
- assets/icons, assets/imgs: recursos visuais

## Convencoes

- Uma pagina HTML pode ter:
  - CSS dedicado em css/pages
  - JS dedicado em js/pages
- Componentes globais ficam em js/components e css/components.
- Integracao com backend deve passar por api/config.js.

## Fluxo de autenticacao no frontend

- login.js e register.js persistem authToken e user.
- forgot-password.js, verify-code.js e reset-password.js controlam o fluxo de recuperacao.
- logout remove token e user de localStorage/sessionStorage.

## Pontos de atencao

- Parte dos scripts ainda usa URL hardcoded para API.
- Recomendado concentrar todo acesso HTTP em api/config.js para reduzir divergencias.
- Garantir limpeza de chaves temporarias do reset apos sucesso.
