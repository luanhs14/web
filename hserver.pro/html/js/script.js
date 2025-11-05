(() => {
    const searchInput = document.getElementById('search');
    const projectsGrid = document.getElementById('projects');
    const projectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newProjectButton = document.getElementById('new-btn');
    const themeSwitcher = document.getElementById('theme-switcher');
    let currentFilter = 'all';

    function updateProjectsDisplay() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let visibleProjectsCount = 0;

        projectCards.forEach((card, index) => {
            const projectName = (card.dataset.name || card.textContent).toLowerCase();
            const projectCategory = card.dataset.category;
            const matchesSearch = !searchTerm || projectName.includes(searchTerm);
            const matchesFilter = currentFilter === 'all' || projectCategory === currentFilter;
            const shouldDisplay = matchesSearch && matchesFilter;

            if (shouldDisplay) {
                card.classList.remove('hidden');
                card.style.display = '';
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`;
                }, 10);
                visibleProjectsCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        let emptyState = projectsGrid.querySelector('.empty-state');
        if (visibleProjectsCount === 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                projectsGrid.appendChild(emptyState);
            }
            if (searchTerm) {
                emptyState.innerHTML = `<div class="empty-state-icon">🔍</div><p>Nenhum projeto encontrado para "<strong>${searchInput.value}</strong>"</p>`;
            } else {
                emptyState.innerHTML = '<div class="empty-state-icon">📂</div><p>Nenhum projeto nesta categoria</p>';
            }
            emptyState.style.display = '';
        } else if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    searchInput.addEventListener('input', updateProjectsDisplay);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            updateProjectsDisplay();
        });
    });

    projectsGrid.addEventListener('click', event => {
        const targetCard = event.target.closest('.project-card');
        if (targetCard && targetCard.classList.contains('coming-soon')) {
            targetCard.style.transform = 'scale(0.98)';
            setTimeout(() => targetCard.style.transform = '', 100);
        }
    });

    newProjectButton.addEventListener('click', () => {
        const originalText = newProjectButton.textContent;
        newProjectButton.textContent = '✓ Criando...';
        newProjectButton.disabled = true;
        setTimeout(() => {
            newProjectButton.textContent = originalText;
            newProjectButton.disabled = false;
        }, 1000);
    });

    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', event => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                filterButtons[(index + 1) % filterButtons.length].focus();
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                filterButtons[(index - 1 + filterButtons.length) % filterButtons.length].focus();
            }
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const animateCounter = (element, start, end, duration) => {
        if (isNaN(end)) return;

        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, 16);
    };

    const statValues = document.querySelectorAll('.stat-value');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.textContent);
                if (!isNaN(endValue)) {
                    animateCounter(target, 0, endValue, 1500);
                }
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => {
        if (!isNaN(parseInt(stat.textContent))) {
            observer.observe(stat);
        }
    });

    const footer = document.querySelector('footer p');
    if (footer) {
        const currentYear = new Date().getFullYear();
        footer.textContent = footer.textContent.replace('2024', currentYear);
    }

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // Theme switcher
    const lightThemeBtn = document.getElementById('light-theme');
    const darkThemeBtn = document.getElementById('dark-theme');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (theme === 'light') {
            lightThemeBtn.classList.add('active');
            darkThemeBtn.classList.remove('active');
        } else {
            darkThemeBtn.classList.add('active');
            lightThemeBtn.classList.remove('active');
        }
    }

    lightThemeBtn.addEventListener('click', () => setTheme('light'));
    darkThemeBtn.addEventListener('click', () => setTheme('dark'));

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
})();
