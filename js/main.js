// Main JavaScript for handling tab switching and theme changing
document.addEventListener('DOMContentLoaded', () => {
    // Get all tab elements
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');
    const tabContainer = document.querySelector('.tabs');
    
    // Function to set the active tab
    function setActiveTab(tabId) {
        // Update active tab state (for styling)
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Update active content
        contents.forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        
        // Update the theme for the content area only (not affecting tabs)
        const body = document.body;
        body.classList.remove('blog-theme', 'portfolio-theme', 'investing-theme');
        body.classList.add(`${tabId}-theme`);
        
        // Save the active tab to local storage
        localStorage.setItem('activeTab', tabId);
        
        // If portfolio tab is active, start typing animation
        if (tabId === 'portfolio') {
            initTypingAnimation();
        }
    }
    
    // Add click event to all tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            setActiveTab(tabId);
        });
    });
    
    // Check for saved tab in local storage
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab && document.querySelector(`[data-tab="${savedTab}"]`)) {
        setActiveTab(savedTab);
    } else {
        // Set blog as default tab
        setActiveTab('blog');
    }
});
