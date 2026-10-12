import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Sun, Compass, Sparkles, CheckCircle2, ShieldCheck, Ruler, Users2 } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const ethosPillars = [
  {
    id: 'client-first',
    icon: HeartHandshake,
    title: "Client-Centric Spatial Design",
    description: "Our primary priority is the client's needs. We listen intently to your daily rhythms, functional desires, and budget parameters to create spaces that feel naturally intuitive and uniquely yours.",
    highlight: "100% Bespoke Floor Plans"
  },
  {
    id: 'traditional-modern',
    icon: Compass,
    title: "Traditional Vernacular & Modern Precision",
    description: "We bridge ancient earth-building techniques (CSEB, lime mortars, terracotta jalis) with modern engineering, clean lines, and state-of-the-art structural longevity.",
    highlight: "Heritage Meets High Tech"
  },
  {
    id: 'bioclimatic',
    icon: Sun,
    title: "Bioclimatic & Passive Solar Intelligence",
    description: "Every building is oriented to harness cooling wind corridors, shade against harsh sun exposure, and create natural air convection channels for round-the-year thermal comfort.",
    highlight: "Zero-Overheating Design"
  },
  {
    id: 'craft-sync',
    icon: Users2,
    title: "Architect & Master Builder Synergy",
    description: "Because we have our own in-house construction, carpentry, and metal teams, our architects ensure seamless communication with site engineers and masons with zero translation loss.",
    highlight: "Integrated Turnkey Craft"
  }
];

export function ArchitecturalEthos() {
  return (
    <section className="py-20 lg:py-28 bg-earth-50 relative overflow-hidden border-b border-earth-200/70">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2f1f13_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-clay/10 text-clay font-mono text-xs uppercase tracking-widest font-semibold">
            <Sparkles size={12} /> Studio Philosophy & Ethos
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-earth-900 leading-tight">
            Crafting Spaces with Passion, Precision & Environmental Integrity
          </h2>
          <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
            &ldquo;We put our full effort into creating the best architecture for our clients. We create both traditional and modern architecture. Our main priority is the client&rsquo;s need. We carefully plan each and every step for the construction of our clients&rsquo; buildings.&rdquo;
          </p>
        </div>

        {/* 4 Ethos Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {ethosPillars.map((pillar, idx) => {
            const IconComp = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative rounded-2xl bg-white p-7 shadow-sm hover:shadow-xl border border-earth-200/80 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-earth-100 text-earth-900 group-hover:bg-clay group-hover:text-white flex items-center justify-center transition-colors duration-300 mb-5 shadow-sm">
                    <IconComp size={22} />
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-clay font-medium block mb-1">
                    {pillar.highlight}
                  </span>

                  <h3 className="font-heading text-xl font-bold text-earth-900 mb-3 group-hover:text-clay transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-stone-600 text-sm font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-earth-100 flex items-center gap-1.5 text-xs font-mono text-stone-500">
                  <CheckCircle2 size={13} className="text-sage" />
                  <span>Auroville Architectural Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner Feature Bar */}
        <div className="mt-12 rounded-2xl bg-earth-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-earth-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-clay text-white flex items-center justify-center shrink-0">
              <Ruler size={24} />
            </div>
            <div>
              <h4 className="font-heading text-xl sm:text-2xl font-bold text-white">
                Comprehensive Architectural Planning
              </h4>
              <p className="text-stone-300 text-xs sm:text-sm font-light mt-0.5">
                Every line drawn in our studio is calibrated for thermal inertia, structural endurance, and ecological harmony.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono uppercase tracking-widest text-earth-200 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
              Zero-Waste Vision
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ArchitecturalEthos;
