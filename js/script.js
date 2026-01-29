// Dark mode toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
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
});
