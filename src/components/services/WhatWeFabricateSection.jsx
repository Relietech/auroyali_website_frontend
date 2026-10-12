import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  Warehouse, 
  DoorOpen, 
  Armchair, 
  Building2, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';

/* ==========================================================================
   WHAT WE FABRICATE DATA (6 Cards)
   ========================================================================== */
export const fabricationOfferings = [
  {
    id: 'gates-grills',
    title: 'Gates & Grills',
    desc: 'Motorized sliding gates, monumental compound pivots, laser-cut security grills, and ornamental wicket doors.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    icon: Shield
  },
  {
    id: 'railings-staircases',
    title: 'Railings & Staircases',
    desc: 'Helical spiral staircases, central spine floating steps, and marine-grade stainless cable wire balustrades.',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    icon: TrendingUp
  },
  {
    id: 'roof-structures',
    title: 'Roof Structures & Pergolas',
    desc: 'Curved reciprocal trusses, courtyard tensile canopies, cantilevered carports, and outdoor garden pergolas.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=1200&q=80',
    icon: Warehouse
  },
  {
    id: 'doors-windows',
    title: 'Doors & Windows',
    desc: 'Slim-line steel Crittall glazed partitions, thermal break casements, and heavy pivot portals.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    icon: DoorOpen
  },
  {
    id: 'furniture-decor',
    title: 'Furniture & Decor',
    desc: 'Bespoke industrial steel dining frames, cast brass hardware, blackened iron credenzas, and custom lighting.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    icon: Armchair
  },
  {
    id: 'structural-works',
    title: 'Structural Works',
    desc: 'Pre-engineered mezzanine floors, seismic moment frames, cantilevered balconies, and earth-building ties.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    icon: Building2
  }
];

/* ==========================================================================
   IMAGE COMPONENT WITH ON-ERROR FALLBACK
   ========================================================================== */
