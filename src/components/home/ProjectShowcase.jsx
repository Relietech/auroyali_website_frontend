import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';
import { projectsData } from '../../data/projects';
import ExpandedCards from '../projects/ExpandedCards';

const headerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const headerItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function ProjectShowcase() {
  const showcaseProjects = projectsData.slice(0, 3).map((p) => ({
    id: p.id,
    category: p.category,
    location: p.location,
    year: p.year,
    title: p.title,
    summary: p.overview,
    image: p.heroImage,
    href: `/projects/${p.slug}`,
  }));

  return (
    <section className="bg-[#2e1f14] relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-clay/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sage/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section with scroll animation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-10 md:pt-20 pb-2 sm:pb-4 relative z-10">
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row md:items-start justify-between gap-6"
        >
          <motion.div variants={headerItemVariants}>
            <SectionHeading
              light
              tag="Selected Portfolios"
              title="Living benchmarks of earth architecture & natural design."
              subtitle="Explore our completed residential sanctuaries, training academies, and experimental bamboo tensile structures."
              className="mb-0"
            />
          </motion.div>

          {/* Desktop-only Header Button */}
          <motion.div variants={headerItemVariants} className="hidden md:block mt-1 shrink-0 md:self-start">
            <Button to="/projects" variant="clay">
              View All Projects
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Expanded Cards Component with Scroll Animations */}
      <ExpandedCards projects={showcaseProjects} />

      {/* Mobile-only Bottom Centered Button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex md:hidden justify-center items-center pt-2 pb-6 px-4 relative z-10"
      >
        <Button to="/projects" variant="clay" size="md">
          View All Projects
        </Button>
      </motion.div>
    </section>
  );
}

export default ProjectShowcase;
