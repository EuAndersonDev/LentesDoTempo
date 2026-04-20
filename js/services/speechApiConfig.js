/**
 * Configuração da Speech API - Lentes do Tempo
 * 
 * Define palavras-chave, páginas e comandos para o reconhecimento de voz
 */

const SPEECH_API_CONFIG = {
    // Páginas do projeto
    pages: {
        galeria: {
            keywords: ['galeria', 'galéria', 'fotos', 'explorar galeria', 'ir para galeria'],
            url: '/pages/main/galeria.html',
            title: 'Galeria'
        },
        sobrenos: {
            keywords: ['sobre', 'sobre nós', 'sobrenos', 'quem somos', 'história'],
            url: '/pages/main/sobrenos.html',
            title: 'Sobre Nós'
        },
        servicos: {
            keywords: ['serviços', 'servicos', 'o que oferecemos', 'ofertas'],
            url: '/pages/main/servicos.html',
            title: 'Serviços'
        },
        eventos: {
            keywords: ['eventos', 'agendamento', 'agendar', 'datas', 'próximos eventos'],
            url: '/pages/main/eventos.html',
            title: 'Eventos'
        },
        parcerias: {
            keywords: ['parcerias', 'parceiros', 'cooperação', 'associações'],
            url: '/pages/main/parcerias.html',
            title: 'Parcerias'
        },
        coliseumVR: {
            keywords: ['coliseu', 'coliseumvr', 'colisseumvr', 'realidade virtual coliseu'],
            url: '/pages/main/VRs/colisseumVR.html',
            title: 'Coliseu VR'
        },
        farolVR: {
            keywords: ['farol', 'farolvr', 'realidade virtual farol'],
            url: '/pages/main/VRs/farolVR.html',
            title: 'Farol VR'
        },
        acervo: {
            keywords: ['acervo', 'coleção', 'acervos', 'artefatos'],
            url: '/pages/secondary/acervo.html',
            title: 'Acervo'
        },
        contato: {
            keywords: ['contato', 'fale conosco', 'contact', 'enviar mensagem'],
            url: '/pages/secondary/contato.html',
            title: 'Contato'
        },
        historico: {
            keywords: ['história', 'historia', 'histórico', 'historico', 'passado'],
            url: '/pages/secondary/historia.html',
            title: 'História'
        },
        perguntasFrequentes: {
            keywords: ['perguntas', 'FAQ', 'dúvidas', 'frequentes', 'ajuda'],
            url: '/pages/secondary/perguntas-frequentes.html',
            title: 'Perguntas Frequentes'
        },
        termosUso: {
            keywords: ['termos', 'termos de uso', 'condições', 'política'],
            url: '/pages/secondary/termos-uso.html',
            title: 'Termos de Uso'
        },
        cookies: {
            keywords: ['cookies', 'política de cookies', 'privacidade'],
            url: '/pages/secondary/cookies.html',
            title: 'Política de Cookies'
        },
        login: {
            keywords: ['login', 'entrar', 'fazer login', 'conectar'],
            url: '/pages/auth/login.html',
            title: 'Login'
        },
        registrar: {
            keywords: ['registrar', 'criar conta', 'cadastro', 'inscrever', 'registre-se'],
            url: '/pages/auth/register.html',
            title: 'Registrar'
        },
        esqueceuSenha: {
            keywords: ['esqueceu a senha', 'esqueci senha', 'recuperar senha', 'reset senha'],
            url: '/pages/auth/forgot-password.html',
            title: 'Recuperar Senha'
        }
    },

    // Comandos gerais
    commands: {
        home: {
            keywords: ['home', 'início', 'inicio', 'voltar', 'página inicial'],
            action: 'navigateHome',
            description: 'Voltar para a página inicial'
        },
        voltar: {
            keywords: ['voltar', 'página anterior', 'anterior', 'para trás'],
            action: 'goBack',
            description: 'Voltar para a página anterior'
        },
        avancar: {
            keywords: ['próximo', 'proximo', 'avançar', 'avancar', 'continuar'],
            action: 'goNext',
            description: 'Avançar para a próxima página'
        },
        menu: {
            keywords: ['menu', 'abrir menu', 'mostrar menu', 'navegação'],
            action: 'toggleMenu',
            description: 'Abrir/fechar o menu'
        },
        ajuda: {
            keywords: ['ajuda', 'help', 'como usar', 'tutorial', 'instruções'],
            action: 'showHelp',
            description: 'Mostrar ajuda'
        },
        pesquisar: {
            keywords: ['pesquisar', 'buscar', 'procurar', 'search'],
            action: 'startSearch',
            description: 'Iniciar pesquisa'
        }
    },

    // Configurações
    settings: {
        language: 'pt-BR',
        continuous: true,
        interimResults: true,
        confidence: 0.6,
        maxAlternatives: 1
    }
};

// Exportar configuração
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SPEECH_API_CONFIG;
} else {
    window.SPEECH_API_CONFIG = SPEECH_API_CONFIG;
}
