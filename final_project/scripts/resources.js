import { fetchResourceArticles } from './modules/dataService.js';

/**
 * Escapes HTML to prevent accidental injection.
 */
function escapeHtml(value = '') {
    const div = document.createElement('div');
    div.textContent = String(value);
    return div.innerHTML;
}

/**
 * Renders resource article cards.
 */
function renderArticleCards(articles) {
    const container = document.getElementById('resources-matrix');
    if (!container) {
        console.warn('resources-matrix container not found.');
        return;
    }

    if (!Array.isArray(articles) || articles.length === 0) {
        container.innerHTML = `
            <p class="fallback-err">
                No resource articles are available at this time.
            </p>
        `;
        return;
    }

    const articleMarkup = articles
        .map(
            (article) => `
                <article class="resources-card">
                    <div class="resource-card-content">
                        <span class="resource-category">
                            ${escapeHtml(article.category || 'General')}
                        </span>
                        <h4 class="resource-card-title">
                            ${escapeHtml(article.title || 'Untitled Article')}
                        </h4>
                        <p class="resource-meta">
                            ${escapeHtml(article.publishDate || 'Unknown Date')}
                            •
                            ${escapeHtml(article.readTime || 'N/A')}
                        </p>
                        <p class="resource-excerpt">
                            ${escapeHtml(article.excerpt || 'No excerpt available.')}
                        </p>
                    </div>

                    <button
                        type="button"
                        class="view-details-btn"
                        data-id="${article.id || ''}"
                    >
                        Read Article
                    </button>
                </article>
            `
        )
        .join('');

    container.innerHTML = articleMarkup;
}

/**
 * Loads articles and renders them.
 */
async function initializeResourcesPage() {
    const container = document.getElementById('resources-matrix');

    if (!container) {
        return;
    }

    try {
        const articles = await fetchResourceArticles();
        console.log('Loaded Articles:', articles);
        renderArticleCards(articles);
    } catch (error) {
        console.error('Failed to load resource articles:', error);
        container.innerHTML = `
            <p class="fallback-err">
                Unable to load articles at this time. Please try again later.
            </p>
        `;
    }
}

/**
 * Initialize when DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeResourcesPage();
});