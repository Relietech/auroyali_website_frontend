import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { Sun, Trees } from 'lucide-react';

const showcaseImages = [
  {
    id: 'architecture',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Auroyali Auroville Earth Architecture',
    tag: 'Our Philosophy',
    quote: '"Architecture is not an imposition on nature, but a quiet conversation with sun, wind, and soil."'
  },
  {
    id: 'craft',
    src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    alt: 'CSEB Earth Blocks & Artisanal Craft',
    tag: 'Material Craft',
    quote: '"Every earth block and timber joint is shaped with intention, breathing vitality into each space."'
  }
];

const scrollContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const scrollItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function AboutIntro() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredThumb, setHoveredThumb] = useState(false);
  const [activeCardSlide, setActiveCardSlide] = useState(0);
  const cardsCarouselRef = useRef(null);

  // When hovering the small thumbnail, preview the other image in the full frame
  const displayedIdx = hoveredThumb ? (activeIdx === 0 ? 1 : 0) : activeIdx;
  const thumbnailIdx = displayedIdx === 0 ? 1 : 0;

  const handleCardsScroll = () => {
    if (cardsCarouselRef.current) {
      const scrollLeft = cardsCarouselRef.current.scrollLeft;
      const width = cardsCarouselRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / (width * 0.8));
      setActiveCardSlide(Math.min(1, Math.max(0, newIndex)));
    }
  };

  const scrollCardTo = (index) => {
    if (cardsCarouselRef.current) {
      const width = cardsCarouselRef.current.offsetWidth;
      cardsCarouselRef.current.scrollTo({
        left: index * (width * 0.85),
        behavior: 'smooth'
      });
      setActiveCardSlide(index);
    }
  };

  return (
    <section className="py-10 sm:py-16 md:py-28 lg:py-32 bg-earth-100/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Heading (Shown BEFORE the image on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="block lg:hidden mb-6 sm:mb-8"
        >
          <SectionHeading
            tag="The Auroville Ethos"
            title="A conscious synthesis of vernacular wisdom and contemporary engineering."
            subtitle="Founded in 2012 in the international township of Auroville, AuroYali was born from an urgency to transform modern building methods into regenerative, earth-positive practices."
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Interactive Image Showcase on Scroll */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Full Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 bg-earth-900 h-[380px] sm:h-[460px]">
              {showcaseImages.map((img, index) => (
                <div
                  key={img.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === displayedIdx
                      ? 'opacity-100 scale-100 z-10'
                      : 'opacity-0 scale-105 pointer-events-none z-0'
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-earth-950/30 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white transition-all duration-500">
                    <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-1 font-semibold">
                      {img.tag}
                    </span>
                    <p className="font-heading text-xl italic font-light leading-snug">
                      {img.quote}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Floating Interactive Thumbnail */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredThumb(true)}
              onMouseLeave={() => setHoveredThumb(false)}
              onClick={() => setActiveIdx(prev => (prev === 0 ? 1 : 0))}
              className="hidden sm:block absolute -top-8 -right-8 w-44 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-stone-800 cursor-pointer z-20 group transition-all duration-300 hover:scale-105 hover:shadow-clay/25 hover:ring-2 hover:ring-clay"
              title="Hover or click to view in full image"
            >
              <img
                src={showcaseImages[thumbnailIdx].src}
                alt={showcaseImages[thumbnailIdx].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          </motion.div>

          {/* Right Narrative & Cards on Scroll */}
          <motion.div
            variants={scrollContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Desktop-only Heading */}
            <motion.div variants={scrollItemVariants} className="hidden lg:block">
              <SectionHeading
                tag="The Auroville Ethos"
                title="A conscious synthesis of vernacular wisdom and contemporary engineering."
                subtitle="Founded in 2012 in the international township of Auroville, AuroYali was born from an urgency to transform modern building methods into regenerative, earth-positive practices."
              />
            </motion.div>

            {/* Cards: Mobile Carousel & Desktop Grid */}
            <div className="relative">
              <div
                ref={cardsCarouselRef}
                onScroll={handleCardsScroll}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 sm:pb-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Card 1: Bioclimatic Engineering */}
                <motion.div
                  variants={scrollItemVariants}
                  className="w-[85vw] max-w-[330px] sm:w-auto shrink-0 snap-center group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white via-white to-earth-50/80 border border-earth-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(181,83,47,0.12)] hover:border-clay/40 transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-clay/5 rounded-full blur-2xl group-hover:bg-clay/10 transition-all duration-500 pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-clay/10 border border-clay/20 text-clay flex items-center justify-center group-hover:scale-110 group-hover:bg-clay group-hover:text-white transition-all duration-300 shadow-sm">
                        <Sun size={20} className="sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
                      </div>
                      <span className="font-mono text-[9.5px] sm:text-[10px] uppercase tracking-widest text-stone-500 group-hover:text-clay font-semibold px-2.5 py-1 rounded-full bg-earth-100/70 border border-earth-200/70 transition-colors">
                        01 / THERMAL
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading text-xl sm:text-2xl font-bold text-earth-900 group-hover:text-clay transition-colors tracking-tight mb-1">
                        Bioclimatic Engineering
                      </h4>
                      <p className="text-[11px] sm:text-xs uppercase tracking-wider text-clay/80 font-mono font-medium mb-2.5 sm:mb-3">
                        Passive Thermal Regulation
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                        Passive ventilation shafts, solar-aligned orientation, and thermal mass walls that eliminate reliance on air-conditioning.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-5 mt-4 border-t border-earth-100 flex flex-wrap gap-2">
                    <span className="text-[10.5px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-earth-100/80 text-earth-900 font-medium border border-earth-200/60">
                      Passive Ventilation
                    </span>
                    <span className="text-[10.5px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-earth-100/80 text-earth-900 font-medium border border-earth-200/60">
                      Zero-HVAC
                    </span>
                  </div>
                </motion.div>

                {/* Card 2: Regenerative Forestry */}
                <motion.div
                  variants={scrollItemVariants}
                  className="w-[85vw] max-w-[330px] sm:w-auto shrink-0 snap-center group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-white via-white to-earth-50/80 border border-earth-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(122,139,105,0.15)] hover:border-sage/50 transition-all duration-500 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-sage/10 rounded-full blur-2xl group-hover:bg-sage/20 transition-all duration-500 pointer-events-none" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sage/15 border border-sage/30 text-sage flex items-center justify-center group-hover:scale-110 group-hover:bg-sage group-hover:text-white transition-all duration-300 shadow-sm">
                        <Trees size={20} className="sm:w-[22px] sm:h-[22px] stroke-[2.2]" />
                      </div>
                      <span className="font-mono text-[9.5px] sm:text-[10px] uppercase tracking-widest text-stone-500 group-hover:text-sage font-semibold px-2.5 py-1 rounded-full bg-earth-100/70 border border-earth-200/70 transition-colors">
                        02 / TIMBER
                      </span>
                    </div>

                    <div>
                      <h4 className="font-heading text-xl sm:text-2xl font-bold text-earth-900 group-hover:text-sage transition-colors tracking-tight mb-1">
                        Regenerative Forestry
                      </h4>
                      <p className="text-[11px] sm:text-xs uppercase tracking-wider text-sage font-mono font-medium mb-2.5 sm:mb-3">
                        Ethical & Non-Toxic Sourcing
                      </p>
                      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                        Engineered structural bamboo treated with mineral salts, coupled with salvaged local acacia, neem, and vintage timber.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-5 mt-4 border-t border-earth-100 flex flex-wrap gap-2">
                    <span className="text-[10.5px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-earth-100/80 text-earth-900 font-medium border border-earth-200/60">
                      Borate Bamboo
                    </span>
                    <span className="text-[10.5px] sm:text-[11px] px-2.5 py-1 rounded-lg bg-earth-100/80 text-earth-900 font-medium border border-earth-200/60">
                      Reclaimed Wood
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Mobile Carousel Pagination Dots */}
              <div className="sm:hidden flex justify-center items-center gap-1.5 pt-3">
                {[0, 1].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => scrollCardTo(dotIdx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeCardSlide === dotIdx
                        ? 'w-6 bg-clay'
                        : 'w-1.5 bg-earth-300 hover:bg-earth-400'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </div>

            <motion.div variants={scrollItemVariants} className="pt-3 sm:pt-4 flex items-center gap-3 sm:gap-4">
              <Button
                to="/about"
                variant="primary"
                size="md"
                className="px-4 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide sm:tracking-wider shadow-sm hover:shadow-md"
              >
                <span className="inline sm:hidden">Our Story</span>
                <span className="hidden sm:inline">Read Our Full Story</span>
              </Button>
              <Button
                to="/workshops"
                variant="secondary"
                size="md"
                className="px-4 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide sm:tracking-wider bg-earth-200/90 hover:bg-earth-300 border border-earth-300/80 text-earth-900 shadow-sm hover:shadow-md"
              >
                <span className="inline sm:hidden">Workshops</span>
                <span className="hidden sm:inline">Explore Workshops</span>
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
export default AboutIntro;
