import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  DoorClosed, 
  Armchair, 
  LayoutGrid, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Eye, 
  Phone, 
  Sparkles, 
  Hammer, 
  Compass,
  CheckCircle2,
  Images,
  Layers,
  Filter,
  Maximize2
} from 'lucide-react';

/* ==========================================================================
   EDITABLE DATA STRUCTURE
   Replace images, titles, tags, and descriptions here.
   ========================================================================== */
export const carpentryCategories = [
  {
    id: 'doors-windows',
    number: '01',
    title: 'Doors and Windows',
    description: 'Custom handcrafted solid wood main entrance portals, foldable patio doors, and weather-sealed casements engineered for tropical durability and acoustic isolation.',
    layout: 'bento', // 1 large tile + 3 smaller tiles
    items: [
      {
        id: 'dw-1',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Lakshmi Training Centre',
        tag: 'Main Door',
        src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Lakshmi Training Centre Main Door - Solid Teak Craftsmanship'
      },
      {
        id: 'dw-2',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Asaithambi Residence',
        tag: 'Main Door',
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Asaithambi Residence Main Door - Vertical Timber Pivot'
      },
      {
        id: 'dw-3',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: "Karthik's Farmhouse",
        tag: 'Main Door',
        src: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
        alt: "Karthik's Farmhouse Main Door - Reclaimed Country Wood"
      },
      {
        id: 'dw-4',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Sudha Srinivasan',
        tag: 'Foldable Door',
        src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Sudha Srinivasan Residence Foldable Glazed Door'
      },
      {
        id: 'dw-5',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Solid Teak French Casement',
        tag: 'Casement Window',
        src: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=1000&q=80',
        alt: 'Solid Teak French Casement Window with Brass Fittings'
      },
      {
        id: 'dw-6',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Louvered Timber Shutter',
        tag: 'Ventilation Shutter',
        src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        alt: 'Tropical Louvered Timber Window Shutter'
      }
    ]
  },
  {
    id: 'furniture',
    number: '02',
    title: 'Furniture',
    description: 'Bespoke freestanding and built-in architectural furniture handcrafted with solid hardwoods, cured bamboo, and heirloom joinery that ages gracefully.',
    layout: 'split', // 1 featured large image + 2x2 grid
    items: [
      {
        id: 'fn-1',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Bamboo Furniture',
        tag: 'Lounge Collection',
        src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        alt: 'Bamboo Furniture Lounge Series'
      },
      {
        id: 'fn-2',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Seating Table',
        tag: 'Bespoke Seating',
        src: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80',
        alt: 'Handcrafted Seating Table and Bench'
      },
      {
        id: 'fn-3',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Table Design 01',
        tag: 'Dining Table',
        src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
        alt: 'Table Design 01 - Solid Timber Dining Series'
      },
      {
        id: 'fn-4',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Table Design 02',
        tag: 'Desk & Table',
        src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
        alt: 'Table Design 02 - Architectural Timber Desk'
      },
      {
        id: 'fn-5',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Handcrafted Credenza',
        tag: 'Cane & Teak Storage',
        src: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80',
        alt: 'Handcrafted Solid Teak Credenza with Cane Webbing'
      },
      {
        id: 'fn-6',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Sculptural Teak Lounge Chair',
        tag: 'Artisanal Seating',
        src: 'https://images.unsplash.com/photo-1580481077194-4d2216e2576b?auto=format&fit=crop&w=1000&q=80',
        alt: 'Sculptural Teak Lounge Chair with Natural Rattan Weave'
      },
      {
        id: 'fn-7',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Live-Edge Coffee Table',
        tag: 'Solid Timber Table',
        src: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80',
        alt: 'Live-Edge Solid Timber Coffee Table'
      },
      {
        id: 'fn-8',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Minimalist Bed Frame',
        tag: 'Bedroom Furniture',
        src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
        alt: 'Minimalist Solid Wood Platform Bed Frame'
      }
    ]
  },
  {
    id: 'wooden-interiors',
    number: '03',
    title: 'Wooden Interiors',
    description: 'Architectural interior millwork, acoustic fluted timber wall paneling, modular solid storage, and custom ceiling pergolas crafted in Auroville.',
    layout: 'grid',
    items: [
      {
        id: 'wi-1',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Acoustic Fluted Timber Cladding',
        tag: 'Wall Paneling',
        src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
        alt: 'Acoustic Fluted Timber Wall Paneling'
      },
      {
        id: 'wi-2',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Exposed Ceiling Rafters & Beams',
        tag: 'Ceiling Architecture',
        src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
        alt: 'Solid Wood Ceiling Rafters and Pergola'
      },
      {
        id: 'wi-3',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Modular Walk-In Wardrobe',
        tag: 'Custom Storage',
        src: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1000&q=80',
        alt: 'Bespoke Modular Wooden Wardrobe'
      },
      {
        id: 'wi-4',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Artisanal Hardwood Kitchen',
        tag: 'Custom Cabinetry',
        src: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
        alt: 'Handcrafted Solid Hardwood Kitchen Cabinetry'
      },
      {
        id: 'wi-5',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Perforated Timber Screen Partition',
        tag: 'Space Divider',
        src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
        alt: 'Handcrafted Architectural Wooden Screen Partition'
      }
    ]
  }
];

