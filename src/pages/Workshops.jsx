import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, HardHat, GraduationCap, Users, ArrowUpRight, ArrowRight, Mail, CheckCircle2, Sparkles, ChevronLeft, ChevronRight, ChevronDown, X, Maximize2 } from 'lucide-react';
import { 
  csebImage, 
  rammedEarthImage, 
  ferrocementImage, 
  bambooImage, 
  timbrelVaultImage, 
  bambooJoineryImage 
} from '../data/workshopImages';
import { workshopsData } from '../data/workshops';
import { WorkshopEnrollModal } from '../components/workshops/WorkshopEnrollModal';
import { 
  getStoredOfferedWorkshops, 
  subscribeToWorkshops,
  getStoredGalleryItems,
  subscribeToGallery,
  GALLERY_CATEGORIES
} from '../services/workshopStore';

const easeCubic = [0.25, 0.1, 0.25, 1];

// 5 Official Workshops from AuroYali Portfolio
const OFFERED_WORKSHOPS = [
  {
    id: "cseb-workshop",
    num: "01",
    title: "CSEB Workshop",
    tag: "Compressed Stabilised Earth Blocks",
    desc: "Hands-on experience in soil testing, stabilizer formulation, brick press production, and constructing load-bearing earth masonry arches and vaults.",
    image: csebImage,
    alt: "Compressed Stabilised Earth Blocks (CSEB)",
    modules: [
      "Soil Test and Mixing of Stabilizer",
      "Hands on Experience of Brick Production",
      "Learning Brick Masonry with different joints",
      "Making of Arches and Vaults",
      "Making Mud Mortar"
    ]
  },
  {
    id: "rammed-earth-workshop",
    num: "02",
    title: "Rammed Earth Workshop",
    tag: "Solid Earth Wall Engineering",
    desc: "A damp mix of subsoil, sand, and stabilizer is compacted inside precision formwork to create monolithic, high-thermal-mass load-bearing walls.",
    image: rammedEarthImage,
    alt: "Compacted layered Rammed Earth wall",
    modules: [
      "Soil Test and Mixing of Stabilizer",
      "Rammed Earth Foundation",
      "Assembling the Shutter / Formwork",
      "Techniques for Ramming",
      "Creating opening in the wall"
    ]
  },
  {
    id: "ferrocement-workshop",
    num: "03",
    title: "Ferro Cement Workshop",
    tag: "Thin-Shell Wire Mesh Architecture",
    desc: "Cement mortar reinforced with layers of continuous wire mesh produces lightweight, ductile, high-strength curved roofs, channels, and sculptures.",
    image: ferrocementImage,
    alt: "Ferrocement wire mesh reinforcement",
    modules: [
      "Understanding Ferro Cement as a Building Material",
      "Making of Ferro Cement Channel and Slab",
      "Experimenting Ferro Cement Structures"
    ]
  },
  {
    id: "timbrel-vault-workshop",
    num: "04",
    title: "Timbrel Vault Workshop",
    tag: "Self-Supporting Catalan Masonry",
    desc: "Parabolic and catenary vaulting structures built from thin, lightweight terracotta tiles that support themselves in pure compression without heavy formwork.",
    image: timbrelVaultImage,
    alt: "Timbrel vault parabolic masonry arches",
    modules: [
      "Understanding the structure & catenary thrust",
      "Theory on the technique",
      "Making of Frame Work & centering guides",
      "Constructing the Vault"
    ]
  },
  {
    id: "natural-plasters-workshop",
    num: "05",
    title: "Natural Plasters & Finishes",
    tag: "Lime Oxide & Breathable Finishes",
    desc: "Artisanal wall and flooring finishes combining aged slaked lime, natural earth plasters, mineral pigments, and seamless hand-cast oxide floors.",
    image: bambooJoineryImage,
    alt: "Natural Plasters, Lime Oxide & Oxide Flooring",
    modules: [
      "Natural earth plasters & clay renders",
      "Lime oxide & breathable wall finishes",
      "Seamless hand-cast oxide flooring",
      "Concrete finishes and stone polishing"
    ]
  }
];

