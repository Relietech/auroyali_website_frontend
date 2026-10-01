import React, { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { projectsData } from '../../data/projects';

const CATEGORIES = ["All", "Institutional / Educational", "Residential", "Hospitality & Ecology", "Experimental / Civic"];

export function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = selectedCategory === "All"
    ? projectsData
    : projectsData.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-mono transition-all duration-300 ${
              selectedCategory === cat
                ? 'bg-earth-900 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-earth-100 border border-earth-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
export default ProjectGrid;
