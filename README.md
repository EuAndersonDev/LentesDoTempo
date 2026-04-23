
# 📸 Lentes do Tempo

> Capturando o presente, preservando o passado e projetando o futuro.

O **Lentes do Tempo** é um frontend web com experiência imersiva, pensado para explorar conteúdos visuais e institucionais como se o usuário estivesse navegando por um museu interativo. A página inicial usa uma rolagem guiada com pontos de navegação para acessar áreas como galeria, serviços, eventos, parcerias, sobre nós e experiências em realidade virtual.

O projeto também inclui autenticação de usuários, recuperação de senha, integração com backend REST, controle por voz em português do Brasil e recursos de acessibilidade.

## Visão Geral

- Navegação principal com foco em experiência visual e imersiva.
- Estrutura de páginas separada por domínio funcional.
- Integração com backend centralizada em um único módulo de API.
- Fluxo de autenticação completo: login, cadastro, recuperação e redefinição de senha.
- Comandos de voz para navegação e ações rápidas.
- Componentes compartilhados para header e footer.

## Funcionalidades

- Página inicial com vídeo e hotspots clicáveis para navegação.
- Galeria de imagens e páginas institucionais separadas por contexto.
- Páginas de autenticação com persistência de sessão.
- Comandos de voz para ir a páginas, abrir menu, voltar, avançar e buscar ajuda.
- Integração com widget de acessibilidade externo.
- Layout responsivo com estilos por página e por componente.

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla
- Web Components para header e footer
- Fetch API para integração com backend
- SpeechRecognition / camada de voz do projeto
- Recursos estáticos em `assets/`

## Estrutura de Pastas

```text
LentesDoTempo/
├── index.html
├── README.md
├── api/
│   └── config.js
├── assets/
│   ├── docs/
│   │   ├── api-integration.md
│   │   ├── auth-routes.md
│   │   ├── frontend-architecture.md
│   │   ├── README-AUTH.md
│   │   ├── README.md
│   │   ├── run-and-config.md
│   │   ├── speech-api-implementation.md
│   │   ├── speech-api-quickstart.md
│   │   └── speech-api-readme.md
│   ├── icons/
│   └── imgs/
├── css/
│   ├── global.css
│   ├── components/
│   ├── motions/
│   └── pages/
├── js/
│   ├── components/
│   ├── motions/
│   ├── pages/
│   └── services/
└── pages/
    ├── speech-api-example.html
    ├── auth/
    ├── main/
    │   ├── VRs/
    │   └── demais páginas principais
    └── secondary/
```

## Organização do Frontend

- `index.html`: ponto de entrada da experiência principal, com vídeo, hotspots e widget de voz.
- `pages/auth/`: páginas de login, cadastro e recuperação de senha.
- `pages/main/`: páginas centrais do site, como galeria, eventos, serviços, parcerias e sobre nós.
- `pages/main/VRs/`: experiências em realidade virtual.
- `pages/secondary/`: páginas complementares, como acervo, contato, cookies, história, FAQ e termos.
- `js/components/`: componentes reutilizáveis, como header e footer.
- `js/pages/`: scripts específicos por página.
- `js/motions/`: animações, transições e comportamentos visuais.
- `js/services/`: serviços compartilhados, incluindo Speech API e controle de voz.
- `css/components/`: estilos de componentes globais.
- `css/pages/`: estilos específicos por área do site.
- `css/motions/`: estilos ligados a transições e animações.
- `api/config.js`: camada central de comunicação com o backend.

## Como Executar

### Requisitos

- Navegador moderno.
- Backend disponível para autenticação e dados dinâmicos.

### Execução local

1. Abra o projeto em um servidor local, se possível.
2. Acesse o arquivo `index.html`.
3. Navegue pelas páginas internas em `pages/`.

Se quiser apenas visualizar rapidamente, também é possível abrir o `index.html` diretamente no navegador, mas alguns fluxos podem funcionar melhor em servidor local.

## Integração com Backend

O frontend centraliza suas requisições em `api/config.js`. Esse módulo resolve automaticamente a URL base da API e expõe helpers globais para autenticação, imagens e contato.

Comportamento principal:

- Usa `localStorage` ou `sessionStorage` para persistir token e usuário.
- Injeta `Authorization: Bearer <token>` quando existe sessão válida.
- Faz logout automático em casos de sessão expirada.
- Suporta configuração explícita da URL da API por meta tag ou variável global.

URLs padrão identificadas no projeto:

- Desenvolvimento: `http://localhost:3000/api`
- Produção: `https://backend-4scx.onrender.com/api`

Rotas mais relevantes:

- Autenticação: login, registro, perfil, recuperação e redefinição de senha.
- Imagens: listagem, busca por id, upload, atualização e exclusão.
- Contato: solicitação de serviço.

## Documentação do Projeto

- [Arquitetura do frontend](assets/docs/frontend-architecture.md)
- [Integração com a API](assets/docs/api-integration.md)
- [Execução e configuração](assets/docs/run-and-config.md)
- [Autenticação](assets/docs/README-AUTH.md)
- [Rotas de autenticação](assets/docs/auth-routes.md)
- [Speech API - visão geral](assets/docs/speech-api-readme.md)
- [Speech API - quickstart](assets/docs/speech-api-quickstart.md)
- [Speech API - implementação](assets/docs/speech-api-implementation.md)

## Acessibilidade e Voz

- O projeto carrega um widget externo de acessibilidade na página inicial.
- A Speech API foi configurada para comandos em pt-BR.
- O sistema reconhece palavras-chave para navegar entre páginas e executar comandos gerais.

## Equipe e Colaboradores

Desenvolvido por Anderson Reis e pela equipe do projeto.

- Anderson
    - Portfólio: http://andersonreis.vercel.app/
    - LinkedIn: https://www.linkedin.com/in/euandersonreis/
    - GitHub: https://github.com/EuAndersonDev
- Letícia
    - LinkedIn: https://www.linkedin.com/in/leticiaandradeads/
    - GitHub: https://github.com/andradebjl24-cmyk
- Christian
    - LinkedIn: https://www.linkedin.com/in/christian-damasceno-vicente-869888252/
    - GitHub: https://github.com/DVChristian
- Gustavo
    - LinkedIn: https://www.linkedin.com/in/gustavobozzodasilva/
    - GitHub: https://github.com/Gusbzz
- Filipe
    - LinkedIn: https://www.linkedin.com/filipe-apolin%C3%A1rio--8113822a1/
    - GitHub: https://github.com/FilipeAp
- Raquel
    - LinkedIn: https://www.linkedin.com/in/raquel-alves-044743385/
    - GitHub: https://github.com/raquealalve

## Próximos Passos

- Consolidar ainda mais o uso de `api/config.js` como fonte única para requests HTTP.
- Manter a documentação de páginas e fluxos sincronizada com o comportamento real do frontend.
- Adicionar screenshots reais do projeto na seção de apresentação.
