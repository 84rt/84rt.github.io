/**
 * Markdown Renderer with Fallback
 * Provides a robust way to render markdown content with proper error handling
 * and fallback mechanisms if CDN scripts fail to load.
 */

// Function to render markdown with fallback
function renderMarkdown(content) {
  // Check if markdown-it and markdown-it-footnote are available
  if (typeof window.markdownit === 'undefined' || typeof window.markdownitFootnote === 'undefined') {
    console.error('markdown-it or markdown-it-footnote failed to load, using fallback renderer');
    return fallbackRenderer(content);
  }
  
  try {
    // Initialize markdown-it with footnote plugin
    const md = window.markdownit({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true
    }).use(window.markdownitFootnote);
    
    return md.render(content);
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return fallbackRenderer(content);
  }
}

// Fallback markdown renderer if markdown-it fails to load
function fallbackRenderer(markdown) {
  if (!markdown) return '';
  
  // Simple markdown conversion for basic formatting
  return markdown
    // Convert headings
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Convert bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // Convert footnotes (basic support)
    .replace(/\[\^(\d+)\](?!:)/g, '<sup><a href="#fn$1" id="fnref$1">[$1]</a></sup>')
    .replace(/\[\^(\d+)\]:/g, '<div id="fn$1" class="footnote"><sup>$1</sup> ')
    // Convert lists
    .replace(/^\s*\-\s*(.*$)/gm, '<li>$1</li>')
    // Convert paragraphs (any line that doesn't start with < and has content)
    .replace(/^([^<].*)/gm, '<p>$1</p>')
    // Fix lists
    .replace(/<li>(.*?)<\/li>\s*<li>/g, '<li>$1</li>\n<li>')
    .replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    // Close any open footnote divs
    .replace(/<div id="fn\d+" class="footnote">.*?(?!<\/div>)$/gm, '$&</div>');
}

// Debug script loading issues
window.addEventListener('error', (event) => {
  if (event.target.tagName === 'SCRIPT') {
    console.error('Failed to load script:', event.target.src);
    
    // If the failed script is markdown-it or markdown-it-footnote, try to load local versions
    if (event.target.src.includes('markdown-it')) {
      console.log('Attempting to load local markdown-it scripts...');
      
      // This would be implemented if you decide to host the scripts locally
      // The current implementation will use the fallback renderer if CDN fails
    }
  }
});

// Export the renderMarkdown function
window.renderMarkdown = renderMarkdown;
