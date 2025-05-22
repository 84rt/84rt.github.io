# 84rt.github.io

Personal website with three distinct style themes for different sections: Blog, Portfolio, and Investing.

## Blog Post System

The website includes a blog system that displays posts written in Markdown format. Here's how to add and manage blog posts:

### Adding a New Blog Post

1. **Create a Markdown File**:
   - Create a new `.md` file in the `posts/` directory
   - Use a descriptive filename that will become part of the URL (e.g., `my-new-post.md`)

2. **Add Frontmatter**:
   - Each post must begin with YAML frontmatter containing at least a title and date
   - Example frontmatter format:
   ```markdown
   ---
   title: Your Post Title
   date: Month Day, Year
   ---
   ```

3. **Write Your Content**:
   - After the frontmatter, write your post content using Markdown syntax
   - Example:
   ```markdown
   # Main Heading

   This is a paragraph with **bold** and *italic* text.

   ## Subheading

   - List item 1
   - List item 2

   [Link text](https://example.com)
   ```

4. **Update the Blog Index**:
   - After adding or modifying posts, run the following command to update the blog index:
   ```
   node generate-blog-index.js
   ```
   - This will scan the `posts/` directory and create/update the `posts/index.json` file

### Blog Post URL Structure

Each blog post will be accessible at: `post.html?slug=your-file-name` (without the .md extension)

### Markdown Features Supported

The blog system supports basic Markdown features:
- Headings (# H1, ## H2, ### H3)
- Bold text (**bold**)
- Italic text (*italic*)
- Lists (- item)
- Links ([text](url))

## Development

To run the website locally:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000 in your browser.