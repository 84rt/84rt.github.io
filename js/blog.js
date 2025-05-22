// Blog post handling functionality
document.addEventListener('DOMContentLoaded', async () => {
    // Only run this code if we're on the main page with the blog tab
    const blogContent = document.getElementById('blog');
    if (!blogContent) return;
    
    // Clear any existing content in the blog section
    blogContent.innerHTML = '<div id="blog-posts-list"></div>';
    const blogPostsList = document.getElementById('blog-posts-list');
    
    try {
        // Get the repository name from the URL (for GitHub Pages)
        const isGitHubPages = window.location.hostname.includes('github.io');
        const repoName = isGitHubPages ? window.location.hostname.split('.')[0] : '';
        
        // Get the base URL for the current environment
        const baseUrl = isGitHubPages ? `/${repoName}` : '';
        
        // Array of possible paths to try for index.json
        const pathsToTry = [
            `./posts/index.json`,                      // Local relative path
            `/posts/index.json`,                       // Root relative path for custom domain
            `${baseUrl}/posts/index.json`,             // Base URL + path (for GitHub Pages)
            `https://${window.location.host}/posts/index.json`, // Absolute URL for custom domain
            `https://${window.location.host}${baseUrl}/posts/index.json` // Absolute URL with base (for GitHub Pages)
        ];
        
        // Add raw GitHub URL as a fallback if we're on GitHub Pages
        if (isGitHubPages) {
            pathsToTry.push(`https://raw.githubusercontent.com/${repoName}/${repoName}.github.io/main/posts/index.json`);
        }
        
        // Try each path until we find one that works
        let response = null;
        let foundPath = null;
        
        console.log('Attempting to load blog post index');
        for (const path of pathsToTry) {
            try {
                console.log(`Trying path: ${path}`);
                const tempResponse = await fetch(path);
                if (tempResponse.ok) {
                    response = tempResponse;
                    foundPath = path;
                    console.log(`Successfully loaded index from: ${path}`);
                    break;
                }
            } catch (error) {
                console.log(`Failed with path: ${path}`);
            }
        }
        
        // If all attempts fail, try a direct raw GitHub content URL as last resort
        if (!response || !response.ok) {
            // For GitHub Pages, try the raw GitHub content URL
            if (isGitHubPages) {
                const rawGitHubPath = `https://raw.githubusercontent.com/${repoName}/${repoName}.github.io/main/posts/index.json`;
                try {
                    console.log(`Trying raw GitHub URL: ${rawGitHubPath}`);
                    response = await fetch(rawGitHubPath);
                    if (response.ok) {
                        foundPath = rawGitHubPath;
                        console.log(`Successfully loaded index from raw GitHub: ${rawGitHubPath}`);
                    }
                } catch (error) {
                    console.log(`Failed with raw GitHub path: ${rawGitHubPath}`);
                }
            }
        }
        
        // If all attempts fail, throw an error
        if (!response || !response.ok) {
            console.error('Failed to fetch blog posts after trying multiple paths');
            console.error('Attempted paths:', pathsToTry);
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
                
                // Get the base URL for links
                // For custom domains, we don't need a prefix
                const linkBase = '';
                
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
        // Get the repository name from the URL (for GitHub Pages)
        const isGitHubPages = window.location.hostname.includes('github.io');
        const repoName = isGitHubPages ? window.location.hostname.split('.')[0] : '';
        
        // Get the base URL for the current environment
        const baseUrl = isGitHubPages ? `/${repoName}` : '';
        
        // Array of possible paths to try
        const pathsToTry = [
            `./posts/${slug}.md`,                      // Local relative path
            `/posts/${slug}.md`,                       // Root relative path for custom domain
            `posts/${slug}.md`,                        // Simple relative path (no leading slash)
            `${baseUrl}/posts/${slug}.md`,             // Base URL + path (for GitHub Pages)
            `https://${window.location.host}/posts/${slug}.md` // Absolute URL for custom domain
        ];
        
        // Add GitHub-specific paths as fallbacks
        pathsToTry.push(`https://raw.githubusercontent.com/84rt/84rt.github.io/main/posts/${slug}.md`);
        pathsToTry.push(`https://84rt.github.io/posts/${slug}.md`);
        
        // Try each path until we find one that works
        let response = null;
        let foundPath = null;
        
        console.log(`Attempting to load post: ${slug}.md`);
        for (const path of pathsToTry) {
            try {
                console.log(`Trying path: ${path}`);
                const tempResponse = await fetch(path);
                if (tempResponse.ok) {
                    response = tempResponse;
                    foundPath = path;
                    console.log(`Successfully loaded from: ${path}`);
                    break;
                }
            } catch (error) {
                console.log(`Failed with path: ${path}`);
            }
        }
        
        // If all attempts fail, try additional fallback options
        if (!response || !response.ok) {
            // Try with different base paths that might work on GitHub Pages or custom domains
            const additionalPaths = [
                `${window.location.origin}/posts/${slug}.md`,
                `${window.location.protocol}//${window.location.host}/posts/${slug}.md`,
                `posts/${slug}.md`,
                `../posts/${slug}.md`
            ];
            
            for (const path of additionalPaths) {
                try {
                    console.log(`Trying additional path: ${path}`);
                    const tempResponse = await fetch(path);
                    if (tempResponse.ok) {
                        response = tempResponse;
                        foundPath = path;
                        console.log(`Successfully loaded from additional path: ${path}`);
                        break;
                    }
                } catch (error) {
                    console.log(`Failed with additional path: ${path}`);
                }
            }
        }
        
        // If all attempts fail, throw an error
        if (!response || !response.ok) {
            console.error(`Failed to load post: ${slug}.md after trying multiple paths`);
            console.error(`Attempted paths:`, pathsToTry);
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
        // Determine the correct base path for links
        // For custom domains, we don't need a prefix
        const linkBase = '';
        
        const postHTML = `
            <header class="site-header">
                <div class="name-container">
                    <a href="index.html" class="blog-name">Bart Jaworski</a>
                </div>
            </header>
            <div class="container">
                <article class="blog-post">
                    <h1 class="post-title">${title}</h1>
                    <div class="post-date">${date}</div>
                    <div class="post-content" id="post-content"></div>
                </article>
                <a href="index.html" class="back-link">← Back to all posts</a>
            </div>
        `;
        
        document.body.innerHTML = postHTML;
        
        // Use our markdown renderer to convert markdown to HTML
        const postContent = document.getElementById('post-content');
        
        // Use the renderMarkdown function from markdown-renderer.js
        let renderedContent = '';
        
        try {
            // Check if our renderMarkdown function is available
            if (typeof window.renderMarkdown === 'function') {
                renderedContent = window.renderMarkdown(content);
            } else {
                // If our renderer is not available, use a basic fallback
                console.error('renderMarkdown function not available, using basic fallback');
                renderedContent = `<pre>${content}</pre>`;
            }
        } catch (error) {
            console.error('Error rendering markdown:', error);
            // Use a very basic fallback if everything else fails
            renderedContent = `<pre>${content}</pre>`;
        }
        
        // Render the content
        postContent.innerHTML = renderedContent;
        
    } catch (error) {
        console.error('Error loading blog post:', error);
        // Define linkBase here to avoid reference error
        const errorLinkBase = '';
        
        document.body.innerHTML = `
            <header class="site-header">
                <div class="name-container">
                    <a href="${errorLinkBase}/index.html" class="blog-name">Bart Jaworski</a>
                </div>
            </header>
            <div class="container">
                <h1>Post Not Found</h1>
                <p>Sorry, the requested blog post could not be found.</p>
                <a href="${errorLinkBase}/index.html" class="back-link">← Back to all posts</a>
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
