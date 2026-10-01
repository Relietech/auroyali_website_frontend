import React from 'react';
import { Button } from '../common/Button';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';
import { Leaf } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-earth-100/60 via-earth-50 to-earth-50">
      {/* Background Subtle Architectural Dot Matrix */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#2f1f13_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Narrative / Headline (6 Cols) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-earth-200/80 border border-earth-300/80 text-earth-900 text-xs uppercase tracking-widest font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
              <span>Auroville Ecological Construction &bull; Est. 2012</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="h1-hero text-earth-900 tracking-tight leading-[1.06]">
                Design. <span className="text-clay italic font-normal">Build.</span> Handover.
              </h1>
              <p className="font-heading text-2xl md:text-3xl text-earth-700 font-normal leading-snug">
                Living earth sanctuaries crafted from the ground beneath your feet.
              </p>
            </div>

            {/* Body Copy */}
            <p className="body-text text-stone-700 max-w-xl font-light text-base md:text-lg leading-relaxed">
              From soil testing and on-site CSEB manufacturing to master bioclimatic architecture and turnkey artisanal handover — we build carbon-negative homes in harmony with climate and nature.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button to="/projects" variant="clay" size="lg">
                Explore Portfolio
              </Button>
              <Button to="/services/architecture" variant="secondary" size="lg">
                Our Process
              </Button>
            </div>

            {/* Core Architectural Trust Pillars */}
            <div className="pt-8 border-t border-earth-200/80 grid grid-cols-3 gap-6">
              <div>
                <span className="font-heading text-3xl md:text-4xl font-bold text-earth-900 block">
                  14+
                </span>
                <span className="text-xs uppercase tracking-wider text-stone-600 font-mono mt-1 block">
                  Years Experience
                </span>
              </div>
              <div>
                <span className="font-heading text-3xl md:text-4xl font-bold text-clay block">
                  100%
                </span>
                <span className="text-xs uppercase tracking-wider text-stone-600 font-mono mt-1 block">
                  Natural Earth
                </span>
              </div>
              <div>
                <span className="font-heading text-3xl md:text-4xl font-bold text-sage block">
                  -70%
                </span>
                <span className="text-xs uppercase tracking-wider text-stone-600 font-mono mt-1 block">
                  Embodied Carbon
                </span>
              </div>
            </div>
          </div>

          {/* Right: Interactive 3D Low-Poly Earth House (6 Cols) */}
          <div className="lg:col-span-6 relative">
            <Hero3DCanvas />

            {/* Clean Feature Tag Below Canvas */}
            <div className="mt-4 flex items-center justify-between text-xs text-stone-500 font-mono px-2">
              <span className="flex items-center gap-1.5 text-earth-800">
                <Leaf size={14} className="text-clay" />
                <span>Passive Solar &bull; Compressed Earth Block Masonry</span>
              </span>
              <span>Auroville International Zone</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
export default Hero;
