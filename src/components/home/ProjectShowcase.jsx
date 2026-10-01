import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../../data/projects';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { ArrowRight, MapPin } from 'lucide-react';

export function ProjectShowcase() {
  const [activeProject, setActiveProject] = useState(0);
  const featured = projectsData.slice(0, 3);
  const current = featured[activeProject] || featured[0];

  return (
    <section className="py-24 md:py-32 bg-earth-900 text-stone-100 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-clay/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <SectionHeading
            light
            tag="Selected Portfolios"
            title="Living benchmarks of earth architecture & natural design."
            subtitle="Explore our completed residential sanctuaries, training academies, and experimental bamboo tensile structures."
            className="mb-0"
          />
          <Button to="/projects" variant="clay" className="mt-6 md:mt-0 shrink-0">
            View All Projects ({projectsData.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-stone-950/60 rounded-3xl p-6 md:p-10 border border-earth-800 shadow-2xl">
          
          <div className="lg:col-span-7 relative h-[380px] md:h-[460px] rounded-2xl overflow-hidden group">
            <img
              src={current.heroImage}
              alt={current.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-1">
                  {current.category}
                </span>
                <h3 className="font-heading text-2xl md:text-4xl text-white font-bold">
                  {current.title}
                </h3>
              </div>
              <Link
                to={`/projects/${current.slug}`}
                className="p-3 bg-white/90 hover:bg-clay text-earth-900 hover:text-white rounded-full transition-colors shadow-lg"
              >
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex space-x-2 border-b border-earth-800 pb-4">
              {featured.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProject(idx)}
                  className={`text-xs uppercase tracking-wider py-1.5 px-3 rounded-full transition-all ${
                    activeProject === idx
                      ? 'bg-earth-800 text-clay font-medium border border-clay/40'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  0{idx + 1}. {p.title.split(' ')[0]}
                </button>
              ))}
            </div>

            <div>
              <span className="text-xs text-stone-400 font-mono flex items-center gap-1.5 mb-2">
                <MapPin size={13} className="text-clay" /> {current.location} &bull; {current.year}
              </span>
              <p className="text-stone-300 font-light text-sm leading-relaxed mb-6">
                {current.overview}
              </p>

              <div className="mb-6">
                <span className="text-xs uppercase tracking-widest text-earth-300 font-mono block mb-2">
                  Key Natural Materials:
                </span>
                <div className="flex flex-wrap gap-2">
                  {current.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-stone-900 rounded-full text-xs text-stone-300 border border-earth-800"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-stone-400 border-t border-earth-800 pt-4 flex items-center justify-between">
                <span>Area: <strong className="text-stone-200">{current.area}</strong></span>
                <span>Status: <strong className="text-sage">{current.status}</strong></span>
              </div>
            </div>

            <Button to={`/projects/${current.slug}`} variant="secondary" size="md" className="w-full">
              View Complete Case Study
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
export default ProjectShowcase;
