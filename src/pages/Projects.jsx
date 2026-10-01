import React from 'react';
import { PageBanner } from '../components/common/PageBanner';
import { SectionHeading } from '../components/common/SectionHeading';
import { ProjectGrid } from '../components/projects/ProjectGrid';
import { Button } from '../components/common/Button';

export function Projects() {
  return (
    <div>
      <PageBanner
        title="Architectural Portfolios & Living Sanctuaries"
        subtitle="A curated showcase of institutional academies, bioclimatic residential homes, and experimental tensile bamboo pavilions executed across Auroville and South India."
        breadcrumb="Portfolios"
        bgImage="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80"
        tag="Design & Turnkey Craft"
      />

      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Selected Case Studies"
            title="Materiality, Climate & Structural Harmony"
            subtitle="Filter through our residential, institutional, and research structures to examine technical specifications, passive cooling strategies, and spatial photography."
          />

          <ProjectGrid />
        </div>
      </section>

      <section className="py-20 bg-earth-900 text-stone-100 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h3 className="font-heading text-3xl md:text-5xl text-earth-50">
            Have an Architectural Plot in Mind?
          </h3>
          <p className="body-text text-stone-300 font-light">
            We offer feasibility studies, soil quality analysis, and bioclimatic master planning for projects anywhere in India or internationally.
          </p>
          <div className="pt-2">
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
