import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';
import { Leaf, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1.0]
    }
  }
};

const floatOrb1 = {
  animate: {
    y: [0, -20, 0],
    x: [0, 15, 0],
    opacity: [0.35, 0.55, 0.35],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatOrb2 = {
  animate: {
    y: [0, 25, 0],
    x: [0, -20, 0],
    opacity: [0.25, 0.45, 0.25],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function Hero() {
  return (
    <section className="relative pt-20 sm:pt-24 md:pt-36 lg:pt-40 pb-6 sm:pb-10 md:pb-24 overflow-hidden bg-gradient-to-b from-earth-100/60 via-earth-50 to-earth-50">
      {/* Background Subtle Architectural Dot Matrix */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#2f1f13_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Ambient Animated Light Orbs */}
      <motion.div
        variants={floatOrb1}
        animate="animate"
        className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-clay/10 to-earth-300/15 rounded-full blur-3xl pointer-events-none -z-0"
      />
      <motion.div
        variants={floatOrb2}
        animate="animate"
        className="absolute bottom-10 right-20 w-[30rem] h-[30rem] bg-gradient-to-tr from-sage/15 to-earth-200/20 rounded-full blur-3xl pointer-events-none -z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Narrative / Headline (6 Cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-8 text-left"
          >
            {/* Tag Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-earth-200/80 border border-earth-300/80 text-earth-900 text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-mono shadow-sm hover:border-clay/50 transition-colors">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-clay opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-clay" />
                </span>
                <span>Auroville Ecological Construction &bull; Est. 2012</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
              <h1 className="h1-hero text-earth-900 tracking-tight leading-[1.08] sm:leading-[1.06]">
                Design.{' '}
                <span className="relative inline-block text-clay italic font-normal">
                  Build.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 right-0 h-[2px] sm:h-[3px] bg-gradient-to-r from-clay via-earth-500 to-clay origin-left rounded-full"
                  />
                </span>{' '}
                Handover.
              </h1>
              <p className="font-heading text-lg sm:text-xl md:text-2xl lg:text-3xl text-earth-700 font-normal leading-snug">
                Living earth sanctuaries crafted from the ground beneath your feet.
              </p>
            </motion.div>

            {/* Body Copy */}
            <motion.p
              variants={itemVariants}
              className="body-text text-stone-700 max-w-xl font-light text-sm sm:text-base md:text-lg leading-relaxed"
            >
              From soil testing and on-site CSEB manufacturing to master bioclimatic architecture and turnkey artisanal handover — we build carbon-negative homes in harmony with climate and nature.
            </motion.p>

            {/* Action Buttons: Clean Single Line on Mobile */}
            <motion.div variants={itemVariants} className="flex items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2 max-w-full">
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="shrink-0">
                <Button
                  to="/projects"
                  variant="clay"
                  size="sm"
                  className="px-4 py-2.5 sm:px-6 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-semibold tracking-wide sm:tracking-wider whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  <span className="inline sm:hidden">Portfolio</span>
                  <span className="hidden sm:inline">Explore Portfolio</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="shrink-0">
                <Button
                  to="/services/architecture"
                  variant="secondary"
                  size="sm"
                  className="px-4 py-2.5 sm:px-6 sm:py-3 text-[11.5px] sm:text-xs md:text-sm font-semibold tracking-wide sm:tracking-wider whitespace-nowrap shadow-sm hover:shadow-md"
                >
                  Our Process
                </Button>
              </motion.div>
            </motion.div>

            {/* Core Architectural Trust Pillars */}
            <motion.div
              variants={itemVariants}
              className="pt-5 sm:pt-8 border-t border-earth-200/80 grid grid-cols-3 gap-2 sm:gap-6 items-start"
            >
              <div className="group cursor-default">
                <span className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-earth-900 block leading-tight group-hover:text-clay transition-colors">
                  14+
                </span>
                <span className="text-[9px] sm:text-[11px] md:text-xs uppercase tracking-tight sm:tracking-wider text-stone-600 font-mono mt-0.5 sm:mt-1 block leading-tight">
                  Years Experience
                </span>
              </div>
              <div className="group cursor-default">
                <span className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-clay block leading-tight group-hover:scale-105 transition-transform origin-left">
                  100%
                </span>
                <span className="text-[9px] sm:text-[11px] md:text-xs uppercase tracking-tight sm:tracking-wider text-stone-600 font-mono mt-0.5 sm:mt-1 block leading-tight">
                  Natural Earth
                </span>
              </div>
              <div className="group cursor-default">
                <span className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-sage block leading-tight group-hover:scale-105 transition-transform origin-left">
                  -70%
                </span>
                <span className="text-[9px] sm:text-[11px] md:text-xs uppercase tracking-tight sm:tracking-wider text-stone-600 font-mono mt-0.5 sm:mt-1 block leading-tight">
                  Embodied Carbon
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Interactive 3D Low-Poly Earth House (6 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.215, 0.61, 0.355, 1.0] }}
            className="lg:col-span-6 relative"
          >
            <Hero3DCanvas />

            {/* Clean Feature Tag Below Canvas */}
            <div className="mt-2.5 sm:mt-4 flex items-center justify-between gap-2 text-[10px] sm:text-xs text-stone-500 font-mono px-1 sm:px-2">
              <span className="flex items-center gap-1 sm:gap-1.5 text-earth-800 shrink-0">
                <Leaf size={12} className="text-clay shrink-0 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Passive Solar &bull; Compressed Earth Block Masonry</span>
                <span className="sm:hidden">Passive Solar &bull; CSEB Masonry</span>
              </span>
              <span className="text-right shrink-0">
                <span className="hidden sm:inline">Auroville International Zone</span>
                <span className="sm:hidden">Auroville Zone</span>
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
export default Hero;
