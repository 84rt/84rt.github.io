// Typing animation for the projects section
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-animation');
    
    typingElements.forEach(element => {
        // Get the text to type
        const textToType = element.textContent;
        // Clear the element's text
        element.textContent = '';
        // Add cursor
        const cursor = document.createElement('span');
        cursor.classList.add('cursor');
        element.appendChild(cursor);
        
        // Type one character at a time
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < textToType.length) {
                // Insert character before cursor
                cursor.insertAdjacentText('beforebegin', textToType.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
                
                // After typing is complete, start blinking cursor
                setTimeout(() => {
                    cursor.style.animation = 'blink 1s step-end infinite';
                }, 500);
            }
        }, 50 + Math.random() * 30); // Random typing speed for realistic effect
    });
}

// Function to animate the name retyping
function animateNameRetyping(tabId) {
    const nameElement = document.getElementById('author-name');
    if (!nameElement) return;
    
    // Define the name variants for each tab
    const nameVariants = {
        'home': 'Bart Jaworski',
        'blog': 'Bart Jaworski',
        'projects': '84rt',
        'investing': 'Bart Jaworski'
    };
    
    // Get the current tab from the class on the name element
    const currentTabClass = Array.from(nameElement.classList).find(cls => cls.endsWith('-name'));
    const currentTab = currentTabClass ? currentTabClass.replace('-name', '') : 'home';
    
    // Determine if we should skip animation
    const isHomeBlogSwitch = (currentTab === 'home' && tabId === 'blog') || (currentTab === 'blog' && tabId === 'home');
    
    // Skip animation in these cases:
    // 1. If we're switching to the same tab
    // 2. If we're switching between Home and Blog
    if (currentTab === tabId || isHomeBlogSwitch) {
        // Just update the class without animation
        nameElement.classList.remove('home-name', 'blog-name', 'projects-name', 'investing-name');
        nameElement.classList.add(`${tabId}-name`);
        
        // Update text content if needed (for switching between tabs with different text)
        const newText = nameVariants[tabId] || 'Bart Jaworski';
        nameElement.textContent = newText;
        return;
    }
    
    // Get the current text without any child elements for animation
    const currentText = nameElement.childNodes[0]?.nodeValue?.trim() || nameElement.textContent.trim();
    const newText = nameVariants[tabId] || 'Bart Jaworski';
    
    // Store the current name style class for use during erasing
    const currentNameClass = Array.from(nameElement.classList).find(cls => cls.endsWith('-name')) || 'home-name';
    
    // Create a separate animation container that won't be affected by global theme changes
    let animationContainer = document.createElement('span');
    animationContainer.classList.add('animation-container');
    animationContainer.classList.add(currentNameClass); // Apply current style to container
    
    // Clear the original element
    nameElement.innerHTML = '';
    nameElement.appendChild(animationContainer);
    
    // Create a cursor element
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    
    // Add the current text and cursor to the animation container
    animationContainer.textContent = currentText;
    animationContainer.appendChild(cursor);
    
    // First, erase the current text
    let currentLength = currentText.length;
    
    // Prevent multiple animations from running simultaneously
    if (nameElement._eraseInterval) clearInterval(nameElement._eraseInterval);
    if (nameElement._typeInterval) clearInterval(nameElement._typeInterval);
    
    nameElement._eraseInterval = setInterval(() => {
        if (currentLength > 0) {
            // Remove one character at a time
            animationContainer.textContent = currentText.substring(0, currentLength - 1);
            animationContainer.appendChild(cursor);
            currentLength--;
        } else {
            clearInterval(nameElement._eraseInterval);
            nameElement._eraseInterval = null;
            
            // Text is now completely erased
            // Change the font by switching the class BEFORE starting to type
            // Remove the old animation container
            nameElement.innerHTML = '';
            
            // Create a new animation container with the new style
            const newAnimationContainer = document.createElement('span');
            newAnimationContainer.classList.add('animation-container');
            newAnimationContainer.classList.add(`${tabId}-name`); // Apply new style
            nameElement.appendChild(newAnimationContainer);
            newAnimationContainer.appendChild(cursor);
            
            // Update the animation container reference
            animationContainer = newAnimationContainer;
            
            // Brief pause before starting to type with the new font
            setTimeout(() => {
                // Then type the new text
                let newIndex = 0;
                nameElement._typeInterval = setInterval(() => {
                    if (newIndex < newText.length) {
                        animationContainer.textContent = newText.substring(0, newIndex + 1);
                        animationContainer.appendChild(cursor);
                        newIndex++;
                    } else {
                        clearInterval(nameElement._typeInterval);
                        nameElement._typeInterval = null;
                        
                        // After typing is complete, start blinking cursor
                        setTimeout(() => {
                            // When animation is complete, completely replace the element content
                            // This ensures consistent styling without any artifacts from the animation
                            nameElement.innerHTML = '';
                            nameElement.textContent = newText;
                            nameElement.classList.remove('home-name', 'blog-name', 'projects-name', 'investing-name');
                            nameElement.classList.add(`${tabId}-name`);
                            
                            // No need to keep the cursor at this point
                        }, 500);
                    }
                }, 50 + Math.random() * 30);
            }, 200); // Small pause for visual effect
        }
    }, 30);
}
