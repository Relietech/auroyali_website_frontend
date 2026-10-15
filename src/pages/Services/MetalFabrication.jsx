import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight, 
  Phone, 
  Flame, 
  Wrench,
  Sparkles,
  Award
} from 'lucide-react';
import WhatWeFabricateSection from '../../components/services/WhatWeFabricateSection';
import MetalProjectGallerySection from '../../components/services/MetalProjectGallerySection';
import FabricationProcessSection from '../../components/services/FabricationProcessSection';
import { 
  getStoredMetalData, 
  subscribeToMetal, 
  getMetalIcon,
  DEFAULT_METAL_DATA 
} from '../../services/metalStore';

// Exports for backward compatibility
export { fabricationOfferings } from '../../components/services/WhatWeFabricateSection';
export { galleryProjects } from '../../components/services/MetalProjectGallerySection';
export { fabricationProcess } from '../../components/services/FabricationProcessSection';

/* ==========================================================================
   MAIN COMPONENT: MetalFabrication
   ========================================================================== */
export function MetalFabrication() {
  const shouldReduceMotion = useReducedMotion();
  const [metalData, setMetalData] = useState(() => getStoredMetalData());

  useEffect(() => {
    const unsub = subscribeToMetal((updated) => {
      setMetalData(updated);
    });
    return () => unsub();
  }, []);

  const hero = metalData.hero || DEFAULT_METAL_DATA.hero;
  const overview = metalData.overview || DEFAULT_METAL_DATA.overview;
  const cta = metalData.ctaBanner || DEFAULT_METAL_DATA.ctaBanner;

  return (
    <div className="bg-[#FAF6F1] min-h-screen text-[#2B2B2B] selection:bg-[#E8782A] selection:text-white">

      {/* ===================================================================
          1. HERO SECTION
          =================================================================== */}
      <section 
        className="relative w-full min-h-[58vh] sm:min-h-[65vh] flex items-center justify-center overflow-hidden bg-[#1F2421] text-[#FAF6F1]"
        aria-label="Metal Fabrication Hero"
      >
        {/* Cinematic Workshop Image Background */}
        <motion.div 
          key={hero.bgImage}
          initial={{ scale: shouldReduceMotion ? 1 : 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 will-change-transform"
        >
          <img
            src={hero.bgImage || "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=2000&q=85"}
            alt={hero.bgAlt || "Welding Sparks and Metal Fabrication Workshop in Auroville"}
            className="w-full h-full object-cover object-center opacity-80"
          />
          {/* Rich Cinematic Charcoal & Warm Spark Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F2421] via-[#1F2421]/55 to-black/30" />
        </motion.div>

        {/* Ambient Spark Glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-[#E8782A]/20 blur-[100px] pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-38 lg:pb-26 text-center flex flex-col items-center">
          
          {/* Breadcrumb */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[#F3E9DC]/80 mb-3 sm:mb-5"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-[#E8782A]" />
            <Link to="/services/architecture" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight size={10} className="text-[#E8782A]" />
            <span className="text-[#E8782A] font-semibold">{hero.breadcrumb || "Metal Fabrication"}</span>
          </motion.nav>

          {/* Eyebrow Tag */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#E8782A]/20 border border-[#E8782A]/40 text-[#F3E9DC] text-[10px] sm:text-xs font-mono uppercase tracking-[0.1em] sm:tracking-[0.14em] font-semibold mb-3 sm:mb-4 backdrop-blur-sm max-w-full text-center"
          >
            <Flame size={12} className="text-[#E8782A] animate-pulse shrink-0" />
            <span>{hero.eyebrow || "PRECISION ARCHITECTURAL STEELWORK"}</span>
          </motion.div>

          {/* H1 Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-2 sm:mb-3"
          >
            {hero.title || "Metal Fabrication"}
          </motion.h1>

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-body text-xs sm:text-base md:text-lg text-[#F3E9DC] font-light max-w-xl leading-relaxed mb-6 sm:mb-8"
          >
            {hero.subtitle || "Strong structures, crafted in steel."}
          </motion.p>

          {/* CTA Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <Link
              to={hero.ctaPrimaryLink || "/contact"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-[12px] bg-[#E8782A] hover:bg-[#d4671e] text-white font-mono text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>{hero.ctaPrimaryText || "Request a Quote"}</span>
              <ArrowRight size={13} />
            </Link>

            <a
              href={hero.ctaSecondaryLink || "#what-we-fabricate"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-[12px] bg-white/10 hover:bg-white/20 text-white font-mono text-[11px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.14em] font-semibold transition-all border border-white/25 backdrop-blur-sm"
            >
              <span>{hero.ctaSecondaryText || "Explore Capabilities"}</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* ===================================================================
          2. OVERVIEW SECTION (Two-Column Layout with Smooth Transitions)
          =================================================================== */}
      <section className="pt-8 pb-12 sm:pt-10 sm:pb-16 border-b border-[#E5D5C0] bg-[#FAF6F1] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Text & Highlights (6 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 space-y-4 sm:space-y-6"
            >
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2B2B2B] leading-tight tracking-tight">
                {overview.heading || "Architectural Metal Craft Rooted in Earth Construction"}
              </h2>

              <p className="font-body text-[#4A4F55] text-xs sm:text-sm md:text-base leading-relaxed font-light">
                {overview.description || "At AuroYali, our specialized in-house metal fabrication division bridges traditional craftsmanship with contemporary structural precision. We manufacture monumental gates, curved staircases, and tensile canopies designed specifically to integrate seamlessly with Compressed Stabilized Earth Blocks (CSEB) and reclaimed timber."}
              </p>

              {/* Dynamic Highlight Points (Up to 3) */}
              {overview.highlights && overview.highlights.length > 0 && (
                <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-4">
                  {overview.highlights.map((hl, idx) => {
                    const HlIcon = getMetalIcon(hl.iconName);
                    return (
                      <motion.div 
                        key={hl.id || idx}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.15 + (idx * 0.1) }}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4.5 rounded-2xl bg-white border border-[#E5D5C0] shadow-xs hover:shadow-md hover:border-[#B5532F]/40 transition-colors"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#B5532F]/10 text-[#B5532F] flex items-center justify-center shrink-0 mt-0.5">
                          <HlIcon size={16} />
                        </div>
                        <div>
                          <h4 className="font-heading text-sm sm:text-base font-bold text-[#2B2B2B]">{hl.title}</h4>
                          <p className="font-body text-[11px] sm:text-xs text-[#4A4F55] font-light mt-0.5 leading-relaxed">
                            {hl.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

            </motion.div>

            {/* Right Column: Large Workshop Imagery (6 cols) */}
            <motion.div 
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E5D5C0] group">
                <img
                  src={overview.image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"}
                  alt={overview.imageAlt || "AuroYali Master Welder in Workshop"}
                  className="w-full h-[300px] sm:h-[460px] md:h-[540px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===================================================================
          3. WHAT WE FABRICATE (Dynamic Capabilities Section)
          =================================================================== */}
      <WhatWeFabricateSection />

      {/* ===================================================================
          4. FABRICATION PROCESS (Dynamic Connected Horizontal Timeline Pipeline)
          =================================================================== */}
      <FabricationProcessSection />

      {/* ===================================================================
          5. FILTERABLE PROJECT GALLERY (Dynamic Section with Lightbox)
          =================================================================== */}
      <MetalProjectGallerySection />

      {/* ===================================================================
          6. CTA BAND (Terracotta / Spark Orange Banner)
          =================================================================== */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-[#B5532F] to-[#E8782A] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-4 sm:space-y-6">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] sm:text-xs font-mono uppercase tracking-[0.14em] font-semibold">
            <Flame size={12} />
            <span>{cta.eyebrow || "START YOUR PROJECT"}</span>
          </div>

          <h2 className="font-heading text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-3xl leading-tight">
            {cta.heading || "Have a metal work idea? Let's build it."}
          </h2>

          <p className="font-body text-white/90 text-xs sm:text-base md:text-lg max-w-xl font-light leading-relaxed">
            {cta.description || "From precision laser-cut Corten façades to custom helical staircases and roof canopies, collaborate with AuroYali's master metal craftsmen."}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
            <Link
              to={cta.buttonLink || "/contact"}
              className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-[12px] bg-white text-[#B5532F] hover:bg-[#FAF6F1] font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
            >
              {cta.buttonText || "Get a Free Estimate"}
            </Link>

            <a
              href={cta.phoneLink || "tel:+918940000126"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-[12px] bg-black/20 hover:bg-black/30 text-white font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] font-semibold transition-all border border-white/20 text-center"
            >
              <Phone size={13} />
              <span>{cta.phoneText || "Call Us (+91 89400 00126)"}</span>
            </a>
          </div>

        </div>
      </section>

      {/* ===================================================================
          7. STICKY MOBILE CTA BAR
          =================================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5D5C0] p-2.5 px-4 shadow-2xl flex items-center justify-between gap-3">
        <a
          href={cta.phoneLink || "tel:+918940000126"}
          className="w-11 h-10 rounded-[10px] bg-[#FAF6F1] border border-[#E5D5C0] text-[#2B2B2B] flex items-center justify-center shrink-0"
        >
          <Phone size={16} className="text-[#B5532F]" />
        </a>

        <Link
          to={cta.buttonLink || "/contact"}
          className="flex-1 py-2.5 px-4 rounded-[10px] bg-[#E8782A] text-white font-mono text-[11px] sm:text-xs uppercase tracking-wider font-bold text-center shadow-md flex items-center justify-center gap-2"
        >
          <span>{hero.ctaPrimaryText || "Request a Quote"}</span>
          <ArrowRight size={12} />
        </Link>
      </div>

    </div>
  );
}

export default MetalFabrication;
