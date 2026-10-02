import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ExpandedCards.css';

export const DEFAULT_PROJECTS = [
  {
    id: 'lakshmi-training-centre',
    category: 'Institutional / Educational',
    location: 'Auroville, Tamil Nadu',
    year: '2021',
    title: 'Lakshmi Training Centre',
    summary:
      'A sustainable educational facility featuring passive solar orientation, rammed earth construction, and locally sourced timber screen facades for optimal thermal comfort.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    href: '#lakshmi-training-centre',
  },
  {
    id: 'courtyard-house',
    category: 'Residential',
    location: 'Kottakarai, Auroville',
    year: '2022',
    title: 'Courtyard House',
    summary:
      'A minimalist private residence structured around a verdant light-well courtyard, seamlessly uniting raw stone finishes with expansive open-air living spaces.',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    href: '#courtyard-house',
  },
  {
    id: 'guest-house-for-seeds',
    category: 'Hospitality & Ecology',
    location: 'International Zone, Auroville',
    year: '2023',
    title: 'Guest House for Seeds',
    summary:
      'An ecological retreat tailored for environmental researchers, integrating biophilic interior principles, bespoke terracotta elements, and energy-positive systems.',
    image:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1400&q=80',
    href: '#guest-house-for-seeds',
  },
];

const PinIcon = () => (
  <svg
    className="xc-pin-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 21c4-4.5 7-8.5 7-12a7 7 0 1 0-14 0c0 3.5 3 7.5 7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    className="xc-arrow-icon"
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

const cardListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.1,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 45, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ExpandedCards({ projects = DEFAULT_PROJECTS }) {
  const [activeId, setActiveId] = useState(projects[0]?.id || null);

  return (
    <section className="xc-section" aria-label="Featured Architectural Projects">
      <motion.ul
        className="xc-row"
        role="list"
        variants={cardListVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {projects.map((project, index) => {
          const isExplicitlyActive = activeId === project.id;

          return (
            <motion.li
              key={project.id}
              variants={cardItemVariants}
              className={`xc-card ${isExplicitlyActive ? 'is-active' : 'is-collapsed'}`}
              onMouseEnter={() => setActiveId(project.id)}
              onClick={() => setActiveId(project.id)}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* Full-bleed background image with subtle parallax zoom */}
              <div className="xc-img-wrap">
                <img
                  src={project.image}
                  alt={project.title}
                  className="xc-card-img"
                  loading="lazy"
                />
              </div>

              {/* Bottom-up dark gradient overlay */}
              <div className="xc-gradient-overlay" aria-hidden="true" />

              {/* Top-left category glass pill */}
              <div className="xc-pill-wrap">
                <span className="xc-pill">{project.category}</span>
              </div>

              {/* Bottom content section */}
              <div className="xc-bottom-content">
                <div className="xc-info-block">
                  <div className="xc-meta">
                    <PinIcon />
                    <span>
                      {project.location} &bull; {project.year}
                    </span>
                  </div>

                  <h3 className="xc-title">{project.title}</h3>

                  {project.summary && (
                    <p className="xc-summary">{project.summary}</p>
                  )}
                </div>

                {/* Bottom-right interactive arrow button */}
                <div className="xc-action-wrap">
                  <a
                    href={project.href || '#'}
                    className="xc-arrow-btn"
                    aria-label={`View ${project.title}`}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={() => setActiveId(project.id)}
                    onBlur={() => setActiveId(null)}
                  >
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
