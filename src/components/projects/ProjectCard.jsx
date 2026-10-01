import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';

export function ProjectCard({ project }) {
  if (!project) return null;

  return (
    <div className="group bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-earth-200/80 shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5">
      <div className="relative h-72 overflow-hidden bg-earth-200">
        <img
          src={project.heroImage}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        <span className="absolute top-4 left-4 bg-earth-900/80 backdrop-blur-md text-earth-100 text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full font-mono border border-white/10">
          {project.category}
        </span>

        <span className="absolute bottom-4 left-4 text-white text-xs flex items-center gap-1.5 font-light">
          <MapPin size={13} className="text-clay" /> {project.location}
        </span>
      </div>

      <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-earth-900 dark:text-stone-100 group-hover:text-clay transition-colors mb-2">
            {project.title}
          </h3>
          <p className="text-xs uppercase tracking-wider text-stone-500 font-mono mb-4">
            {project.subtitle}
          </p>
          <p className="body-text text-stone-600 dark:text-stone-400 text-sm font-light leading-relaxed line-clamp-3 mb-6">
            {project.overview}
          </p>
        </div>

        <div>
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.materials.slice(0, 3).map((mat, i) => (
              <span
                key={i}
                className="text-[11px] px-2.5 py-1 rounded-md bg-earth-100 text-earth-800 dark:bg-stone-800 dark:text-stone-300 font-mono"
              >
                {mat}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-earth-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs text-stone-400 font-mono">{project.area}</span>
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-clay hover:text-earth-900 transition-colors"
            >
              <span>Explore Project</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectCard;
