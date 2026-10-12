import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsData } from '../data/projects';
import { SingleProjectFixedReveal } from '../components/projects/SingleProjectFixedReveal';
import { 
  ArrowLeft, 
  X, 
  ChevronLeft, 
  ChevronRight,
  LayoutGrid,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProjectDetail() {
  const { slug } = useParams();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);

  // Find project index and object
  const currentIndex = projectsData.findIndex((p) => p.slug === slug);
  const project = currentIndex !== -1 ? projectsData[currentIndex] : projectsData[0];
  const totalProjects = projectsData.length;

  // Next and Previous projects
  const prevProject = projectsData[(currentIndex - 1 + totalProjects) % totalProjects];
  const nextProject = projectsData[(currentIndex + 1) % totalProjects];

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Lock body scroll and pause Lenis smooth scroll while modal or lightbox is open
  useEffect(() => {
    if (isGridViewOpen || lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isGridViewOpen, lightboxIndex]);

  // Handle keyboard navigation for lightbox & grid modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        if (isGridViewOpen) setIsGridViewOpen(false);
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, isGridViewOpen, project]);

  if (!project) {
    return (
      <div className="py-40 text-center bg-[#000000] text-white min-h-screen flex flex-col items-center justify-center">
        <h2 className="font-heading text-4xl text-white mb-4">Project Not Found</h2>
        <p className="text-stone-400 mb-8 font-light">The requested project could not be located.</p>
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black text-xs uppercase tracking-widest font-mono hover:bg-clay hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Return to all projects
        </Link>
      </div>
    );
  }

  const allImages = project.gallery && project.gallery.length > 0 
    ? project.gallery 
    : [project.heroImage];

  const openLightbox = (index) => {
    setIsGridViewOpen(false);
    setLightboxIndex(index);
  };
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <article className="min-h-screen bg-[#000000] text-white font-body selection:bg-clay selection:text-white">
      
      {/* PURE CSS FULL-SCREEN FIXED IMAGE REVEAL FOR THIS PROJECT */}
      <SingleProjectFixedReveal
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
        currentIndex={currentIndex}
        totalProjects={totalProjects}
        onOpenLightbox={openLightbox}
        onOpenGridView={() => setIsGridViewOpen(true)}
      />

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 select-none"
            onClick={closeLightbox}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-white z-20 px-1 sm:px-2" onClick={(e) => e.stopPropagation()}>
              <div className="font-mono text-xs text-stone-300 flex items-center gap-2">
                <span className="text-white font-semibold">{project.title}</span>
                <span className="text-stone-500">•</span>
                <span className="text-clay-300">{lightboxIndex + 1} of {allImages.length}</span>
              </div>

              <div className="flex items-center gap-2">
                {allImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      closeLightbox();
                      setIsGridViewOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider border border-white/15 transition-colors cursor-pointer"
                    title="View All Photos Grid"
                  >
                    <LayoutGrid size={14} className="text-clay-300" />
                    <span className="hidden sm:inline">View All ({allImages.length})</span>
                  </button>
                )}

                <button
                  onClick={closeLightbox}
                  aria-label="Close"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Image Stage */}
            <div className="relative flex-1 flex items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={prevImage}
                aria-label="Previous"
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                src={allImages[lightboxIndex]}
                alt={`${project.title} - ${lightboxIndex + 1}`}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              />

              <button
                onClick={nextImage}
                aria-label="Next"
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all z-20 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div 
              className="flex items-center justify-start sm:justify-center gap-2.5 py-3 px-4 z-20 max-w-xl mx-auto overflow-x-auto no-scrollbar scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    lightboxIndex === idx ? 'border-white ring-2 ring-white/50 scale-105 opacity-100' : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW ALL PHOTOS GRID OVERLAY MODAL */}
      <AnimatePresence>
        {isGridViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-contain select-none custom-specs-scrollbar"
            onClick={() => setIsGridViewOpen(false)}
          >
            <div 
              data-lenis-prevent
              className="max-w-6xl w-full mx-auto space-y-6 pt-4 sm:pt-6 pb-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-widest font-mono text-clay-300 block mb-1">
                    Photo Archive • {allImages.length} Photographs
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl text-white font-light">
                    {project.title}
                  </h2>
                </div>

                <button
                  onClick={() => setIsGridViewOpen(false)}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-mono uppercase tracking-wider border border-white/15"
                  aria-label="Close gallery grid"
                >
                  <span>Close Grid</span>
                  <X size={16} />
                </button>
              </div>

              {/* Grid of All Photos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
                {allImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => openLightbox(idx)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/15 bg-stone-900 cursor-pointer shadow-lg hover:border-white/50 transition-all"
                  >
                    <img
                      src={img}
                      alt={`${project.title} - Plate ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5">
                      <span className="self-end px-2.5 py-1 rounded-md bg-black/60 text-[10px] font-mono text-white/90 border border-white/20 backdrop-blur-md">
                        {String(idx + 1).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
                      </span>
                      <div className="flex items-center justify-between text-white text-xs font-mono">
                        <span className="text-clay-200">Expand Fullscreen</span>
                        <Maximize2 size={14} />
                      </div>
                    </div>

                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-stone-300 border border-white/10 group-hover:opacity-0 transition-opacity">
                      Plate {String(idx + 1).padStart(2, '0')}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer hint */}
              <div className="text-center pt-4">
                <p className="text-xs font-mono text-stone-400">
                  Click any image to view in full-screen lightbox presentation • Press ESC to close
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </article>
  );
}

export default ProjectDetail;
