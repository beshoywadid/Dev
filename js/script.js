// Blog functionality and dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 1;
    let currentSearch = '';
    let currentUser = null;

    // Check authentication status
    checkAuthStatus();

    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const htmlElement = document.documentElement;
        const icon = darkModeToggle.querySelector('i');

        // Function to set dark mode
        function setDarkMode(isDark) {
            if (isDark) {
                htmlElement.setAttribute('data-bs-theme', 'dark');
                icon.className = 'fa-solid fa-sun';
                localStorage.setItem('darkMode', 'true');
            } else {
                htmlElement.removeAttribute('data-bs-theme');
                icon.className = 'fa-solid fa-moon';
                localStorage.setItem('darkMode', 'false');
            }
        }

        // Load saved preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }

        // Toggle on button click
        darkModeToggle.addEventListener('click', function() {
            const isDark = htmlElement.getAttribute('data-bs-theme') === 'dark';
            setDarkMode(!isDark);
        });
    }

    // Load posts
    loadPosts();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            currentSearch = searchInput.value.trim();
            currentPage = 1;
            loadPosts();
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentSearch = searchInput.value.trim();
                currentPage = 1;
                loadPosts();
            }
        });
    }

    // Logout functionality
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle contact form submission
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/user');
            if (response.ok) {
                const user = await response.json();
                currentUser = user;
                showUserMenu();
            } else {
                showLoginMenu();
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            showLoginMenu();
        }
    }

    function showUserMenu() {
        const userMenu = document.getElementById('userMenu');
        const loginMenu = document.getElementById('loginMenu');
        if (userMenu) userMenu.classList.remove('d-none');
        if (loginMenu) loginMenu.classList.add('d-none');
    }

    function showLoginMenu() {
        const userMenu = document.getElementById('userMenu');
        const loginMenu = document.getElementById('loginMenu');
        if (userMenu) userMenu.classList.add('d-none');
        if (loginMenu) loginMenu.classList.remove('d-none');
    }

    async function loadPosts() {
        try {
            const response = await fetch(`/api/posts?page=${currentPage}&search=${encodeURIComponent(currentSearch)}`);
            if (response.ok) {
                const data = await response.json();
                displayPosts(data.posts);
                displayPagination(data.pagination);
                displayRecentPosts(data.posts.slice(0, 5));
            } else {
                console.error('Error loading posts:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    function displayPosts(posts) {
        const container = document.getElementById('postsContainer');
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '<div class="alert alert-info">No posts found.</div>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <article class="card mb-4">
                <div class="card-body">
                    <h2 class="card-title h4">${escapeHtml(post.title)}</h2>
                    <p class="card-text text-muted small">
                        By ${escapeHtml(post.author)} on ${new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <p class="card-text">${truncateText(escapeHtml(post.content), 200)}</p>
                    <a href="#" class="btn btn-primary btn-sm" onclick="viewPost(${post.id})">Read More</a>
                    ${currentUser && currentUser.userId === post.author_id ? `
                        <button class="btn btn-outline-secondary btn-sm ms-2" onclick="editPost(${post.id})">Edit</button>
                        <button class="btn btn-outline-danger btn-sm ms-2" onclick="deletePost(${post.id})">Delete</button>
                    ` : ''}
                </div>
            </article>
        `).join('');
    }

    function displayPagination(pagination) {
        const container = document.getElementById('paginationContainer');
        if (!container) return;

        const { page, pages } = pagination;
        if (pages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHtml = '<nav><ul class="pagination">';

        // Previous button
        paginationHtml += `<li class="page-item ${page === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${page - 1})">Previous</a>
        </li>`;

        // Page numbers
        for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) {
            paginationHtml += `<li class="page-item ${i === page ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>`;
        }

        // Next button
        paginationHtml += `<li class="page-item ${page === pages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${page + 1})">Next</a>
        </li>`;

        paginationHtml += '</ul></nav>';
        container.innerHTML = paginationHtml;
    }

    function displayRecentPosts(posts) {
        const container = document.getElementById('recentPosts');
        if (!container) return;

        container.innerHTML = posts.map(post => `
            <li><a href="#" class="text-decoration-none" onclick="viewPost(${post.id})">${escapeHtml(post.title)}</a></li>
        `).join('');
    }

    async function logout() {
        try {
            const response = await fetch('/api/logout', { method: 'POST' });
            if (response.ok) {
                currentUser = null;
                showLoginMenu();
                loadPosts(); // Reload posts to update edit/delete buttons
                window.location.href = '/';
            } else {
                alert('Error logging out');
            }
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out');
        }
    }

    // Global functions for onclick handlers
    window.changePage = function(page) {
        currentPage = page;
        loadPosts();
        window.scrollTo(0, 0);
    };

    window.viewPost = function(postId) {
        // For now, just scroll to top. In a real app, you'd navigate to a post detail page
        window.scrollTo(0, 0);
        alert('Post detail view would be implemented here');
    };

    window.editPost = function(postId) {
        // For now, redirect to new blog page. In a real app, you'd have an edit page
        window.location.href = './html/newblog.html';
    };

    window.deletePost = async function(postId) {
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
                if (response.ok) {
                    loadPosts();
                } else {
                    alert('Error deleting post');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Error deleting post');
            }
        }
    };

    // Utility functions
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
});
