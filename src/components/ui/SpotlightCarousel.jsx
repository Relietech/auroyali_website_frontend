import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='%23e5d5c0'%3E%3Crect width='200' height='200' fill='%23d2b48c'/%3E%3Ccircle cx='100' cy='75' r='40' fill='%23faf6f1'/%3E%3Cpath d='M30 180 c0-40 30-65 70-65 s70 25 70 65' fill='%23faf6f1'/%3E%3C/svg%3E";

/**
 * SpotlightCarousel - Luxury 3D Orbital Spotlight Carousel
 * 
 * @param {Array} people - Array of people objects ({ id, name, role, image })
 * @param {number} autoplayInterval - Autoplay duration in ms (default 4000ms)
 * @param {string} className - Additional CSS wrapper classes
 */
export function SpotlightCarousel({
  people = [],
  autoplayInterval = 4000,
  className = ""
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState({});
  const shouldReduceMotion = useReducedMotion();
  const carouselRef = useRef(null);

  const total = people.length;

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  const goToIndex = (idx) => {
    if (total === 0) return;
    setCurrentIndex((idx + total) % total);
  };

  // Autoplay timer that pauses on hover/focus and respects reduced motion
  useEffect(() => {
    if (isPaused || shouldReduceMotion || total <= 1 || !autoplayInterval) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [isPaused, shouldReduceMotion, total, autoplayInterval, handleNext]);

  // Keyboard navigation support
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Handle Drag Gesture on Center Card
  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    const vel = velocity.x;

    if (swipe < -40 || vel < -300) {
      handleNext();
    } else if (swipe > 40 || vel > 300) {
      handlePrev();
    }
  };

  if (!people || people.length === 0) return null;

  // Spring physics for buttery-smooth continuous translation
  const springTransition = shouldReduceMotion
    ? { duration: 0.3 }
    : { type: "spring", stiffness: 220, damping: 26, mass: 0.8 };

  return (
    <div
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Spotlight Team Carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={`w-full max-w-5xl mx-auto flex flex-col items-center select-none outline-none focus-visible:ring-2 focus-visible:ring-clay/40 rounded-3xl ${className}`}
    >
      {/* 3D Viewport Stage */}
      <div 
        className="relative w-full h-[330px] sm:h-[460px] flex items-center justify-center overflow-hidden py-2 sm:py-4 perspective-[1200px]"
      >
        {people.map((person, idx) => {
          // Calculate shortest circular offset distance (-2, -1, 0, 1, 2)
          let offset = (idx - currentIndex + total) % total;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          const isCenter = offset === 0;
          const isImmediate = Math.abs(offset) === 1;
          const isOuter = Math.abs(offset) === 2;
          const isVisible = Math.abs(offset) <= 2;

          // Compute continuous 3D transform targets
          let x = `${offset * 54}%`;
          let scale = 1 - Math.abs(offset) * 0.16;
          let opacity = isCenter ? 1 : isImmediate ? 0.55 : isOuter ? 0.25 : 0;
          let zIndex = 30 - Math.abs(offset) * 10;
          let rotateY = offset * -12;
          let blur = isCenter ? 'blur(0px)' : isImmediate ? 'blur(0.8px)' : 'blur(2.5px)';
          let grayscale = isCenter ? 'grayscale(0%)' : isImmediate ? 'grayscale(35%)' : 'grayscale(70%)';

          return (
            <motion.div
              key={person.id || person.name || idx}
              initial={false}
              animate={{
                x,
                scale: isCenter ? 1.04 : scale,
                opacity,
                zIndex,
                rotateY,
                filter: `${blur} ${grayscale}`,
                pointerEvents: isVisible ? 'auto' : 'none'
              }}
              transition={springTransition}
              onClick={() => {
                if (!isCenter) goToIndex(idx);
              }}
              drag={isCenter ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={isCenter ? handleDragEnd : undefined}
              className={`absolute w-[220px] sm:w-[300px] h-[300px] sm:h-[410px] rounded-3xl overflow-hidden cursor-pointer transition-shadow duration-500 bg-earth-900 border flex flex-col justify-end ${
                isCenter
                  ? 'border-clay/90 shadow-[0_20px_50px_rgba(200,90,50,0.22)] ring-4 ring-clay/25 cursor-grab active:cursor-grabbing'
                  : 'border-earth-200/90 shadow-md hover:opacity-80'
              }`}
            >
              {/* Card Photo (Ken-Burns subtle zoom on active) */}
              <div className="absolute inset-0 overflow-hidden bg-earth-200 pointer-events-none">
                <motion.img
                  src={imageErrorMap[person.id] ? FALLBACK_AVATAR : (person.image || person.img)}
                  alt={person.name}
                  onError={() => setImageErrorMap(prev => ({ ...prev, [person.id]: true }))}
                  loading="lazy"
                  animate={{
                    scale: isCenter ? 1.08 : 1.0,
                    brightness: isCenter ? 1.05 : 0.95
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                />
                
                {/* Bottom dark gradient overlay to ensure text contrast without blocking faces */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-earth-950/95 via-earth-950/40 to-transparent transition-opacity duration-500 ${
                    isCenter ? 'opacity-100' : 'opacity-40'
                  }`} 
                />

                {/* Subtle top specular sheen on center card */}
                {isCenter && (
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
                )}
              </div>

              {/* Bottom Text Overlay: Role & Name pinned to the bottom */}
              <div 
                className={`relative z-10 p-6 text-white transition-all duration-500 ease-out pointer-events-none ${
                  isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                {person.role && (
                  <span className="text-xs font-mono text-clay-300 block uppercase tracking-wider font-semibold">
                    {person.role}
                  </span>
                )}
                <h4 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mt-1">
                  {person.name}
                </h4>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Carousel Navigation Strip: Prev Button, Indicators, Next Button */}
      <div className="flex items-center justify-center gap-6 mt-4">
        {/* Prev Arrow Button (Terracotta on warm white) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous person"
          className="w-11 h-11 rounded-full bg-white hover:bg-clay text-clay hover:text-white border border-earth-200 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Animated Dot Indicators with Active Pill */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Carousel pagination">
          {people.map((person, idx) => (
            <button
              key={person.id || idx}
              type="button"
              role="tab"
              aria-selected={currentIndex === idx}
              aria-label={`Go to ${person.name}`}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-clay ${
                currentIndex === idx
                  ? 'w-8 h-2.5 bg-clay'
                  : 'w-2.5 h-2.5 bg-earth-300 hover:bg-earth-400'
              }`}
            />
          ))}
        </div>

        {/* Next Arrow Button (Terracotta on warm white) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next person"
          className="w-11 h-11 rounded-full bg-white hover:bg-clay text-clay hover:text-white border border-earth-200 shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-clay"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default SpotlightCarousel;
