import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ShieldCheck, Flame, Leaf, Droplets } from 'lucide-react';

const materials = [
  {
    id: "cseb",
    name: "Compressed Stabilized Earth Blocks (CSEB)",
    category: "Structural Masonry",
    tagline: "Ultra-low embodied carbon & natural thermal inertia",
    description: "Pressed on-site using local subsoil, sand, and minimal lime/cement stabilizer. CSEB walls breathe naturally, dampening peak outdoor temperatures and radiating passive coolness indoors.",
    thermalBenefit: "Reduces indoor temperature fluctuations by 5-7°C",
    durability: "50+ Years Service Life",
    sustainability: "Near-zero carbon footprint",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "lime",
    name: "Hydraulic Lime & Mineral Plasters",
    category: "Breathable Surface Finishes",
    tagline: "Natural anti-bacterial and breathable wall skin",
    description: "Pure hydraulic lime cured naturally with atmospheric carbon dioxide. Unlike synthetic paints, lime plaster allows walls to absorb and release humidity, preventing mold while maintaining a velvety tactile sheen.",
    thermalBenefit: "Natural hygroscopic humidity regulator",
    durability: "Improves and calcifies with age",
    sustainability: "100% Non-toxic VOC-free",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "timber",
    name: "Seasoned Reclaimed Teak & Neem Hardwood",
    category: "Architectural Woodcraft",
    tagline: "Artisanal joinery with zero toxic chemical preservatives",
    description: "Ethically salvaged old country teak and seasoned local neem timber treated with natural borax-boric salts and finished with organic cold-pressed oils. Handcrafted by Auroville master carpenters.",
    thermalBenefit: "Warm tactile feel & natural acoustic absorption",
    durability: "Multi-generational heirloom endurance",
    sustainability: "100% Upcycled & Reclaimed",
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "jali",
    name: "Terracotta Jalis & Shading Louvers",
    category: "Bioclimatic Airflow",
    tagline: "Ventilating breeze screens & geometric light filtration",
    description: "Locally fired clay lattice screens that shield interiors from harsh glare while catching ocean trade winds and accelerating airflow through natural venturi action.",
    thermalBenefit: "Continuous cross-ventilation with 100% shade",
    durability: "Weather & salt-air resistant",
    sustainability: "Natural clay kiln-fired",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oxide",
    name: "Polished Red & Yellow Oxide Flooring",
    category: "Artisanal Floor Finishes",
    tagline: "Cool to the bare foot and silky mirror luster",
    description: "A traditional South Indian vernacular flooring crafted by master artisans through continuous water curing and hand buffing. It stays cool even in high summer heat.",
    thermalBenefit: "Cooling barefoot touch year-round",
    durability: "Seamless monolithic finish",
    sustainability: "Mineral pigments and zero plastics",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
  }
];

export function ArchitectureMaterials() {
  const [selectedMat, setSelectedMat] = useState(materials[0]);

  return (
    <section className="py-20 lg:py-28 bg-earth-900 text-stone-100 relative overflow-hidden border-b border-earth-800">
      
      {/* Subtle Blueprint grid overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-clay/20 text-clay font-mono text-xs uppercase tracking-widest font-semibold border border-clay/30">
            <Sparkles size={12} /> Tactile Vernacular Materiality
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
            Materials of Honest Ecological Substance
          </h2>
          <p className="text-stone-300 font-light text-base sm:text-lg leading-relaxed">
            We avoid artificial veneers and petroleum polymers. Our architecture relies on noble, earth-born materials that age gracefully and regulate microclimates naturally.
          </p>
        </div>

        {/* Interactive Material Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {materials.map((mat) => {
            const isSelected = selectedMat.id === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => setSelectedMat(mat)}
                className={`p-4 rounded-2xl text-left transition-all duration-300 border cursor-pointer ${
                  isSelected
                    ? 'bg-clay text-white border-clay shadow-lg scale-[1.03]'
                    : 'bg-earth-950/70 hover:bg-earth-800/80 text-stone-300 border-earth-800'
                }`}
              >
                <span className="text-[10px] font-mono uppercase tracking-wider block opacity-75">
                  {mat.category}
                </span>
                <h4 className="font-heading text-sm sm:text-base font-bold mt-1 line-clamp-1">
                  {mat.name.split('(')[0]}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Selected Material Showcase Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMat.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-earth-950 border border-earth-800 p-6 sm:p-8 lg:p-10 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Material Info (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs uppercase font-mono text-clay tracking-widest font-semibold block">
                    {selectedMat.category}
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">
                    {selectedMat.name}
                  </h3>
                  <p className="text-amber-200 font-heading text-lg italic mt-1">
                    &ldquo;{selectedMat.tagline}&rdquo;
                  </p>
                </div>

                <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed">
                  {selectedMat.description}
                </p>

                {/* 3 Metric Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-earth-900 border border-earth-800">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      Thermal Benefit
                    </span>
                    <span className="text-xs font-semibold text-white mt-0.5 block">
                      {selectedMat.thermalBenefit}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-earth-900 border border-earth-800">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      Durability
                    </span>
                    <span className="text-xs font-semibold text-earth-200 mt-0.5 block">
                      {selectedMat.durability}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-earth-900 border border-earth-800">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                      Ecological Standard
                    </span>
                    <span className="text-xs font-semibold text-sage mt-0.5 block">
                      {selectedMat.sustainability}
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Column: Material Visual (5 Cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl border-4 border-earth-800 group">
                  <img
                    src={selectedMat.image}
                    alt={selectedMat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono text-earth-300 bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-sm">
                      Authentic Auroville Vernacular
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

export default ArchitectureMaterials;
