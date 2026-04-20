/**
 * Componente de Controle de Voz - Lentes do Tempo
 * 
 * Widget que fornece interface visual para o reconhecimento de voz
 */

class VoiceControlWidget {
    constructor(options = {}) {
        this.position = options.position || 'bottom-right';
        this.theme = options.theme || 'dark';
        this.enabled = options.enabled !== false;
        this.container = null;
        this.speechService = window.speechService || null;
    }

    /**
     * Inicializar widget
     */
    initialize() {
        if (!this.speechService) {
            console.warn('Speech Service não inicializado');
            return;
        }

        this.createWidget();
        this.attachEventListeners();
    }

    /**
     * Criar elementos do widget
     */
    createWidget() {
        // Container principal
        this.container = document.createElement('div');
        this.container.id = 'voice-control-widget';
        this.container.className = `voice-control-widget ${this.position} ${this.theme}`;

        // Botão do microfone
        const micButton = document.createElement('button');
        micButton.id = 'voice-control-mic';
        micButton.className = 'voice-control-mic';
        micButton.title = 'Ativar controle por voz (Clique ou pressione V)';
        micButton.innerHTML = '🎤';
        micButton.setAttribute('aria-label', 'Ativar controle por voz');

        // Indicador de status
        const statusIndicator = document.createElement('div');
        statusIndicator.id = 'voice-status';
        statusIndicator.className = 'voice-status hidden';

        // Texto de status
        const statusText = document.createElement('span');
        statusText.id = 'voice-status-text';
        statusText.className = 'voice-status-text';

        statusIndicator.appendChild(statusText);

        // Transcript visualizador
        const transcript = document.createElement('div');
        transcript.id = 'voice-transcript';
        transcript.className = 'voice-transcript hidden';

        // Menu de ajuda
        const helpButton = document.createElement('button');
        helpButton.id = 'voice-help-btn';
        helpButton.className = 'voice-help-btn';
        helpButton.title = 'Mostrar ajuda de comandos de voz';
        helpButton.innerHTML = '❓';

        // Montar widget
        this.container.appendChild(micButton);
        this.container.appendChild(statusIndicator);
        this.container.appendChild(transcript);
        this.container.appendChild(helpButton);

        // Adicionar ao DOM
        document.body.appendChild(this.container);

        // Injetar estilos
        this.injectStyles();
    }

