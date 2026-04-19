/**
 * Speech API Service - Lentes do Tempo
 * 
 * Serviço de reconhecimento de voz usando Web Speech API
 * Integrado com a estrutura de navegação do projeto
 */

class SpeechAPIService {
  constructor() {
    // Verificar suporte do navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Web Speech API não suportada neste navegador');
      this.available = false;
      return;
    }

    this.recognition = new SpeechRecognition();
    this.available = true;
    this.isListening = false;
    this.config = window.SPEECH_API_CONFIG || {};
    this.listeners = [];

    this.initializeRecognition();
    this.setupEventListeners();
  }

  /**
   * Inicializar configurações do reconhecimento de vala
   */
  initializeRecognition() {
    if (!this.available) return;

    const settings = this.config.settings || {};
    
    this.recognition.continuous = settings.continuous !== false;
    this.recognition.interimResults = settings.interimResults !== false;
    this.recognition.lang = settings.language || 'pt-BR';
  }

  /**
   * Configurar listeners de eventos
   */
  setupEventListeners() {
    if (!this.available) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.emit('listening-start', { message: 'Ouvindo...' });
      this.showVisualIndicator(true);
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        this.emit('interim-result', { text: interimTranscript });
      }

      if (finalTranscript) {
        this.processCommand(finalTranscript.toLowerCase().trim());
        this.emit('final-result', { text: finalTranscript });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      this.emit('error', { error: event.error });
      this.showVisualIndicator(false);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.emit('listening-end', { message: 'Parou de ouvir' });
      this.showVisualIndicator(false);
    };
  }

  /**
   * Iniciar reconhecimento de voz
   */
  start() {
    if (!this.available) {
      alert('Speech API não disponível neste navegador');
      return;
    }

    if (!this.isListening) {
      this.recognition.start();
    }
  }

  /**
   * Parar reconhecimento de voz
   */
  stop() {
    if (this.available && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Abortar reconhecimento de voz
   */
  abort() {
    if (this.available) {
      this.recognition.abort();
      this.isListening = false;
      this.showVisualIndicator(false);
    }
  }

  /**
   * Processar comando reconhecido
   */
  processCommand(text) {
    // Verificar se é um comando de navegação para página
    const pageCommand = this.findMatchingPage(text);
    if (pageCommand) {
      this.navigateToPage(pageCommand);
      return;
    }

    // Verificar se é um comando geral
    const generalCommand = this.findMatchingCommand(text);
    if (generalCommand) {
      this.executeCommand(generalCommand);
      return;
    }

    this.emit('unrecognized-command', { text });
  }

  /**
   * Encontrar página correspondente ao texto
   */
  findMatchingPage(text) {
    const pages = this.config.pages || {};

    for (const [key, page] of Object.entries(pages)) {
      const keywords = page.keywords || [];
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return page;
        }
      }
    }

    return null;
  }

  /**
   * Encontrar comando correspondente ao texto
   */
  findMatchingCommand(text) {
    const commands = this.config.commands || {};

    for (const [key, command] of Object.entries(commands)) {
      const keywords = command.keywords || [];
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          return command;
        }
      }
    }

    return null;
  }

  /**
   * Navegar para página
   */
  navigateToPage(page) {
    if (!page.url) return;

    this.emit('navigating', { page: page.title, url: page.url });
    
    // Usar timeout para dar tempo visual do comando
    setTimeout(() => {
      window.location.href = page.url;
    }, 300);
  }

  /**
   * Executar comando geral
   */
  executeCommand(command) {
    this.emit('command-executed', { action: command.action });

    switch (command.action) {
      case 'navigateHome':
        window.location.href = '/';
        break;
      
      case 'goBack':
        window.history.back();
        break;
      
      case 'goNext':
        window.history.forward();
        break;
      
      case 'toggleMenu':
        this.toggleMenu();
        break;
      
      case 'showHelp':
        this.showHelp();
        break;
      
      case 'startSearch':
        this.startSearch();
        break;
      
      default:
        console.log('Comando não implementado:', command.action);
    }
  }

  /**
   * Alternar menu
   */
  toggleMenu() {
    const menu = document.querySelector('.menu-overlay') || document.querySelector('nav');
    if (menu) {
      menu.classList.toggle('active');
      menu.classList.toggle('hidden');
    }
  }

  /**
   * Mostrar ajuda
   */
  showHelp() {
    this.showHelpModal();
  }

  /**
   * Iniciar pesquisa
   */
  startSearch() {
    const searchInput = document.querySelector('input[type="search"]') || 
                        document.querySelector('input[placeholder*="Buscar"]');
    if (searchInput) {
      searchInput.focus();
    }
  }

  /**
   * Mostrar indicador visual (microfone)
   */
  showVisualIndicator(active) {
    let indicator = document.getElementById('speech-indicator');

    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'speech-indicator';
      indicator.className = 'speech-indicator';
      document.body.appendChild(indicator);
    }

    if (active) {
      indicator.classList.add('active');
      indicator.innerHTML = '🎤 Ouvindo...';
    } else {
      indicator.classList.remove('active');
      indicator.innerHTML = '';
    }
  }

  /**
   * Mostrar modal de ajuda
   */
  showHelpModal() {
    let modal = document.getElementById('speech-help-modal');

    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'speech-help-modal';
      modal.className = 'speech-help-modal';
      
      const content = this.generateHelpContent();
      modal.innerHTML = content;
      
      // Estilos
      const styles = `
        .speech-help-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: 2px solid #333;
          border-radius: 8px;
          padding: 20px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 10000;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .speech-help-modal.hidden {
          display: none;
        }
        .speech-help-modal h2 {
          margin-top: 0;
          color: #333;
        }
        .speech-help-modal .help-section {
          margin-bottom: 20px;
        }
        .speech-help-modal .help-section h3 {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .speech-help-modal .help-item {
          margin-bottom: 8px;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 4px;
          font-size: 13px;
        }
        .speech-help-modal .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      
      document.body.appendChild(modal);
    }

    modal.classList.remove('hidden');

    // Fechar ao clicar no X
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.add('hidden');
    }
  }

  /**
   * Gerar conteúdo da ajuda
   */
  generateHelpContent() {
    let html = '<button class="close-btn">✕</button>';
    html += '<h2>Comandos de Voz Disponíveis</h2>';

    // Páginas
    html += '<div class="help-section">';
    html += '<h3>🏠 Navegação de Páginas</h3>';
    const pages = this.config.pages || {};
    for (const [key, page] of Object.entries(pages)) {
      const keywords = (page.keywords || []).join(', ');
      html += `<div class="help-item"><strong>${page.title}:</strong> "${keywords}"</div>`;
    }
    html += '</div>';

    // Comandos gerais
    html += '<div class="help-section">';
    html += '<h3>⚙️ Comandos Gerais</h3>';
    const commands = this.config.commands || {};
    for (const [key, command] of Object.entries(commands)) {
      const keywords = (command.keywords || []).join(', ');
      html += `<div class="help-item"><strong>${command.description}:</strong> "${keywords}"</div>`;
    }
    html += '</div>';

    return html;
  }

  /**
   * Adicionar listener customizado
   */
  on(event, callback) {
    this.listeners.push({ event, callback });
  }

  /**
   * Remover listener
   */
  off(event, callback) {
    this.listeners = this.listeners.filter(l => 
      !(l.event === event && l.callback === callback)
    );
  }

  /**
   * Emitir evento
   */
  emit(event, data) {
    this.listeners.forEach(listener => {
      if (listener.event === event) {
        listener.callback(data);
      }
    });
  }
}

// Criar instância global
let speechService = null;

function initSpeechAPI() {
  if (!speechService) {
    speechService = new SpeechAPIService();
    window.speechService = speechService;
  }
  return speechService;
}

// Inicializar quando o documento estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpeechAPI);
} else {
  initSpeechAPI();
}

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpeechAPIService, initSpeechAPI };
}
