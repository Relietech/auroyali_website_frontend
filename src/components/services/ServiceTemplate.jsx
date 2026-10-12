import React from 'react';
import { Link } from 'react-router-dom';
import { PageBanner } from '../common/PageBanner';
import { SectionHeading } from '../common/SectionHeading';
import { CheckCircle, ArrowRight } from 'lucide-react';

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

      <section className="py-12 sm:py-16 md:py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 w-full">
              <SectionHeading
                tag="Our Methodology"
                title={`Crafting with environmental intelligence in ${service.title.toLowerCase()}.`}
              />

              <p className="body-text text-stone-700 leading-relaxed text-sm sm:text-base md:text-lg font-light">
                {service.longDesc}
              </p>

              {/* Technical Capabilities */}
              <div className="pt-2 sm:pt-4">
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-earth-900 mb-3 sm:mb-4">
                  Key Technical Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {service.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-earth-200/80 shadow-xs flex items-start gap-3"
                    >
                      <CheckCircle size={18} className="text-clay shrink-0 mt-0.5" />
                      <span className="text-stone-800 text-xs sm:text-sm font-light leading-snug">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div className="pt-2 sm:pt-4">
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-earth-900 mb-3 sm:mb-4">
                  Client Deliverables & Documentation
                </h4>
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-earth-100/60 border border-earth-300/40 space-y-2.5 sm:space-y-3">
                  {service.deliverables.map((del, idx) => (
                    <div key={idx} className="flex items-start sm:items-center gap-2.5 text-xs sm:text-sm text-stone-800 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0 mt-1 sm:mt-0" />
                      <span className="leading-snug">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Arranged side-by-side in a single line on all screen sizes */}
              <div className="pt-3 sm:pt-4 flex flex-row items-center gap-2 sm:gap-4 w-full">
                <Link 
                  to="/contact" 
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-clay hover:bg-earth-800 text-white font-mono text-[10.5px] sm:text-xs uppercase tracking-tight sm:tracking-wider font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap text-center group"
                >
                  <span>Request Consultation</span>
                  <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link 
                  to="/projects" 
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-earth-100 hover:bg-earth-200 text-earth-900 border border-earth-300/40 font-mono text-[10.5px] sm:text-xs uppercase tracking-tight sm:tracking-wider font-semibold transition-all shadow-xs hover:shadow-md whitespace-nowrap text-center group"
                >
                  <span>Case Studies</span>
                  <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5 sm:space-y-6 w-full mt-4 lg:mt-0">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-earth-200">
                <img
                  src={service.heroImage}
                  alt={service.title}
                  className="w-full h-56 sm:h-72 md:h-80 object-cover"
                />
              </div>

              <div className="bg-earth-900 text-stone-100 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-earth-800 space-y-5 sm:space-y-6 shadow-xl w-full">
                <span className="text-xs uppercase tracking-widest text-clay font-mono block">
                  Studio Track Record
                </span>

                <div className="space-y-3.5 sm:space-y-4">
                  {Object.entries(service.stats || {}).map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between border-b border-earth-800 pb-2.5 sm:pb-3 gap-2">
                      <span className="text-[11px] sm:text-xs text-stone-400 uppercase font-mono">
                        {label.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="font-heading text-xl sm:text-2xl text-earth-100 font-bold shrink-0">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-1 text-[11px] sm:text-xs text-stone-400 font-light leading-relaxed">
                  Every project is supervised directly by Auroville master builders and registered architects.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceTemplate;
