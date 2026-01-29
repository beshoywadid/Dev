// Blog functionality and dark mode toggle
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode toggle functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    const icon = darkModeToggle.querySelector('i');

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

    // Blog functionality
    let currentPage = 1;
    const postsPerPage = 5;

    async function fetchPosts(page = 1) {
        try {
            const response = await fetch(`/api/posts?page=${page}&limit=${postsPerPage}`);
            if (response.ok) {
                const posts = await response.json();
                displayPosts(posts);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    function displayPosts(posts) {
        const container = document.getElementById('postsContainer');
        if (posts.length === 0 && currentPage === 1) {
            container.innerHTML = '<p class="text-muted">No blog posts yet. Check back soon!</p>';
            return;
        }

        posts.forEach(post => {
            const postElement = createPostElement(post);
            container.appendChild(postElement);
        });
    }

    function createPostElement(post) {
        const postDiv = document.createElement('article');
        postDiv.className = 'card mb-4';
        postDiv.innerHTML = `
            <div class="card-body">
                <h3 class="card-title">${post.title}</h3>
                <p class="card-text">${post.content.substring(0, 200)}${post.content.length > 200 ? '...' : ''}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">By ${post.username} on ${new Date(post.created_at).toLocaleDateString()}</small>
                    <a href="#" class="btn btn-sm btn-outline-primary">Read More</a>
                </div>
            </div>
        `;
        return postDiv;
    }

    // Load more posts
    const loadMoreBtn = document.getElementById('loadMorePosts');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            fetchPosts(currentPage);
        });
    }

    // Search functionality
    const searchForm = document.querySelector('form.d-flex');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = document.getElementById('searchInput').value;
            searchPosts(searchTerm);
        });
    }

    async function searchPosts(term) {
        try {
            const response = await fetch(`/api/posts/search?q=${encodeURIComponent(term)}`);
            if (response.ok) {
                const posts = await response.json();
                document.getElementById('postsContainer').innerHTML = '';
                displayPosts(posts);
            }
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    }

    // Check authentication status
    async function checkAuth() {
        try {
            const response = await fetch('/api/user');
            if (response.ok) {
                const user = await response.json();
                updateUIForLoggedInUser(user);
            } else {
                updateUIForLoggedOutUser();
            }
        } catch (error) {
            updateUIForLoggedOutUser();
        }
    }

    function updateUIForLoggedInUser(user) {
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', logout);
        }
    }

    function updateUIForLoggedOutUser() {
        // Redirect to login if trying to access protected pages
        if (window.location.pathname.includes('newblog')) {
            window.location.href = '/login';
        }
    }

    async function logout() {
        try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.reload();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    // Initialize
    fetchPosts();
    checkAuth();
});
