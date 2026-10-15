import React, { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { getStoredProjects, subscribeToProjects } from '../../services/projectStore';

export function ProjectGrid() {
  const [projects, setProjects] = useState(() => {
    return getStoredProjects().filter((p) => (p.status || 'Published') === 'Published');
  });

  useEffect(() => {
    const unsubscribe = subscribeToProjects((allProjects) => {
      setProjects(allProjects.filter((p) => (p.status || 'Published') === 'Published'));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project, index) => (
        <ProjectCard key={project.id || index} project={project} index={index} />
      ))}
    </div>
  );
}

export default ProjectGrid;

