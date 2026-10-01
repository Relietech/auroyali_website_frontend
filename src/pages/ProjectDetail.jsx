import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { PageBanner } from '../components/common/PageBanner';
import { SectionHeading } from '../components/common/SectionHeading';
import { ImageGallery } from '../components/common/ImageGallery';
import { Button } from '../components/common/Button';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function ProjectDetail() {
  const { slug } = useParams();
  const project = projectsData.find((p) => p.slug === slug) || projectsData[0];

  if (!project) {
    return (
      <div className="py-40 text-center">
        <h2 className="font-heading text-3xl">Project Not Found</h2>
        <Link to="/projects" className="text-clay underline mt-4 block">Return to Portfolios</Link>
      </div>
    );
  }

  return (
    <div>
      <PageBanner
        title={project.title}
        subtitle={project.subtitle}
        breadcrumb={project.title}
        bgImage={project.heroImage}
        tag={project.category}
      />

      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-clay font-mono mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to all projects
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-8 space-y-8">
              <SectionHeading
                tag="Architectural Overview"
                title="Design Intent & Context"
              />

              <p className="body-text text-stone-700 leading-relaxed text-base md:text-lg font-light">
                {project.overview}
              </p>

              <div className="pt-6">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-earth-900 mb-4">
                  Bioclimatic & Passive Cooling Logic
                </h3>
                <div className="space-y-3">
                  {project.bioclimaticFeatures?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-earth-200 shadow-sm flex items-start gap-3"
                    >
                      <Sparkles size={18} className="text-clay shrink-0 mt-0.5" />
                      <span className="text-stone-800 text-sm font-light leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-earth-900 mb-6">
                  Spatial Visuals & Material Details
                </h3>
                <ImageGallery images={project.gallery || [project.heroImage]} title={project.title} />
              </div>
            </div>

            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-earth-900 text-stone-100 p-8 rounded-3xl border border-earth-800 space-y-6 shadow-2xl">
                <h4 className="font-heading text-2xl text-earth-50 border-b border-earth-800 pb-4">
                  Project Data Sheet
                </h4>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-earth-400 font-mono block">Location</span>
                    <span className="text-stone-100 font-medium">{project.location}</span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-earth-400 font-mono block">Built Area</span>
                    <span className="text-stone-100 font-medium">{project.area}</span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-earth-400 font-mono block">Year Completed</span>
                    <span className="text-stone-100 font-medium">{project.year}</span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-earth-400 font-mono block">Client / Patron</span>
                    <span className="text-stone-100 font-medium">{project.client}</span>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-earth-400 font-mono block">AuroYali Scope</span>
                    <span className="text-stone-100 font-medium">{project.scope}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-earth-800">
                  <span className="text-[11px] uppercase tracking-wider text-earth-400 font-mono block mb-2">Natural Materials</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.materials.map((m, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-earth-800 text-clay border border-earth-700 font-mono">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Button to="/contact" variant="clay" className="w-full">
                    Inquire Similar Project
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
export default ProjectDetail;
