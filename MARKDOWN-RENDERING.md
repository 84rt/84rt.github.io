# Markdown Rendering System for GitHub Pages

This document explains how the markdown rendering system works in this website and how to maintain it.

## Overview

The website uses `markdown-it` and `markdown-it-footnote` libraries to render markdown content with a robust fallback mechanism. The system is designed to be reliable even if CDN resources fail to load.

## How It Works

1. **Multiple CDN Sources**: The system tries to load libraries from multiple CDNs in this order:
   - Primary: unpkg.com
   - Fallback: cdn.jsdelivr.net
   - Last resort: Local copies in the `/js` directory

2. **Fallback Renderer**: If all CDN sources fail, the system uses a built-in fallback renderer that handles basic markdown syntax.

3. **Error Handling**: Comprehensive error handling ensures content is always displayed, even if in a simplified format.

## Files Involved

- `post.html`: Contains the script loading logic with fallback mechanisms
- `js/markdown-renderer.js`: Contains the main rendering logic and fallback renderer
- `js/blog.js`: Uses the renderer to display blog post content
- `js/markdown-it.min.js`: Local copy of markdown-it (v13.0.1)
- `js/markdown-it-footnote.min.js`: Local copy of markdown-it-footnote (v3.0.3)

## Maintenance

### Updating Library Versions

If you want to update the library versions:

1. Update the version numbers in `post.html` for both CDN sources
2. Download new versions of the libraries:
   ```
   curl -s https://unpkg.com/markdown-it@NEW_VERSION/dist/markdown-it.min.js -o js/markdown-it.min.js
   curl -s https://unpkg.com/markdown-it-footnote@NEW_VERSION/dist/markdown-it-footnote.min.js -o js/markdown-it-footnote.min.js
   ```

### Adding More Markdown Extensions

To add more markdown-it plugins:

1. Add the plugin to `post.html` with fallback loading logic
2. Update `markdown-renderer.js` to use the plugin
3. Download a local copy of the plugin for reliability

Example for adding a new plugin:

```html
<!-- In post.html -->
<script src="https://unpkg.com/markdown-it-plugin@version/dist/markdown-it-plugin.min.js" 
        onerror="handleScriptError('markdown-it-plugin')"></script>
```

```javascript
// In markdown-renderer.js
function renderMarkdown(content) {
  if (typeof window.markdownit === 'undefined' || 
      typeof window.markdownitFootnote === 'undefined' ||
      typeof window.markdownitPlugin === 'undefined') {
    console.error('One or more markdown-it libraries failed to load, using fallback renderer');
    return fallbackRenderer(content);
  }
  
  try {
    const md = window.markdownit({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true
    })
    .use(window.markdownitFootnote)
    .use(window.markdownitPlugin);
    
    return md.render(content);
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return fallbackRenderer(content);
  }
}
```

## Testing

To test the fallback mechanisms:

1. Open your browser's developer tools
2. Go to the Network tab and block requests to unpkg.com and jsdelivr.net
3. Load a blog post page and verify that content still renders using the local files
4. Block requests to your local files as well and verify that the basic fallback renderer works

## Troubleshooting

If markdown content isn't rendering correctly:

1. Check browser console for errors related to script loading
2. Verify that the Content Security Policy allows loading from the CDNs
3. Check that local copies of libraries exist and are accessible
4. Verify that the `renderMarkdown` function is being called correctly
