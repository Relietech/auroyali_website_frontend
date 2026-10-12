import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Images, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  TrendingUp, 
  Warehouse, 
  DoorOpen, 
  Armchair, 
  Building2,
  Calendar,
  MapPin,
  Flame
} from 'lucide-react';

/* ==========================================================================
   PROJECT GALLERY DATA
   ========================================================================== */
export const galleryProjects = [
  {
    id: 'p-1',
    title: "Alain Residence Architectural Compound Pivot Portal",
    category: 'Gates',
    location: 'Auroville',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Architectural Pivot Steel Gate',
    materials: 'Heavy Mild Steel, Zinc Undercoat, Weatherproof PU',
    desc: 'Monumental 3.8m high compound pivot entrance gate with concealed bearing pivot and integrated smart access automation.',
    icon: Shield,
    featured: true
  },
  {
    id: 'p-2',
    title: 'Helical Spiral Steel Staircase & Balustrade',
    category: 'Railings',
    location: 'Kottakarai',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    alt: 'Helical Spiral Steel Staircase',
    materials: 'Curved Steel Stringer, Reclaimed Teakwood Treads',
    desc: 'Custom laser-cut helical stringers supporting cantilevered solid teak treads with continuous welded handrails.',
    icon: TrendingUp,
    featured: false
  },
  {
    id: 'p-3',
    title: 'Silk Road Pavilion Reciprocal Roof Structure',
    category: 'Roofs',
    location: 'International Zone',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Reciprocal Steel Roof Truss Framing',
    materials: 'Hot-Dip Galvanized Steel, Tensile Stainless Rods',
    desc: 'Column-free courtyard canopy featuring reciprocal steel beam geometry and integrated tensile tie-rods for extreme weather resistance.',
    icon: Warehouse,
    featured: true
  },
  {
    id: 'p-4',
    title: 'Crittall Slim-Line French Doors & Glazed Partitions',
    category: 'Doors',
    location: 'Pondicherry',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Steel Frame Crittall French Doors',
    materials: 'Cold-Rolled Steel Profiles, Acoustic Laminated Glass',
    desc: 'Ultra-narrow sightline steel interior dividers and exterior French doors with multi-point perimeter compression seals.',
    icon: DoorOpen,
    featured: false
  },
  {
    id: 'p-5',
    title: 'Bespoke Blackened Steel & Live-Edge Timber Table',
    category: 'Furniture',
    location: 'Auroville Studio',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    alt: 'Welded Steel Base Dining Table',
    materials: '10mm Hot-Rolled Plate Steel, Beeswax Patina',
    desc: 'Sculptural steel dining table base with invisible mortise joinery connecting into sustainable local timber slab.',
    icon: Armchair,
    featured: false
  },
  {
    id: 'p-6',
    title: 'Earth-Block Anchored Seismic Moment Frame & Mezzanine',
    category: 'Structural',
    location: 'Kuiliapalayam',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Heavy Structural Steel Framing',
    materials: 'Universal Column / Beam Sections, High-Tensile Anchor Bolts',
    desc: 'Engineered steel mezzanine structure distributing floor loads across CSEB compressed earth brick piers without stress fractures.',
    icon: Building2,
    featured: false
  },
  {
    id: 'p-7',
    title: 'Corten Laser-Cut Geometric Privacy Screen & Wicket Door',
    category: 'Gates',
    location: 'Alankuppam',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Laser-Cut Corten Steel Gate',
    materials: '3mm Corten Weathering Steel, Natural Rust Patina',
    desc: 'Parametric geometric perforated screen panels allowing filtered ocean breeze while ensuring privacy and coastal durability.',
    icon: Shield,
    featured: false
  },
  {
    id: 'p-8',
    title: 'Marine-Grade Cable Wire Balustrade & Cantilever Balcony',
    category: 'Railings',
    location: 'East Coast Road',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
    alt: 'Stainless Cable Wire Balustrade',
    materials: '316 Marine Stainless Steel Cable, Blackened Stanchions',
    desc: 'High-tension cable balustrades engineered for coastal air resistance, minimal visual obstruction, and strict code compliance.',
    icon: TrendingUp,
    featured: false
  }
];

const CATEGORIES = ['All', 'Gates', 'Railings', 'Roofs', 'Doors', 'Furniture', 'Structural'];

/* ==========================================================================
   IMAGE COMPONENT WITH SHIMMER AND ON-ERROR FALLBACK
   ========================================================================== */
