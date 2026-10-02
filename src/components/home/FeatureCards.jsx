import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../../data/services';
import { SectionHeading } from '../common/SectionHeading';
import { Compass, Layers, Hammer, Shield, ArrowUpRight } from 'lucide-react';

const icons = {
  Compass,
  Layers,
  Hammer,
  Shield
};

export function FeatureCards() {
  return (
    <section className="py-24 md:py-32 bg-earth-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <SectionHeading
            tag="Core Architectural Practices"
            title="Integrated craftsmanship from master planning to artisanal joinery."
            subtitle="Unlike standard design firms that outsource execution, our in-house Auroville studios handle design, raw material production, woodcraft, and metal fabrication under one roof."
            className="mb-0 max-w-3xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service, index) => {
            const IconComp = icons[service.icon] || Compass;
            return (
              <div
                key={service.id}
                className="group relative bg-white dark:bg-stone-900 rounded-3xl p-8 border border-earth-200/80 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                  <img
                    src={service.heroImage}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-3.5 rounded-2xl bg-earth-100 text-earth-800 dark:bg-stone-800 dark:text-earth-300 group-hover:bg-clay group-hover:text-white transition-all duration-300 shadow-sm">
                      <IconComp size={24} />
                    </div>
                    <span className="font-mono text-sm text-stone-400 group-hover:text-clay font-semibold">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-earth-900 dark:text-stone-100 mb-3 group-hover:text-clay transition-colors">
                    {service.title}
                  </h3>
                  <p className="body-text text-stone-600 dark:text-stone-400 text-sm font-light leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-earth-100 dark:border-stone-800">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-earth-900 dark:text-stone-200 group-hover:text-clay transition-colors"
                  >
                    <span>Read Practice Details</span>
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
export default FeatureCards;
