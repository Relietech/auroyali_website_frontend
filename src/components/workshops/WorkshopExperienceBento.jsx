import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Sparkles, Compass, Leaf, Award, Trees, ShieldCheck, Users } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const PILLARS = [
  {
    icon: Hammer,
    number: "01",
    tag: "Field Immersive",
    title: "100% Direct Tool Time",
    description: "No passive lectures. From the first hour, you're handling Japanese saws, hydraulic presses, mixing slaked lime, or carving mortise-and-tenons under open-air banyan trees."
  },
  {
    icon: Compass,
    number: "02",
    tag: "Master Lineage",
    title: "1:6 Master Artisan Coaching",
    description: "Learn directly beside veteran Tamil Nadu timber masters and bioclimatic engineers with 20+ years of institutional and residential construction experience in Auroville."
  },
  {
    icon: Leaf,
    number: "03",
    tag: "Circular Ecology",
    title: "Zero-Chemical Preservation",
    description: "Discover natural borax baths, slaked lime matrices, and natural linseed-tung oil coatings that outlast toxic synthetic adhesives while leaving zero planetary footprint."
  },
  {
    icon: Award,
    number: "04",
    tag: "Guild Credentials",
    title: "AGP Official Certification",
    description: "Graduate with the internationally recognized Auroville Green Practices (AGP) credential, along with full structural Rhino/CAD detail blueprints for your own practice."
  }
];

export function WorkshopExperienceBento() {
  return (
    <section className="py-24 bg-[#f7f2eb] dark:bg-stone-950/60 border-y border-earth-200/80 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] font-semibold text-clay block mb-3">
            The AuroYali Pedagogy
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-earth-900 dark:text-stone-100 tracking-tight leading-tight">
            Why Architects & Builders Travel to Auroville
          </h2>
          <p className="body-text text-stone-600 dark:text-stone-400 mt-4 font-light">
            We don't teach from slides. Our 3.5-acre living workshop yard in Kottakarai is a working laboratory where design theory is immediately tested against physics and material reality.
          </p>
        </div>

        {/* 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-stone-900 border border-earth-200/90 dark:border-stone-800 shadow-[0_8px_30px_rgba(47,31,19,0.04)] hover:shadow-[0_16px_40px_rgba(47,31,19,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-earth-100 dark:bg-stone-800 text-clay flex items-center justify-center group-hover:scale-110 group-hover:bg-clay group-hover:text-white transition-all duration-300">
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-300 dark:text-stone-700">
                      {pillar.number}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-widest text-clay font-semibold block mb-2">
                    {pillar.tag}
                  </span>

                  <h3 className="font-heading text-xl font-bold text-earth-900 dark:text-stone-100 leading-snug mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-earth-100 dark:border-stone-800 flex items-center gap-1.5 text-[11px] font-mono text-clay font-medium">
                  <Sparkles size={13} />
                  <span>Auroville Studio Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
export default WorkshopExperienceBento;
