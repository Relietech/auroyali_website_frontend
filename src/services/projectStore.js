import { projectsData } from '../data/projects';

const STORAGE_KEY = 'auroyali_projects_v1';
const UPDATE_EVENT = 'auroyali_projects_updated';

// Default enriched projects with operational metadata
function getDefaultProjects() {
  return projectsData.map((project, index) => ({
    ...project,
    status: 'Published',
    featured: index < 3,
    createdAt: new Date(2023, index, 15).toISOString(),
    updatedAt: new Date(2024, index, 1).toISOString(),
  }));
}

/**
 * Fetch all projects from localStorage, fallback to default seed data
 */
export function getStoredProjects() {
  if (typeof window === 'undefined') return getDefaultProjects();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = getDefaultProjects();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return getDefaultProjects();
  } catch (err) {
    console.error('Error loading projects from storage:', err);
    return getDefaultProjects();
  }
}

/**
 * Save array of projects to storage and notify listeners
 */
function persistProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects to storage:', err);
  }

  // Dispatch custom event for reactive real-time UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { count: projects.length } }));
  }
}

/**
 * Get single project by slug or ID
 */
export function getProjectBySlug(slugOrId) {
  const projects = getStoredProjects();
  return projects.find((p) => p.slug === slugOrId || p.id === slugOrId) || null;
}

/**
 * Create or Update a project
 */
export function saveProject(projectInput) {
  const projects = getStoredProjects();
  const now = new Date().toISOString();

  // Normalize slug
  const baseSlug = (projectInput.slug || projectInput.title || 'untitled')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (projectInput.id) {
    // UPDATE EXISTING
    const index = projects.findIndex((p) => p.id === projectInput.id);
    if (index !== -1) {
      const updated = {
        ...projects[index],
        ...projectInput,
        slug: projectInput.slug ? baseSlug : projects[index].slug,
        updatedAt: now,
      };
      projects[index] = updated;
      persistProjects(projects);
      return updated;
    }
  }

  // CREATE NEW
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (projects.some((p) => p.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const newProject = {
    ...projectInput,
    id: projectInput.id || `project-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    slug: uniqueSlug,
    status: projectInput.status || 'Published',
    featured: Boolean(projectInput.featured),
    materials: Array.isArray(projectInput.materials) ? projectInput.materials : [],
    gallery: Array.isArray(projectInput.gallery) ? projectInput.gallery : [],
    createdAt: now,
    updatedAt: now,
  };

  projects.unshift(newProject);
  persistProjects(projects);
  return newProject;
}

/**
 * Delete a project by ID
 */
export function deleteProject(id) {
  const projects = getStoredProjects();
  const filtered = projects.filter((p) => p.id !== id);
  persistProjects(filtered);
  return filtered;
}

/**
 * Duplicate an existing project
 */
export function duplicateProject(id) {
  const projects = getStoredProjects();
  const source = projects.find((p) => p.id === id);
  if (!source) return null;

  const now = new Date().toISOString();
  const newTitle = `${source.title} (Copy)`;
  const baseSlug = `${source.slug}-copy`;

  let uniqueSlug = baseSlug;
  let counter = 1;
  while (projects.some((p) => p.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const clone = {
    ...source,
    id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: newTitle,
    slug: uniqueSlug,
    status: 'Draft',
    featured: false,
    createdAt: now,
    updatedAt: now,
  };

  projects.unshift(clone);
  persistProjects(projects);
  return clone;
}

/**
 * Toggle Published / Draft status
 */
export function toggleProjectStatus(id) {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const nextStatus = projects[index].status === 'Published' ? 'Draft' : 'Published';
  projects[index].status = nextStatus;
  projects[index].updatedAt = new Date().toISOString();
  persistProjects(projects);
  return projects[index];
}

/**
 * Toggle Featured status
 */
export function toggleProjectFeatured(id) {
  const projects = getStoredProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  projects[index].featured = !projects[index].featured;
  projects[index].updatedAt = new Date().toISOString();
  persistProjects(projects);
  return projects[index];
}

/**
 * Reset all projects back to system defaults
 */
export function resetProjectsToDefault() {
  const defaults = getDefaultProjects();
  persistProjects(defaults);
  return defaults;
}

/**
 * Export projects as a downloadable JSON file
 */
export function exportProjectsToJSON() {
  const projects = getStoredProjects();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `auroyali-projects-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Subscribe to project updates
 */
export function subscribeToProjects(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback(getStoredProjects());
  };

  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