function ServiceCardImage({ src, alt, icon: IconComponent }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-[#EBE2D7]">
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#2B2B2B] to-[#1F2421] flex flex-col items-center justify-center p-6 text-center text-[#F3E9DC]">
          <IconComponent size={36} className="text-[#E8782A] mb-2" />
          <span className="font-heading text-sm font-semibold tracking-wide text-white">{alt}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      
      {/* Top-left rounded icon badge on white square */}
      <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-[#B5532F] shadow-sm">
        <IconComponent size={18} />
      </div>
    </div>
  );
}

/* ==========================================================================
   WHAT WE FABRICATE SECTION COMPONENT
   ========================================================================== */
export function WhatWeFabricateSection() {
  const shouldReduceMotion = useReducedMotion();
  const scrollContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track active carousel card on mobile scroll
  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.querySelector('[data-carousel-item]')?.offsetWidth || 300;
    const gap = 16;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(Math.max(index, 0), fabricationOfferings.length - 1));
  };

  const scrollToCard = (index) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const targetIndex = Math.min(Math.max(index, 0), fabricationOfferings.length - 1);
    const items = container.querySelectorAll('[data-carousel-item]');
    if (items[targetIndex]) {
      items[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setActiveIndex(targetIndex);
    }
  };

  return (
    <section id="what-we-fabricate" className="py-12 sm:py-20 bg-[#F7F0E8] border-b border-[#E5D5C0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Motion Transition */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/30 text-[#B5532F] text-[10px] sm:text-xs font-mono uppercase tracking-[0.14em] font-semibold mb-2.5 sm:mb-3">
            <Layers size={12} />
            <span>FABRICATION CAPABILITIES</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2B2B2B] tracking-tight">
            What We Fabricate
          </h2>
          <p className="font-body text-[#3A3F45] text-xs sm:text-base md:text-lg font-light mt-2 sm:mt-3 leading-relaxed">
            From heavy structural roof frames to intricate laser-cut Corten privacy screens, explore our diverse steel and metal craft offerings.
          </p>
        </motion.div>

        {/* ===================================================================
            1. MOBILE VIEW: SMOOTH HORIZONTAL SWIPEABLE CAROUSEL (hidden on md+)
            =================================================================== */}
        <div className="md:hidden">
          {/* Scrollable Card Track with Snap Center */}
          <div
            ref={scrollContainerRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 pt-1 px-4 -mx-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {fabricationOfferings.map((item, index) => (
              <div
                key={item.id}
                data-carousel-item
                className="snap-center shrink-0 w-[84vw] max-w-[325px] rounded-2xl bg-white border border-[#E5D5C0] shadow-sm flex flex-col overflow-hidden transition-all duration-300"
              >
                {/* Image with Error Fallback & Icon Badge */}
                <ServiceCardImage 
                  src={item.image} 
                  alt={item.title} 
                  icon={item.icon} 
                />

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-heading text-lg font-bold text-[#2B2B2B] leading-snug">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#B5532F] font-bold bg-[#FAF6F1] px-2 py-0.5 rounded-full border border-[#E5D5C0] shrink-0">
                      0{index + 1}/0{fabricationOfferings.length}
                    </span>
                  </div>

                  {/* Thin Terracotta Accent Line */}
                  <div className="w-8 h-0.5 bg-[#B5532F] mt-1 mb-2.5 rounded-full" />

                  {/* Description Text */}
                  <p className="font-body text-[#3A3F45] text-xs leading-relaxed font-light mb-4">
                    {item.desc}
                  </p>

                  {/* Outlined Action Button */}
                  <Link
                    to="/contact"
                    aria-label={`Get a quote for ${item.title}`}
                    className="mt-auto w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#B5532F] text-[#B5532F] hover:bg-[#B5532F] hover:text-white font-sans text-xs font-medium transition-all duration-200"
                  >
                    <span>Get a Quote</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Pagination Controls & Swipe Indicators */}
          <div className="flex items-center justify-between pt-2 px-1">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous capability card"
              className={`w-9 h-9 rounded-full border border-[#E5D5C0] flex items-center justify-center transition-all ${
                activeIndex === 0 
                  ? 'bg-white/40 text-stone-300 border-stone-200 cursor-not-allowed' 
                  : 'bg-white text-[#2B2B2B] hover:bg-[#B5532F] hover:text-white hover:border-[#B5532F] shadow-xs active:scale-95'
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {fabricationOfferings.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToCard(index)}
                  aria-label={`Go to ${item.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === index 
                      ? 'w-6 bg-[#B5532F]' 
                      : 'w-2 bg-[#D9CBBA] hover:bg-[#B5532F]/50'
                  }`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex + 1)}
              disabled={activeIndex === fabricationOfferings.length - 1}
              aria-label="Next capability card"
              className={`w-9 h-9 rounded-full border border-[#E5D5C0] flex items-center justify-center transition-all ${
                activeIndex === fabricationOfferings.length - 1 
                  ? 'bg-white/40 text-stone-300 border-stone-200 cursor-not-allowed' 
                  : 'bg-white text-[#2B2B2B] hover:bg-[#B5532F] hover:text-white hover:border-[#B5532F] shadow-xs active:scale-95'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ===================================================================
            2. DESKTOP / TABLET VIEW: 3x2 GRID (hidden on mobile, visible md+)
            =================================================================== */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {fabricationOfferings.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ 
                duration: 0.55, 
                delay: shouldReduceMotion ? 0 : (index % 3) * 0.12, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group rounded-2xl bg-white border border-[#E5D5C0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              {/* Image with Error Fallback & Icon Badge */}
              <ServiceCardImage 
                src={item.image} 
                alt={item.title} 
                icon={item.icon} 
              />

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                {/* Serif Title */}
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2B2B2B] sm:min-h-[3rem] flex items-center leading-snug">
                  {item.title}
                </h3>

                {/* Thin Terracotta Accent Line */}
                <div className="w-8 sm:w-10 h-0.5 bg-[#B5532F] mt-1.5 sm:mt-2 mb-2.5 sm:mb-3 rounded-full" />

                {/* Description Text */}
                <p className="font-body text-[#3A3F45] text-xs sm:text-sm leading-relaxed font-light mb-4 sm:mb-6">
                  {item.desc}
                </p>

                {/* Full-width Outlined Button (Pinned to Bottom) */}
                <Link
                  to="/contact"
                  aria-label={`Get a quote for ${item.title}`}
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 sm:py-3 sm:px-5 rounded-xl border border-[#B5532F] text-[#B5532F] hover:bg-[#B5532F] hover:text-white font-sans text-xs sm:text-sm font-medium transition-all duration-200 group/btn focus:outline-none focus:ring-2 focus:ring-[#B5532F] focus:ring-offset-2"
                >
                  <span>Get a Quote</span>
                  <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default WhatWeFabricateSection;

