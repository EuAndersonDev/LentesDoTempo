const state = {
    selectedFile: null,
    sourceObjectUrl: null,
    loading: false,
    pollToken: 0,
};

const POLL_INTERVAL_MS = 2200;
const POLL_MAX_ATTEMPTS = 18;

const form = document.getElementById("reload-form");
const fileInput = document.getElementById("image-file");
const dropzone = document.getElementById("reload-dropzone");
const sourcePreview = document.getElementById("source-preview");
const sourcePlaceholder = document.getElementById("source-placeholder");
const clearFileButton = document.getElementById("clear-file-button");
const submitButton = document.getElementById("reload-submit-button");
const refreshButton = document.getElementById("reload-refresh-button");
const feedback = document.getElementById("reload-feedback");
const uploadState = document.getElementById("upload-state");
const resultEmptyState = document.getElementById("result-empty-state");
const resultActiveState = document.getElementById("result-active-state");
const resultPreview = document.getElementById("result-preview");
const resultTitle = document.getElementById("result-title");
const resultDescription = document.getElementById("result-description");
const resultLink = document.getElementById("result-link");
const gallery = document.getElementById("reload-gallery");
const galleryCount = document.getElementById("gallery-count");

function ensureAuthenticatedSession() {
    if (typeof window.getAuthToken !== "function") {
        throw new Error("Módulo de autenticação não carregado. Recarregue a página.");
    }

    const token = window.getAuthToken();
    if (!token) {
        throw new Error("Faça login para enviar e visualizar suas imagens revitalizadas.");
    }
}

function getImagesApi() {
    if (window.api && window.api.images) {
        return window.api.images;
    }

    if (typeof window.apiRequest === "function") {
        return {
            getAll: () => window.apiRequest("/images"),
            getById: (id) => window.apiRequest(`/images/${id}`),
            create: (formData) =>
                window.apiRequest("/images/upload", {
                    method: "POST",
                    headers: {},
                    body: formData,
                }),
        };
    }

    throw new Error("Integração de API indisponível. Recarregue a página e tente novamente.");
}

function setFeedback(message, type = "") {
    feedback.textContent = message;
    feedback.classList.toggle("is-error", type === "error");
    feedback.classList.toggle("is-success", type === "success");
}

function setUploadState(message) {
    uploadState.textContent = message;
}

function clearPreviewState() {
    if (state.sourceObjectUrl) {
        URL.revokeObjectURL(state.sourceObjectUrl);
        state.sourceObjectUrl = null;
    }

    sourcePreview.removeAttribute("src");
    sourcePreview.hidden = true;
    sourcePlaceholder.hidden = false;
}

function clearResultState() {
    resultPreview.removeAttribute("src");
    resultLink.hidden = true;
    resultLink.removeAttribute("href");
    resultEmptyState.hidden = false;
    resultActiveState.hidden = true;
}

function setSourcePreview(file) {
    clearPreviewState();

    if (!file) {
        state.selectedFile = null;
        setUploadState("Aguardando arquivo");
        return;
    }

    state.selectedFile = file;
    state.sourceObjectUrl = URL.createObjectURL(file);
    sourcePreview.src = state.sourceObjectUrl;
    sourcePreview.hidden = false;
    sourcePlaceholder.hidden = true;
    setUploadState(file.name);
}

function normalizeCollectionResponse(response) {
    if (Array.isArray(response)) {
        return response;
    }

    if (response && Array.isArray(response.data)) {
        return response.data;
    }

    if (response && Array.isArray(response.items)) {
        return response.items;
    }

    return [];
}

function extractPayload(response) {
    if (!response) {
        return null;
    }

    if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
        return response.data;
    }

    return response;
}

function pickImageUrl(payload) {
    if (!payload) {
        return "";
    }

    return (
        payload.revitalizedImageUrl ||
        payload.generatedImageUrl ||
        payload.restoredImageUrl ||
        payload.processedImageUrl ||
        payload.resultImageUrl ||
        payload.imageUrl ||
        payload.url ||
        payload.path ||
        ""
    );
}

