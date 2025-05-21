const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Directory containing the markdown posts
const postsDirectory = path.join(__dirname, 'posts');

// Function to generate the blog index
function generateBlogIndex() {
  // Create posts directory if it doesn't exist
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  // Read all markdown files in the posts directory
  const files = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
  
  // Parse each file to extract metadata
  const posts = files.map(filename => {
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter
    const { data } = matter(fileContent);
    
    // Get slug from filename (remove .md extension)
    const slug = filename.replace(/\.md$/, '');
    
    // Return post metadata
    return {
      slug,
      title: data.title || 'Untitled Post',
      date: data.date || 'No date',
      // Add any other metadata you want to include
    };
  });
  
  // Sort posts by date (newest first)
  posts.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  
  // Write the index file
  const indexPath = path.join(postsDirectory, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(posts, null, 2));
  
  console.log(`Generated blog index with ${posts.length} posts`);
}

// Run the function
generateBlogIndex();
