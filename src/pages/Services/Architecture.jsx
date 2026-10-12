import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { PageBanner } from '../../components/common/PageBanner';
import { 
  Lightbulb, 
  Compass, 
  PenTool, 
  FileText, 
  Users, 
  HardHat, 
  Palette, 
  Trees, 
  Armchair, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const architecturalServices = [
  {
    step: "01",
    title: "Concept Development",
    icon: Lightbulb,
    description: "They work closely with clients to understand their needs, goals, and preferences. They develop initial design concepts and sketches, exploring various options and presenting them to the client for feedback and approval."
  },
  {
    step: "02",
    title: "Feasibility Studies",
    icon: Compass,
    description: "The architects assess the viability and potential of a project by conducting feasibility studies. This involves analyzing site conditions, zoning and building code requirements, environmental impact, and other factors that may affect the project's success."
  },
  {
    step: "03",
    title: "Design Development",
    icon: PenTool,
    description: "Once the concept is approved, architects proceed with the design development phase. They create detailed drawings, plans, and 3D models that illustrate the proposed design, including floor plans, elevations, sections, and other technical documentation."
  },
  {
    step: "04",
    title: "Construction Documentation",
    icon: FileText,
    description: "Architects prepare comprehensive construction documents that serve as a guide for builders and contractors. These documents include detailed drawings, specifications, and schedules, ensuring that the project is built according to the intended design."
  },
  {
    step: "05",
    title: "Discussion with Construction Team",
    icon: Users,
    description: "Our architects then explain the design and drawings to the project manager, site engineers, masons and other construction workers and make sure they deliver the clients' needs and interests."
  },
  {
    step: "06",
    title: "Construction Supervision",
    icon: HardHat,
    description: "During the construction phase, architects provide on-site supervision, monitor progress, and ensure that the construction aligns with the design intent. They review shop drawings, respond to contractor inquiries, conduct site visits, and address any design clarifications or modifications that may arise."
  }
];

const alliedServices = [
  {
    numeral: "01",
    id: "interior-design",
    title: "Interior Design",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    description: "Holistic spatial planning, mineral lime finishes, custom lighting, and bespoke interior styling tailored to elevate daily rituals.",
    bullets: [
      "Space Planning & Flow",
      "Material & Lime Finishes",
      "Custom Architectural Lighting"
    ]
  },
  {
    numeral: "02",
    id: "landscape-design",
    title: "Landscape Design",
    icon: Trees,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
    description: "Climate-responsive outdoor sanctuaries, native drought-tolerant flora, rainwater bioswales, and shaded courtyards integrated with nature.",
    bullets: [
      "Microclimate Courtyards",
      "Native Botanical Planning",
      "Rainwater Swales & Paving"
    ]
  },
  {
    numeral: "03",
    id: "furniture-design",
    title: "Furniture Design",
    icon: Armchair,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
    description: "Bespoke solid timber joinery, cane details, and custom architectural furniture handcrafted for heirloom durability and ergonomic comfort.",
    bullets: [
      "Custom Millwork & Joinery",
      "Reclaimed Teak & Hardwood",
      "Ergonomic Heirloom Pieces"
    ]
  }
];

// Single Allied Service Row Component with Scroll-Triggered Reveal & Parallax
function AlliedServiceRow({ service, index }) {
  const [imgError, setImgError] = useState(false);
  const rowRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isReversed = index % 2 === 1;
  const IconComp = service.icon;

  // Subtle Scroll Parallax on Image (disabled on reduced motion & mobile)
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"]
  });
  
  const parallaxY = useTransform(
    scrollYProgress, 
    [0, 1], 
    shouldReduceMotion ? [0, 0] : [18, -18]
  );

  return (
    <article
      ref={rowRef}
      className={`py-12 sm:py-16 md:py-20 border-b border-[#E8D9CC] last:border-b-0 overflow-hidden ${
        index % 2 === 1 ? 'bg-[#F3EBE1]' : 'bg-[#FAF6F1]'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 items-center">
          
          {/* Image Column (5 cols, max-w-[420px]) */}
          <div className={`md:col-span-5 lg:col-span-5 ${isReversed ? 'md:order-2' : 'md:order-1'}`}>
            <motion.div 
              style={{ y: parallaxY }} 
              className="group relative max-w-[420px] mx-auto md:mx-0 will-change-transform"
            >
              
              {/* Decorative Offset Frame (Draws in after reveal) */}
              {!shouldReduceMotion ? (
                <motion.div 
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  whileInView={{ 
                    opacity: 1, 
                    x: isReversed ? 12 : -12, 
                    y: 12 
                  }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className={`hidden md:block absolute inset-0 rounded-[6px] border border-[#B5472B]/50 pointer-events-none transition-transform duration-500 ease-out z-0 ${
                    isReversed 
                      ? 'group-hover:translate-x-4 group-hover:translate-y-4' 
                      : 'group-hover:-translate-x-4 group-hover:translate-y-4'
                  }`}
                  aria-hidden="true"
                />
              ) : (
                <div 
                  className={`hidden md:block absolute inset-0 rounded-[6px] border border-[#B5472B]/50 pointer-events-none z-0 ${
                    isReversed ? 'translate-x-3 translate-y-3' : '-translate-x-3 translate-y-3'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Main Image Container */}
              <figure className="relative z-10 aspect-[4/3] w-full rounded-[6px] overflow-hidden bg-[#E8D9CC] shadow-md group-hover:shadow-xl transition-shadow duration-500 m-0">
                
                {/* Sliding Curtain Cover Panel (scaleX: 1 to 0) */}
                {!shouldReduceMotion && (
                  <motion.div
                    initial={{ scaleX: 1 }}
                    whileInView={{ scaleX: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
                    style={{ transformOrigin: isReversed ? 'left' : 'right' }}
                    className={`absolute inset-0 z-30 pointer-events-none ${
                      index % 2 === 1 ? 'bg-[#F3EBE1]' : 'bg-[#FAF6F1]'
                    }`}
                    aria-hidden="true"
                  />
                )}

                {/* Scaled Image (settling from 1.3 to 1 over 1.4s) */}
                {!imgError ? (
                  <motion.img
                    src={service.image}
                    alt={`${service.title} - AuroYali Design Studio`}
                    loading="lazy"
                    onError={() => setImgError(true)}
                    initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.3 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                  />
                ) : (
                  /* Sand-colored gradient fallback with centered icon */
                  <div className="w-full h-full bg-gradient-to-br from-[#FAF6F1] via-[#F3EBE1] to-[#E8D9CC] flex flex-col items-center justify-center p-6 text-center text-[#6B5B52]">
                    <div className="w-14 h-14 rounded-full bg-white/80 shadow-inner flex items-center justify-center text-[#B5472B] mb-2">
                      <IconComp size={24} />
                    </div>
                    <span className="font-heading text-lg text-[#2A1A12] font-semibold">{service.title}</span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#B5472B] mt-1">Auroville Crafted</span>
                  </div>
                )}

                {/* Floating Top-Left Badge with Service Icon (pops in last at 0.9s) */}
                <motion.div 
                  initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-3.5 left-3.5 w-9 h-9 rounded-[6px] bg-white/95 backdrop-blur-sm text-[#B5472B] flex items-center justify-center shadow-md z-20 group-hover:bg-[#B5472B] group-hover:text-white transition-colors duration-300"
                  aria-hidden="true"
                >
                  <IconComp size={16} />
                </motion.div>
              </figure>
            </motion.div>
          </div>

          {/* Text Column with Choreographed Stagger Sequence */}
          <div className={`md:col-span-7 lg:col-span-7 relative space-y-4 md:space-y-5 ${isReversed ? 'md:order-1' : 'md:order-2'}`}>
            
            {/* 1. Outlined Serif Background Numeral (slides up 30px, delay 0.3s) */}
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 0.65, y: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 0.65, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-heading font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none select-none pointer-events-none -mb-5 sm:-mb-6 lg:-mb-8 text-transparent tabular-nums"
              style={{
                WebkitTextStroke: '1px rgba(181, 71, 43, 0.35)',
                fontVariantNumeric: 'lining-nums',
                fontFeatureSettings: '"lnum"'
              }}
              aria-hidden="true"
            >
              {service.numeral}
            </motion.div>

            {/* 2. Title Mask Reveal */}
            <div className="overflow-hidden">
              <motion.h3 
                initial={shouldReduceMotion ? { y: 0 } : { y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-2xl sm:text-3xl lg:text-[38px] font-semibold text-[#2A1A12] tracking-tight leading-tight"
              >
                {service.title}
              </motion.h3>
            </div>

            {/* 3. Description Fades Up */}
            <motion.p 
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-body font-light text-sm sm:text-base md:text-lg text-[#6B5B52] leading-relaxed md:leading-[1.8]"
            >
              {service.description}
            </motion.p>

            {/* 4. 3 Bullet Items Staggered by 120ms */}
            <ul className="space-y-2 pt-1 text-xs sm:text-sm md:text-base font-body text-[#2A1A12]">
              {service.bullets.map((bullet, idx) => (
                <motion.li 
                  key={idx} 
                  initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: shouldReduceMotion ? 0 : 0.6 + idx * 0.12, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  className="flex items-center gap-2.5"
                >
                  <motion.span 
                    initial={shouldReduceMotion ? { scale: 1 } : { scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ 
                      duration: 0.35, 
                      delay: shouldReduceMotion ? 0 : 0.6 + idx * 0.12, 
                      ease: "backOut" 
                    }}
                    className="w-4 h-4 rounded-full bg-[#B5472B]/10 text-[#B5472B] flex items-center justify-center shrink-0"
                  >
                    <Check size={11} className="stroke-[2.8]" />
                  </motion.span>
                  <span className="font-light">{bullet}</span>
                </motion.li>
              ))}
            </ul>

            {/* 5. 1px Thin Divider Line */}
            <motion.div 
              initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "left" }}
              className="w-full h-[1px] bg-[#E8D9CC] my-2"
              aria-hidden="true"
            />

            {/* 6. Outlined CTA Button with Arrow Nudge */}
            <motion.div 
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="pt-2"
            >
              <Link
                to="/contact"
                className="group/cta inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-[#B5472B] text-[#B5472B] hover:bg-[#B5472B] hover:text-white font-mono text-xs uppercase tracking-[0.12em] font-semibold transition-all duration-300 shadow-2xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5472B] focus-visible:ring-offset-2"
                aria-label={`Request ${service.title} Service`}
              >
                <span>Request Service</span>
                <motion.div
                  initial={{ x: 0 }}
                  whileInView={{ x: shouldReduceMotion ? 0 : [0, 6, 0] }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: 1.3, duration: 0.6, ease: "easeInOut" }}
                  className="inline-flex items-center"
                >
                  <ArrowRight 
                    size={14} 
                    className="stroke-[2.2] transform transition-transform duration-300 group-hover/cta:translate-x-1.5" 
                  />
                </motion.div>
              </Link>
            </motion.div>

          </div>

        </div>
      </div>
    </article>
  );
}

export function Architecture() {
  const shouldReduceMotion = useReducedMotion();
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCarouselScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, offsetWidth } = carouselRef.current;
      const index = Math.round(scrollLeft / (offsetWidth * 0.85));
      setActiveSlide(Math.min(Math.max(index, 0), architecturalServices.length - 1));
    }
  };

  const scrollToSlide = (idx) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85;
      carouselRef.current.scrollTo({
        left: idx * cardWidth,
        behavior: 'smooth'
      });
      setActiveSlide(idx);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: shouldReduceMotion ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="bg-[#FAF6F1] min-h-screen overflow-hidden text-[#2A1A12]">
      
      {/* 1. Header Banner with Parallax Background */}
      <PageBanner
        title="Architecture"
        subtitle="Creating both traditional and modern architecture with thorough planning and client-centric precision."
        breadcrumb="Architecture"
        bgImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
        tag="Services"
      />

      {/* 2. Overview / Ethos Section */}
      <section className="py-12 sm:py-16 md:py-24 border-b border-[#E8D9CC] relative bg-[#FAF6F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-16 items-center">
            
            {/* Left Content (7 Cols) */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
              className="lg:col-span-7 space-y-4 sm:space-y-6"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5472B]/10 text-[#B5472B] text-xs font-mono uppercase tracking-[0.15em] font-semibold">
                <Sparkles size={12} />
                <span>Our Approach</span>
              </motion.div>
              
              <motion.h2 
                variants={fadeInUp}
                className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2A1A12] leading-[1.22] sm:leading-tight"
              >
                Architectural Excellence Centered on Your Needs
              </motion.h2>

              <motion.p 
                variants={fadeInUp}
                className="font-body font-light text-[#6B5B52] text-sm sm:text-base md:text-lg leading-relaxed md:leading-[1.8]"
              >
                We put our full effort into creating the best architecture for our clients. We create both traditional and modern architecture. Our main priority is client&rsquo;s need. We carefully plan each and every step for the construction of our clients&rsquo; buildings. Client satisfaction is most important to us. We have a well trained team.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 pt-1 sm:pt-2"
              >
                {[
                  "Traditional & Modern Styles",
                  "Carefully Planned Step-by-Step",
                  "Client Satisfaction as Priority",
                  "Well Trained Professional Team"
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2.5 text-xs sm:text-sm font-body text-[#2A1A12] font-medium p-2.5 sm:p-3 rounded-xl bg-white/80 border border-[#E8D9CC] shadow-2xs hover:bg-white transition-colors"
                  >
                    <CheckCircle2 size={15} className="text-[#B5472B] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="pt-2 sm:pt-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#B5472B] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-[0.12em] transition-all shadow-md hover:shadow-lg hover:gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5472B]"
                >
                  <span>Inquire with Our Architects</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Image (5 Cols) */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeInUp}
              className="lg:col-span-5"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white bg-[#E8D9CC] aspect-[4/3] max-w-[420px] mx-auto group">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                  alt="AuroYali Architectural Studio"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A1A12]/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Architectural Services We Provide (The 6 Services: Mobile Carousel & Desktop Grid) */}
      <section className="py-12 sm:py-16 md:py-24 bg-white border-b border-[#E8D9CC] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainer}
            className="max-w-3xl mb-10 sm:mb-14 space-y-2 sm:space-y-3"
          >
            <motion.span variants={fadeInUp} className="text-xs font-mono uppercase tracking-[0.15em] text-[#B5472B] font-semibold block">
              Step-by-Step Process
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#2A1A12] leading-tight">
              Architectural services we provide:
            </motion.h2>
            <motion.p variants={fadeInUp} className="font-body font-light text-sm sm:text-base md:text-lg text-[#6B5B52]">
              Our architects guide your project with methodical attention to detail at each stage of design and construction.
            </motion.p>
          </motion.div>

          {/* Carousel on Mobile, Responsive Grid on Desktop */}
          <motion.div 
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={staggerContainer}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-4 sm:px-0 -mx-4 sm:mx-0 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {architecturalServices.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <motion.div
                  key={service.step}
                  variants={cardVariant}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="shrink-0 w-[84%] sm:w-[72%] md:w-auto snap-center group p-5 sm:p-6 md:p-8 rounded-2xl bg-[#FAF6F1]/80 hover:bg-white border border-[#E8D9CC] hover:border-[#B5472B]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-5 select-none"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#B5472B]/10 text-[#B5472B] group-hover:bg-[#B5472B] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-105">
                        <IconComp size={20} />
                      </div>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#6B5B52]/60 group-hover:text-[#B5472B] transition-colors">
                        {service.step}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-[#2A1A12] group-hover:text-[#B5472B] transition-colors">
                      {service.title}
                    </h3>

                    <p className="font-body font-light text-xs sm:text-sm md:text-base text-[#6B5B52] leading-relaxed sm:leading-[1.8]">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E8D9CC]/60 flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-[#6B5B52]/70 group-hover:text-[#B5472B] transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B5472B] opacity-60" />
                    <span>AuroYali Architectural Standard</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Mobile Dot Indicators */}
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-4">
            {architecturalServices.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx 
                    ? 'w-6 bg-[#B5472B]' 
                    : 'w-1.5 bg-[#E8D9CC] hover:bg-[#B5472B]/50'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. EDITORIAL ALTERNATING SHOWCASE: Allied Services with Choreographed Reveal */}
      <section className="bg-[#FAF6F1] border-b border-[#E8D9CC] relative">
        
        {/* Section Header (Centered) */}
        <div className="pt-14 sm:pt-20 md:pt-28 pb-8 sm:pb-12 md:pb-16 text-center max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3 sm:space-y-4"
          >
            {/* Eyebrow flanked by horizontal lines */}
            <div className="flex items-center justify-center gap-3 text-[#B5472B] text-xs font-mono uppercase tracking-[0.15em] font-semibold">
              <span className="w-6 sm:w-8 h-px bg-[#B5472B]/50" />
              <span>WHAT WE DO</span>
              <span className="w-6 sm:w-8 h-px bg-[#B5472B]/50" />
            </div>

            {/* Main Heading */}
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-semibold text-[#2A1A12] leading-tight tracking-tight">
              Our Design Services
            </h2>

            {/* One-line subtext in muted color */}
            <p className="font-body font-light text-sm sm:text-base md:text-lg text-[#6B5B52] max-w-[520px] mx-auto leading-relaxed">
              Comprehensive design disciplines crafted for architectural harmony.
            </p>
          </motion.div>
        </div>

        {/* Alternating Service Rows */}
        <div className="w-full">
          {alliedServices.map((service, index) => (
            <AlliedServiceRow 
              key={service.id} 
              service={service} 
              index={index} 
            />
          ))}
        </div>

        {/* Bottom Call to Action Banner */}
        <div className="py-12 sm:py-16 md:py-24 bg-[#FAF6F1]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 sm:p-8 md:p-14 rounded-2xl sm:rounded-3xl bg-[#2A1A12] text-white flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl border border-[#3D281D]"
            >
              <div className="space-y-2 sm:space-y-2.5 text-center md:text-left">
                <h3 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white">
                  Ready to Start Your Architectural Project?
                </h3>
                <p className="font-body font-light text-[#E8D9CC] text-xs sm:text-sm md:text-base max-w-xl">
                  Get in touch with our Auroville studio to discuss your site, design requirements, and construction timeline.
                </p>
              </div>

              <Link
                to="/contact"
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#B5472B] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-[0.12em] font-semibold transition-all shrink-0 shadow-lg hover:shadow-[#B5472B]/30 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Contact Us Today
              </Link>
            </motion.div>
          </div>
        </div>

      </section>

    </div>
  );
}

export default Architecture;
