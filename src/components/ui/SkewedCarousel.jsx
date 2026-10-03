import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue
} from 'framer-motion';

const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='%23e5d5c0'%3E%3Crect width='200' height='200' fill='%23d2b48c'/%3E%3Ccircle cx='100' cy='75' r='40' fill='%23faf6f1'/%3E%3Cpath d='M30 180 c0-40 30-65 70-65 s70 25 70 65' fill='%23faf6f1'/%3E%3C/svg%3E";

/**
 * Wrap helper to keep number in range [min, max)
 */
function wrap(min, max, v) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

/**
 * Skewed Carousel / Marquee (React Bits Pro inspired)
 * Continuous tilted horizontal scrolling cards with dynamic scroll velocity scaling
 */
export function SkewedCarousel({
  items = [],
  baseVelocity = -1.2,
  skewAngle = -4,
  className = ""
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState({});
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Transform scroll velocity into dynamic speed factor
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false
  });

  // Duplicate items to make an infinite seamless loop
  const duplicatedItems = [...items, ...items, ...items, ...items];

  // Calculate position loop using requestAnimationFrame via Framer Motion
  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 16);

    // If hovering, slow down to a crawl
    if (isHovered) {
      moveBy *= 0.15;
    } else {
      const extraVelocity = velocityFactor.get();
      if (Math.abs(extraVelocity) > 0.05) {
        moveBy += moveBy * Math.abs(extraVelocity) * 1.5;
      }
    }

    baseX.set(baseX.get() + moveBy);
  });

  // Modulo wrap to repeat smoothly across items
  // Total width of one set of items is approx items.length * 320px
  const setWidth = Math.max(1, items.length * 320);
  const x = useTransform(baseX, (v) => `${wrap(-setWidth, 0, v)}px`);

  const handleImageError = (id) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div
      className={`relative w-full overflow-hidden py-12 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: '1200px'
      }}
    >

      {/* Skewed Stage */}
      <motion.div
        className="w-full flex"
        style={{
          transformStyle: 'preserve-3d',
          transform: `skewY(${skewAngle}deg) rotateZ(${skewAngle * 0.5}deg)`
        }}
      >
        <motion.div
          className="flex gap-6 will-change-transform"
          style={{ x }}
        >
          {duplicatedItems.map((member, idx) => (
            <motion.div
              key={`${member.id}-${idx}`}
              whileHover={{
                scale: 1.05,
                y: -10,
                rotateZ: -skewAngle * 0.5,
                transition: { duration: 0.3, ease: 'easeOut' }
              }}
              className="group relative shrink-0 w-[270px] sm:w-[300px] h-[380px] sm:h-[420px] rounded-3xl bg-earth-900 border border-earth-200/90 hover:border-clay/80 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-end cursor-pointer"
            >
              {/* Card Photo */}
              <div className="absolute inset-0 overflow-hidden bg-earth-200">
                <img
                  src={imageErrorMap[member.id] ? FALLBACK_AVATAR : member.image}
                  alt={member.name}
                  onError={() => handleImageError(member.id)}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950/90 via-earth-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Card Information Overlay - Revealed only on hover */}
              <div className="relative z-10 p-6 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                <span className="text-[11px] font-mono text-clay-300 block uppercase tracking-widest font-semibold">
                  {member.role}
                </span>
                <h4 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mt-1">
                  {member.name}
                </h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default SkewedCarousel;