// Who Joins Data
const WHO_JOINS = [
  {
    num: "01",
    icon: Ruler,
    title: "Architects",
    tag: "Design & Details",
    desc: "Deepen practical mastery of low-carbon materials, joinery details, and bioclimatic design principles."
  },
  {
    num: "02",
    icon: HardHat,
    title: "Engineers",
    tag: "Structural Mechanics",
    desc: "Understand compressive structural performance, optimal soil stabilizers, and thin-shell mechanics."
  },
  {
    num: "03",
    icon: GraduationCap,
    title: "Students",
    tag: "Live Site Lab",
    desc: "Bridge studio theory with hands-on tool time, physical construction prototypes, and live site builds."
  },
  {
    num: "04",
    icon: Users,
    title: "General Public",
    tag: "Self-Building",
    desc: "Learn self-building techniques for conscious homes and community-driven sustainable architecture."
  }
];

// Gallery Items
// Gallery Items with rich categories & captions
const GALLERY_ITEMS = [
  { 
    id: 1,
    title: "CSEB Pressing", 
    category: "earth",
    categoryLabel: "Earth Masonry",
    img: csebImage, 
    tall: false,
    caption: "Manual Auram press compaction of compressed stabilized earth blocks."
  },
  { 
    id: 2,
    title: "Rammed Earth", 
    category: "earth",
    categoryLabel: "Earth Masonry",
    img: rammedEarthImage, 
    tall: true,
    caption: "Layered monolithic earth wall compacted inside precision formwork."
  },
  { 
    id: 3,
    title: "Ferro Cement", 
    category: "vaults",
    categoryLabel: "Vaults & Shells",
    img: ferrocementImage, 
    tall: true,
    caption: "Curved ductile wire mesh armature coated with high-strength mortar."
  },
  { 
    id: 4,
    title: "Timbrel Vault", 
    category: "vaults",
    categoryLabel: "Vaults & Shells",
    img: timbrelVaultImage, 
    tall: false,
    caption: "Self-supporting parabolic Catalan masonry built without heavy formwork."
  },
  { 
    id: 5,
    title: "Natural Finishes", 
    category: "finishes",
    categoryLabel: "Natural Plasters",
    img: bambooJoineryImage, 
    tall: false,
    caption: "Aged slaked lime plaster and seamless hand-cast oxide flooring."
  },
  { 
    id: 6,
    title: "Bamboo Pavilion", 
    category: "bamboo",
    categoryLabel: "Bamboo Craft",
    img: bambooImage, 
    tall: false,
    caption: "Treated structural bamboo culms assembled in tensile parabolic form."
  },
  { 
    id: 7,
    title: "Lime Plaster Rendering", 
    category: "finishes",
    categoryLabel: "Natural Plasters",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", 
    tall: true,
    caption: "Multi-layered breathable lime and mineral clay render application."
  },
  { 
    id: 8,
    title: "Arch Masonry Bonding", 
    category: "earth",
    categoryLabel: "Earth Masonry",
    img: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80", 
    tall: false,
    caption: "Constructing catenary arches with optimized mud mortar interlocking joints."
  },
  { 
    id: 9,
    title: "Bamboo Node Joinery", 
    category: "bamboo",
    categoryLabel: "Bamboo Craft",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", 
    tall: false,
    caption: "Precision fish-mouth joinery with wooden dowels and bolted connections."
  },
  { 
    id: 10,
    title: "Catenary Vault Testing", 
    category: "vaults",
    categoryLabel: "Vaults & Shells",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", 
    tall: true,
    caption: "Live structural load verification and line-of-thrust analysis."
  }
];

// Community Pillars
const COMMUNITY_PILLARS = [
  {
    num: "01",
    name: "UNDERSTAND",
    text: "We explore the needs of people and communities in Auroville."
  },
  {
    num: "02",
    name: "BUILD TOGETHER",
    text: "We address them with our skills and the work of the trainees."
  },
  {
    num: "03",
    name: "SUPPORT",
    text: "Your work supports local communities while you gain skills."
  }
];

