/**
 * Configuração da API - Lentes do Tempo
 *
 * Módulo centralizado para comunicação com o backend.
 * Todos os requests HTTP devem passar por este módulo.
 */

const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3000/api';
const DEFAULT_RENDER_API_BASE_URL = 'https://backend-4scx.onrender.com/api';

function resolveApiBaseUrl() {
    if (window.__API_BASE_URL__ && typeof window.__API_BASE_URL__ === 'string') {
        return window.__API_BASE_URL__.trim();
    }

    const metaTag = document.querySelector('meta[name="api-base-url"]');
    const metaValue = metaTag && metaTag.content ? metaTag.content.trim() : '';
    if (metaValue) {
        return metaValue;
    }

    if (window.API_BASE_URL && typeof window.API_BASE_URL === 'string') {
        return window.API_BASE_URL.trim();
    }

    const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocalHost ? DEFAULT_LOCAL_API_BASE_URL : DEFAULT_RENDER_API_BASE_URL;
}

const API_BASE_URL = resolveApiBaseUrl();

const globalApi = window.api && typeof window.api === 'object' ? window.api : {};
const globalLegacyConfig = window.API_CONFIG && typeof window.API_CONFIG === 'object'
    ? window.API_CONFIG
    : {};

window.api = {
    ...globalApi,
    auth: globalApi.auth && typeof globalApi.auth === 'object' ? globalApi.auth : {},
    images: globalApi.images && typeof globalApi.images === 'object' ? globalApi.images : {},
    contact: globalApi.contact && typeof globalApi.contact === 'object' ? globalApi.contact : {},
};

window.API_CONFIG = {
    ...globalLegacyConfig,
    auth: globalLegacyConfig.auth && typeof globalLegacyConfig.auth === 'object'
        ? globalLegacyConfig.auth
        : {},
    images: globalLegacyConfig.images && typeof globalLegacyConfig.images === 'object'
        ? globalLegacyConfig.images
        : {},
    contact: globalLegacyConfig.contact && typeof globalLegacyConfig.contact === 'object'
        ? globalLegacyConfig.contact
        : {},
};

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
    window.location.href = '/pages/auth/login.html';
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

    // Contato
    contact: {
        serviceRequest: (data) => apiRequest('/contact/service-request', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    },
};

function getAuthApi() {
    if (window.api && window.api.auth) {
        return window.api.auth;
    }

    if (window.API_CONFIG && window.API_CONFIG.auth) {
        return window.API_CONFIG.auth;
    }

    if (typeof window.apiRequest === 'function') {
        return {
            register: (data) => window.apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
            login: (data) => window.apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
            getProfile: () => window.apiRequest('/auth/me'),
            forgotPassword: (data) => window.apiRequest('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
            verifyCode: (data) => window.apiRequest('/auth/verify-code', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
            resetPassword: (data) => window.apiRequest('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        };
    }

    throw new Error('API de autenticação indisponível. Recarregue a página e tente novamente.');
}

function getImagesApi() {
    if (window.api && window.api.images) {
        return window.api.images;
    }

    if (window.API_CONFIG && window.API_CONFIG.images) {
        return window.API_CONFIG.images;
    }

    if (typeof window.apiRequest === 'function') {
        return {
            getAll: () => window.apiRequest('/images'),
            getById: (id) => window.apiRequest(`/images/${id}`),
            create: (formData) => window.apiRequest('/images/upload', {
                method: 'POST',
                headers: {},
                body: formData,
            }),
            update: (id, data) => window.apiRequest(`/images/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            }),
            delete: (id) => window.apiRequest(`/images/${id}`, {
                method: 'DELETE',
            }),
        };
    }

    throw new Error('API de imagens indisponível. Recarregue a página e tente novamente.');
}

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
window.getAuthApi = getAuthApi;
window.getImagesApi = getImagesApi;
window.apiReady = Promise.resolve(window.api);

// Compatibilidade legada para scripts antigos que ainda usam API_CONFIG.auth/images.
window.API_CONFIG = {
    ...(window.API_CONFIG || {}),
    baseUrl: API_BASE_URL,
    auth: {
        register: (data) => api.auth.register(data),
        login: (data) => api.auth.login(data),
        getProfile: () => api.auth.getProfile(),
        forgotPassword: (data) => api.auth.forgotPassword(data),
        verifyCode: (data) => api.auth.verifyCode(data),
        resetPassword: (data) => api.auth.resetPassword(data),
    },
    images: {
        getAll: () => api.images.getAll(),
        getById: (id) => api.images.getById(id),
        create: (formData) => api.images.create(formData),
        update: (id, data) => api.images.update(id, data),
        delete: (id) => api.images.delete(id),
    },
    contact: {
        serviceRequest: (data) => api.contact.serviceRequest(data),
    },
};

// Alias adicional para cobrir variacoes comuns em codigo legado.
window.config = window.API_CONFIG;
