# 🚀 Guia Rápido - Speech API

## Instalação Rápida (2 minutos)

### 1️⃣ Adicione os Scripts

Coloque isso antes do `</body>` em qualquer página HTML:

```html
<script src="./js/services/speechApiConfig.js" defer></script>
<script src="./js/services/speechApi.js" defer></script>
<script src="./js/services/voiceControlWidget.js" defer></script>
<script defer>
    document.addEventListener('DOMContentLoaded', function() {
        initVoiceControlWidget({
            position: 'bottom-right',
            theme: 'dark'
        });
    });
</script>
```

### 2️⃣ Pronto! 🎉

Reinicie a página e veja o botão 🎤 aparecer no canto inferior direito.

---

## 🎤 Como Usar

- **Clique** no botão 🎤 ou pressione **V**
- **Fale** um comando em português
- O sistema **executa automaticamente**

---

## 📝 Exemplos de Comandos

```
"Galeria"           → Vai para a galeria
"Sobre nós"         → Vai para sobre nós
"Eventos"           → Vai para eventos
"Menu"              → Abre/fecha menu
"Voltar"            → Volta página anterior
"Home"              → Página inicial
"Ajuda"             → Mostra comandos disponíveis
```

---

## ⚙️ Personalização

### Mudar Posição do Botão

```javascript
initVoiceControlWidget({
    position: 'top-left'  // ou 'top-right', 'bottom-left', 'bottom-right'
});
```

### Mudar Tema

```javascript
initVoiceControlWidget({
    theme: 'light'  // ou 'dark'
});
```

### Desabilitar por Padrão

```javascript
initVoiceControlWidget({
    enabled: false
});
```

---

## 🔧 Adicionar Novos Comandos

Edit `js/services/speechApiConfig.js` e adicione na seção desejada:

```javascript
meusServicos: {
    keywords: ['meus serviços', 'serviços meus', 'minhas ofertas'],
    url: '/pages/main/meus-servicos.html',
    title: 'Meus Serviços'
}
```

---

## 📱 Compatibilidade

| Navegador | Versão | Status |
|-----------|--------|--------|
| Chrome | 25+ | ✅ Funciona |
| Firefox | 25+ | ✅ Funciona |
| Safari | 14.1+ | ✅ Funciona |
| Edge | 79+ | ✅ Funciona |
| Opera | 27+ | ✅ Funciona |
| IE 11 | - | ❌ Não suporta |

---

## ❓ Problemas Comuns

### Botão não aparece
- Verifique se os scripts foram adicionados
- Verifique os caminhos dos scripts
- Abra o console (F12) e procure por erros

### Microfone não funciona
- Permita acesso ao microfone no navegador
- Verifique se o microfone está funcionando
- Tente em HTTPS (em produção) ou localhost (desenvolvimento)

### Não reconhece voz
- Fale mais claramente
- Verifique se o microfone está ativo
- Tente novamente

---

## 📚 Documentação Completa

Veja `speech-api-readme.md` para documentação detalhada.

---

## 💡 Dicas

1. **Use o atalho V** - Mais rápido que clicar no botão
2. **Fale claramente** - Melhora o reconhecimento
3. **Veja a ajuda** - Clique em ❓ para ver todos os comandos
4. **Customize** - Adicione seus próprios comandos

---

**Criado para Lentes do Tempo** ⏰✨