export function Workshops() {
  const [offeredWorkshops, setOfferedWorkshops] = useState(() => getStoredOfferedWorkshops());
  const [galleryItems, setGalleryItems] = useState(() => getStoredGalleryItems());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(workshopsData[0]);
  const [activeWhoJoinsIdx, setActiveWhoJoinsIdx] = useState(0);
  const [activeGalleryCat, setActiveGalleryCat] = useState('all');
  const [showAllMobileGallery, setShowAllMobileGallery] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const whoJoinsRef = useRef(null);

  // Subscribe to live workshops and gallery store changes from Admin
  useEffect(() => {
    const unsubWorkshops = subscribeToWorkshops((updated) => {
      setOfferedWorkshops(updated);
    });
    const unsubGallery = subscribeToGallery((updated) => {
      setGalleryItems(updated);
    });
    return () => {
      unsubWorkshops();
      unsubGallery();
    };
  }, []);

  const filteredGallery = activeGalleryCat === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeGalleryCat);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx((prev) => (prev + 1) % filteredGallery.length);
      if (e.key === 'ArrowLeft') setLightboxIdx((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, filteredGallery.length]);

  const handleOpenModal = (workshopInfo) => {
    if (workshopInfo) {
      const matched = workshopsData.find(w => w.id === workshopInfo.id) || workshopInfo;
      setSelectedWorkshop(matched);
    }
    setIsModalOpen(true);
  };

  const handleWhoJoinsScroll = () => {
    if (!whoJoinsRef.current) return;
    const { scrollLeft } = whoJoinsRef.current;
    const cardWidth = 290;
    const newIdx = Math.round(scrollLeft / cardWidth);
    setActiveWhoJoinsIdx(Math.min(WHO_JOINS.length - 1, Math.max(0, newIdx)));
  };

  const scrollToWhoJoins = (idx) => {
    if (!whoJoinsRef.current) return;
    const cardWidth = 290;
    whoJoinsRef.current.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth'
    });
    setActiveWhoJoinsIdx(idx);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2F1F13] font-body selection:bg-[#B5532F] selection:text-white overflow-x-hidden">
      
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Decorative Floating Arches (Bottom Right) */}
        <div 
          className="absolute -bottom-10 right-0 sm:right-6 lg:right-12 flex items-end gap-2 sm:gap-4 md:gap-5 opacity-20 sm:opacity-40 lg:opacity-60 pointer-events-none z-0"
          aria-hidden="true"
        >
          {/* Arch 1 - Clay */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: ['0px', '240px'] }}
            transition={{ duration: 1.2, ease: easeCubic, delay: 0.2 }}
            className="w-12 sm:w-20 md:w-32 bg-gradient-to-t from-[#B5532F]/20 to-[#B5532F]/5 rounded-t-full border-t border-l border-r border-[#B5532F]/30"
          />
          {/* Arch 2 - Terracotta */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: ['0px', '320px'] }}
            transition={{ duration: 1.4, ease: easeCubic, delay: 0.4 }}
            className="w-16 sm:w-24 md:w-36 bg-gradient-to-t from-[#C98A4B]/20 to-[#C98A4B]/5 rounded-t-full border-t border-l border-r border-[#C98A4B]/30"
          />
          {/* Arch 3 - Sage */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: ['0px', '180px'] }}
            transition={{ duration: 1.2, ease: easeCubic, delay: 0.6 }}
            className="w-12 sm:w-16 md:w-28 bg-gradient-to-t from-[#7A8B69]/20 to-[#7A8B69]/5 rounded-t-full border-t border-l border-r border-[#7A8B69]/30"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl">
          
          {/* Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeCubic }}
            className="mb-2 sm:mb-3"
          >
            <span className="text-[11px] sm:text-xs md:text-sm uppercase font-mono tracking-[0.18em] sm:tracking-[0.25em] md:tracking-[0.3em] text-[#B5532F] font-bold block leading-normal">
              Earth & Soil in Harmony with Construction
            </span>
          </motion.div>

          {/* Giant Gradient Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: easeCubic }}
            className="font-heading font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[8.5rem] 2xl:text-[9.5rem] uppercase tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-[#2F1F13] via-[#4D2F19] to-[#865430] select-none my-2 -ml-0.5 sm:-ml-1"
          >
            WORKSHOPS
          </motion.h1>

          {/* Official Tagline from Portfolio PDF */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: easeCubic }}
            className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-[#524336] max-w-3xl leading-relaxed mt-2 sm:mt-3 mb-6 sm:mb-7"
          >
            Various workshops conducted for young people, architects, engineers, and builders — teaching them to interact with earth and soil in harmony with the field of construction.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: easeCubic }}
            className="flex flex-row items-center gap-2 sm:gap-4 mb-2 max-w-none"
          >
            {/* Modal Trigger Pill "Enquire now" */}
            <button
              onClick={() => handleOpenModal(workshopsData[0])}
              className="group relative inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#B5532F] via-[#A04625] to-[#865430] text-white font-mono text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-bold shadow-[0_6px_16px_rgba(181,83,47,0.22)] hover:brightness-110 transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Enquire now</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform sm:w-[15px] sm:h-[15px]" />
            </button>

            {/* Button "See what we offer" */}
            <a
              href="#we-offer"
              className="group inline-flex items-center justify-center gap-1.5 sm:gap-2.5 px-3.5 sm:px-7 py-2.5 sm:py-3 rounded-full border border-[#2F1F13]/25 hover:border-[#B5532F] bg-white/90 hover:bg-white text-[#2F1F13] hover:text-[#B5532F] font-mono text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-bold shadow-xs hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>See what we offer</span>
              <span className="text-[#B5532F] group-hover:translate-y-0.5 transition-transform duration-300 font-bold">&darr;</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* =========================================================================
          2. INTRO SECTION (Warm Cream #F1E8DC, Rounded Top with Rich Animations)
          ========================================================================= */}
      <section className="bg-[#F1E8DC] text-[#2F1F13] rounded-t-[28px] sm:rounded-t-[36px] md:rounded-t-[40px] pt-8 sm:pt-12 pb-8 sm:pb-12 relative z-10 border-t border-[#E5D7C5] overflow-hidden">
        
        {/* Animated Ambient Floating Background Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Drifting Clay Orb */}
          <motion.div
            animate={{
              x: [0, 40, 0],
              y: [0, -30, 0],
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.28, 0.15]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#B5532F]/30 to-[#C98A4B]/10 blur-3xl"
          />
          {/* Drifting Sage Orb */}
          <motion.div
            animate={{
              x: [0, -35, 0],
              y: [0, 35, 0],
              scale: [1, 1.2, 1],
              opacity: [0.12, 0.25, 0.12]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-tl from-[#7A8B69]/30 to-[#B5532F]/10 blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headline + Animated Rotating Craft Seal */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: easeCubic }}
              className="lg:col-span-5 space-y-4 sm:space-y-6"
            >
              <div className="space-y-1.5 sm:space-y-2">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.2em] sm:tracking-[0.25em] text-[#B5532F] font-bold block"
                >
                  Our Philosophy
                </motion.span>
                <h2 className="font-heading font-black uppercase text-2xl sm:text-4xl md:text-5xl text-[#2F1F13] tracking-tight leading-[1.08]">
                  Skills that support communities
                </h2>
              </div>

              {/* Interactive Animated Badge / Craft Stamp */}
              <div className="flex items-center gap-3 sm:gap-4 pt-1">
                <div className="relative w-16 h-16 sm:w-22 sm:h-22 flex items-center justify-center shrink-0">
                  {/* Rotating Circular SVG Text */}
                  <motion.svg
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    viewBox="0 0 100 100"
                    className="w-full h-full select-none pointer-events-none"
                  >
                    <path
                      id="circlePath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="text-[9.5px] uppercase font-mono tracking-[0.22em] fill-[#B5532F] font-bold">
                      <textPath href="#circlePath" startOffset="0%">
                        • AUROVILLE EARTH CRAFT • COMMUNITY DRIVEN 
                      </textPath>
                    </text>
                  </motion.svg>

                  {/* Pulsing Center Icon */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E5D7C5] flex items-center justify-center text-[#B5532F] shadow-sm"
                  >
                    <Sparkles size={15} />
                  </motion.div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-[#2F1F13] uppercase tracking-wider block">
                    Living Architecture
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono text-[#7A6B5D] block">
                    Ecological & hands-on
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Staggered Animated Paragraphs + Highlighted Quote */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-3.5">
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15, ease: easeCubic }}
                className="text-sm sm:text-base font-normal text-[#4D3E33] leading-relaxed"
              >
                After many years of working with earth and other natural materials, AuroYali has refined techniques proven to be ecologically sound and wants them available to everyone.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.25, ease: easeCubic }}
                className="text-sm sm:text-base font-normal text-[#4D3E33] leading-relaxed"
              >
                Workshops run throughout the year to spread awareness and encourage eco-construction among architects, engineers, students and the general public.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35, ease: easeCubic }}
                className="text-sm sm:text-base font-normal text-[#4D3E33] leading-relaxed"
              >
                The workshops are community oriented: they explore what people and communities in Auroville need and meet those needs with our skills and the trainees' labour.
              </motion.p>

              {/* Highlighted Quote with Shimmer Bar & Hover Slide */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.45, ease: easeCubic }}
                whileHover={{ x: 6 }}
                className="mt-3 sm:mt-4 pt-1 transition-transform duration-300"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xs border border-[#E5D7C5] p-3.5 sm:p-5 shadow-sm">
                  {/* Glowing Animated Left Accent Line */}
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#B5532F] via-[#C98A4B] to-[#7A8B69]"
                  />
                  <blockquote className="pl-3 font-medium text-[#2F1F13] text-sm sm:text-base md:text-lg leading-snug">
                    “Joining a workshop builds your skills, and the work you do supports local communities.”
                  </blockquote>
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. WE OFFER SECTION (Warm Linen, Overlaps Section Above)
          ========================================================================= */}
      <section 
        id="we-offer"
        className="bg-[#FAF7F2] text-[#2F1F13] -mt-4 sm:-mt-6 rounded-t-[28px] sm:rounded-t-[36px] md:rounded-t-[40px] pt-8 sm:pt-12 pb-10 sm:pb-14 relative z-20 border-t border-[#E5D7C5] shadow-[0_-10px_30px_rgba(47,31,19,0.05)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: easeCubic }}
            className="mb-6 sm:mb-10"
          >
            <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.2em] sm:tracking-[0.25em] text-[#B5532F] font-bold block mb-1">
              Our Active Workshop Programs
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#2F1F13] via-[#4D2F19] to-[#865430]">
              We offer
            </h2>
          </motion.div>

          {/* Alternating Rows from What We Offer */}
          <div className="space-y-7 sm:space-y-10 md:space-y-12">
            {offeredWorkshops.map((workshop, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <motion.div
                  key={`${workshop.id}-${workshop.num}`}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.75, ease: easeCubic }}
                  className={`group grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-10 items-center ${
                    isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Image Column */}
                  <div className={`lg:col-span-6 ${isEven ? 'lg:col-start-7' : ''}`}>
                    <div className="relative h-56 sm:h-72 md:h-84 lg:h-[400px] w-full rounded-[22px] sm:rounded-[28px] overflow-hidden bg-[#F1E8DC] border border-[#E5D7C5] shadow-md">
                      <img
                        src={workshop.image}
                        alt={workshop.alt}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={`lg:col-span-6 space-y-2.5 ${isEven ? 'lg:col-start-1' : ''}`}>
                    
                    {/* Number & Tag */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <span className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-[#C98A4B]/50 to-[#B5532F]/80 leading-none select-none">
                        {workshop.num}
                      </span>
                      <span className="inline-block text-[10px] sm:text-xs uppercase font-mono tracking-[0.18em] sm:tracking-[0.25em] text-[#B5532F] font-bold">
                        {workshop.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3.5xl uppercase tracking-tight text-[#2F1F13] leading-snug">
                      {workshop.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm md:text-base font-light text-[#524336] leading-relaxed max-w-xl">
                      {workshop.desc}
                    </p>

                    {/* Portfolio Syllabus Checklist */}
                    {workshop.modules && (
                      <div className="pt-0.5 pb-0.5 space-y-1">
                        <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-[#B5532F] font-bold block">
                          Key Learning Modules:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] sm:text-xs font-mono text-[#4D3E33]">
                          {workshop.modules.map((m, mIdx) => (
                            <li key={mIdx} className="flex items-start gap-1.5">
                              <CheckCircle2 size={13} className="text-[#7A8B69] shrink-0 mt-0.5" />
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interactive "Enquire" Modal Trigger Pill */}
                    <div className="pt-1">
                      <button
                        onClick={() => handleOpenModal(workshop)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2 rounded-full border border-[#B5532F] text-[#B5532F] hover:bg-[#B5532F] hover:text-white font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 group/btn shadow-xs active:scale-95 cursor-pointer text-center"
                      >
                        <span>Enquire</span>
                        <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. WHO JOINS SECTION (Warm Light & Elevated Cards)
          ========================================================================= */}
      <section className="bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Heading & Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: easeCubic }}
          className="mb-6 sm:mb-8"
        >
          <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.2em] sm:tracking-[0.25em] text-[#B5532F] font-bold block mb-1">
            Open to All Backgrounds
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#2F1F13] via-[#4D2F19] to-[#865430]">
            Who joins
          </h2>
        </motion.div>

        {/* Mobile Carousel & Desktop Grid */}
        <div 
          ref={whoJoinsRef}
          onScroll={handleWhoJoinsScroll}
          className="flex overflow-x-auto snap-x snap-mandatory pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 gap-3.5 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 lg:gap-6 no-scrollbar"
        >
          {WHO_JOINS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: easeCubic }}
                className="w-[78vw] max-w-[285px] shrink-0 snap-center sm:w-auto sm:max-w-none group relative bg-white rounded-[22px] sm:rounded-[26px] p-5 sm:p-6 lg:p-7 border border-[#E5D7C5] shadow-sm hover:shadow-[0_20px_40px_rgba(47,31,19,0.08)] hover:border-[#B5532F]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Section: Icon + Tag */}
                <div className="relative z-10 space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#F1E8DC] border border-[#E5D7C5] flex items-center justify-center text-[#B5532F] group-hover:bg-[#B5532F] group-hover:text-white transition-all duration-300 shadow-xs">
                      <IconComponent size={20} />
                    </div>

                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider sm:tracking-widest text-[#B5532F] font-bold bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E5D7C5]">
                      {item.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-[#2F1F13] group-hover:text-[#B5532F] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-light text-[#524336] leading-relaxed mt-1.5 sm:mt-2">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Subtle Hover Gradient Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B5532F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Carousel Indicators */}
        <div className="flex sm:hidden items-center justify-center gap-1.5 pt-3">
          {WHO_JOINS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToWhoJoins(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeWhoJoinsIdx === idx ? 'w-6 bg-[#B5532F]' : 'w-1.5 bg-[#E5D7C5]'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

      </section>

      {/* =========================================================================
          5. GALLERY SECTION ("Created")
          ========================================================================= */}
      <section id="gallery" className="bg-[#FAF7F2] py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        
        {/* Section Header & Category Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: easeCubic }}
          >
            <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.2em] sm:tracking-[0.25em] text-[#B5532F] font-bold block mb-1">
              Gallery of Techniques & Work
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#2F1F13] via-[#4D2F19] to-[#865430]">
              Created
            </h2>
          </motion.div>

          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeCubic }}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar"
          >
            {GALLERY_CATEGORIES.map((cat) => {
              const isActive = activeGalleryCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveGalleryCat(cat.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#B5532F] text-white shadow-sm font-bold scale-102'
                      : 'bg-white/80 hover:bg-[#F1E8DC] text-[#524336] border border-[#E5D7C5]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Bento Grid: 2 cols mobile / 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[140px] sm:auto-rows-[170px] md:auto-rows-[200px] lg:auto-rows-[230px] gap-3 sm:gap-4 lg:gap-5">
          {filteredGallery.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease: easeCubic }}
              onClick={() => setLightboxIdx(idx)}
              className={`group relative rounded-[18px] sm:rounded-[22px] overflow-hidden bg-[#F1E8DC] border border-[#E5D7C5] shadow-sm cursor-pointer ${
                item.tall ? 'row-span-2' : 'row-span-1'
              } ${idx >= 4 && !showAllMobileGallery ? 'hidden md:block' : ''}`}
            >
              {/* Background Image with Zoom on Hover */}
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Subtle dark vignette overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

              {/* Top Right Zoom Icon on hover */}
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                <Maximize2 size={13} />
              </div>

              {/* Bottom Details & Caption */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-10 space-y-1 pointer-events-none">
                <span className="inline-block px-2 py-0.5 sm:px-2.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E5D7C5] text-[8px] sm:text-[10px] md:text-[11px] font-mono font-semibold text-[#2F1F13] tracking-wider uppercase shadow-xs">
                  {item.title}
                </span>
                <p className="text-[9px] sm:text-xs text-white/80 font-light line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile-only "View All" / "Show Less" Expand Toggle */}
        {filteredGallery.length > 4 && (
          <div className="flex md:hidden justify-center items-center pt-6">
            <button
              type="button"
              onClick={() => setShowAllMobileGallery(prev => !prev)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-[#F1E8DC] text-[#2F1F13] border border-[#E5D7C5] font-mono text-xs uppercase tracking-wider font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>
                {showAllMobileGallery ? 'Show Less' : `View All Photos (${filteredGallery.length})`}
              </span>
              <ChevronDown
                size={14}
                className={`transform transition-transform duration-300 ${
                  showAllMobileGallery ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}

      </section>

      {/* =========================================================================
          LIGHTBOX FULLSCREEN MODAL
          ========================================================================= */}
      <AnimatePresence>
        {lightboxIdx !== null && filteredGallery[lightboxIdx] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setLightboxIdx(null)}
          >
            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-[#1E1712] rounded-3xl overflow-hidden border border-[#524336] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#3D2E24] bg-black/40">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C98A4B] block">
                    {filteredGallery[lightboxIdx].categoryLabel} • {lightboxIdx + 1} of {filteredGallery.length}
                  </span>
                  <h3 className="font-heading text-lg sm:text-2xl font-bold uppercase tracking-wide text-white">
                    {filteredGallery[lightboxIdx].title}
                  </h3>
                </div>

                <button
                  onClick={() => setLightboxIdx(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#B5532F] text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close lightbox"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Main Image Container */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px] max-h-[60vh]">
                <img
                  src={filteredGallery[lightboxIdx].img}
                  alt={filteredGallery[lightboxIdx].title}
                  className="max-h-full max-w-full object-contain"
                />

                {/* Left / Right Nav Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
                  }}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#B5532F] text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIdx((prev) => (prev + 1) % filteredGallery.length);
                  }}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#B5532F] text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Caption Footer */}
              <div className="p-4 sm:p-5 border-t border-[#3D2E24] bg-black/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm font-mono text-[#E5D7C5]">
                  {filteredGallery[lightboxIdx].caption}
                </p>
                <button
                  onClick={() => {
                    setLightboxIdx(null);
                    handleOpenModal(workshopsData[0]);
                  }}
                  className="shrink-0 px-4 py-2 bg-[#B5532F] hover:bg-[#865430] text-white rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Inquire Workshop</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          6. COMMUNITY SECTION (Warm Cream #F1E8DC, Rounded Top)
          ========================================================================= */}
      <section className="bg-[#F1E8DC] text-[#2F1F13] rounded-t-[28px] sm:rounded-t-[36px] md:rounded-t-[40px] pt-8 sm:pt-12 pb-8 sm:pb-10 relative z-10 border-t border-[#E5D7C5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: easeCubic }}
            className="mb-6 sm:mb-8"
          >
            <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.2em] sm:tracking-[0.25em] text-[#B5532F] font-bold block mb-1">
              Rooted in Auroville
            </span>
            <h2 className="font-heading font-black uppercase text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2F1F13] tracking-tight leading-tight">
              Community
            </h2>
          </motion.div>

          {/* 3 Columns with top border */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-10 border-t border-[#2F1F13]/15 pt-5 sm:pt-6">
            {COMMUNITY_PILLARS.map((pillar, idx) => (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, delay: idx * 0.12, ease: easeCubic }}
                className="space-y-1.5 sm:space-y-2"
              >
                <span className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-[#2F1F13]/25 block leading-none select-none">
                  {pillar.num}
                </span>

                <h3 className="font-heading font-black text-lg sm:text-xl uppercase tracking-tight text-[#2F1F13]">
                  {pillar.name}
                </h3>

                <p className="text-xs sm:text-sm md:text-base font-light text-[#4D3E33] leading-relaxed">
                  {pillar.text}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          7. CTA BAND
          ========================================================================= */}
      <section className="bg-[#F1E8DC] pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeCubic }}
            className="rounded-[24px] sm:rounded-[36px] bg-gradient-to-br from-[#2F1F13] via-[#B5532F] to-[#865430] text-white p-5 sm:p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 border border-white/10"
          >
            <div className="space-y-1.5 sm:space-y-2 text-center md:text-left max-w-xl">
              <h3 className="font-heading font-black uppercase text-xl sm:text-2xl md:text-3xl lg:text-3.5xl text-white tracking-tight leading-tight">
                Join a workshop with us
              </h3>
              <p className="text-xs sm:text-sm md:text-base font-light text-white/90 leading-relaxed">
                Contact our coordinator at <a href="tel:+919585550709" className="underline font-mono text-[#FAF7F2] font-semibold">+91 9585550709</a> or email us to take part.
              </p>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => handleOpenModal(workshopsData[0])}
                className="w-full md:w-auto group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-3 rounded-full bg-white text-[#2F1F13] hover:bg-[#FAF7F2] font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-lg active:scale-95 cursor-pointer text-center"
              >
                <Mail size={15} className="text-[#B5532F]" />
                <span>Enquire with us</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Interactive Workshop Enquiry / Enrollment Modal */}
      <WorkshopEnrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedWorkshop={selectedWorkshop}
      />

    </div>
  );
}

export default Workshops;
