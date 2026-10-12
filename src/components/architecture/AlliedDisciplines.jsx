import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Trees, 
  Armchair, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Layers,
  Sun,
  Droplets,
  Hammer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const alliedServices = [
  {
    id: "interior-design",
    title: "Interior Design",
    category: "Spatial Cohesion & Tactile Harmony",
    icon: Palette,
    tagline: "Enhancing functionality, aesthetics, and creating a cohesive, restorative environment",
    description: "Our interior design practice focuses on creating spaces that soothe the senses. We carefully orchestrate space planning, natural color palettes, mineral lime finishes, acoustic comfort, bespoke lighting design, and customized built-ins that flow seamlessly with the building's architecture.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Natural lime plasters, red & yellow oxide floor finishes",
      "Ergonomic space planning and circulation zoning",
      "Circadian lighting design and glare-free architectural fixtures",
      "Custom storage niches, Kadappa stone shelving, and concealed utilities",
      "Tactile organic fabrics, linen drapery, and acoustic insulation"
    ],
    stats: { completion: "30+ Interiored Homes", highlight: "100% Non-Toxic VOC-Free Finishes" }
  },
  {
    id: "landscape-design",
    title: "Landscape Architecture",
    category: "Outdoor Spaces & Ecological Integration",
    icon: Trees,
    tagline: "Designing functional, living outdoor environments deeply integrated with nature",
    description: "Landscape architecture at AuroYali embraces native biodiversity, rainwater management, and microclimate cooling. From plant selection and bioswales to shaded courtyards, stone walkways, and serene water bodies, we create outdoor living sanctuaries that flourish effortlessly.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Indigenous, drought-tolerant subtropical plant selection",
      "Rainwater harvesting swales, reed-bed greywater filtration",
      "Permeable terracotta paving, Kadappa stone garden paths",
      "Shaded pergolas, bamboo trellis canopies, and courtyard cooling pools",
      "Integration of food-forest gardens and aromatic flora"
    ],
    stats: { completion: "25+ Landscape Projects", highlight: "100% Rainwater Retention" }
  },
  {
    id: "furniture-design",
    title: "Custom Furniture Design",
    category: "Bespoke Artisanal Wood & Metal Joinery",
    icon: Armchair,
    tagline: "Customizing heirloom furniture pieces tailored to client lifestyle and architecture",
    description: "Our master carpenters and metal craftsmen design bespoke furniture pieces that match the exact architectural language of your building. We conceptualize, prototype, and handcraft custom dining tables, daybeds, jali screens, and cabinetry using seasoned tropical hardwoods and bamboo.",
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Seasoned reclaimed teak, neem, and sustainable acacia timber",
      "Traditional mortise-and-tenon joinery with zero synthetic adhesives",
      "Borate-treated bamboo composite furniture and screen panels",
      "Hand-rubbed organic beeswax and cold-pressed linseed oil finishes",
      "Bespoke patinated brass and hand-forged blackened iron hardware"
    ],
    stats: { completion: "80+ Custom Sets", highlight: "Heirloom Durability" }
  }
];

export function AlliedDisciplines() {
  const [selectedId, setSelectedId] = useState(alliedServices[0].id);
  const activeService = alliedServices.find((s) => s.id === selectedId) || alliedServices[0];
  const IconComp = activeService.icon;

  return (
    <section id="allied-services" className="py-20 lg:py-28 bg-earth-100/60 relative overflow-hidden border-b border-earth-200/70">
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-clay/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-clay/10 text-clay font-mono text-xs uppercase tracking-widest font-semibold">
            <Sparkles size={12} /> Integrated Disciplines
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-earth-900 leading-tight">
            Allied Architectural Services
          </h2>
          <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
            Architecture doesn't end at the walls. We provide holistic interior, landscape, and custom furniture services to complete your spatial experience.
          </p>
        </div>

        {/* 3 Main Tab Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {alliedServices.map((service) => {
            const TabIcon = service.icon;
            const isSelected = selectedId === service.id;

            return (
              <button
                key={service.id}
                onClick={() => setSelectedId(service.id)}
                className={`p-5 rounded-2xl text-left transition-all duration-300 border flex items-start gap-4 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-clay/80 shadow-lg ring-2 ring-clay/20 scale-[1.02]'
                    : 'bg-white/70 hover:bg-white border-earth-200/80 shadow-xs text-stone-700'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? 'bg-clay text-white shadow-md' : 'bg-earth-200/80 text-earth-900'
                  }`}
                >
                  <TabIcon size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-clay font-semibold block">
                    {service.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-earth-900 mt-0.5">
                    {service.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Allied Service Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl bg-white border border-earth-200/90 p-6 sm:p-8 lg:p-12 shadow-xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Details (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-clay/10 text-clay flex items-center justify-center">
                    <IconComp size={20} />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-mono text-clay tracking-wider font-semibold">
                      Allied Service
                    </span>
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-earth-900">
                      {activeService.title}
                    </h3>
                  </div>
                </div>

                <p className="text-earth-900 font-heading text-lg sm:text-xl italic">
                  &ldquo;{activeService.tagline}&rdquo;
                </p>

                <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
                  {activeService.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-heading text-base font-bold text-earth-900 uppercase tracking-wider font-mono text-xs">
                    Scope of Work & Capabilities:
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {activeService.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm text-stone-700 font-light">
                        <CheckCircle2 size={16} className="text-clay shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Stats & CTA */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-earth-200">
                  <div className="flex items-center gap-4 text-xs font-mono text-stone-600">
                    <span className="px-3 py-1 rounded-full bg-earth-100 text-earth-900 font-semibold">
                      {activeService.stats.completion}
                    </span>
                    <span className="text-clay font-medium">
                      {activeService.stats.highlight}
                    </span>
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-earth-900 hover:bg-clay text-white text-xs font-mono uppercase tracking-wider transition-all shadow-sm"
                  >
                    <span>Request {activeService.title}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

              </div>

              {/* Right Column: Imagery (5 Cols) */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border-4 border-white bg-earth-200 group">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/70 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-clay bg-white/90 px-2.5 py-0.5 rounded-full font-bold">
                      Auroville Crafted
                    </span>
                    <p className="font-heading text-lg font-bold mt-1 text-white">
                      {activeService.title}
                    </p>
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

export default AlliedDisciplines;
