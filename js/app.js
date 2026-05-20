(function () {
    const THEME_KEY = 'kroeppis-theme';
    const RECIPES_PATH = 'data/recipes.json';
    let recipes = [];

    function escapeHtml(input) {
        return String(input)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function setTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.textContent = isDark ? '☀️' : '🌙';
        }
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    }

    function initTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(saved ? saved === 'dark' : prefersDark);

        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', function () {
                setTheme(!document.body.classList.contains('dark-mode'));
            });
        }
    }

    function toCard(recipe) {
        return `
            <article class="recipe-card" data-recipe-id="${recipe.id}" role="button" tabindex="0">
                <h3>${escapeHtml(recipe.name)}</h3>
                <p class="recipe-duration">⏱️ ${escapeHtml(recipe.dauer)}</p>
            </article>
        `;
    }

    function renderRecipeCards(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }
        container.innerHTML = items.map(toCard).join('');
        container.querySelectorAll('.recipe-card').forEach(function (card) {
            const openRecipe = function () {
                openRecipeModal(card.getAttribute('data-recipe-id'));
            };
            card.addEventListener('click', openRecipe);
            card.addEventListener('keypress', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openRecipe();
                }
            });
        });
    }

    function openRecipeModal(recipeId) {
        const recipe = recipes.find(function (item) {
            return String(item.id) === String(recipeId);
        });
        if (!recipe) {
            return;
        }

        const modal = document.getElementById('recipeModal');
        const modalBody = document.getElementById('modalBody');
        if (!modal || !modalBody) {
            return;
        }

        modalBody.innerHTML = `
            <div class="recipe-detail">
                <h2>${escapeHtml(recipe.name)}</h2>
                <p><strong>Zubereitungsdauer:</strong> ${escapeHtml(recipe.dauer)}</p>
                <h3>Zutaten</h3>
                <pre>${escapeHtml(recipe.zutaten)}</pre>
                <h3>Zubereitung</h3>
                <pre>${escapeHtml(recipe.zubereitung)}</pre>
            </div>
        `;

        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeRecipeModal() {
        const modal = document.getElementById('recipeModal');
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    function bindModalHandlers() {
        const modal = document.getElementById('recipeModal');
        if (!modal) {
            return;
        }

        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeRecipeModal);
        }

        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeRecipeModal();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeRecipeModal();
            }
        });
    }

    function setNoResultsVisibility(elementId, visible) {
        const el = document.getElementById(elementId);
        if (el) {
            el.style.display = visible ? 'block' : 'none';
        }
    }

    function normalize(value) {
        return value.trim().toLowerCase();
    }

    function searchByName(value) {
        const term = normalize(value);
        if (!term) {
            renderRecipeCards('searchNameResults', recipes);
            setNoResultsVisibility('noResultsName', false);
            return;
        }

        const filtered = recipes.filter(function (recipe) {
            return recipe.name.toLowerCase().includes(term);
        });

        renderRecipeCards('searchNameResults', filtered);
        setNoResultsVisibility('noResultsName', filtered.length === 0);
    }

    function searchByIngredients(value) {
        const term = normalize(value);
        if (!term) {
            renderRecipeCards('searchIngredientsResults', recipes);
            setNoResultsVisibility('noResultsIngredients', false);
            return;
        }

        const filtered = recipes.filter(function (recipe) {
            return recipe.zutaten.toLowerCase().includes(term);
        });

        renderRecipeCards('searchIngredientsResults', filtered);
        setNoResultsVisibility('noResultsIngredients', filtered.length === 0);
    }

    function switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });

        document.querySelectorAll('.tab').forEach(function (tab) {
            tab.classList.toggle('active', tab.id === tabId);
        });

        const url = new URL(window.location.href);
        if (tabId === 'list') {
            url.searchParams.delete('tab');
        } else {
            url.searchParams.set('tab', tabId);
        }
        history.replaceState({}, '', url.toString());
    }

    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        if (!tabButtons.length) {
            return;
        }

        tabButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                switchTab(btn.getAttribute('data-tab'));
            });
        });

        const tabFromUrl = new URLSearchParams(window.location.search).get('tab');
        const validTab = tabFromUrl && document.getElementById(tabFromUrl) ? tabFromUrl : 'list';
        switchTab(validTab);
    }

    function renderHomepageStats() {
        const count = document.getElementById('recipeCount');
        if (count) {
            count.textContent = String(recipes.length);
        }
    }

    function initSearchHandlers() {
        const searchNameInput = document.getElementById('searchNameInput');
        if (searchNameInput) {
            searchNameInput.addEventListener('input', function (event) {
                searchByName(event.target.value);
            });
        }

        const searchIngredientsInput = document.getElementById('searchIngredientsInput');
        if (searchIngredientsInput) {
            searchIngredientsInput.addEventListener('input', function (event) {
                searchByIngredients(event.target.value);
            });
        }
    }

    function sortRecipesByName(data) {
        return data.slice().sort(function (a, b) {
            return a.name.localeCompare(b.name, 'de', { sensitivity: 'base' });
        });
    }

    function renderRecipesPage() {
        if (!document.getElementById('recipeList')) {
            return;
        }

        renderRecipeCards('recipeList', recipes);
        renderRecipeCards('searchNameResults', recipes);
        renderRecipeCards('searchIngredientsResults', recipes);

        initTabs();
        initSearchHandlers();
        bindModalHandlers();
    }

    function loadRecipes() {
        return fetch(RECIPES_PATH)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Rezepte konnten nicht geladen werden.');
                }
                return response.json();
            })
            .then(function (data) {
                recipes = sortRecipesByName(Array.isArray(data) ? data : []);
                renderHomepageStats();
                renderRecipesPage();
            })
            .catch(function () {
                renderHomepageStats();
                renderRecipeCards('recipeList', []);
                renderRecipeCards('searchNameResults', []);
                renderRecipeCards('searchIngredientsResults', []);
                setNoResultsVisibility('noResultsName', true);
                setNoResultsVisibility('noResultsIngredients', true);
            });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initTheme();
        loadRecipes();
    });
})();
