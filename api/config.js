/**
 * Configuração da API - Lentes do Tempo
 *
 * Módulo centralizado para comunicação com o backend.
 * Todos os requests HTTP devem passar por este módulo.
 */

const API_BASE_URL = 'http://localhost:3000/api';

const PUBLIC_AUTH_ENDPOINTS = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/verify-code',
    '/auth/reset-password',
];

/**
 * Obtém o token de autenticação armazenado
 * @returns {string|null} Token JWT ou null
 */
function getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

/**
 * Persistencia de sessao de acordo com preferencia do usuario
 * @param {object} authData - payload retornado pelo backend
 * @param {object} options
 * @param {boolean} options.remember - true salva no localStorage, false no sessionStorage
 */
function setAuthSession(authData, { remember = false } = {}) {
    if (!authData || !authData.token) {
        throw new Error('Dados de autenticacao invalidos');
    }

    const storage = remember ? localStorage : sessionStorage;
    const fallbackStorage = remember ? sessionStorage : localStorage;

    // Remove sessao anterior para evitar conflitos entre storages
    fallbackStorage.removeItem('authToken');
    fallbackStorage.removeItem('user');

    storage.setItem('authToken', authData.token);
    storage.setItem('user', JSON.stringify({
        id: authData.id,
        name: authData.name,
        email: authData.email,
    }));
}

/**
 * Limpa dados de autenticacao dos storages
 */
function clearAuthSession() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
}

/**
 * Obtém os dados do usuário armazenados
 * @returns {object|null} Dados do usuário ou null
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean} True se autenticado
 */
function isAuthenticated() {
    return !!getAuthToken();
}

/**
 * Faz logout do usuário (remove tokens da sessão)
 */
function logout() {
    clearAuthSession();
    window.location.href = '../pages/login.html';
}

function isPublicAuthEndpoint(endpoint) {
    return PUBLIC_AUTH_ENDPOINTS.some((publicEndpoint) => endpoint.startsWith(publicEndpoint));
}

/**
 * Executa uma requisição HTTP para a API
 * @param {string} endpoint - Endpoint da API (ex: '/auth/login')
 * @param {object} options - Opções da requisição
 * @returns {Promise<any>} Resposta da API
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const hasFormDataBody = options.body instanceof FormData;

    const headers = {
        ...options.headers,
    };

    if (!hasFormDataBody && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // Adiciona token de autenticação se existir
    const token = getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        const responseType = response.headers.get('content-type') || '';
        const data = responseType.includes('application/json')
            ? await response.json()
            : null;

        if (!response.ok) {
            // Nao derruba fluxo de login/registro por 401 de credenciais invalidas
            if (response.status === 401 && getAuthToken() && !isPublicAuthEndpoint(endpoint)) {
                clearAuthSession();
                throw new Error('Sessão expirada. Faça login novamente.');
            }

            const errorMessage = data && data.error ? data.error : 'Erro na requisição';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error(`API Request failed: ${url}`, error);
        throw error;
    }
}

/**
 * Valida o JWT atual com o backend
 * @returns {Promise<boolean>} true quando token valido
 */
async function validateJwtSession() {
    const token = getAuthToken();

    if (!token) {
        return false;
    }

    try {
        await api.auth.getProfile();
        return true;
    } catch (error) {
        clearAuthSession();
        return false;
    }
}

/**
 * Métodos HTTP simplificados
 */
const api = {
    // Auth
    auth: {
        register: (data) => apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        login: (data) => apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        getProfile: () => apiRequest('/auth/me'),
        forgotPassword: (data) => apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        verifyCode: (data) => apiRequest('/auth/verify-code', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        resetPassword: (data) => apiRequest('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },

    // Imagens
    images: {
        getAll: () => apiRequest('/images'),
        getById: (id) => apiRequest(`/images/${id}`),
        create: (formData) => apiRequest('/images/upload', {
            method: 'POST',
            headers: {}, // Sem Content-Type para permitir multipart/form-data
            body: formData,
        }),
        update: (id, data) => apiRequest(`/images/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        delete: (id) => apiRequest(`/images/${id}`, {
            method: 'DELETE',
        }),
    },
};

// Exporta para uso em outros módulos
window.api = api;
window.apiRequest = apiRequest;
window.getAuthToken = getAuthToken;
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.setAuthSession = setAuthSession;
window.clearAuthSession = clearAuthSession;
window.validateJwtSession = validateJwtSession;
window.logout = logout;
window.API_BASE_URL = API_BASE_URL;
