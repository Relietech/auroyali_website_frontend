import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { servicesData } from '../../data/services';
import { 
  Compass, 
  Layers, 
  Hammer, 
  Shield, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const icons = {
  Compass,
  Layers,
  Hammer,
  Shield
};

export function ServicesDropdown({ onClose }) {
  const [activeService, setActiveService] = useState(servicesData[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 pointer-events-auto"
    >
      <div className="w-[720px] bg-earth-50/95 backdrop-blur-2xl rounded-2xl p-5 shadow-[0_25px_60px_-15px_rgba(47,31,19,0.22)] border border-earth-300/60 transition-all">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-earth-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest font-mono font-semibold text-clay">
              Architectural Disciplines & Practices
            </span>
          </div>
          <span className="text-[11px] font-sans text-earth-600 font-light">
            Auroville • Ecological Master Building
          </span>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Left Column: 4 Services List (7 Cols) */}
          <div className="col-span-7 space-y-1.5">
            {servicesData.map((service) => {
              const IconComp = icons[service.icon] || Compass;
              const isSelected = activeService.id === service.id;

              return (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  onClick={onClose}
                  onMouseEnter={() => setActiveService(service)}
                  className={`group flex items-start gap-3 p-2.5 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-white shadow-sm border-earth-300/80'
                      : 'hover:bg-white/70 border-transparent'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-colors shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-clay text-white shadow-sm'
                        : 'bg-earth-200/60 text-earth-800 group-hover:bg-clay group-hover:text-white'
                    }`}
                  >
                    <IconComp size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-heading text-[16px] font-semibold leading-snug transition-colors ${
                          isSelected
                            ? 'text-clay'
                            : 'text-earth-900 group-hover:text-clay'
                        }`}
                      >
                        {service.title}
                      </h4>
                      <ArrowRight
                        size={13}
                        className={`text-clay transition-all duration-200 ${
                          isSelected
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-1 mt-0.5 font-light">
                      {service.shortDesc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Practice Spotlight (5 Cols) */}
          <div className="col-span-5">
            <div className="relative h-full min-h-[220px] rounded-xl overflow-hidden border border-earth-300/60 shadow-inner flex flex-col justify-between p-4 group">
              {/* Background Image */}
              <img
                src={activeService.heroImage}
                alt={activeService.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/95 via-earth-950/55 to-black/30" />

              {/* Spotlight Header Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider text-amber-200 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
                  <Sparkles size={10} /> Spotlight
                </span>
                {activeService.stats?.completed && (
                  <span className="text-[10px] font-mono text-stone-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                    {activeService.stats.completed} Projects
                  </span>
                )}
              </div>

              {/* Spotlight Content */}
              <div className="relative z-10 space-y-2 mt-auto">
                <h5 className="font-heading text-lg font-bold text-white leading-snug drop-shadow-sm">
                  {activeService.title}
                </h5>

                {activeService.features && activeService.features.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-200 font-light">
                    <CheckCircle2 size={11} className="text-clay shrink-0" />
                    <span className="line-clamp-1">{activeService.features[0]}</span>
                  </div>
                )}

                <Link
                  to={`/services/${activeService.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white bg-clay hover:bg-clay/90 px-3 py-1.5 rounded-lg transition-all shadow-sm group-hover:shadow hover:gap-2 mt-1"
                >
                  <span>Explore Practice</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bar */}
        <div className="mt-3.5 pt-3 border-t border-earth-200/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            <span>Zero-Carbon & Bioclimatic Architectural Unit</span>
          </div>
          <Link
            to="/services/architecture"
            onClick={onClose}
            className="text-clay font-medium hover:text-earth-900 transition-colors flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider"
          >
            <span>All Services</span>
            <ArrowRight size={12} />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}

export default ServicesDropdown;
