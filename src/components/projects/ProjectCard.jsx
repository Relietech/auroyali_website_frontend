import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import './ProjectCard.css';

/**
 * ProjectCard - Modern, polished, perfectly aligned architectural project card.
 * 
 * Features:
 * - Uniform card height in CSS Grid with flex-column stretch
 * - Fixed 4:3.2 aspect ratio image with gradient scrim and category pill
 * - Title and Subtitle with 2-line clamping and reserved min-heights
 * - Pinned bottom tag area with max 3 chips + overflow count
 * - Fully clickable card with keyboard focus ring and sliding arrow affordance
 * 
 * @param {Object} project - Project data object
 * @param {number} index - Index in the list for lazy loading control
 */
export function ProjectCard({ project, index = 0 }) {
  if (!project) return null;

  const projectSlug = project.slug || project.id;
  const materials = project.materials || [];
  const maxTags = 3;
  const visibleTags = materials.slice(0, maxTags);
  const remainingCount = materials.length - maxTags;

  return (
    <Link
      to={`/projects/${projectSlug}`}
      className="project-card group"
      aria-label={`View ${project.title} project details`}
    >
      {/* 1. Image Area with Fixed Aspect Ratio (4:3.2) */}
      <div className="project-card-image-wrap">
        <img
          src={project.heroImage}
          alt={project.title}
          className="project-card-image"
          loading={index < 3 ? "eager" : "lazy"}
        />

        {/* Top-Left Category Pill */}
        <span className="project-card-category">
          {project.category}
        </span>

        {/* Bottom Gradient Scrim Overlay */}
        <div className="project-card-scrim" aria-hidden="true" />

        {/* Bottom Baseline: Location & Year */}
        <div className="project-card-meta">
          <span className="project-card-location">
            <MapPin size={13} className="project-card-location-icon" />
            <span>{project.location}</span>
          </span>
          <span className="project-card-year">{project.year}</span>
        </div>
      </div>

      {/* 2. Content Area with Uniform 28px Padding */}
      <div className="project-card-body">
        {/* Title: 2 lines clamped with 2.3em reserved min-height */}
        <h3 className="project-card-title">
          {project.title}
        </h3>

        {/* Subtitle: Normal sentence case, 2 lines clamped with 3em reserved min-height */}
        <p className="project-card-subtitle">
          {project.subtitle}
        </p>

        {/* 3. Footer Area pinned to bottom with margin-top: auto */}
        <div className="project-card-footer">
          {/* Material Tags Row (Max 3 + Counter) */}
          <div className="project-card-tags">
            {visibleTags.map((mat, i) => (
              <span key={i} className="project-card-tag">
                {mat}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="project-card-tag-more">
                +{remainingCount}
              </span>
            )}
          </div>

          {/* Action Link Bar */}
          <div className="project-card-action-bar">
            <span className="project-card-area">
              {project.area}
            </span>

            <span className="project-card-link">
              <span>View project</span>
              <ArrowRight size={14} className="project-card-arrow" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
