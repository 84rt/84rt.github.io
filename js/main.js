// Main JavaScript for handling tab switching and theme changing
document.addEventListener('DOMContentLoaded', () => {
    // Check for hash in URL for direct navigation
    const hash = window.location.hash.substring(1); // Remove the # symbol
    // Get all tab elements
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');
    
    // Function to set the active tab
    function setActiveTab(tabId) {
        // Update active tab
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Update active content
        contents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        
        // Update the theme based on active tab
        const body = document.body;
        body.classList.remove('home-theme', 'blog-theme', 'projects-theme', 'investing-theme');
        body.classList.add(`${tabId}-theme`);
        
        // Save the active tab to local storage
        localStorage.setItem('activeTab', tabId);
        
        // Animate the name retyping based on the active tab
        animateNameRetyping(tabId);
        
        // If projects tab is active, start typing animation
        if (tabId === 'projects') {
            initTypingAnimation();
        }
    }
    
    // Add click event to all tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            // Only set active tab if it's not already active
            if (!tab.classList.contains('active')) {
                setActiveTab(tabId);
            }
        });
    });
    
    // Add click event to update links in the home page
    const updateLinks = document.querySelectorAll('.update-link');
    updateLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.dataset.tab;
            setActiveTab(tabId);
        });
    });
    
    // Check for hash in URL first, then saved tab in local storage
    if (hash && document.querySelector(`[data-tab="${hash}"]`)) {
        setActiveTab(hash);
    } else {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab && document.querySelector(`[data-tab="${savedTab}"]`)) {
            setActiveTab(savedTab);
        } else {
            // Set home as default tab
            setActiveTab('home');
        }
    }
    
    // Initialize the name with the correct style without animation on first load
    const nameElement = document.getElementById('author-name');
    if (nameElement) {
        const currentTab = localStorage.getItem('activeTab') || 'home';
        const nameVariants = {
            'home': 'Bart Jaworski',
            'blog': 'Bart\'s Posts',
            'projects': '84rt',
            'investing': "Bart's Writeups"
        };
        nameElement.textContent = nameVariants[currentTab] || 'Bart Jaworski';
        
        // Add the appropriate class for styling
        nameElement.classList.remove('home-name', 'blog-name', 'projects-name', 'investing-name');
        nameElement.classList.add(`${currentTab}-name`);
    }
});
