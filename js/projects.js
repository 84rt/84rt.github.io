/**
 * Projects loader
 * Dynamically loads project data from individual JSON files in the projects directory
 */

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

/**
 * Fetches and displays all projects from the projects directory
 */
async function loadProjects() {
    try {
        const projectsContainer = document.getElementById('projects');
        const loadingElement = document.createElement('p');
        loadingElement.textContent = 'Loading projects...';
        projectsContainer.innerHTML = '';
        projectsContainer.appendChild(loadingElement);

        // Fetch the list of project files
        const response = await fetch('/projects/index.json');
        if (!response.ok) {
            throw new Error('Failed to load projects index');
        }
        
        const projectsList = await response.json();
        
        // Clear loading message
        projectsContainer.innerHTML = '';
        
        // Load each project
        const projectPromises = projectsList.map(projectFile => fetchProject(projectFile));
        const projects = await Promise.all(projectPromises);
        
        // Sort projects if needed (can be customized)
        // projects.sort((a, b) => a.title.localeCompare(b.title));
        
        // Render each project
        projects.forEach(project => {
            const projectElement = createProjectElement(project);
            projectsContainer.appendChild(projectElement);
        });
        
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsContainer = document.getElementById('projects');
        projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
}

/**
 * Fetches a single project by its filename
 * @param {string} projectFile - The filename of the project JSON
 * @returns {Promise<Object>} - The project data
 */
async function fetchProject(projectFile) {
    const response = await fetch(`/projects/${projectFile}`);
    if (!response.ok) {
        throw new Error(`Failed to load project: ${projectFile}`);
    }
    return await response.json();
}

/**
 * Creates a DOM element for a project
 * @param {Object} project - The project data
 * @returns {HTMLElement} - The project card element
 */
function createProjectElement(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Project title
    const titleElement = document.createElement('h2');
    titleElement.className = 'project-title';
    titleElement.textContent = project.title;
    projectCard.appendChild(titleElement);
    
    // Project description
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'project-description';
    descriptionElement.textContent = project.description;
    projectCard.appendChild(descriptionElement);
    
    // Project tags
    if (project.tags && project.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'project-tags';
        
        project.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'project-tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        projectCard.appendChild(tagsContainer);
    }
    
    // Project links
    if (project.links && project.links.length > 0) {
        const linksContainer = document.createElement('div');
        linksContainer.className = 'project-links';
        
        project.links.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.textContent = link.text;
            
            // Add target blank for external links
            if (link.url.startsWith('http')) {
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
            }
            
            linksContainer.appendChild(linkElement);
        });
        
        projectCard.appendChild(linksContainer);
    }
    
    return projectCard;
}
