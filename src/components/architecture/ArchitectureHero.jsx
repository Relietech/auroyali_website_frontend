import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, ShieldCheck, Layers, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ArchitectureHero({ onExploreClick, onConsultClick }) {
  return (
    <section className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center bg-earth-950 text-white overflow-hidden pt-28 pb-16 lg:py-24">
      {/* Background Architectural Blueprint Grid & Gradient */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      {/* Background Image with Deep Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
          alt="AuroYali Bioclimatic Architecture"
          className="w-full h-full object-cover opacity-25 scale-105 transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-950 via-earth-950/85 to-earth-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950 via-transparent to-earth-950/70" />
      </div>

      {/* Decorative Architectural Accent Lines */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-clay/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sage/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag / Breadcrumb Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-mono tracking-wider text-earth-100"
            >
              <Compass size={14} className="text-clay animate-spin-slow" />
              <span>Auroville Architectural Practice</span>
              <span className="w-1 h-1 rounded-full bg-clay" />
              <span className="text-stone-300">Bioclimatic & Vernacular Design</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.12] tracking-tight text-white"
            >
              Architecture Tuned to <br />
              <span className="italic font-normal text-earth-200">Earth, Climate</span> &{' '}
              <span className="text-clay underline decoration-clay/40 underline-offset-8">
                Human Spirit
              </span>
            </motion.h1>

            {/* Subtitle / Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone-300 font-light text-base sm:text-lg max-w-2xl leading-relaxed"
            >
              At AuroYali, we blend traditional vernacular intelligence with contemporary architectural precision.
              Every building is conceived as a breathable, passive solar habitat crafted in deep harmony with the client's vision and site topography.
            </motion.p>

            {/* Core Pill Attributes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-2.5 pt-2"
            >
              {[
                { icon: Layers, label: "Concept to Turnkey Delivery" },
                { icon: ShieldCheck, label: "Auroville Ecological Standards" },
                { icon: Sparkles, label: "Integrated Interior & Landscape" },
                { icon: Award, label: "Passive Solar & CSEB Expertise" }
              ].map((pill, idx) => {
                const IconComponent = pill.icon;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-earth-900/80 border border-earth-800/80 text-xs text-stone-300 font-mono"
                  >
                    <IconComponent size={12} className="text-clay" />
                    <span>{pill.label}</span>
                  </span>
                );
              })}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <button
                onClick={onConsultClick}
                className="px-6 py-3.5 bg-clay hover:bg-clay/90 text-white rounded-full font-medium text-xs sm:text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-clay/30 flex items-center gap-2 group cursor-pointer"
              >
                <span>Book Architectural Consultation</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-full font-medium text-xs sm:text-sm uppercase tracking-widest transition-all backdrop-blur-sm cursor-pointer"
              >
                Explore 6-Step Process
              </button>
            </motion.div>

          </div>

          {/* Right Architectural Feature Card (5 Cols) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative rounded-3xl p-6 sm:p-8 bg-earth-900/80 border border-earth-700/60 backdrop-blur-xl shadow-2xl space-y-6"
            >
              {/* Studio Metadata Header */}
              <div className="flex items-center justify-between pb-4 border-b border-earth-800">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-clay block">
                    Architectural Studio
                  </span>
                  <h4 className="font-heading text-xl text-white font-semibold">
                    AuroYali Design Wing
                  </h4>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-300 bg-earth-800/80 px-2.5 py-1 rounded-full border border-earth-700">
                    <MapPin size={11} className="text-clay" /> Auroville, India
                  </span>
                </div>
              </div>

              {/* Architectural Image Snippet with Overlay */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-earth-700/80">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                  alt="AuroYali Residence"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="font-heading font-medium tracking-wide">
                    Passive Courtyard & CSEB Walls
                  </span>
                  <span className="text-[10px] font-mono text-earth-300 bg-black/60 px-2 py-0.5 rounded">
                    Turnkey Design
                  </span>
                </div>
              </div>

              {/* Fast Stats Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-earth-950/60 border border-earth-800/60 text-center">
                  <span className="font-heading text-2xl font-bold text-earth-100 block">45+</span>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    Completed Works
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-earth-950/60 border border-earth-800/60 text-center">
                  <span className="font-heading text-2xl font-bold text-clay block">100%</span>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    Custom Tailored
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-earth-950/60 border border-earth-800/60 text-center">
                  <span className="font-heading text-2xl font-bold text-earth-100 block">6</span>
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                    Defined Stages
                  </span>
                </div>
              </div>

              {/* Studio Promise Quote */}
              <p className="text-xs text-stone-400 italic leading-relaxed border-l-2 border-clay pl-3">
                &ldquo;We carefully plan each and every step for the construction of our clients&rsquo; buildings. Client satisfaction and ecological harmony are our greatest priorities.&rdquo;
              </p>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ArchitectureHero;
