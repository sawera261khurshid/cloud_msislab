// navigation.js

// Fetch and insert the navigation menu using JavaScript
window.addEventListener('DOMContentLoaded', async () => {
    const navigationContainer = document.getElementById('navigationContainer');
    const response = await fetch('sawera/templates/navigation.html');
    const navigationHTML = await response.text();
    navigationContainer.innerHTML = navigationHTML;
});