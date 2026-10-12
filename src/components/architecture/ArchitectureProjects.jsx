import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsData } from '../../data/projects';
import { Sparkles, ArrowRight, MapPin, Maximize2, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ["All Works", "Residential", "Institutional", "Specialized Craft"];

export function ArchitectureProjects() {
  const [activeCategory, setActiveCategory] = useState("All Works");

  const filteredProjects = projectsData.filter((project) => {
    if (activeCategory === "All Works") return true;
    if (activeCategory === "Residential") return project.category === "Residential";
    if (activeCategory === "Institutional") return project.category === "Institutional";
    if (activeCategory === "Specialized Craft") return project.category === "Specialized Craft" || project.category.includes("Commercial");
    return true;
  });

  return (
    <section id="architecture-portfolio" className="py-20 lg:py-28 bg-earth-50 relative overflow-hidden border-b border-earth-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-clay/10 text-clay font-mono text-xs uppercase tracking-widest font-semibold">
              <Sparkles size={12} /> Architectural Portfolio
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-earth-900 leading-tight">
              Featured Architectural Works
            </h2>
            <p className="text-stone-600 font-light text-base sm:text-lg">
              Explore our built sanctuaries across Auroville, Pondicherry, and South India.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-clay text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-earth-200/70 border border-earth-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.slice(0, 6).map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group rounded-3xl bg-white border border-earth-200/80 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[16/11] overflow-hidden bg-earth-200">
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider border border-white/10">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-xs text-stone-200 font-mono">
                        <MapPin size={12} className="text-clay" /> {project.location}
                      </span>
                      {project.area && (
                        <span className="text-[11px] font-mono bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-white">
                          {project.area}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-heading text-2xl font-bold text-earth-900 group-hover:text-clay transition-colors leading-snug">
                      {project.title}
                    </h3>
                    
                    <p className="text-stone-600 text-xs sm:text-sm font-light line-clamp-2 leading-relaxed">
                      {project.about}
                    </p>

                    {/* Materials Snippet */}
                    {project.materials && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {project.materials.slice(0, 3).map((mat, mIdx) => (
                          <span
                            key={mIdx}
                            className="px-2 py-0.5 rounded bg-earth-100 text-earth-800 text-[10px] font-mono"
                          >
                            {mat}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-earth-100 hover:bg-clay text-earth-900 hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View Project Details</span>
                    <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA to All Projects */}
        <div className="mt-14 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-earth-900 hover:bg-clay text-white font-mono text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg"
          >
            <span>Explore Complete Architectural Portfolio</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default ArchitectureProjects;
