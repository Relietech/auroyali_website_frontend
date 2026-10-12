import React from 'react';
import { Link } from 'react-router-dom';
import { projectsData as defaultProjects } from '../../data/projects';
import './FixedImageRevealScroll.css';

/**
 * FixedImageRevealScroll - Arkdes Studio (/space) Fixed Image Reveal Section
 * 
 * Pure CSS scroll reveal where each project occupies 100svh.
 * The background image stays fixed in place, while each section's clip-path
 * functions as a moving window revealing its fixed image and scrolling text.
 * 
 * @param {Array} projects - Array of project objects
 * @param {string} className - Optional additional CSS class for the container
 */
export function FixedImageRevealScroll({ projects = defaultProjects, className = "" }) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className={`fixed-reveal-container ${className}`} aria-label="Full-Screen Project Showcase">
      {projects.map((project, index) => {
        const imageSrc = project.heroImage || project.image;
        const projectSlug = project.slug || project.id;
        const projectHref = project.href || `/projects/${projectSlug}`;

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

          // Fallback parsing if plain title string is provided
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

        return (
          <section
            key={project.id || index}
            className="fixed-reveal-section"
            id={`reveal-${projectSlug}`}
            aria-label={project.title}
          >
            {/* Fixed Background Image */}
            <img
              src={imageSrc}
              alt={project.title}
              className="fixed-reveal-image"
              loading={index === 0 ? "eager" : "lazy"}
            />

            {/* Fixed Faint Overlay (rgba(0,0,0,0.22)) for optimal text contrast */}
            <div className="fixed-reveal-overlay" aria-hidden="true" />

            {/* Scrolling Content: Absolutely Centered Title + Centered Know More Button */}
            <div className="fixed-reveal-content">
              <h2 className="fixed-reveal-title">
                {renderTitle()}
              </h2>

              <div className="fixed-reveal-btn-wrap">
                <Link
                  to={projectHref}
                  className="fixed-reveal-btn"
                  aria-label={`Know more about ${project.title}`}
                >
                  Know more
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default FixedImageRevealScroll;
