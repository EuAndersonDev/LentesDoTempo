function pickGalleryImageUrl(item) {
    if (!item) {
        return "";
    }

    return (
        item.revitalizedImageUrl ||
        item.generatedImageUrl ||
        item.restoredImageUrl ||
        item.processedImageUrl ||
        item.imageUrl ||
        ""
    );
}

function buildEmptyGalleryCard(title, message) {
    return `
        <article class="gallery-backend__card gallery-backend__card--empty">
            <h3>${title}</h3>
            <p>${message}</p>
        </article>
    `;
}

async function loadBackendGallery() {
    const feedback = document.getElementById("gallery-backend-feedback");
    const grid = document.getElementById("gallery-backend-grid");

    if (!feedback || !grid) {
        return;
    }

    const imagesApi = typeof window.getImagesApi === "function" ? window.getImagesApi() : null;
    const token = typeof window.getAuthToken === "function" ? window.getAuthToken() : null;

    if (!imagesApi) {
        feedback.textContent = "Integração da API indisponível nesta página.";
        grid.innerHTML = buildEmptyGalleryCard(
            "Configuração pendente",
            "Recarregue a página para inicializar o módulo de integração."
        );
        return;
    }

    if (!token) {
        feedback.textContent = "Faça login para carregar suas imagens revitalizadas.";
        grid.innerHTML = buildEmptyGalleryCard(
            "Sem sessão ativa",
            "Entre na sua conta para visualizar o acervo gerado no backend."
        );
        return;
    }

    try {
        const response = await imagesApi.getAll();
        const items = Array.isArray(response && response.data) ? response.data : [];

        if (!items.length) {
            feedback.textContent = "Nenhuma imagem encontrada para a sua conta.";
            grid.innerHTML = buildEmptyGalleryCard(
                "Acervo vazio",
                "Envie uma imagem na página de Reconstrução de cenário para começar."
            );
            return;
        }

        feedback.textContent = `${items.length} item${items.length > 1 ? "s" : ""} carregado${items.length > 1 ? "s" : ""} do backend.`;
        grid.innerHTML = items
            .map((item) => {
                const imageUrl = pickGalleryImageUrl(item);
                const title = item.originalName || item.fileName || "Cenário revitalizado";
                const statusText =
                    item.status === "completed"
                        ? "Análise concluída"
                        : item.status === "processing"
                            ? "Processando"
                            : item.status === "failed"
                                ? "Falha na análise"
                                : "Status indisponível";

                return `
                    <article class="gallery-backend__card">
                        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" class="gallery-backend__image" />` : '<div class="gallery-backend__no-image">Sem imagem disponível</div>'}
                        <div class="gallery-backend__meta">
                            <h3>${title}</h3>
                            <span class="gallery-backend__status">${statusText}</span>
                            <p>${item.geminiAnalysis || "A descrição de revitalização aparecerá aqui quando o processamento terminar."}</p>
                        </div>
                    </article>
                `;
            })
            .join("");
    } catch (error) {
        feedback.textContent = "Não foi possível carregar a galeria do backend.";
        grid.innerHTML = buildEmptyGalleryCard(
            "Erro de integração",
            error.message || "Falha ao consultar o endpoint de imagens."
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadBackendGallery();
});
