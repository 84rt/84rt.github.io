// Blog post handling functionality
document.addEventListener('DOMContentLoaded', async () => {
    // Only run this code if we're on the main page with the blog tab
    const blogContent = document.getElementById('blog');
    if (!blogContent) return;
    
    // Clear any existing content in the blog section
    blogContent.innerHTML = '<h1>Posts</h1><div id="blog-posts-list"></div>';
    const blogPostsList = document.getElementById('blog-posts-list');
    
    try {
        // Fetch the list of blog posts
        const response = await fetch('./posts/index.json');
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        
        const posts = await response.json();
        
        // Display each post as a link with title and date
        if (posts.length === 0) {
            blogPostsList.innerHTML = '<p>No posts available yet.</p>';
        } else {
            posts.forEach(post => {
                const postElement = document.createElement('article');
                postElement.className = 'blog-post';
                
                const titleElement = document.createElement('h2');
                titleElement.className = 'post-title';
                
                const linkElement = document.createElement('a');
                linkElement.href = `post.html?slug=${post.slug}`;
                linkElement.textContent = post.title;
                
                titleElement.appendChild(linkElement);
                
                const dateElement = document.createElement('div');
                dateElement.className = 'post-date';
                dateElement.textContent = post.date;
                
                postElement.appendChild(titleElement);
                postElement.appendChild(dateElement);
                
                blogPostsList.appendChild(postElement);
            });
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogPostsList.innerHTML = '<p>Failed to load blog posts. Please try again later.</p>';
    }
});

// Function to handle individual blog post pages
async function loadBlogPost() {
    // Check if we're on a blog post page (not the main page with tabs)
    if (document.querySelector('.tabs')) return;
    
    // Get the slug from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    if (!slug) return;
    
    try {
        // Fetch the post content
        const response = await fetch(`./posts/${slug}.md`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const markdown = await response.text();
        
        // Extract title and date from markdown frontmatter if present
        let title = 'Blog Post';
        let date = '';
        
        const frontmatterMatch = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
        let content = markdown;
        
        if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            content = frontmatterMatch[2];
            
            const titleMatch = frontmatter.match(/title:\s*(.+)$/m);
            if (titleMatch) title = titleMatch[1].trim();
            
            const dateMatch = frontmatter.match(/date:\s*(.+)$/m);
            if (dateMatch) date = dateMatch[1].trim();
        }
        
        // Add the blog theme to the body
        document.body.classList.add('blog-theme');
        
        // Create the post HTML structure
        const postHTML = `
            <header class="site-header">
                <div class="name-container">
                    <a href="./index.html" class="blog-name">Bart Jaworski</a>
                </div>
            </header>
            <div class="container">
                <article class="blog-post">
                    <h1 class="post-title">${title}</h1>
                    <div class="post-date">${date}</div>
                    <div class="post-content" id="post-content"></div>
                </article>
                <a href="./index.html" class="back-link">← Back to all posts</a>
            </div>
        `;
        
        document.body.innerHTML = postHTML;
        
        // Convert markdown to HTML (using a simple approach)
        // For a production site, you'd want to use a proper markdown parser like marked.js
        const postContent = document.getElementById('post-content');
        
        // Simple markdown conversion (headings, paragraphs, bold, italic)
        let html = content
            // Convert headings
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Convert bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Convert links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
            // Convert lists
            .replace(/^\s*\-\s*(.*$)/gm, '<li>$1</li>')
            // Convert paragraphs (any line that doesn't start with < and has content)
            .replace(/^([^<].*)/gm, '<p>$1</p>');
        
        // Wrap lists
        html = html.replace(/<li>(.*?)<\/li>\s*<li>/g, '<li>$1</li>\n<li>');
        html = html.replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        
        postContent.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading blog post:', error);
        document.body.innerHTML = `
            <header class="site-header">
                <div class="name-container">
                    <a href="./index.html" class="blog-name">Bart Jaworski</a>
                </div>
            </header>
            <div class="container">
                <h1>Post Not Found</h1>
                <p>Sorry, the requested blog post could not be found.</p>
                <a href="./index.html" class="back-link">← Back to all posts</a>
            </div>
        `;
        document.body.classList.add('blog-theme');
    }
}

// Check if we're on a blog post page and load the content
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogPost);
} else {
    loadBlogPost();
}
