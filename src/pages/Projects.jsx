import React from 'react';
import { ProjectGrid } from '../components/projects/ProjectGrid';
import { Button } from '../components/common/Button';

export function Projects() {
  return (
    <div className="bg-[#faf8f5] text-stone-900 font-body">
      
      {/* Editorial Space Header */}
      <header className="pt-20 pb-12 md:pt-28 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 max-w-4xl">
          
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-clay">
            <span className="px-3 py-1 rounded-full bg-clay/10 border border-clay/20 font-semibold">
              Spatial Architecture & Interiors
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-light text-earth-950 tracking-tight leading-[1.05]">
            SPATIAL & INTERIOR Design
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-stone-600 font-light leading-relaxed max-w-3xl">
            Bespoke bioclimatic and interior designs, right at the crossroads of stunning, sustainable, tactile and functional — meticulously crafted to transform your indoor and living experiences, elevating the mundane to the magnificent.
          </p>

        </div>
      </header>

      {/* Grid View Only */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectGrid />
      </section>

      {/* Consultation Footer */}
      <section className="py-20 bg-earth-950 text-stone-100 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <span className="text-xs uppercase tracking-widest font-mono text-clay font-semibold block">
            Custom Commissions
          </span>
          
          <h3 className="font-heading text-3xl md:text-5xl text-earth-50 font-light">
            Have an Architectural or Interior Plot in Mind?
          </h3>

          <p className="body-text text-stone-300 font-light text-sm md:text-base leading-relaxed">
            We offer feasibility studies, natural material sourcing, and bioclimatic master planning for projects anywhere in India or internationally.
          </p>

          <div className="pt-4">
            <Button to="/contact" variant="clay" size="lg">
              Book Project Briefing
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Projects;
