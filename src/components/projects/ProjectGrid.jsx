import React from 'react';
import { ProjectCard } from './ProjectCard';
import { projectsData } from '../../data/projects';

export function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projectsData.map((project, index) => (
        <ProjectCard key={project.id || index} project={project} index={index} />
      ))}
    </div>
  );
}

export default ProjectGrid;

