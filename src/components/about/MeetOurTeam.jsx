import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Users, 
  Award, 
  HardHat, 
  Layers, 
  Coffee
} from 'lucide-react';
import { 
  MANAGEMENT_SECTION, 
  ADMINISTRATION_SECTION, 
  SITE_ENGINEERS_SECTION, 
  ARTISANS_SECTION, 
  CSEB_PRODUCTION_SECTION, 
  CARETAKERS_SECTION 
} from '../../data/teamData';
import { getStoredTeamData, subscribeToTeam } from '../../services/teamStore';
import { SkewedCarousel } from '../ui/SkewedCarousel';
import { Masonry } from '../ui/Masonry';
import { SpotlightCarousel } from '../ui/SpotlightCarousel';

const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' fill='%23e5d5c0'%3E%3Crect width='200' height='200' fill='%23d2b48c'/%3E%3Ccircle cx='100' cy='75' r='40' fill='%23faf6f1'/%3E%3Cpath d='M30 180 c0-40 30-65 70-65 s70 25 70 65' fill='%23faf6f1'/%3E%3C/svg%3E";

// Mobile Carousel for Artisans
function ArtisansMobileCarousel({ items, imageErrorMap, handleImageError }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef([]);
  const containerRef = useRef(null);

  // Track active card via IntersectionObserver without interrupting native swipe momentum
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6
      }
    );

    cardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToCard = (index) => {
    setActiveIndex(index);
    const target = cardRefs.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  };

  return (
    <div className="w-full">
      {/* Horizontal Carousel Track with Native Momentum Scroll-Snap */}
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-2 px-6 snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {items.map((artisan, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div
              key={artisan.id}
              data-index={idx}
              ref={(el) => (cardRefs.current[idx] = el)}
              onClick={() => scrollToCard(idx)}
              className={`group relative shrink-0 w-[270px] h-[380px] snap-center rounded-3xl bg-earth-900 border overflow-hidden flex flex-col justify-end select-none cursor-pointer transition-all duration-500 ease-out ${
                isActive 
                  ? 'border-clay/80 shadow-2xl scale-[1.02]' 
                  : 'border-earth-200/90 shadow-md opacity-80 scale-95'
              }`}
            >
              {/* Photo Background (Grayscale when inactive, Color when centered/active) */}
              <div className="absolute inset-0 overflow-hidden bg-earth-200">
                <img
                  src={imageErrorMap[artisan.id] ? FALLBACK_AVATAR : (artisan.image || artisan.img)}
                  alt={artisan.name}
                  onError={() => handleImageError(artisan.id)}
                  loading="lazy"
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    isActive 
                      ? 'grayscale-0 brightness-100 scale-105' 
                      : 'grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100'
                  }`}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-earth-950/95 via-earth-950/45 to-transparent opacity-90 transition-opacity duration-300"
                />
              </div>

              {/* Name and Role Overlay - Always visible normally */}
              <div className="relative z-10 p-5 text-white transition-all duration-300 ease-out">
                {artisan.role && (
                  <span className="text-xs font-mono text-clay-300 block uppercase tracking-wider font-semibold">
                    {artisan.role}
                  </span>
                )}
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight mt-0.5">
                  {artisan.name}
                </h4>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => scrollToCard(idx)}
            aria-label={`Go to artisan ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === idx
                ? 'w-7 h-2 bg-clay'
                : 'w-2 h-2 bg-earth-300 hover:bg-earth-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// 3D Tilt Card with Cursor Glare & Info Reveal for Administration
function AdminTiltCard({ admin, idx, isLeft, imageErrorMap, handleImageError }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt (max 6 degrees)
    const rotX = -((y - centerY) / centerY) * 6;
    const rotY = ((x - centerX) / centerX) * 6;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const delayOffset = idx * 0.12;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: isLeft ? -90 : 90 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ 
        type: "spring", 
        stiffness: 140, 
        damping: 20, 
        mass: 0.9,
        delay: delayOffset 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: isHovered ? -8 : 0,
        rotateX,
        rotateY,
        transformPerspective: 1000
      }}
      className="group relative rounded-3xl bg-earth-900 border border-earth-200/90 hover:border-clay/70 shadow-lg hover:shadow-[0_24px_50px_rgba(40,25,20,0.35)] transition-shadow duration-500 overflow-hidden h-80 sm:h-96 flex flex-col justify-end cursor-pointer select-none"
    >
      {/* Photo Curtain Wipe Wrapper */}
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ 
          duration: 1.1, 
          delay: 0.2 + delayOffset, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="absolute inset-0 overflow-hidden bg-earth-200"
      >
        {/* Image zooming from 1.15 down to 1.0 on entrance, and slowly to 1.05 on hover */}
        <motion.img 
          src={imageErrorMap[admin.id] ? FALLBACK_AVATAR : admin.image}
          alt={admin.name}
          onError={() => handleImageError(admin.id)}
          loading="lazy"
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1.0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ 
            scale: { duration: isHovered ? 0.8 : 1.3, ease: [0.22, 1, 0.36, 1] },
            duration: 1.3, 
            delay: 0.2 + delayOffset
          }}
          className="w-full h-full object-cover brightness-95 group-hover:brightness-105"
        />

        {/* Dynamic Gradient shift: grows taller and richer on hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-earth-950 via-earth-950/40 to-transparent transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-85'
          }`} 
        />

        {/* Cursor-following faint light glare */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, ${glarePos.opacity}), transparent 80%)`
          }}
        />
      </motion.div>

      {/* Member Details Overlay */}
      <div className="relative z-10 p-6 text-white transform transition-transform duration-300">
        {/* Role label with animated terracotta underline */}
        <div className="inline-block mb-1">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.05em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.18em' }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ 
              duration: 0.7, 
              delay: 0.75 + delayOffset, 
              ease: 'easeOut' 
            }}
            className="text-xs font-mono text-clay-300 block uppercase font-medium"
          >
            {admin.role}
          </motion.span>
          
          {/* Terracotta underline drawing under role on hover */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: isHovered ? '100%' : '0%' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="h-[1.5px] bg-clay rounded-full mt-0.5"
          />
        </div>

        {/* Masked name container: Rises from behind hidden line and slides up slightly on hover */}
        <div className="overflow-hidden">
          <motion.h4 
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            animate={{ y: isHovered ? -2 : 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ 
              duration: 0.8, 
              delay: 0.9 + delayOffset, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight"
          >
            {admin.name}
          </motion.h4>
        </div>
      </div>
    </motion.div>
  );
}

// Clean, elegant SubSectionHeader
function SubSectionHeader({ title }) {
  return (
    <div className="mb-4 sm:mb-8 max-w-3xl">
      <motion.h3
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-heading text-2xl sm:text-4xl font-bold text-earth-900 tracking-tight"
      >
        {title}
      </motion.h3>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="h-1 bg-clay rounded-full mt-2"
      />
    </div>
  );
}

// Earth-tone brick pattern divider
function SectionBrickDivider() {
  return (
    <div className="py-6 sm:py-20 flex items-center justify-center">
      <div className="w-full flex items-center gap-4 max-w-4xl opacity-50">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-earth-300 to-earth-400" />
        <div className="flex items-center gap-1.5 text-clay">
          <div className="w-2 h-2 rounded-sm bg-clay rotate-45" />
          <div className="w-3 h-3 rounded-sm bg-earth-600 rotate-45" />
          <div className="w-2 h-2 rounded-sm bg-sage rotate-45" />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-earth-300 to-earth-400" />
      </div>
    </div>
  );
}

export function MeetOurTeam() {
  const [teamState, setTeamState] = useState(() => getStoredTeamData());
  const [imageErrorMap, setImageErrorMap] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToTeam((updated) => {
      setTeamState(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleImageError = (id) => {
    setImageErrorMap(prev => ({ ...prev, [id]: true }));
  };

  // Safe fallback extractions
  const management = teamState?.management || MANAGEMENT_SECTION;
  const administration = teamState?.administration || ADMINISTRATION_SECTION;
  const siteEngineers = teamState?.siteEngineers || SITE_ENGINEERS_SECTION;
  const artisans = teamState?.artisans || ARTISANS_SECTION;
  const csebProduction = teamState?.csebProduction || CSEB_PRODUCTION_SECTION;
  const caretakers = teamState?.caretakers || CARETAKERS_SECTION;

  // Normalize site engineers list
  const siteEngineersList = Array.isArray(siteEngineers.members)
    ? siteEngineers.members
    : siteEngineers.member
    ? [siteEngineers.member]
    : [];

  return (
    <section className="py-12 sm:py-32 bg-earth-50 text-earth-950 relative overflow-hidden" id="meet-our-team">
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-clay/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-sage/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 mb-3 text-xs font-mono font-semibold tracking-[0.25em] text-clay uppercase"
          >
            <span className="w-5 h-[1.5px] bg-clay rounded-full" />
            <Users size={14} className="text-clay" />
            <span>The Human Spirit of AuroYali</span>
            <span className="w-5 h-[1.5px] bg-clay rounded-full" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-earth-900 tracking-tight"
          >
            Meet Our Team
          </motion.h2>

          <div className="flex justify-center mt-2.5">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 110 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
              className="h-1.5 bg-gradient-to-r from-clay via-earth-400 to-sage rounded-full"
            />
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="body-text mt-3 text-stone-600 font-light text-sm sm:text-lg leading-relaxed"
          >
            AuroYali unites architects, engineers, master soil scientists, and generational Tamil craftspeople in an inclusive guild dedicated to conscious earth construction.
          </motion.p>
        </div>

        {/* ======================================================== */}
        {/* 1. MANAGEMENT SECTION (LEADERSHIP) */}
        {/* ======================================================== */}
        <div id="team-management">
          <SubSectionHeader title="Leadership" />

          {/* Skewed Carousel for Leadership Team */}
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <SkewedCarousel 
              key={`mgmt-${(management.members || []).length}`}
              items={management.members || []} 
              skewAngle={-3.5} 
              baseVelocity={-1.2} 
            />
          </div>
        </div>


        <SectionBrickDivider />


        {/* ======================================================== */}
        {/* 2. ADMINISTRATION SECTION */}
        {/* ======================================================== */}
        <div id="team-administration">
          <SubSectionHeader title="Administration" />

          {/* Symmetrical Converging Cards with 3D Tilt, Curtain Reveal & Info Reveal */}
          <div className={`grid grid-cols-1 ${(administration.members || []).length > 1 ? 'sm:grid-cols-2' : ''} gap-6 max-w-3xl mx-auto overflow-hidden sm:overflow-visible`}>
            {(administration.members || []).map((admin, idx) => (
              <AdminTiltCard
                key={admin.id}
                admin={admin}
                idx={idx}
                isLeft={idx % 2 === 0}
                imageErrorMap={imageErrorMap}
                handleImageError={handleImageError}
              />
            ))}
          </div>
        </div>


        <SectionBrickDivider />


        {/* ======================================================== */}
        {/* 3. SITE ENGINEERS SECTION */}
        {/* ======================================================== */}
        <div id="team-site-engineers">
          <SubSectionHeader title="Site Engineers" />

          {/* Single Centered Spotlight Card or Grid for Multiple Site Engineers */}
          <div className={`mx-auto ${siteEngineersList.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl' : 'max-w-sm'}`}>
            {siteEngineersList.map((engineer) => (
              <motion.div
                key={engineer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative rounded-3xl bg-earth-900 border border-earth-200/90 hover:border-sage/70 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-80 sm:h-96 flex flex-col justify-end"
              >
                {/* Photo Background */}
                <div className="absolute inset-0 overflow-hidden bg-earth-200">
                  <img 
                    src={imageErrorMap[engineer.id] ? FALLBACK_AVATAR : (engineer.image || engineer.img)}
                    alt={engineer.name}
                    onError={() => handleImageError(engineer.id)}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-95 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/95 via-earth-950/45 to-transparent transition-opacity duration-300" />
                </div>

                {/* Member Name and Role Overlay - Always visible normally */}
                <div className="relative z-10 p-6 text-white transition-all duration-300 ease-out group-hover:-translate-y-1">
                  <span className="text-xs font-mono text-sage-300 block uppercase tracking-wider font-semibold">
                    {engineer.role || engineer.trade || 'Site Engineer'}
                  </span>
                  <h4 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight mt-0.5">
                    {engineer.name}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        <SectionBrickDivider />


        {/* ======================================================== */}
        {/* 4. ARTISANS SECTION */}
        {/* ======================================================== */}
        <div id="team-artisans">
          <SubSectionHeader title="Artisans" />

          {/* Mobile View: Interactive Artisans Carousel */}
          <div className="block md:hidden">
            <ArtisansMobileCarousel 
              items={artisans.members || []} 
              imageErrorMap={imageErrorMap} 
              handleImageError={handleImageError} 
            />
          </div>

          {/* Desktop & Tablet View: Staggered Masonry Layout */}
          <div className="hidden md:block relative -mx-2 sm:-mx-3">
            <Masonry 
              key={`artisans-${(artisans.members || []).length}`}
              items={artisans.members || []} 
              ease="power3.out"
              duration={0.6}
              stagger={0.06}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.96}
              blurToFocus={true}
            />
          </div>
        </div>


        <SectionBrickDivider />


        {/* ======================================================== */}
        {/* 5. CSEB PRODUCTION TEAM */}
        {/* ======================================================== */}
        <div id="team-cseb">
          <SubSectionHeader title="CSEB Production Team" />

          {/* Clean Group Image Card with Team Name */}
          <div className="max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative rounded-3xl bg-earth-900 border border-earth-200/90 hover:border-clay/60 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-80 sm:h-96 lg:h-[420px] flex flex-col justify-end"
            >
              {/* Photo Background */}
              <div className="absolute inset-0 overflow-hidden bg-earth-200">
                <img 
                  src={imageErrorMap['cseb'] ? FALLBACK_AVATAR : (csebProduction.image || csebProduction.img)} 
                  alt={csebProduction.name}
                  onError={() => handleImageError('cseb')}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 brightness-95 group-hover:brightness-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth-950/90 via-earth-950/30 to-transparent" />
              </div>

              {/* Team Name Overlay */}
              <div className="relative z-10 p-6 sm:p-8 text-white transform group-hover:-translate-y-1 transition-transform duration-300">
                <span className="text-xs font-mono text-clay-300 block uppercase tracking-wider font-medium">
                  {csebProduction.role}
                </span>
                <h4 className="font-heading text-2xl sm:text-4xl font-bold text-white leading-tight mt-0.5">
                  {csebProduction.name}
                </h4>
              </div>
            </motion.div>
          </div>
        </div>


        <SectionBrickDivider />


        {/* ======================================================== */}
        {/* 6. CARETAKERS SECTION */}
        {/* ======================================================== */}
        <div id="team-caretakers">
          <SubSectionHeader title="Caretakers" />

          {/* Scrolltide-Style Spotlight Carousel */}
          <div className="py-2">
            <SpotlightCarousel 
              key={`caretakers-${(caretakers.members || []).length}`}
              people={caretakers.members || []} 
              autoplayInterval={4000}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default MeetOurTeam;