/* ==========================================================================
   1. HERO BANNER COMPONENT
   ========================================================================== */
function PageHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section 
      className="relative w-full min-h-[54vh] sm:min-h-[58vh] flex items-center justify-center overflow-hidden bg-[#2A1A12] text-[#FAF6F1]"
      aria-label="Carpentry Studio Hero"
    >
      {/* Background Image with Slow Ambient Zoom */}
      <motion.div 
        initial={{ scale: shouldReduceMotion ? 1 : 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=85"
          alt="AuroYali Woodcraft Workshop"
          className="w-full h-full object-cover object-center opacity-70"
        />
        {/* Balanced Cinematic Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A1A12]/95 via-[#2A1A12]/55 to-[#2A1A12]/35" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Breadcrumb */}
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.15em] text-[#E8D9CC]/75 mb-4"
        >
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={11} className="text-[#B5472B]" />
          <Link to="/services/architecture" className="hover:text-white transition-colors">Services</Link>
          <ChevronRight size={11} className="text-[#B5472B]" />
          <span className="text-[#B5472B] font-semibold">Carpentry</span>
        </motion.nav>

        {/* Eyebrow */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5472B]/20 border border-[#B5472B]/40 text-[#E8D9CC] text-xs font-mono uppercase tracking-[0.15em] font-semibold mb-3"
        >
          <Sparkles size={11} className="text-[#B5472B]" />
          <span>OUR CRAFT</span>
        </motion.div>

        {/* H1 Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-tight mb-4"
        >
          Carpentry
        </motion.h1>

        {/* One-line Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-body font-light text-sm sm:text-base md:text-lg text-[#E8D9CC] max-w-2xl leading-relaxed"
        >
          Bespoke architectural woodworking, heirloom solid timber joinery, and sustainable woodcraft rooted in Auroville.
        </motion.p>
      </div>
    </section>
  );
}

/* ==========================================================================
   2. STICKY CATEGORY NAVIGATION (IntersectionObserver Active Tracking + Auto-Scroll)
   ========================================================================== */
function CategoryNav({ categories, activeSection }) {
  const navRef = useRef(null);
  const buttonRefs = useRef({});
  const isFirstRender = useRef(true);

  // Automatically scroll the active tab pill into view horizontally without clipping
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const activeButton = buttonRefs.current[activeSection];
    const container = navRef.current;
    if (activeButton && container) {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      if (buttonRect.left < containerRect.left + 16 || buttonRect.right > containerRect.right - 16) {
        const scrollOffset = (buttonRect.left - containerRect.left) - (containerRect.width / 2) + (buttonRect.width / 2);
        container.scrollBy({
          left: scrollOffset,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSection]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // account for sticky nav height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[64px] sm:top-[70px] z-30 bg-[#FAF6F1]/95 backdrop-blur-md border-b border-[#E8D9CC] py-2.5 transition-shadow shadow-xs">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div 
          ref={navRef}
          className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-1"
        >
          <nav 
            aria-label="Carpentry Categories"
            className="flex items-center gap-2 sm:gap-3 w-max min-w-0 mx-auto px-3 sm:px-4"
          >
            {categories.map((cat) => {
              const isActive = activeSection === cat.id;
              return (
                <button
                  key={cat.id}
                  ref={(el) => (buttonRefs.current[cat.id] = el)}
                  type="button"
                  onClick={() => scrollToSection(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full font-mono text-xs uppercase tracking-[0.08em] sm:tracking-[0.12em] font-semibold transition-all duration-300 shrink-0 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5472B] focus-visible:ring-offset-2 ${
                    isActive
                      ? 'bg-[#B5472B] text-white shadow-sm'
                      : 'bg-white/90 text-[#6B5B52] hover:text-[#2A1A12] hover:bg-[#F3EBE1] border border-[#E8D9CC]'
                  }`}
                  aria-current={isActive ? 'true' : 'false'}
                >
                  <span className="whitespace-nowrap inline-block">{cat.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. GALLERY TILE COMPONENT (With Fast Image Fallback & Smooth Hover Zoom)
   ========================================================================== */
function GalleryTile({ item, index, onTileClick, className = '', isFeatured = false }) {
  const [imgSrc, setImgSrc] = useState(item.src);
  const [isFailed, setIsFailed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setImgSrc(item.src);
    setIsFailed(false);
  }, [item.src]);

  const handleImgError = () => {
    const fallbackSrc = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80';
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setIsFailed(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-[6px] overflow-hidden bg-[#2A1A12] border border-[#E8D9CC] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${className}`}
      onClick={() => onTileClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTileClick(item);
        }
      }}
      aria-label={`View ${item.title} - ${item.tag}`}
    >
      {/* Image Container with Absolute Fill & Smooth Hover Zoom */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#2A1A12]">
        {!isFailed ? (
          <img
            src={imgSrc}
            alt={item.alt || item.title}
            loading="lazy"
            onError={handleImgError}
            className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700 ease-out select-none"
          />
        ) : (
          /* Sand-colored gradient fallback with centered icon */
          <div className="w-full h-full bg-gradient-to-br from-[#FAF6F1] via-[#F3EBE1] to-[#E8D9CC] flex flex-col items-center justify-center p-6 text-center text-[#6B5B52]">
            <div className="w-12 h-12 rounded-full bg-white/85 shadow-inner flex items-center justify-center text-[#B5472B] mb-2">
              <Hammer size={22} />
            </div>
            <span className="font-heading text-lg font-semibold text-[#2A1A12]">{item.title}</span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5472B] mt-1">{item.tag}</span>
          </div>
        )}

        {/* Hover "View" Icon Circle */}
        <div className="absolute inset-0 bg-[#2A1A12]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full bg-white/95 text-[#2A1A12] flex items-center justify-center shadow-lg transform scale-80 group-hover:scale-100 transition-transform duration-300">
            <Eye size={18} className="text-[#B5472B]" />
          </div>
        </div>

        {/* Gradient Caption at Bottom */}
        {!isFailed && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2A1A12]/90 via-[#2A1A12]/50 to-transparent pt-14 pb-4 px-4 z-10 transition-transform duration-300">
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-[#E8D9CC]/90 mb-0.5">
              {item.tag}
            </span>
            <h3 className={`font-heading font-semibold text-white leading-snug ${
              isFeatured ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
            }`}>
              {item.title}
            </h3>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   4. TASTEFUL EMPTY STATE (For Upcoming Projects)
   ========================================================================== */
function EmptyState() {
  return (
    <div className="w-full relative rounded-2xl border-2 border-dashed border-[#B5472B]/40 bg-[#F3EBE1]/60 p-8 sm:p-14 text-center overflow-hidden">
      
      {/* Wood-grain subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #2A1A12 0, #2A1A12 1px, transparent 0, transparent 18px)`
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-md mx-auto space-y-4 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-[#B5472B]/10 text-[#B5472B] flex items-center justify-center shadow-inner">
          <Hammer size={26} className="stroke-[2.2]" />
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-[#2A1A12]">
          Projects coming soon
        </h3>

        <p className="font-body font-light text-sm sm:text-base text-[#6B5B52] leading-relaxed">
          Our studio is currently crafting bespoke acoustic timber paneling, ceiling pergolas, and modular cabinetry for upcoming architectural projects.
        </p>

        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B5472B] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-[0.12em] font-semibold transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5472B]"
          >
            <span>Request a Custom Interior</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. CATEGORY SECTION (Header with View All Action + Dynamic Responsive Layout)
   ========================================================================== */
function CategorySection({ category, index, onTileClick, onOpenCategoryGallery }) {
  const shouldReduceMotion = useReducedMotion();
  const hasItems = category.items && category.items.length > 0;

  return (
    <section
      id={category.id}
      className={`py-14 sm:py-20 md:py-24 border-b border-[#E8D9CC] last:border-b-0 ${
        index % 2 === 1 ? 'bg-[#F3EBE1]' : 'bg-[#FAF6F1]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 sm:mb-14 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-3xl">
              {/* Heading */}
              <motion.h2 
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2A1A12] leading-tight"
              >
                {category.title}
              </motion.h2>

              {/* 2-line Description */}
              <motion.p 
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-body font-light text-sm sm:text-base md:text-lg text-[#6B5B52] leading-relaxed mt-2"
              >
                {category.description}
              </motion.p>
            </div>

            {/* Category Level "View All" Button (Opens ONLY this category's collection) */}
            {hasItems && (
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="shrink-0 pt-2 md:pt-0"
              >
                <button
                  type="button"
                  onClick={() => onOpenCategoryGallery(category)}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full border border-[#B5472B]/40 hover:border-[#B5472B] bg-white hover:bg-[#B5472B] text-[#2A1A12] hover:text-white font-mono text-[10px] sm:text-xs uppercase tracking-[0.08em] sm:tracking-[0.14em] font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap group"
                >
                  <Images size={13} className="text-[#B5472B] group-hover:text-white transition-colors shrink-0" />
                  <span>View All {category.title} ({category.items.length})</span>
                  <ArrowRight size={12} className="text-[#6B5B52] group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Thin Divider Line */}
          <div className="w-full h-px bg-[#E8D9CC] mt-6" aria-hidden="true" />
        </div>

        {/* Dynamic Gallery or Empty State */}
        {hasItems ? (
          <div>
            {/* LAYOUT 1: ASYMMETRIC BENTO GRID (Doors & Windows) */}
            {category.layout === 'bento' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
                {/* 1 Large Tile (7 cols) */}
                <div className="md:col-span-7">
                  <GalleryTile
                    item={category.items[0]}
                    index={0}
                    onTileClick={(item) => onTileClick(item, category.items)}
                    isFeatured={true}
                    className="h-full min-h-[320px] md:min-h-[440px]"
                  />
                </div>

                {/* 3 Smaller Tiles (5 cols) */}
                <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5 sm:gap-6">
                  {category.items.slice(1, 4).map((item, idx) => (
                    <GalleryTile
                      key={item.id}
                      item={item}
                      index={idx + 1}
                      onTileClick={(it) => onTileClick(it, category.items)}
                      className="min-h-[190px] md:min-h-[135px]"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* LAYOUT 2: ALTERNATING SPLIT (Furniture) */}
            {category.layout === 'split' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                {/* 2x2 Grid on Left (6 cols) */}
                <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 order-2 md:order-1">
                  {category.items.slice(1, 5).map((item, idx) => (
                    <GalleryTile
                      key={item.id}
                      item={item}
                      index={idx}
                      onTileClick={(it) => onTileClick(it, category.items)}
                      className="min-h-[190px] sm:min-h-[200px]"
                    />
                  ))}
                </div>

                {/* Large Featured Image on Right (6 cols) */}
                <div className="md:col-span-6 order-1 md:order-2 flex flex-col">
                  <GalleryTile
                    item={category.items[0]}
                    index={0}
                    onTileClick={(it) => onTileClick(it, category.items)}
                    isFeatured={true}
                    className="w-full h-full min-h-[300px] md:min-h-[420px]"
                  />
                </div>
              </div>
            )}

            {/* LAYOUT 3: 4-TILE ARCHITECTURAL GRID */}
            {category.layout === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {category.items.slice(0, 4).map((item, idx) => (
                  <GalleryTile
                    key={item.id}
                    item={item}
                    index={idx}
                    onTileClick={(it) => onTileClick(it, category.items)}
                    className="min-h-[240px]"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <EmptyState />
        )}

      </div>
    </section>
  );
}

/* ==========================================================================
   6. CATEGORY GALLERY MODAL (Dedicated Gallery Grid For ONLY The Active Category)
   ========================================================================== */
function CategoryGalleryModal({ isOpen, onClose, onSelectTile, category }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !category) return null;

  const items = category.items || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#2A1A12]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${category.title} Gallery`}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl w-full bg-[#FAF6F1] rounded-2xl overflow-hidden shadow-2xl border border-[#E8D9CC] flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8D9CC] bg-[#FAF6F1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.15em] text-[#B5472B] font-semibold mb-1">
              <Images size={13} />
              <span>Category Portfolio</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-[#2A1A12]">
              {category.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#6B5B52] uppercase tracking-wider hidden sm:inline-block">
              {items.length} {items.length === 1 ? 'Photograph' : 'Photographs'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-[#B5472B] hover:text-white text-[#2A1A12] flex items-center justify-center transition-colors border border-[#E8D9CC] shadow-xs cursor-pointer ml-auto sm:ml-0"
              aria-label="Close Gallery"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Scrollable Responsive Image Grid (Only this category's items) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onClose();
                  onSelectTile(item, items);
                }}
                className="group relative rounded-lg overflow-hidden bg-[#2A1A12] border border-[#E8D9CC] aspect-[4/3] cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClose();
                    onSelectTile(item, items);
                  }
                }}
              >
                <img
                  src={item.src}
                  alt={item.alt || item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Hover overlay with eye icon */}
                <div className="absolute inset-0 bg-[#2A1A12]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white text-[#B5472B] flex items-center justify-center shadow-md">
                    <Maximize2 size={16} />
                  </div>
                </div>

                {/* Bottom caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2A1A12]/95 via-[#2A1A12]/60 to-transparent p-3 pt-8">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#E8D9CC]/90 block">
                    {item.tag}
                  </span>
                  <p className="font-heading text-sm font-semibold text-white truncate">
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 px-6 bg-[#FAF6F1] border-t border-[#E8D9CC] flex items-center justify-between">
          <span className="text-xs font-mono text-[#6B5B52]">
            Click any image to inspect in high resolution
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#2A1A12] hover:bg-[#B5472B] text-white font-mono text-xs uppercase tracking-[0.12em] font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   7. FULL LIGHTBOX MODAL (Category-Scoped Navigation & Thumbnails)
   ========================================================================== */
function Lightbox({ activeItem, allItems, onClose, onNavigate, onSelectTile, onOpenCategoryGallery }) {
  const currentIndex = allItems.findIndex(i => i.id === activeItem.id);
  const touchStartX = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onNavigate('prev');
    if (e.key === 'ArrowRight') onNavigate('next');
  }, [onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) onNavigate('next');
    if (diffX < -50) onNavigate('prev');
    touchStartX.current = null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#2A1A12]/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox Preview"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full bg-[#FAF6F1] rounded-2xl overflow-hidden shadow-2xl border border-[#E8D9CC] flex flex-col max-h-[95vh]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8D9CC] bg-[#FAF6F1]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#B5472B] font-semibold">
              {currentIndex >= 0 ? currentIndex + 1 : 1} / {allItems.length}
            </span>
            {activeItem.categoryTitle && (
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#F3EBE1] text-[#6B5B52] text-[10px] font-mono uppercase tracking-wider">
                {activeItem.categoryTitle}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCategoryGallery(activeItem.categoryId);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#B5472B] hover:text-white text-[#2A1A12] text-xs font-mono uppercase tracking-wider transition-colors border border-[#E8D9CC] cursor-pointer"
              title="View all photographs in this category"
            >
              <LayoutGrid size={13} />
              <span className="hidden sm:inline">{activeItem.categoryTitle || 'Category'} Grid</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-[#B5472B] hover:text-white text-[#2A1A12] flex items-center justify-center transition-colors border border-[#E8D9CC] cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Image Viewport */}
        <div className="relative flex-1 min-h-[280px] max-h-[58vh] bg-[#2A1A12] flex items-center justify-center overflow-hidden">
          <img
            src={activeItem.src}
            alt={activeItem.alt || activeItem.title}
            className="max-h-full max-w-full object-contain select-none"
          />

          {/* Prev Arrow */}
          {allItems.length > 1 && (
            <button
              type="button"
              onClick={() => onNavigate('prev')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#B5472B] text-white flex items-center justify-center transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Next Arrow */}
          {allItems.length > 1 && (
            <button
              type="button"
              onClick={() => onNavigate('next')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#B5472B] text-white flex items-center justify-center transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Interactive Thumbnail Carousel Strip (Scoped to this category) */}
        {allItems.length > 1 && (
          <div className="px-4 py-2.5 bg-[#2A1A12]/95 border-t border-[#3A2820] flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {allItems.map((item, idx) => {
              const isSelected = item.id === activeItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTile(item, allItems)}
                  className={`relative w-14 h-11 rounded overflow-hidden shrink-0 transition-all cursor-pointer ${
                    isSelected 
                      ? 'ring-2 ring-[#B5472B] scale-105 opacity-100' 
                      : 'opacity-50 hover:opacity-90'
                  }`}
                  aria-label={`Jump to image ${idx + 1}: ${item.title}`}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Caption Bar */}
        <div className="p-4 sm:p-5 bg-[#FAF6F1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E8D9CC]">
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-[#B5472B] font-semibold">
              {activeItem.tag}
            </span>
            <h4 className="font-heading text-xl sm:text-2xl font-semibold text-[#2A1A12]">
              {activeItem.title}
            </h4>
          </div>

          <Link
            to="/contact"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#B5472B] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-[0.12em] font-semibold transition-all shrink-0 shadow-sm"
          >
            <span>Inquire About This Work</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   8. BOTTOM CTA STRIP (Terracotta Accent Band)
   ========================================================================== */
function CtaStrip() {
  return (
    <section 
      className="py-14 sm:py-20 bg-[#B5472B] text-white relative overflow-hidden"
      aria-label="Carpentry Consultation Call to Action"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-6">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/30 text-white text-xs font-mono uppercase tracking-[0.15em] font-semibold">
          <Hammer size={12} />
          <span>Auroville Master Woodcraft</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-white max-w-2xl leading-tight">
          Have a custom woodwork idea?
        </h2>

        <p className="font-body font-light text-sm sm:text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
          From monumental solid teak entrance doors to heirloom dining tables and architectural interiors, our master carpenters bring your vision to life.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
          <Link
            to="/contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#B5472B] font-mono text-xs uppercase tracking-[0.12em] font-semibold transition-all duration-300 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Request a Quote
          </Link>

          <a
            href="tel:+918940000126"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white/90 hover:text-white font-mono text-xs uppercase tracking-[0.12em] transition-colors"
          >
            <Phone size={14} />
            <span>Call Us (+91 89400 00126)</span>
          </a>
        </div>

      </div>
    </section>
  );
}

/* ==========================================================================
   MAIN CARPENTRY PAGE COMPONENT
   ========================================================================== */
export function Carpentry() {
  const [activeSection, setActiveSection] = useState(carpentryCategories[0].id);
  const [activeCategoryModal, setActiveCategoryModal] = useState(null);
  const [lightboxState, setLightboxState] = useState({
    activeItem: null,
    items: []
  });

  // Set up IntersectionObserver to update active pill tab on scroll
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    carpentryCategories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleOpenLightbox = (item, categoryItems) => {
    const contextItems = categoryItems || (
      carpentryCategories.find(c => c.id === item.categoryId)?.items || [item]
    );
    setLightboxState({
      activeItem: item,
      items: contextItems
    });
  };

  const handleCloseLightbox = () => {
    setLightboxState({
      activeItem: null,
      items: []
    });
  };

  const handleNavigateLightbox = (direction) => {
    const { activeItem, items } = lightboxState;
    if (!activeItem || items.length === 0) return;
    const currentIndex = items.findIndex(i => i.id === activeItem.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= items.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = items.length - 1;
    setLightboxState({
      activeItem: items[nextIndex],
      items
    });
  };

  const handleOpenCategoryGallery = (categoryOrId) => {
    const targetCategory = typeof categoryOrId === 'string'
      ? carpentryCategories.find(c => c.id === categoryOrId)
      : categoryOrId;
    setActiveCategoryModal(targetCategory || null);
  };

  const handleCloseCategoryGallery = () => {
    setActiveCategoryModal(null);
  };

  return (
    <div className="bg-[#FAF6F1] min-h-screen text-[#2A1A12]">
      
      {/* 1. HERO BANNER */}
      <PageHero />

      {/* 2. STICKY CATEGORY NAV */}
      <CategoryNav 
        categories={carpentryCategories} 
        activeSection={activeSection} 
      />

      {/* 3, 4, 5. CATEGORY SECTIONS (Doors & Windows, Furniture, Wooden Interiors) */}
      <main>
        {carpentryCategories.map((category, index) => (
          <CategorySection
            key={category.id}
            category={category}
            index={index}
            onTileClick={handleOpenLightbox}
            onOpenCategoryGallery={handleOpenCategoryGallery}
          />
        ))}
      </main>

      {/* 8. BOTTOM CTA STRIP */}
      <CtaStrip />

      {/* 6. CATEGORY GALLERY MODAL (Dedicated strictly to selected category) */}
      <AnimatePresence>
        {activeCategoryModal && (
          <CategoryGalleryModal
            isOpen={Boolean(activeCategoryModal)}
            onClose={handleCloseCategoryGallery}
            onSelectTile={handleOpenLightbox}
            category={activeCategoryModal}
          />
        )}
      </AnimatePresence>

      {/* 7. LIGHTBOX MODAL (Scoped strictly to selected category) */}
      <AnimatePresence>
        {lightboxState.activeItem && (
          <Lightbox
            activeItem={lightboxState.activeItem}
            allItems={lightboxState.items}
            onClose={handleCloseLightbox}
            onNavigate={handleNavigateLightbox}
            onSelectTile={handleOpenLightbox}
            onOpenCategoryGallery={handleOpenCategoryGallery}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

export default Carpentry;