    /**
     * Injetar estilos CSS
     */
    injectStyles() {
        const styleId = 'voice-control-styles';

        if (document.getElementById(styleId)) {
            return; // Já injetado
        }

        const styles = `
      /* Voice Control Widget */
      #voice-control-widget {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 9999;
        pointer-events: auto;
      }

      #voice-control-widget.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      #voice-control-widget.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      #voice-control-widget.top-right {
        top: 20px;
        right: 20px;
      }

      #voice-control-widget.top-left {
        top: 20px;
        left: 20px;
      }

      /* Botão do Microfone */
      .voice-control-mic {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: none;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .voice-control-mic:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
      }

      .voice-control-mic:active {
        transform: scale(0.95);
      }

      .voice-control-mic.listening {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        animation: pulse-mic 0.8s ease-in-out infinite;
      }

      @keyframes pulse-mic {
        0% {
          box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
        }
        50% {
          box-shadow: 0 4px 20px rgba(245, 87, 108, 0.8);
        }
        100% {
          box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
        }
      }

      /* Indicador de Status */
      .voice-status {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 12px;
        text-align: center;
        white-space: nowrap;
        max-width: 150px;
        animation: fadeIn 0.3s ease;
      }

      .voice-status.hidden {
        display: none;
      }

      .voice-status.error {
        background: rgba(220, 53, 69, 0.9);
      }

      /* Transcript */
      .voice-transcript {
        background: rgba(255, 255, 255, 0.95);
        padding: 12px;
        border-radius: 6px;
        font-size: 13px;
        max-width: 250px;
        border-left: 3px solid #667eea;
        animation: slideIn 0.3s ease;
      }

      .voice-transcript.hidden {
        display: none;
      }

      .voice-transcript.interim {
        color: #999;
        font-style: italic;
      }

      /* Botão de Ajuda */
      .voice-help-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: rgba(102, 126, 234, 0.2);
        color: #667eea;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid #667eea;
      }

      .voice-help-btn:hover {
        background: rgba(102, 126, 234, 0.3);
        transform: scale(1.05);
      }

      /* Speech Indicator */
      #speech-indicator {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(240, 147, 251, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9998;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      #speech-indicator.active {
        opacity: 1;
      }

      /* Animações */
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideIn {
        from {
          transform: translateY(-10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      /* Dark Theme */
      #voice-control-widget.dark {
        color: white;
      }

      /* Light Theme */
      #voice-control-widget.light .voice-status {
        background: rgba(255, 255, 255, 0.95);
        color: #333;
        border: 1px solid #ddd;
      }

      #voice-control-widget.light .voice-transcript {
        background: rgba(0, 0, 0, 0.05);
        color: #333;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .voice-control-mic {
          width: 48px;
          height: 48px;
          font-size: 20px;
        }

        #voice-control-widget.bottom-right,
        #voice-control-widget.bottom-left {
          bottom: 15px;
        }

        #voice-control-widget.bottom-right,
        #voice-control-widget.top-right {
          right: 15px;
        }

        #voice-control-widget.bottom-left,
        #voice-control-widget.top-left {
          left: 15px;
        }
      }
    `;

        const styleSheet = document.createElement('style');
        styleSheet.id = styleId;
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    /**
     * Conectar listeners de eventos
     */
    attachEventListeners() {
        const micButton = document.getElementById('voice-control-mic');
        const helpButton = document.getElementById('voice-help-btn');

        // Click no botão do microfone
        if (micButton) {
            micButton.addEventListener('click', () => this.toggleListening());
        }

        // Click no botão de ajuda
        if (helpButton) {
            helpButton.addEventListener('click', () => this.speechService?.showHelpModal());
        }

        // Atalho de teclado (V)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'v' || e.key === 'V') {
                this.toggleListening();
            }
        });

        // Listeners do Speech Service
        if (this.speechService) {
            this.speechService.on('listening-start', () => this.onListeningStart());
            this.speechService.on('listening-end', () => this.onListeningEnd());
            this.speechService.on('interim-result', (data) => this.onInterimResult(data));
            this.speechService.on('final-result', (data) => this.onFinalResult(data));
            this.speechService.on('command-executed', (data) => this.onCommandExecuted(data));
            this.speechService.on('error', (data) => this.onError(data));
        }
    }

    /**
     * Alternar ouvindo
     */
    toggleListening() {
        if (!this.speechService?.available) {
            alert('Speech API não disponível neste navegador');
            return;
        }

        if (this.speechService.isListening) {
            this.speechService.stop();
        } else {
            this.speechService.start();
        }
    }

    /**
     * Callback: começou a ouvir
     */
    onListeningStart() {
        const micButton = document.getElementById('voice-control-mic');
        const statusDiv = document.getElementById('voice-status');

        if (micButton) {
            micButton.classList.add('listening');
        }

        if (statusDiv) {
            statusDiv.textContent = '🎤 Ouvindo...';
            statusDiv.classList.remove('hidden', 'error');
        }
    }

    /**
     * Callback: parou de ouvir
     */
    onListeningEnd() {
        const micButton = document.getElementById('voice-control-mic');
        const statusDiv = document.getElementById('voice-status');
        const transcriptDiv = document.getElementById('voice-transcript');

        if (micButton) {
            micButton.classList.remove('listening');
        }

        // Manter status visível por um segundo
        setTimeout(() => {
            if (statusDiv) {
                statusDiv.classList.add('hidden');
            }
            if (transcriptDiv) {
                transcriptDiv.classList.add('hidden');
            }
        }, 1500);
    }

    /**
     * Callback: resultado interim
     */
    onInterimResult(data) {
        const transcriptDiv = document.getElementById('voice-transcript');

        if (transcriptDiv) {
            transcriptDiv.textContent = `${data.text}`;
            transcriptDiv.classList.remove('hidden');
            transcriptDiv.classList.add('interim');
        }
    }

    /**
     * Callback: resultado final
     */
    onFinalResult(data) {
        const transcriptDiv = document.getElementById('voice-transcript');

        if (transcriptDiv) {
            transcriptDiv.textContent = `✓ "${data.text}"`;
            transcriptDiv.classList.remove('interim');
        }
    }

    /**
     * Callback: comando executado
     */
    onCommandExecuted(data) {
        const statusDiv = document.getElementById('voice-status');

        if (statusDiv) {
            statusDiv.textContent = `✓ Comando executado`;
            statusDiv.classList.remove('hidden', 'error');
        }
    }

    /**
     * Callback: erro
     */
    onError(data) {
        const statusDiv = document.getElementById('voice-status');

        if (statusDiv) {
            const errorMessage = this.getErrorMessage(data.error);
            statusDiv.textContent = `❌ ${errorMessage}`;
            statusDiv.classList.remove('hidden');
            statusDiv.classList.add('error');
        }

        console.error('Erro de voz:', data.error);
    }

    /**
     * Obter mensagem de erro amigável
     */
    getErrorMessage(error) {
        const messages = {
            'no-speech': 'Nenhuma fala detectada',
            'audio-capture': 'Sem acesso ao microfone',
            'network': 'Erro de conexão',
            'permission-denied': 'Permissão negada',
            'not-allowed': 'Recurso não permitido',
            'bad-grammar': 'Comando não reconhecido'
        };

        return messages[error] || `Erro: ${error}`;
    }
}

// Inicializar widget quando o Speech Service estiver pronto
function initVoiceControlWidget(options = {}) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const widget = new VoiceControlWidget(options);
            widget.initialize();
            window.voiceControlWidget = widget;
        });
    } else {
        const widget = new VoiceControlWidget(options);
        widget.initialize();
        window.voiceControlWidget = widget;
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VoiceControlWidget, initVoiceControlWidget };
}
