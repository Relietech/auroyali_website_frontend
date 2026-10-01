import React from 'react';
import { PageBanner } from '../common/PageBanner';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { MaterialExplorer3D } from '../3d/MaterialExplorer3D';
import { CheckCircle } from 'lucide-react';

export function ServiceTemplate({ service }) {
  if (!service) return null;

  return (
    <div>
      <PageBanner
        title={service.title}
        subtitle={service.shortDesc}
        breadcrumb={service.title}
        bgImage={service.heroImage}
        tag="Specialized Architectural Discipline"
      />

      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-7 space-y-8">
              <SectionHeading
                tag="Our Methodology"
                title={`Crafting with environmental intelligence in ${service.title.toLowerCase()}.`}
              />

              <p className="body-text text-stone-700 leading-relaxed text-base md:text-lg font-light">
                {service.longDesc}
              </p>

              <div className="pt-4">
                <h4 className="font-heading text-2xl font-bold text-earth-900 mb-4">
                  Key Technical Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-earth-200/80 shadow-sm flex items-start gap-3"
                    >
                      <CheckCircle size={18} className="text-clay shrink-0 mt-0.5" />
                      <span className="text-stone-800 text-sm font-light leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-heading text-2xl font-bold text-earth-900 mb-4">
                  Client Deliverables & Documentation
                </h4>
                <div className="p-6 rounded-2xl bg-earth-100/60 border border-earth-300/40 space-y-3">
                  {service.deliverables.map((del, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm text-stone-800 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-clay" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button to="/contact" variant="clay" size="lg">
                  Request Studio Consultation
                </Button>
                <Button to="/projects" variant="secondary" size="lg">
                  View Case Studies
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 sticky top-28 space-y-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-earth-200">
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="w-full h-80 object-cover"
                />
              </div>

              <div className="bg-earth-900 text-stone-100 p-8 rounded-3xl border border-earth-800 space-y-6 shadow-xl">
                <span className="text-xs uppercase tracking-widest text-clay font-mono block">
                  Studio Track Record
                </span>

                <div className="space-y-4">
                  {Object.entries(service.stats || {}).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between border-b border-earth-800 pb-3">
                      <span className="text-xs text-stone-400 uppercase font-mono">
                        {label.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-heading text-2xl text-earth-100 font-bold">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-xs text-stone-400 font-light leading-relaxed">
                  Every project is supervised directly by Auroville master builders and registered architects.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-earth-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MaterialExplorer3D />
        </div>
      </section>
    </div>
  );
}
export default ServiceTemplate;
