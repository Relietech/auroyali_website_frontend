import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { Sun, Trees } from 'lucide-react';

export function AboutIntro() {
  return (
    <section className="py-24 md:py-32 bg-earth-100/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                alt="Auroyali Auroville Architecture"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-1">
                  Our Philosophy
                </span>
                <p className="font-heading text-xl italic font-light">
                  "Architecture is not an imposition on nature, but a quiet conversation with sun, wind, and soil."
                </p>
              </div>
            </div>

            <div className="hidden sm:block absolute -top-8 -right-8 w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80"
                alt="CSEB Earth Blocks"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              tag="The Auroville Ethos"
              title="A conscious synthesis of vernacular wisdom and contemporary engineering."
              subtitle="Founded in 2012 in the international township of Auroville, AuroYali was born from an urgency to transform modern building methods into regenerative, earth-positive practices."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-earth-200 shadow-sm space-y-2">
                <div className="p-2.5 w-10 h-10 rounded-lg bg-earth-100 text-clay flex items-center justify-center">
                  <Sun size={20} />
                </div>
                <h4 className="font-heading text-xl font-semibold text-earth-900">
                  Bioclimatic Engineering
                </h4>
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  Passive ventilation chimneys and shaded courtyards that eliminate the reliance on air-conditioning.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-earth-200 shadow-sm space-y-2">
                <div className="p-2.5 w-10 h-10 rounded-lg bg-earth-100 text-sage flex items-center justify-center">
                  <Trees size={20} />
                </div>
                <h4 className="font-heading text-xl font-semibold text-earth-900">
                  Regenerative Forestry
                </h4>
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  Engineered bamboo and responsibly harvested local acacia, neem, and reclaimed vintage timber.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Button to="/about" variant="primary">
                Read Our Full Story
              </Button>
              <Button to="/workshops" variant="ghost">
                Explore Workshops
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
export default AboutIntro;
