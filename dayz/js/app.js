// ========================================
// DayZ Wiki PT-BR - Main Application
// ========================================

class DayZWiki {
    constructor() {
        this.articleContent = document.getElementById('articleContent');
        this.searchInput = document.getElementById('searchInput');
        this.recentArticles = [];
        this.allArticles = [];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupSearch();
        this.loadArticlesList();
        this.handleRouting();

        // Update stats
        this.updateStats();
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('a[data-category], a[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                const page = link.dataset.page;

                if (category && page) {
                    this.loadArticle(category, page);
                } else if (category) {
                    this.loadCategory(category);
                } else if (page) {
                    this.loadPage(page);
                }

                // Update active state
                this.updateActiveNav(link);
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleRouting();
        });
    }

    setupMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const nav = document.getElementById('mainNav');

        if (toggle) {
            toggle.addEventListener('click', () => {
                const navList = nav.querySelector('.nav-list');
                navList.classList.toggle('active');
            });
        }

        // Mobile dropdown toggle
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = toggle.closest('.dropdown');
                    dropdown.classList.toggle('active');
                }
            });
        });
    }

    setupSearch() {
        let searchTimeout;

        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim().toLowerCase();

            if (query.length < 2) return;

            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        // Search button
        document.querySelector('.search-btn').addEventListener('click', () => {
            const query = this.searchInput.value.trim().toLowerCase();
            if (query.length >= 2) {
                this.performSearch(query);
            }
        });

        // Enter key
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = this.searchInput.value.trim().toLowerCase();
                if (query.length >= 2) {
                    this.performSearch(query);
                }
            }
        });
    }

    performSearch(query) {
        const results = this.allArticles.filter(article => {
            return article.title.toLowerCase().includes(query) ||
                   article.category.toLowerCase().includes(query) ||
                   (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)));
        });

        this.displaySearchResults(query, results);
    }

    displaySearchResults(query, results) {
        let html = `
            <h1>Resultados da Busca: "${query}"</h1>
            <p class="lead">Encontrados ${results.length} resultado(s)</p>
        `;

        if (results.length === 0) {
            html += `
                <div class="about-section">
                    <p>Nenhum resultado encontrado. Tente:</p>
                    <ul>
                        <li>Usar palavras-chave diferentes</li>
                        <li>Verificar a ortografia</li>
                        <li>Usar termos mais gerais</li>
                    </ul>
                </div>
            `;
        } else {
            html += '<div class="feature-cards">';
            results.forEach(article => {
                html += `
                    <div class="feature-card">
                        <div class="feature-icon">${this.getCategoryIcon(article.category)}</div>
                        <h3>${article.title}</h3>
                        <p>${article.description || 'Clique para ler mais'}</p>
                        <a href="#" data-category="${article.category}" data-page="${article.slug}" class="btn">Ler Artigo</a>
                    </div>
                `;
            });
            html += '</div>';
        }

        this.articleContent.innerHTML = html;

        // Re-attach event listeners for new links
        this.setupEventListeners();
    }

    handleRouting() {
        const hash = window.location.hash.slice(1);

        if (!hash) {
            return; // Show home page
        }

        const [category, page] = hash.split('/');

        if (category && page) {
            this.loadArticle(category, page);
        } else if (category) {
            this.loadCategory(category);
        }
    }

    async loadArticle(category, page) {
        this.showLoading();

        try {
            const response = await fetch(`content/${category}/${page}.md`);

            if (!response.ok) {
                throw new Error('Artigo não encontrado');
            }

            const markdown = await response.text();
            const html = marked.parse(markdown);

            this.articleContent.innerHTML = html;

            // Update URL
            window.history.pushState({}, '', `#${category}/${page}`);

            // Add to recent articles
            this.addToRecent({ category, page, title: page });

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            this.showError(`Não foi possível carregar o artigo: ${error.message}`);
        }
    }

    async loadCategory(category) {
        this.showLoading();

        try {
            const articles = this.allArticles.filter(a => a.category === category);

            let html = `
                <h1>${this.getCategoryTitle(category)}</h1>
                <p class="lead">Explore todos os artigos desta categoria</p>
            `;

            if (articles.length === 0) {
                html += `
                    <div class="about-section">
                        <p>Ainda não há artigos nesta categoria. Em breve!</p>
                    </div>
                `;
            } else {
                html += '<div class="feature-cards">';
                articles.forEach(article => {
                    html += `
                        <div class="feature-card">
                            <div class="feature-icon">${this.getCategoryIcon(category)}</div>
                            <h3>${article.title}</h3>
                            <p>${article.description || 'Clique para ler mais'}</p>
                            <a href="#" data-category="${category}" data-page="${article.slug}" class="btn">Ler Artigo</a>
                        </div>
                    `;
                });
                html += '</div>';
            }

            this.articleContent.innerHTML = html;

            // Update URL
            window.history.pushState({}, '', `#${category}`);

            // Re-attach event listeners
            this.setupEventListeners();

        } catch (error) {
            this.showError(`Erro ao carregar categoria: ${error.message}`);
        }
    }

    async loadPage(page) {
        // Load special pages (about, home, etc)
        this.showLoading();

        try {
            const response = await fetch(`content/${page}.md`);

            if (!response.ok) {
                throw new Error('Página não encontrada');
            }

            const markdown = await response.text();
            const html = marked.parse(markdown);

            this.articleContent.innerHTML = html;

            window.history.pushState({}, '', `#${page}`);

        } catch (error) {
            this.showError(`Não foi possível carregar a página: ${error.message}`);
        }
    }

    async loadArticlesList() {
        // In a real implementation, this would fetch from a manifest file
        // For now, we'll define some example articles
        this.allArticles = [
            {
                category: 'armas',
                slug: 'ak101',
                title: 'AK-101',
                description: 'Rifle de assalto automático 5.56x45mm',
                tags: ['rifle', 'automático', '556']
            },
            {
                category: 'armas',
                slug: 'm4a1',
                title: 'M4-A1',
                description: 'Carabina modular 5.56x45mm',
                tags: ['carabina', 'modular', '556']
            },
            {
                category: 'guias',
                slug: 'sobrevivencia',
                title: 'Guia de Sobrevivência',
                description: 'Aprenda os fundamentos para sobreviver em DayZ',
                tags: ['iniciante', 'survival', 'básico']
            },
            {
                category: 'mapas',
                slug: 'chernarus',
                title: 'Mapa de Chernarus',
                description: 'Mapa completo de Chernarus com localizações',
                tags: ['mapa', 'chernarus', 'localização']
            }
        ];

        this.updateStats();
    }

    updateStats() {
        const totalArticlesEl = document.getElementById('totalArticles');
        if (totalArticlesEl) {
            totalArticlesEl.textContent = this.allArticles.length;
        }
    }

    addToRecent(article) {
        // Remove if already exists
        this.recentArticles = this.recentArticles.filter(a =>
            !(a.category === article.category && a.page === article.page)
        );

        // Add to beginning
        this.recentArticles.unshift(article);

        // Keep only last 5
        this.recentArticles = this.recentArticles.slice(0, 5);

        // Update UI
        this.updateRecentArticles();

        // Save to localStorage
        localStorage.setItem('recentArticles', JSON.stringify(this.recentArticles));
    }

    updateRecentArticles() {
        const container = document.getElementById('recentArticles');
        if (!container) return;

        container.innerHTML = '';

        this.recentArticles.forEach(article => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.dataset.category = article.category;
            a.dataset.page = article.page;
            a.textContent = article.title;
            li.appendChild(a);
            container.appendChild(li);
        });

        // Re-attach event listeners
        this.setupEventListeners();
    }

    updateActiveNav(activeLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-list > li > a').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current link or its parent
        const parentNav = activeLink.closest('.nav-list > li');
        if (parentNav) {
            const mainLink = parentNav.querySelector('a');
            if (mainLink) {
                mainLink.classList.add('active');
            }
        }
    }

    showLoading() {
        this.articleContent.innerHTML = '<div class="loading">Carregando</div>';
    }

    showError(message) {
        this.articleContent.innerHTML = `
            <div class="about-section">
                <h1>Erro</h1>
                <p>${message}</p>
                <a href="#" onclick="location.reload()" class="btn">Voltar ao Início</a>
            </div>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            'armas': '🔫',
            'equipamentos': '🎒',
            'itens': '🍖',
            'veiculos': '🚗',
            'guias': '📖',
            'mapas': '🗺️'
        };
        return icons[category] || '📄';
    }

    getCategoryTitle(category) {
        const titles = {
            'armas': 'Armas',
            'equipamentos': 'Equipamentos',
            'itens': 'Itens',
            'veiculos': 'Veículos',
            'guias': 'Guias',
            'mapas': 'Mapas'
        };
        return titles[category] || category;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dayzWiki = new DayZWiki();
});

// Configure marked.js options
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
    });
}
