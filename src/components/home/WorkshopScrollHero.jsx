import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common/Button';
import './WorkshopScrollHero.css';

/**
 * NOTE: WorkshopScrollHero relies on `position: sticky`.
 * It must NOT sit inside any parent container with `overflow: hidden`,
 * as this will break sticky positioning and scroll synchronization.
 */

export const DEFAULT_WORKSHOP_DATA = {
  eyebrow: ['Auroville Green Practices', 'Upcoming Workshop'],
  title: 'Mastering Structural Bamboo: Joinery, Treatment & Tensile Design',
  description:
    'Immerse yourself in the science and craft of building with bamboo. Learn species selection, non-toxic borax preservation, fish-mouth cutting, steel bolt and dowel connections, and build a full-scale reciprocal dome structure.',
  facts: [
    { label: 'Duration', value: '5 Days Intensive Hands-On' },
    { label: 'Next Dates', value: '14 – 18 Nov 2026' },
    { label: 'Class Size', value: '18 Seats Max' },
  ],
  badge: 'Certification Included',
  primaryCta: { label: 'Register for workshop', href: '/workshops/bamboo' },
  secondaryCta: { label: 'See all courses', href: '/workshops' },
  image:
    'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1600&q=80',
};

const ArrowRightIcon = () => (
  <svg
    className="wsh-arrow-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);

function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export default function WorkshopScrollHero({ data = DEFAULT_WORKSHOP_DATA }) {
  const workshop = { ...DEFAULT_WORKSHOP_DATA, ...data };

  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);
  const slotRef = useRef(null);
  const photoCardRef = useRef(null);
  const photoImgRef = useRef(null);
  const introCaptionRef = useRef(null);
  const badgeRef = useRef(null);

  const [isDesktopMotion, setIsDesktopMotion] = useState(false);

  // Measure slot and animate on desktop scroll (>= 900px)
  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 900px) and (prefers-reduced-motion: no-preference)'
    );

    const updateMedia = () => setIsDesktopMotion(mq.matches);
    updateMedia();

    if (mq.addEventListener) {
      mq.addEventListener('change', updateMedia);
    } else {
      mq.addListener(updateMedia);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', updateMedia);
      } else {
        mq.removeListener(updateMedia);
      }
    };
  }, []);

  useEffect(() => {
    if (!isDesktopMotion) return;

    let slotBox = { left: 0, top: 0, width: 0, height: 0 };
    let stageBox = { width: 0, height: 0 };
    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = null;
    let isLoopRunning = false;

    const measure = () => {
      if (!stageRef.current || !slotRef.current) return;
      const stageRect = stageRef.current.getBoundingClientRect();
      const slotRect = slotRef.current.getBoundingClientRect();

      stageBox = {
        width: stageRect.width || window.innerWidth,
        height: stageRect.height || window.innerHeight,
      };
      slotBox = {
        left: slotRect.left - stageRect.left,
        top: slotRect.top - stageRect.top,
        width: slotRect.width,
        height: slotRect.height,
      };
      
      updateTargetProgress();
      renderFrame(currentProgress);
    };

    const renderFrame = (progress) => {
      if (!wrapperRef.current || !stageRef.current) return;

      const stW = stageBox.width || stageRef.current.clientWidth || window.innerWidth;
      const stH = stageBox.height || stageRef.current.clientHeight || window.innerHeight;

      // 1. Initial Intro Caption Overlay (0 -> 0.18)
      if (introCaptionRef.current) {
        const captionAlpha = clamp(1 - progress / 0.18, 0, 1);
        const captionTranslateY = (progress / 0.18) * -24;
        introCaptionRef.current.style.opacity = captionAlpha;
        introCaptionRef.current.style.transform = `translateY(${captionTranslateY}px)`;
        introCaptionRef.current.style.pointerEvents = captionAlpha > 0.05 ? 'auto' : 'none';
      }

      // 2. White Panel Fade In & Subtle Scale (0 -> 0.45)
      if (panelRef.current) {
        const panelAlpha = clamp(progress / 0.45, 0, 1);
        const panelScale = 0.96 + 0.04 * panelAlpha;
        panelRef.current.style.opacity = panelAlpha;
        panelRef.current.style.transform = `scale(${panelScale})`;
      }

      // 3. Floating Photo Box Transform (0 -> 0.50)
      if (photoCardRef.current && photoImgRef.current && stW > 0) {
        const t = clamp(progress / 0.5, 0, 1);
        const e = easeInOutCubic(t);

        const currentLeft = 0 + (slotBox.left - 0) * e;
        const currentTop = 0 + (slotBox.top - 0) * e;
        const currentWidth = stW + (slotBox.width - stW) * e;
        const currentHeight = stH + (slotBox.height - stH) * e;
        const currentRadius = 28 * e;
        const imgZoom = 1.08 - 0.08 * e;

        photoCardRef.current.style.transform = `translate3d(${currentLeft}px, ${currentTop}px, 0)`;
        photoCardRef.current.style.width = `${currentWidth}px`;
        photoCardRef.current.style.height = `${currentHeight}px`;
        photoCardRef.current.style.borderRadius = `${currentRadius}px`;
        photoCardRef.current.style.boxShadow = `0 ${24 * e}px ${48 * e}px -12px rgba(42, 26, 16, ${0.45 * e})`;
        photoCardRef.current.style.borderColor = `rgba(255, 255, 255, ${0.9 * e})`;

        photoImgRef.current.style.transform = `scale(${imgZoom})`;
      }

      // 4. Content Staggered Reveal via CSS Variable --r (0.35 -> 0.90)
      if (contentRef.current) {
        const r = clamp((progress - 0.35) / 0.55, 0, 1);
        contentRef.current.style.setProperty('--r', r.toString());
      }

      // 5. Certification Badge Reveal (0.82 -> 0.94)
      if (badgeRef.current) {
        const badgeProgress = clamp((progress - 0.82) / 0.12, 0, 1);
        const badgeScale = 0.85 + 0.15 * badgeProgress;
        const badgeY = (1 - badgeProgress) * 16;
        badgeRef.current.style.opacity = badgeProgress;
        badgeRef.current.style.transform = `translate3d(0, ${badgeY}px, 0) scale(${badgeScale})`;
      }
    };

    const loop = () => {
      const delta = targetProgress - currentProgress;
      currentProgress += delta * 0.14;

      if (Math.abs(delta) < 0.0004) {
        currentProgress = targetProgress;
        renderFrame(currentProgress);
        isLoopRunning = false;
        return;
      }

      renderFrame(currentProgress);
      rafId = requestAnimationFrame(loop);
    };

    const updateTargetProgress = () => {
      if (!wrapperRef.current) return;
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      const scrollDist = wrapperRect.height - window.innerHeight;
      targetProgress = clamp(-wrapperRect.top / Math.max(scrollDist, 1), 0, 1);

      if (!isLoopRunning) {
        isLoopRunning = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    window.addEventListener('scroll', updateTargetProgress, { passive: true });
    window.addEventListener('resize', measure);

    measure();
    const timer = setTimeout(measure, 100);

    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updateTargetProgress);
      window.removeEventListener('resize', measure);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDesktopMotion]);

  // Mobile View: Natural, smooth, high-end scroll card
  if (!isDesktopMotion) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-[#f6efe7] overflow-hidden" aria-label="Upcoming Bamboo Architecture Workshop">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_16px_50px_rgba(42,26,16,0.08)] border border-earth-200/80 space-y-4 sm:space-y-5"
          >
            {/* Top Photo Frame with Floating Badge */}
            <div className="relative w-full aspect-[16/10] max-h-[250px] rounded-2xl overflow-hidden border border-earth-200/80 shadow-sm bg-earth-900">
              <img
                src={workshop.image}
                alt={workshop.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/70 via-transparent to-transparent" />
              
              {/* Certification Badge */}
              <div className="absolute bottom-3 left-3 bg-earth-950/90 backdrop-blur-md text-white text-[10px] font-mono tracking-wider px-3 py-1 rounded-full border border-earth-700/70 shadow-md">
                {workshop.badge}
              </div>
            </div>

            {/* Workshop Details */}
            <div className="space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-[0.2em] font-semibold text-clay">
                <span>{workshop.eyebrow[0]}</span>
                <span className="w-1 h-1 rounded-full bg-clay" />
                <span>{workshop.eyebrow[1]}</span>
              </div>

              <h3 className="font-heading text-xl sm:text-2xl font-bold text-earth-900 leading-snug tracking-tight">
                {workshop.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                {workshop.description}
              </p>
            </div>

            {/* 3 Facts Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {workshop.facts.map((fact, idx) => (
                <div key={idx} className="bg-earth-50/90 border border-earth-200/80 rounded-xl p-2.5 text-center">
                  <span className="block font-mono text-[8.5px] uppercase tracking-wider text-stone-500 mb-0.5">
                    {fact.label}
                  </span>
                  <strong className="block font-sans text-[11px] sm:text-xs font-semibold text-earth-900 leading-tight">
                    {fact.value}
                  </strong>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <Button to={workshop.primaryCta.href} variant="clay" size="md" className="flex-1 text-xs py-2.5">
                Register
              </Button>
              <Button to={workshop.secondaryCta.href} variant="secondary" size="md" className="flex-1 text-xs py-2.5">
                All Courses
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`wsh-wrapper ${isDesktopMotion ? 'is-animated' : 'is-static'}`}
    >
      <section
        ref={stageRef}
        className="wsh-stage"
        aria-label="Upcoming Bamboo Architecture Workshop"
      >
        {/* Main Background Cream Panel with Inner White Card */}
        <div className="wsh-panel-shell">
          <div ref={panelRef} className="wsh-panel">
            <div className="wsh-grid">
              {/* Left Column: Workshop Details */}
              <div ref={contentRef} className="wsh-content">
                {/* 1. Eyebrow */}
                <div className="wsh-stagger wsh-eyebrow-wrap" style={{ '--d': '0.0' }}>
                  <span className="wsh-eyebrow">
                    {workshop.eyebrow[0]}
                    <span className="wsh-dot" aria-hidden="true" />
                    {workshop.eyebrow[1]}
                  </span>
                </div>

                {/* 2. Main Title */}
                <h2 className="wsh-stagger wsh-title" style={{ '--d': '0.12' }}>
                  {workshop.title}
                </h2>

                {/* 3. Description Paragraph */}
                <p className="wsh-stagger wsh-description" style={{ '--d': '0.24' }}>
                  {workshop.description}
                </p>

                {/* 4. Three Fact Info Boxes */}
                <ul className="wsh-stagger wsh-facts-list" style={{ '--d': '0.36' }}>
                  {workshop.facts.map((fact, idx) => (
                    <li key={idx} className="wsh-fact-card">
                      <span className="wsh-fact-label">{fact.label}</span>
                      <strong className="wsh-fact-value">{fact.value}</strong>
                    </li>
                  ))}
                </ul>

                {/* 5. CTA Action Buttons */}
                <div className="wsh-stagger wsh-actions" style={{ '--d': '0.48' }}>
                  <a
                    href={workshop.primaryCta.href}
                    className="wsh-btn wsh-btn-primary"
                  >
                    <span>{workshop.primaryCta.label}</span>
                    <ArrowRightIcon />
                  </a>

                  <a
                    href={workshop.secondaryCta.href}
                    className="wsh-btn wsh-btn-secondary"
                  >
                    <span>{workshop.secondaryCta.label}</span>
                    <ArrowRightIcon />
                  </a>
                </div>
              </div>

              {/* Right Column: Invisible Slot (Target Geometry) */}
              <div className="wsh-slot-column">
                <div ref={slotRef} className="wsh-slot" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Animated Photo Card (Pinned Stage Space) */}
        <div ref={photoCardRef} className="wsh-photo-card">
          <div className="wsh-photo-inner">
            <img
              ref={photoImgRef}
              src={workshop.image}
              alt=""
              className="wsh-photo-img"
            />

            {/* Initial Fullscreen Intro Caption (Scroll 0 -> 0.18) */}
            <div ref={introCaptionRef} className="wsh-intro-caption">
              <div className="wsh-intro-inner">
                <span className="wsh-intro-eyebrow">
                  {workshop.eyebrow[0]} &bull; {workshop.eyebrow[1]}
                </span>
                <p className="wsh-intro-title">Scroll to explore</p>
              </div>
            </div>
          </div>

          {/* Bottom-Left Overlapping Badge (Reveals at 0.82 -> 0.94) */}
          <div ref={badgeRef} className="wsh-badge">
            <span>{workshop.badge}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
