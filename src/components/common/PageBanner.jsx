import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function PageBanner({
  title,
  subtitle,
  breadcrumb,
  bgImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
  tag = "Auroville Architectural Practice"
}) {
  return (
    <div className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-earth-900 text-stone-100">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={title}
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-950 via-earth-900/80 to-earth-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-stone-400 mb-4 font-mono">
          <Link to="/" className="hover:text-clay transition-colors">Home</Link>
          <ChevronRight size={12} className="text-stone-500" />
          <span className="text-clay font-medium">{breadcrumb || title}</span>
        </div>

        <div className="max-w-3xl">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-earth-300 font-medium mb-3">
            {tag}
          </span>
          <h1 className="h1-hero text-earth-50 tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="body-text text-stone-300 mt-6 font-light max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
export default PageBanner;
