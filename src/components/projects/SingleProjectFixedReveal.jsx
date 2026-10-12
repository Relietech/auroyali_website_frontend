import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Compass, 
  Clock, 
  Maximize, 
  User, 
  Layers, 
  Hammer,
  Maximize2,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import './FixedImageRevealScroll.css';

/**
 * SingleProjectFixedReveal - Arkdes Studio Full-Screen Fixed Image Reveal
 * for Single Project View Details.
 * 
 * Shows all images of the project one-by-one in full-screen fixed windows
 * with the title, specifications, about narrative, and spatial photos.
 */
export function SingleProjectFixedReveal({ 
  project, 
  prevProject, 
  nextProject, 
  currentIndex = 0, 
  totalProjects = 1,
  onOpenLightbox,
  onOpenGridView
}) {
  if (!project) return null;

  const images = project.gallery && project.gallery.length > 0 
    ? project.gallery 
    : [project.heroImage];


  // Render mixed font weights for the title (light 300 / bold 700 / light 300)
  const renderTitle = () => {
    if (project.titleParts) {
      return (
        <>
          {project.titleParts.prefix && (
            <span className="title-prefix">{project.titleParts.prefix}</span>
          )}
          {project.titleParts.highlight && (
            <span className="title-highlight">{project.titleParts.highlight}</span>
          )}
          {project.titleParts.suffix && (
            <span className="title-suffix">{project.titleParts.suffix}</span>
          )}
        </>
      );
    }

    const title = project.title || "";
    const parts = title.split("-");
    if (parts.length > 1) {
      return (
        <>
          <span className="title-prefix">{parts[0].trim()} -</span>
          <span className="title-highlight">{parts.slice(1).join("-").trim()}</span>
        </>
      );
    }

    return <span className="title-highlight">{title}</span>;
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (window.lenis) {
      window.lenis.scrollTo(el, { duration: 1.1 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed-reveal-container" aria-label={`${project.title} Detailed Walkthrough`}>

      {/* Floating Top Control Bar */}
      <div className="fixed top-20 sm:top-24 left-0 right-0 z-30 pointer-events-none px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white text-xs font-mono uppercase tracking-wider backdrop-blur-md border border-white/15 transition-all shadow-md"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">All Projects</span>
          </Link>

          {images.length > 1 && onOpenGridView && (
            <button
              type="button"
              onClick={onOpenGridView}
              className="inline-flex items-center gap-2 px-4 py-1.5 sm:py-2 rounded-full bg-black/65 hover:bg-[#B5532F] text-white text-xs font-mono uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95"
              aria-label={`View all ${images.length} photos`}
            >
              <LayoutGrid size={13} className="text-clay-300" />
              <span>View All Photos ({images.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLIDE 1: IMAGE 1 — HERO TITLE & IDENTITY                                   */}
      {/* ========================================================================= */}
      <section className="fixed-reveal-section" id="section-hero" aria-label="Hero Title">
        <img
          src={images[0]}
          alt={`${project.title} - Overview`}
          className="fixed-reveal-image"
          loading="eager"
        />
        <div className="fixed-reveal-overlay" aria-hidden="true" />

        <div className="fixed-reveal-content">
          <div className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[60vw] max-w-4xl text-center text-white pointer-events-auto">
            
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-clay-200 mb-4 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10">
              <span>{project.category}</span>
              <span className="text-white/40">•</span>
              <span>{project.location}</span>
            </div>

            <h1 className="fixed-reveal-title !static !transform-none !w-full !p-0 mb-4">
              {renderTitle()}
            </h1>

            {project.subtitle && (
              <p className="text-sm sm:text-base md:text-lg text-stone-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md mb-6">
                {project.subtitle}
              </p>
            )}

            {/* Prominent Hero Action Buttons */}
            {images.length > 1 && onOpenGridView && (
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenGridView}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/30 text-white text-xs font-mono uppercase tracking-widest border border-white/25 backdrop-blur-md transition-all shadow-lg cursor-pointer hover:scale-105 active:scale-95"
                >
                  <LayoutGrid size={14} className="text-clay-300" />
                  <span>View All Photos ({images.length})</span>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('section-specs')}
            className="fixed-reveal-btn-wrap !top-[82%] flex flex-col items-center gap-2 cursor-pointer bg-transparent border-0 p-0 hover:opacity-80 transition-opacity"
            aria-label="Scroll to specifications"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-300 drop-shadow-sm flex items-center gap-1">
              Scroll to explore details & all images <ChevronDown size={14} className="animate-bounce" />
            </span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SLIDE 2: IMAGE 2 — PROJECT SPECIFICATIONS & DATA MATRIX                    */}
      {/* ========================================================================= */}
      <section className="fixed-reveal-section" id="section-specs" aria-label="Project Details">
        <img
          src={images[1] || images[0]}
          alt={`${project.title} - Details`}
          className="fixed-reveal-image"
          loading="lazy"
        />
        <div className="fixed-reveal-overlay !bg-black/40" aria-hidden="true" />

        <div className="fixed-reveal-content">
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[90vw] max-w-4xl max-h-[86svh] sm:max-h-[88vh] bg-black/75 sm:bg-black/60 backdrop-blur-xl border border-white/15 p-4 sm:p-7 md:p-10 rounded-2xl text-white pointer-events-auto shadow-2xl custom-specs-scrollbar flex flex-col justify-start"
          >
            
            <div className="border-b border-white/15 pb-2.5 sm:pb-4 mb-3.5 sm:mb-6 flex items-start sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-mono text-clay-300 block font-semibold">
                  Architectural Data Sheet
                </span>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl text-white font-light leading-tight">
                  Project Specifications
                </h2>
              </div>
              <span className="text-[11px] sm:text-xs font-mono text-stone-300 bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/10 shrink-0">
                02 / {String(images.length + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-xs font-mono">
              <div className="col-span-1">
                <span className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5 sm:mb-1 flex items-center gap-1.5">
                  <Compass size={12} className="text-clay-300 shrink-0 sm:w-[13px] sm:h-[13px]" /> Location:
                </span>
                <p className="text-white font-sans text-xs sm:text-sm font-medium leading-snug">
                  {project.location}
                </p>
              </div>

              <div className="col-span-1">
                <span className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5 sm:mb-1 flex items-center gap-1.5">
                  <Maximize size={12} className="text-clay-300 shrink-0 sm:w-[13px] sm:h-[13px]" /> Area:
                </span>
                <p className="text-white font-sans text-xs sm:text-sm font-medium leading-snug">
                  {project.area}
                </p>
              </div>

              {project.timeTaken && (
                <div className="col-span-1">
                  <span className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5 sm:mb-1 flex items-center gap-1.5">
                    <Clock size={12} className="text-clay-300 shrink-0 sm:w-[13px] sm:h-[13px]" /> Time Taken:
                  </span>
                  <p className="text-white font-sans text-xs sm:text-sm font-medium leading-snug">
                    {project.timeTaken}
                  </p>
                </div>
              )}

              {project.client && (
                <div className="col-span-1">
                  <span className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5 sm:mb-1 flex items-center gap-1.5">
                    <User size={12} className="text-clay-300 shrink-0 sm:w-[13px] sm:h-[13px]" /> Client Name:
                  </span>
                  <p className="text-white font-sans text-xs sm:text-sm font-medium leading-snug">
                    {project.client}
                  </p>
                </div>
              )}

              {project.architect && (
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5 sm:mb-1 flex items-center gap-1.5">
                    <Layers size={12} className="text-clay-300 shrink-0 sm:w-[13px] sm:h-[13px]" /> Architect:
                  </span>
                  <p className="text-white font-sans text-xs sm:text-sm font-medium leading-snug">
                    {project.architect}
                  </p>
                </div>
              )}

              <div className="col-span-2 sm:col-span-1">
                <span className="text-stone-400 text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5 sm:mb-1 flex items-center gap-1.5">
                  <Hammer size={12} className="text-clay-300 shrink-0 sm:w-[13px] sm:h-[13px]" /> Construction:
                </span>
                <p className="text-white font-sans text-xs sm:text-sm font-medium leading-snug">
                  {project.construction || 'AuroYali'}
                </p>
              </div>
            </div>

            {project.materials && project.materials.length > 0 && (
              <div className="mt-3.5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-mono text-stone-400 mr-1 sm:mr-2">
                  Materials:
                </span>
                {project.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md bg-white/10 border border-white/10 text-stone-200 font-mono"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            )}

            {/* Next Section Indicator */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
              <span className="text-[11px] text-stone-400">Section 02 of {String(images.length + 1).padStart(2, '0')}</span>
              <button
                type="button"
                onClick={() => scrollToSection('section-about')}
                className="inline-flex items-center gap-1.5 text-stone-200 hover:text-white transition-colors text-[11px] sm:text-xs cursor-pointer py-1 px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10"
              >
                <span>About Story</span>
                <ChevronDown size={13} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SLIDE 3: IMAGE 3 — ABOUT THE PROJECT NARRATIVE & STORY                      */}
      {/* ========================================================================= */}
      <section className="fixed-reveal-section" id="section-about" aria-label="About the Project">
        <img
          src={images[2] || images[0]}
          alt={`${project.title} - Architectural Story`}
          className="fixed-reveal-image"
          loading="lazy"
        />
        <div className="fixed-reveal-overlay !bg-black/45" aria-hidden="true" />

        <div className="fixed-reveal-content">
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[92vw] sm:w-[90vw] max-w-3xl max-h-[86svh] sm:max-h-[88vh] bg-black/75 sm:bg-black/65 backdrop-blur-xl border border-white/15 p-4 sm:p-7 md:p-10 rounded-2xl text-white pointer-events-auto shadow-2xl space-y-3 sm:space-y-4 custom-specs-scrollbar"
          >
            
            <div className="border-b border-white/15 pb-2.5 sm:pb-3 flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-mono text-clay-300 font-semibold">
                Project Description
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-stone-300 bg-white/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-white/10 shrink-0">
                03 / {String(images.length + 1).padStart(2, '0')}
              </span>
            </div>

            <h2 className="font-heading text-xl sm:text-3xl md:text-4xl text-white font-light leading-tight">
              About the Project
            </h2>

            <p className="text-stone-200 text-xs sm:text-base md:text-lg font-light leading-relaxed">
              {project.about || project.overview}
            </p>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-stone-400 border-t border-white/10">
              <span className="text-[11px] sm:text-xs">{project.location}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenLightbox && onOpenLightbox(2)}
                  className="inline-flex items-center gap-1 text-clay-300 hover:text-white transition-colors text-[11px] sm:text-xs cursor-pointer py-1 px-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10"
                >
                  <Maximize2 size={13} /> View Photo
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection(images.length > 3 ? 'section-gallery-3' : (nextProject ? 'section-next' : 'section-hero'))}
                  className="inline-flex items-center gap-1.5 text-stone-200 hover:text-white transition-colors text-[11px] sm:text-xs cursor-pointer py-1 px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10"
                  aria-label="Scroll to next photo"
                >
                  <span>Next Photo</span>
                  <ChevronDown size={13} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SLIDES 4+: REMAINING PROJECT GALLERY IMAGES (ONE BY ONE FIXED REVEAL)      */}
      {/* ========================================================================= */}
      {images.slice(3).map((img, idx) => {
        const imageIndex = idx + 3;
        const plateNumber = String(imageIndex + 1).padStart(2, '0');

        return (
          <section
            key={imageIndex}
            className="fixed-reveal-section"
            id={`section-gallery-${imageIndex}`}
            aria-label={`${project.title} - Plate ${plateNumber}`}
          >
            <img
              src={img}
              alt={`${project.title} - Perspective ${plateNumber}`}
              className="fixed-reveal-image"
              loading="lazy"
            />
            <div className="fixed-reveal-overlay" aria-hidden="true" />

            <div className="fixed-reveal-content">
              {/* Minimalist Centered Plate & Caption */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white pointer-events-auto">
                <span className="text-xs uppercase tracking-widest font-mono text-stone-300 block mb-2 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                  {project.title} • PLATE {plateNumber}
                </span>

                <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-light text-white drop-shadow-md">
                  Spatial Perspective & Detail
                </h3>
              </div>

              {/* Lightbox Trigger Button & Next Slide */}
              <div className="fixed-reveal-btn-wrap !top-[72%] flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenLightbox && onOpenLightbox(imageIndex)}
                  className="fixed-reveal-btn flex items-center gap-2 cursor-pointer"
                  aria-label={`Expand Plate ${plateNumber}`}
                >
                  <Maximize2 size={13} />
                  <span>View Fullscreen</span>
                </button>

                {imageIndex < images.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => scrollToSection(`section-gallery-${imageIndex + 1}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black/60 hover:bg-black/90 text-white text-xs font-mono uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md cursor-pointer"
                    aria-label="Scroll to next photo"
                  >
                    <span>Next</span>
                    <ChevronDown size={13} />
                  </button>
                ) : nextProject ? (
                  <button
                    type="button"
                    onClick={() => scrollToSection('section-next')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black/60 hover:bg-black/90 text-white text-xs font-mono uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md cursor-pointer"
                    aria-label="Scroll to next project"
                  >
                    <span>Next Space</span>
                    <ChevronDown size={13} />
                  </button>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}

      {/* ========================================================================= */}
      {/* FINAL SLIDE: NEXT PROJECT & INQUIRY REVEAL                                  */}
      {/* ========================================================================= */}
      {nextProject && (
        <section className="fixed-reveal-section" id="section-next" aria-label="Next Project">
          <img
            src={nextProject.heroImage}
            alt={nextProject.title}
            className="fixed-reveal-image"
            loading="lazy"
          />
          <div className="fixed-reveal-overlay !bg-black/55" aria-hidden="true" />

          <div className="fixed-reveal-content">
            <div className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[88vw] md:w-[56vw] text-center text-white pointer-events-auto">
              <span className="text-xs uppercase tracking-widest font-mono text-clay-300 block mb-2 font-semibold">
                Next Space in Collection
              </span>

              <h2 className="fixed-reveal-title !static !transform-none !w-full !p-0 mb-4">
                {nextProject.titleParts ? (
                  <>
                    <span className="title-prefix">{nextProject.titleParts.prefix}</span>
                    <span className="title-highlight">{nextProject.titleParts.highlight}</span>
                    <span className="title-suffix">{nextProject.titleParts.suffix}</span>
                  </>
                ) : (
                  <span className="title-highlight">{nextProject.title}</span>
                )}
              </h2>

              <p className="text-xs sm:text-sm font-mono text-stone-300 mb-6">
                {nextProject.location} • {nextProject.area}
              </p>
            </div>

            <div className="fixed-reveal-btn-wrap !top-[72%] flex items-center gap-3">
              <Link
                to={`/projects/${nextProject.slug}`}
                className="fixed-reveal-btn flex items-center gap-2"
                aria-label={`Explore ${nextProject.title}`}
              >
                <span>Explore Space</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                to="/projects"
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-widest border border-white/20 transition-colors backdrop-blur-md"
              >
                All Projects
              </Link>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

export default SingleProjectFixedReveal;
