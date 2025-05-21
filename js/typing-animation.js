// Typing animation for the portfolio section
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