function GalleryImage({ src, alt, icon: IconComponent }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full bg-[#1F2421] overflow-hidden">
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-[#282D2A] animate-pulse flex items-center justify-center z-10">
          <div className="w-8 h-8 rounded-full border-2 border-[#E8782A]/30 border-t-[#E8782A] animate-spin" />
        </div>
      )}

      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#2B2B2B] via-[#202522] to-[#161917] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E8782A] mb-8 shadow-inner">
            {IconComponent ? <IconComponent size={30} /> : <Sparkles size={30} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   MAIN PROJECT GALLERY COMPONENT
   ========================================================================== */
export function MetalProjectGallerySection() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter projects
  const filteredProjects = selectedCategory === 'All'
    ? galleryProjects
    : galleryProjects.filter(item => item.category === selectedCategory);

  // Items to display (initial 6 or all)
  const visibleProjects = isExpanded ? filteredProjects : filteredProjects.slice(0, 6);

  // Category counts
  const getCategoryCount = (cat) => {
    if (cat === 'All') return galleryProjects.length;
    return galleryProjects.filter(p => p.category === cat).length;
  };

  // Keyboard navigation for Lightbox
  const handleKeyDown = useCallback((e) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') setLightboxIndex(null);
    if (e.key === 'ArrowLeft') {
      setLightboxIndex((prev) => (prev - 1 + filteredProjects.length) % filteredProjects.length);
    }
    if (e.key === 'ArrowRight') {
      setLightboxIndex((prev) => (prev + 1) % filteredProjects.length);
    }
  }, [lightboxIndex, filteredProjects.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section id="project-gallery" className="py-16 sm:py-24 bg-[#F7F0E8] border-b border-[#E5D5C0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ===================================================================
            1. SECTION HEADER & CATEGORY FILTERS
            =================================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/30 text-[#B5532F] text-[10px] sm:text-xs font-mono uppercase tracking-[0.14em] font-semibold mb-2.5 sm:mb-3">
              <Images size={12} />
              <span>PORTFOLIO SHOWCASE</span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2B2B2B] tracking-tight">
              Project Gallery
            </h2>
            <p className="font-body text-[#4A4F55] text-xs sm:text-base md:text-lg font-light mt-1.5 sm:mt-2">
              Explore bespoke architectural steel and ironcraft installations crafted in Auroville.
            </p>
          </div>

          {/* Filter Pills (Clean horizontal scroll without scrollbar) */}
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0 py-1 flex items-center gap-2">
            {CATEGORIES.map((category) => {
              const count = getCategoryCount(category);
              const isActive = selectedCategory === category;

              return (
                <motion.button
                  key={category}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsExpanded(false);
                  }}
                  aria-pressed={isActive}
                  className={`shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-sans text-[11px] sm:text-xs uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#B5532F] focus:ring-offset-2 ${
                    isActive
                      ? 'bg-[#B5532F] text-white shadow-md'
                      : 'bg-white text-[#4A4F55] hover:text-[#2B2B2B] border border-[#E5D5C0] hover:border-[#B5532F]/50 shadow-xs'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-mono transition-colors ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F7F0E8] text-[#7A4E38]'
                  }`}>
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>

        </motion.div>

        {/* ===================================================================
            2. BENTO & MASONRY GALLERY GRID (With Fluid Transitions)
            =================================================================== */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 auto-rows-[250px] sm:auto-rows-[300px]"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((item, index) => {
              const isBentoFeatured = item.featured && index % 3 === 0;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 16 }}
                  transition={{ 
                    duration: 0.45, 
                    delay: shouldReduceMotion ? 0 : (index % 4) * 0.08,
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className={`group relative rounded-2xl overflow-hidden border border-[#E5D5C0] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                    isBentoFeatured 
                      ? 'sm:col-span-2 lg:col-span-2 sm:row-span-2' 
                      : 'col-span-1 row-span-1'
                  }`}
                  onClick={() => setLightboxIndex(index)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.title} details`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLightboxIndex(index);
                    }
                  }}
                >
                  {/* Card Image */}
                  <GalleryImage 
                    src={item.image} 
                    alt={item.alt || item.title} 
                    icon={item.icon} 
                  />

                  {/* Top-Right Expand Icon Badge */}
                  <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                    <Maximize2 size={15} />
                  </div>

                  {/* Bottom Dark Gradient & Caption Always High-Contrast */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-6 pt-14 flex flex-col justify-end">
                    
                    {/* Category Pill & Location Badge */}
                    <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#E8782A] text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">
                        {item.category}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-sans text-white/80 flex items-center gap-1">
                        <MapPin size={10} className="text-[#E8782A]" />
                        <span>{item.location}</span>
                      </span>
                    </div>

                    {/* Project Title (Line-Clamp 2) */}
                    <h3 className="font-heading text-sm sm:text-base md:text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-[#F3E9DC] transition-colors">
                      {item.title}
                    </h3>

                    {/* Materials Subtitle */}
                    <p className="text-[11px] sm:text-xs font-sans text-white/70 line-clamp-1 mt-0.5 sm:mt-1 font-light">
                      {item.materials}
                    </p>

                    {/* Slide-Up "View Project" Action on Hover */}
                    <div className="mt-2 sm:mt-3 overflow-hidden h-0 group-hover:h-6 sm:group-hover:h-7 transition-all duration-300">
                      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-sans uppercase tracking-wider text-[#E8782A] font-bold">
                        <span>View Project</span>
                        <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* ===================================================================
            3. SECTION FOOTER ACTIONS (Load More & Start Project)
            =================================================================== */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          
          {filteredProjects.length > 6 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full sm:w-auto px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl border border-[#B5532F] text-[#B5532F] hover:bg-[#B5532F] hover:text-white font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#B5532F]"
            >
              {isExpanded ? 'Show Less' : `Load More Projects (${filteredProjects.length - 6} more)`}
            </button>
          )}

          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-[#E8782A] hover:bg-[#d4671e] text-white font-sans text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E8782A]"
          >
            <span>Start Your Custom Build</span>
            <ArrowRight size={14} />
          </Link>

        </div>

      </div>

      {/* ===================================================================
          4. ACCESSIBLE LIGHTBOX MODAL
          =================================================================== */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredProjects[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Project details modal"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#FAF6F1] rounded-2xl overflow-hidden shadow-2xl border border-[#E5D5C0] flex flex-col max-h-[92vh]"
            >
              {/* Lightbox Top Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5D5C0] bg-white">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#E8782A]">
                    {lightboxIndex + 1} / {filteredProjects.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F7F0E8] text-[#7A4E38] text-[11px] font-sans uppercase tracking-wider font-semibold border border-[#E8DEC8]">
                    {filteredProjects[lightboxIndex].category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close modal"
                  className="w-8 h-8 rounded-full bg-[#FAF6F1] hover:bg-[#B5532F] hover:text-white text-[#2B2B2B] flex items-center justify-center transition-colors border border-[#E5D5C0] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B5532F]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Main Image Display */}
              <div className="relative flex-1 min-h-[300px] max-h-[58vh] bg-stone-950 flex items-center justify-center overflow-hidden">
                <img
                  src={filteredProjects[lightboxIndex].image}
                  alt={filteredProjects[lightboxIndex].title}
                  className="max-h-full max-w-full object-contain select-none"
                />

                {/* Left / Right Navigation Buttons */}
                {filteredProjects.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredProjects.length) % filteredProjects.length)}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#E8782A] text-white flex items-center justify-center transition-colors shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8782A]"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredProjects.length)}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-[#E8782A] text-white flex items-center justify-center transition-colors shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E8782A]"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Lightbox Footer Details */}
              <div className="p-5 sm:p-6 bg-white border-t border-[#E5D5C0] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 text-xs font-sans text-[#7A4E38] mb-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-[#E8782A]" />
                      {filteredProjects[lightboxIndex].location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-[#E8782A]" />
                      {filteredProjects[lightboxIndex].year}
                    </span>
                  </div>
                  
                  <h4 className="font-heading text-xl sm:text-2xl font-bold text-[#2B2B2B]">
                    {filteredProjects[lightboxIndex].title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#4A4F55] font-normal leading-relaxed mt-1">
                    {filteredProjects[lightboxIndex].desc}
                  </p>
                  
                  <p className="text-xs text-[#7A4E38] font-medium mt-1">
                    Materials: <span className="text-[#2B2B2B]">{filteredProjects[lightboxIndex].materials}</span>
                  </p>
                </div>

                <Link
                  to="/contact"
                  onClick={() => setLightboxIndex(null)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#E8782A] hover:bg-[#d4671e] text-white font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#E8782A]"
                >
                  <span>Inquire About This Work</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

export default MetalProjectGallerySection;
