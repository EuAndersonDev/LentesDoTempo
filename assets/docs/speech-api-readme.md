# Speech API - Lentes do Tempo

## 📖 Documentação

Implementação completa de **reconhecimento de voz** usando Web Speech API no projeto "Lentes do Tempo".

### 🎯 Funcionalidades

- ✅ Reconhecimento de voz em português (PT-BR)
- ✅ Navegação por voz para todas as páginas do projeto
- ✅ Comandos genéricos (home, voltar, avançar, etc)
- ✅ Widget visual com indicador de status
- ✅ Ajuda interativa com lista de comandos
- ✅ Atalho de teclado (tecla V)
- ✅ Suporte para navegadores com Web Speech API

---

## 🚀 Como Usar

### 1. **Ativar o Controle de Voz**

Clique no botão **🎤** no canto inferior direito da página, ou pressione a tecla **V** no teclado.

### 2. **Pronunciar Comandos**

Fale um dos comandos disponíveis. O sistema reconhecerá e executará automaticamente.

### 3. **Ver Ajuda**

Clique no botão **❓** para ver a lista completa de comandos disponíveis.

---

## 📋 Comandos Disponíveis

### 🏠 Navegação para Páginas

| Página | Palavras-chave |
|--------|-----------------|
| **Galeria** | galeria, galéria, fotos, explorar galeria, ir para galeria |
| **Sobre Nós** | sobre, sobre nós, sobrenos, quem somos, história |
| **Serviços** | serviços, servicos, o que oferecemos, ofertas |
| **Eventos** | eventos, agendamento, agendar, datas, próximos eventos |
| **Parcerias** | parcerias, parceiros, cooperação, associações |
| **Coliseu VR** | coliseu, coliseumvr, colisseumvr, realidade virtual coliseu |
| **Farol VR** | farol, farolvr, realidade virtual farol |
| **Acervo** | acervo, coleção, acervos, artefatos |
| **Contato** | contato, fale conosco, contact, enviar mensagem |
| **História** | história, historia, histórico, historico, passado |
| **Perguntas Frequentes** | perguntas, FAQ, dúvidas, frequentes, ajuda |
| **Termos de Uso** | termos, termos de uso, condições, política |
| **Cookies** | cookies, política de cookies, privacidade |
| **Login** | login, entrar, fazer login, conectar |
| **Registrar** | registrar, criar conta, cadastro, inscrever, registre-se |
| **Recuperar Senha** | esqueceu a senha, esqueci senha, recuperar senha, reset senha |

### ⚙️ Comandos Gerais

| Comando | Palavras-chave | Ação |
|---------|-----------------|------|
| **Home** | home, início, inicio, voltar, página inicial | Voltar para página inicial |
| **Voltar** | voltar, página anterior, anterior, para trás | Voltar página anterior |
| **Avançar** | próximo, proximo, avançar, avancar, continuar | Avançar próxima página |
| **Menu** | menu, abrir menu, mostrar menu, navegação | Abrir/fechar menu |
| **Ajuda** | ajuda, help, como usar, tutorial, instruções | Mostrar ajuda |
| **Pesquisar** | pesquisar, buscar, procurar, search | Iniciar pesquisa |

---

## 💻 Integração em Outras Páginas

Para ativar o controle de voz em outras páginas do projeto, adicione os seguintes scripts antes do fechamento da tag `</body>`:

```html
<!-- Speech API Scripts -->
<script src="../../js/services/speechApiConfig.js" defer></script>
<script src="../../js/services/speechApi.js" defer></script>
<script src="../../js/services/voiceControlWidget.js" defer></script>
<script defer>
    // Inicializar widget de controle de voz
    document.addEventListener('DOMContentLoaded', function() {
        initVoiceControlWidget({
            position: 'bottom-right',  // Posição: bottom-right, bottom-left, top-right, top-left
            theme: 'dark',              // Tema: dark ou light
            enabled: true               // Habilitado por padrão
        });
    });
</script>
```

### ⚠️ Atenção aos Caminhos

O caminho dos scripts depende de onde a página está localizada:
- **Páginas em `/pages/main/`**: use `../../js/services/`
- **Páginas em `/pages/secondary/`**: use `../../js/services/`
- **Páginas em `/pages/auth/`**: use `../../js/services/`
- **Páginas em `/pages/main/VRs/`**: use `../../../js/services/`

---

## 🔧 Personalização

### Modificar Configuração

Edite o arquivo `js/services/speechApiConfig.js` para:
- Adicionar/remover palavras-chave
- Adicionar novas páginas
- Modificar idioma (padrão: pt-BR)
- Alterar sensibilidade

### Customizar Estilos

Os estilos do widget estão em `js/services/voiceControlWidget.js`. Você pode:
- Alterar cores do gradiente
- Modificar tamanho do botão
- Ajustar posição padrão
- Mudar animações

### Adicionar Novos Comandos

No arquivo `speechApiConfig.js`, adicione à seção `commands`:

```javascript
meuComando: {
  keywords: ['palavra1', 'palavra2', 'palavra3'],
  action: 'myCustomAction',
  description: 'Descrição do meu comando'
}
```

Depois implemente a ação em `speechApi.js` na função `executeCommand()`:

```javascript
case 'myCustomAction':
  // Seu código aqui
  break;
```

---

## 📱 Compatibilidade

### Navegadores Suportados

- ✅ Chrome/Edge (v25+)
- ✅ Firefox (v25+)
- ✅ Safari (v14.1+)
- ✅ Opera (v27+)

### Considerações

- Requer **permissão do microfone** (o navegador solicitará)
- Funciona melhor com **conexão estável**
- Deve ser usado em **HTTPS** (ou localhost para desenvolvimento)

---

## 🐛 Troubleshooting

### "Speech API não disponível"
- Seu navegador não suporta Web Speech API
- Solução: Use um navegador moderno (Chrome, Edge, Firefox, Safari)

### "Sem acesso ao microfone"
- Permissão negada pelo navegador
- Solução: Permita acesso ao microfone nas configurações do navegador

### "Nenhuma fala detectada"
- O microfone pode estar desligado ou com volume baixo
- Solução: Verifique o microfone e tente novamente

### Comando não reconhecido
- A fala pode não ter sido clara
- Solução: Fale mais claramente ou use o atalho V para tentar novamente

---

## 📊 Estrutura de Arquivos

```
js/services/
├── speechApiConfig.js      # Configuração (palavras-chave, páginas, comandos)
├── speechApi.js            # Serviço principal (reconhecimento e processamento)
└── voiceControlWidget.js   # Componente visual (widget, estilos, interação)
```

---

## 🔐 Privacidade

- O reconhecimento de voz ocorre **localmente** usando Web Speech API
- Nenhum áudio é enviado para servidores externos
- Os dados de fala são processados apenas no navegador do usuário

---

## 📝 Notas de Desenvolvimento

- O serviço é inicializado automaticamente quando `speechApi.js` é carregado
- O widget é criado automaticamente ao chamar `initVoiceControlWidget()`
- Todos os eventos do Speech Service podem ser ouvidos via `speechService.on()`
- Erros são capturados e exibidos ao usuário de forma amigável

---

## 📞 Suporte

Para adicionar novos comandos, modificar palavras-chave ou reportar problemas, edite os arquivos correspondentes em `js/services/`.

**Versão:** 1.0  
**Última atualização:** 2026-04-18