function renderResult(payload, title) {
    const imageUrl = pickImageUrl(payload);
    const status = payload && payload.status;
    const analysisText = payload && payload.geminiAnalysis;
    const statusLabel =
        status === "processing"
            ? "Análise em andamento..."
            : status === "completed"
                ? "Análise concluída"
                : status === "failed"
                    ? "Falha na análise"
                    : "";

    resultTitle.textContent = title || (payload && payload.title) || "Resultado processado";
    resultDescription.textContent =
        analysisText ||
        (payload && payload.description) ||
        (payload && payload.message) ||
        statusLabel ||
        "A resposta do backend será exibida aqui com a imagem revitalizada ou com os metadados do processamento.";

    if (imageUrl) {
        resultPreview.src = imageUrl;
        resultPreview.hidden = false;
        resultEmptyState.hidden = true;
        resultActiveState.hidden = false;
        resultLink.href = imageUrl;
        resultLink.download = "imagem-restaurada.webp";
        resultLink.textContent = "Baixar imagem restaurada";
        resultLink.hidden = false;
    } else {
        resultEmptyState.hidden = false;
        resultActiveState.hidden = true;
        resultLink.hidden = true;
        resultLink.removeAttribute("href");
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function pollImageStatus(imageId, title, pollToken) {
    const imagesApi = getImagesApi();

    for (let attempt = 1; attempt <= POLL_MAX_ATTEMPTS; attempt += 1) {
        if (pollToken !== state.pollToken) {
            return;
        }

        try {
            const detailsResponse = await imagesApi.getById(imageId);
            const detailsPayload = extractPayload(detailsResponse);

            renderResult(detailsPayload, title);

            if (detailsPayload && detailsPayload.status === "completed") {
                setFeedback("Imagem restaurada pronta. A análise foi concluída.", "success");
                return;
            }

            if (detailsPayload && detailsPayload.status === "failed") {
                setFeedback("A restauração foi entregue, mas a análise textual falhou.", "error");
                return;
            }

            setFeedback(`Restauração entregue. Finalizando análise (${attempt}/${POLL_MAX_ATTEMPTS})...`);
        } catch (error) {
            setFeedback(`Não foi possível consultar o status da análise: ${error.message}`, "error");
            return;
        }

        await sleep(POLL_INTERVAL_MS);
    }

    setFeedback("A imagem restaurada está disponível, mas a análise ainda não terminou.");
}

function renderGallery(items) {
    if (!items.length) {
        gallery.innerHTML = `
            <article class="reload-gallery__empty">
                <h3>Nenhum item encontrado</h3>
                <p>
                    O endpoint de imagens ainda não retornou registros. Envie uma imagem para começar a popular o acervo.
                </p>
            </article>
        `;
        galleryCount.textContent = "0 itens";
        return;
    }

    galleryCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

    gallery.innerHTML = items
        .map((item) => {
            const imageUrl = pickImageUrl(item);
            const label = item.title || item.originalName || item.name || "Registro sem título";
            const statusLabel =
                item.status === "processing"
                    ? "Análise em andamento"
                    : item.status === "completed"
                        ? "Análise concluída"
                        : item.status === "failed"
                            ? "Falha na análise"
                            : "Status indisponível";
            const description =
                item.geminiAnalysis ||
                item.description ||
                item.caption ||
                item.prompt ||
                statusLabel;

            return `
                <article class="reload-gallery-card">
                    ${imageUrl ? `<img class="reload-gallery-card__image" src="${imageUrl}" alt="${label}" />` : `<div class="reload-gallery-card__placeholder">Sem miniatura disponível</div>`}
                    <div class="reload-gallery-card__body">
                        <h3>${label}</h3>
                        <p>${description}</p>
                    </div>
                </article>
            `;
        })
        .join("");
}

async function loadGallery() {
    gallery.innerHTML = `
        <article class="reload-gallery__empty">
            <h3>Carregando registros</h3>
            <p>Consultando os envios mais recentes no backend.</p>
        </article>
    `;

    try {
        ensureAuthenticatedSession();
        const imagesApi = getImagesApi();
        const response = await imagesApi.getAll();
        renderGallery(normalizeCollectionResponse(response));
    } catch (error) {
        gallery.innerHTML = `
            <article class="reload-gallery__empty">
                <h3>Não foi possível carregar a galeria</h3>
                <p>${error.message}</p>
            </article>
        `;
        galleryCount.textContent = "0 itens";
    }
}

function setLoading(isLoading) {
    state.loading = isLoading;
    submitButton.disabled = isLoading;
    refreshButton.disabled = isLoading;
    submitButton.textContent = isLoading ? "Processando..." : "Processar com IA";
}

dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragover");
});

dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("is-dragover");
});

dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragover");

    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        fileInput.files = transfer.files;
        setSourcePreview(file);
        setFeedback("Arquivo pronto para envio.", "success");
        clearResultState();
    }
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    setSourcePreview(file || null);

    if (file) {
        setFeedback("Arquivo selecionado. Configure o briefing e processe a imagem.", "success");
        clearResultState();
    } else {
        setFeedback("");
    }
});

clearFileButton.addEventListener("click", () => {
    fileInput.value = "";
    setSourcePreview(null);
    setFeedback("Arquivo removido.");
    clearResultState();
});

refreshButton.addEventListener("click", () => {
    loadGallery();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const selectedFile = fileInput.files && fileInput.files[0];
    const sceneTitle = document.getElementById("scene-title").value.trim();
    const brief = document.getElementById("revitalization-brief").value.trim();
    const stylePreset = document.getElementById("style-presets").value;

    if (!selectedFile) {
        setFeedback("Selecione uma imagem para iniciar a reconstrução.", "error");
        return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", sceneTitle || selectedFile.name);
    formData.append("brief", brief);
    formData.append("style", stylePreset);

    setLoading(true);
    setFeedback("Enviando imagem para o backend...");
    clearResultState();

    try {
        ensureAuthenticatedSession();
        const imagesApi = getImagesApi();
        const response = await imagesApi.create(formData);
        const payload = extractPayload(response);
        const title = sceneTitle || (payload && payload.title) || selectedFile.name;
        const imageId = payload && payload.id;
        const pollToken = state.pollToken + 1;

        state.pollToken = pollToken;

        renderResult(payload, title);
        setFeedback("Imagem restaurada gerada e pronta para visualização/download.", "success");

        if (imageId) {
            pollImageStatus(imageId, title, pollToken);
        }

        await loadGallery();
    } catch (error) {
        setFeedback(error.message, "error");
    } finally {
        setLoading(false);
    }
});

loadGallery();