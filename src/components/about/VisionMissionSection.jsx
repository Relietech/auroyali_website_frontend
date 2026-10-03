import React from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Target 
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export function VisionMissionSection() {
  return (
    <section className="py-12 sm:py-32 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Ambient background soft glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-clay/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-sage/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading: Who We Are */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <SectionHeading
            align="center"
            tag="Who We Are"
            title="Conscious Creators of Living Architecture"
            subtitle="Rooted in Auroville since 2012, we bridge natural earth materials with scientific engineering to design sanctuaries that heal ecosystems."
            light={true}
          />
        </motion.div>

        {/* Two-Card Grid: Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-10 mt-6 sm:mt-16">
          
          {/* Card 1: Our Vision */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group relative rounded-2xl sm:rounded-3xl bg-stone-950 border border-stone-800 hover:border-clay/50 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Image Header with Floating Badge */}
              <div className="relative h-48 sm:h-72 w-full overflow-hidden bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="AuroYali Vision Earth Architecture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                
                {/* Floating Vision Badge */}
                <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-700 text-clay text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase">
                  <Eye className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
                  <span>Our Vision</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6">
                  <span className="text-[10px] sm:text-xs font-mono text-clay uppercase tracking-widest block mb-0.5 sm:mb-1">
                    01 / Long-Term Horizon
                  </span>
                  <h3 className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold text-stone-50 leading-snug sm:leading-tight">
                    Restoring the Earth Through Design
                  </h3>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-4 sm:p-8 space-y-3.5 sm:space-y-6">
                <blockquote className="font-heading text-sm sm:text-xl text-stone-200 font-normal leading-relaxed italic border-l-2 border-clay pl-3 sm:pl-4">
                  "To pioneer a global architectural paradigm where built spaces heal ecosystems and elevate human consciousness."
                </blockquote>

                <p className="text-xs sm:text-base text-stone-400 font-light leading-relaxed">
                  We envision a future where construction ceases to be an act of depletion, transforming into a regenerative dialogue between natural geology, vernacular intelligence, and climate-positive engineering.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Our Mission */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group relative rounded-2xl sm:rounded-3xl bg-stone-950 border border-stone-800 hover:border-sage/50 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Image Header with Floating Badge */}
              <div className="relative h-48 sm:h-72 w-full overflow-hidden bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                  alt="AuroYali Mission Earth Craftsmanship"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                
                {/* Floating Mission Badge */}
                <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-stone-950/85 backdrop-blur-md border border-stone-700 text-sage text-[10px] sm:text-xs font-mono font-semibold tracking-wider uppercase">
                  <Target className="w-3.5 h-3.5 sm:w-[15px] sm:h-[15px]" />
                  <span>Our Mission</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 sm:bottom-4 sm:left-6 sm:right-6">
                  <span className="text-[10px] sm:text-xs font-mono text-sage uppercase tracking-widest block mb-0.5 sm:mb-1">
                    02 / Action & Execution
                  </span>
                  <h3 className="font-heading text-lg sm:text-2xl lg:text-3xl font-bold text-stone-50 leading-snug sm:leading-tight">
                    Low-Carbon Sanctuaries in Practice
                  </h3>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-4 sm:p-8 space-y-3.5 sm:space-y-6">
                <blockquote className="font-heading text-sm sm:text-xl text-stone-200 font-normal leading-relaxed italic border-l-2 border-sage pl-3 sm:pl-4">
                  "To engineer breathable, low-carbon sanctuaries through artisanal mastery, raw earth, and scientific rigor."
                </blockquote>

                <p className="text-xs sm:text-base text-stone-400 font-light leading-relaxed">
                  Our day-to-day mission is to replace high-emission industrial building materials with locally excavated earth, structural bamboo, and pozzolanic lime—while empowering rural Tamil artisans through dignified craft.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default VisionMissionSection;
