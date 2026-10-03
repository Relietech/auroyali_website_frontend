import React from 'react';
import { motion } from 'framer-motion';
import { PageBanner } from '../components/common/PageBanner';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { VisionMissionSection } from '../components/about/VisionMissionSection';
import { MeetOurTeam } from '../components/about/MeetOurTeam';
import { 
  CheckCircle2 
} from 'lucide-react';

export function AboutUs() {
  return (
    <div className="min-h-screen bg-earth-50">
      <PageBanner
        title="Conscious Architecture Rooted in Auroville"
        subtitle="Since 2012, AuroYali has been a pioneering force in earth-based sustainable architecture, bioclimatic engineering, and circular craftsmanship."
        breadcrumb="About Us"
        bgImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
        tag="Our Legacy & Philosophy"
      />

      {/* Origin & Foundation Section */}
      <section className="py-10 sm:py-28 bg-earth-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 space-y-6"
            >
              <SectionHeading
                tag="Founded in 2012"
                title="Manifesting a new consciousness in the built environment."
              />

              <p className="body-text text-stone-700 leading-relaxed font-light">
                Auroville is an international universal township in South India dedicated to sustainable human unity and experimental ecology. AuroYali was established within the International Zone as an architectural design and construction unit dedicated to eliminating the massive carbon footprint of conventional cement and fired clay.
              </p>

              <p className="body-text text-stone-700 leading-relaxed font-light">
                We believe that true luxury lies in breathable, toxin-free spaces where the walls regulate humidity, the roofs capture passive sea breezes, and the materials return gracefully to the earth at the end of their lifecycle.
              </p>

              {/* Features: Mobile Carousel / Desktop 2-Col Grid */}
              <div className="pt-4">
                <div 
                  className="flex sm:grid sm:grid-cols-2 gap-3.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 px-1 sm:px-0 snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <motion.div 
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="shrink-0 w-[85%] sm:w-auto snap-center flex items-start gap-3 p-4 rounded-2xl bg-white border border-earth-200 shadow-sm select-none"
                  >
                    <CheckCircle2 size={20} className="text-clay shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-semibold text-earth-900">Zero-Waste Material Flow</strong>
                      <span className="text-xs text-stone-600 font-light mt-0.5 block leading-relaxed">
                        Earth excavated on-site is converted directly into high-strength CSEB masonry.
                      </span>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="shrink-0 w-[85%] sm:w-auto snap-center flex items-start gap-3 p-4 rounded-2xl bg-white border border-earth-200 shadow-sm select-none"
                  >
                    <CheckCircle2 size={20} className="text-sage shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-sm font-semibold text-earth-900">Non-Toxic Living Spaces</strong>
                      <span className="text-xs text-stone-600 font-light mt-0.5 block leading-relaxed">
                        Pure lime plasters, natural earth pigments, and beeswax timber protection.
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Mobile scroll swipe indicator */}
                <div className="flex sm:hidden items-center justify-center gap-1.5 mt-2.5">
                  <div className="w-5 h-1 bg-clay rounded-full" />
                  <div className="w-1.5 h-1 bg-earth-300 rounded-full" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.94, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative mt-4 lg:mt-0"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-earth-200 group">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
                  alt="Auroyali Courtyard Architecture"
                  className="w-full h-[340px] sm:h-[460px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>

              {/* Responsive Metric Card */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-3 sm:mt-0 sm:absolute sm:-bottom-6 sm:-right-6 bg-earth-900 text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-earth-700 max-w-xs mx-auto sm:mx-0"
              >
                <span className="font-heading text-2xl sm:text-3xl font-bold text-clay block">1.2 Million+</span>
                <span className="text-[11px] sm:text-xs text-stone-300 font-mono mt-0.5 sm:mt-1 block leading-snug sm:leading-relaxed">
                  CSEB Blocks Pressed On-Site Across 80+ Structures
                </span>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Bespoke Editorial Vision & Mission Section */}
      <VisionMissionSection />

      {/* Dedicated Meet Our Team Section */}
      <MeetOurTeam />

      {/* CTA Section */}
      <section className="py-12 sm:py-24 bg-earth-900 text-stone-100 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-clay/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-4 space-y-6 relative z-10"
        >
          <span className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-earth-300 font-semibold">
            Begin Your Sustainable Journey
          </span>
          <h3 className="font-heading text-3xl md:text-5xl lg:text-6xl text-earth-50 leading-tight">
            Let's Collaborate on Your Vision
          </h3>
          <p className="body-text text-stone-300 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Whether for architectural master planning or exploring natural construction methods, we welcome your conversation.
          </p>
          <div className="pt-4">
            <Button to="/contact" variant="clay" size="lg">
              Contact Auroville Studio
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default AboutUs;
