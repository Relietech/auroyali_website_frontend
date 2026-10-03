import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function PageBanner({
  title,
  subtitle,
  breadcrumb,
  bgImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
  tag = "Auroville Architectural Practice"
}) {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 100]);
  const opacityText = useTransform(scrollY, [0, 400], [1, 0.4]);

  return (
    <div className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-earth-900 text-stone-100">
      <motion.div 
        style={{ y: yBg }} 
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover object-center opacity-30 scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950 via-earth-900/80 to-earth-900/60" />
      </motion.div>

      <motion.div 
        style={{ opacity: opacityText }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center space-x-2 text-xs uppercase tracking-widest text-stone-400 mb-4 font-mono"
        >
          <Link to="/" className="hover:text-clay transition-colors">Home</Link>
          <ChevronRight size={12} className="text-stone-500" />
          <span className="text-clay font-medium">{breadcrumb || title}</span>
        </motion.div>

        <div className="max-w-3xl">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block text-xs uppercase tracking-[0.25em] text-earth-300 font-medium mb-3"
          >
            {tag}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="h1-hero text-earth-50 tracking-tight leading-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="body-text text-stone-300 mt-6 font-light max-w-2xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
export default PageBanner;

