import React from 'react';

export function SectionHeading({
  tag,
  title,
  subtitle,
  align = 'left',
  className = '',
  light = false
}) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto'
  };

  return (
    <div className={`flex flex-col max-w-3xl mb-6 sm:mb-10 md:mb-16 ${alignClasses[align]} ${className}`}>
      {tag && (
        <span
          className={`inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] font-semibold mb-2 sm:mb-3 ${
            light ? 'text-earth-300' : 'text-clay'
          }`}
        >
          {tag}
        </span>
      )}
      <h2
        className={`h2-section tracking-tight leading-[1.18] sm:leading-tight ${
          light ? 'text-earth-50' : 'text-earth-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`body-text mt-3 sm:mt-4 font-light leading-relaxed ${
            light ? 'text-stone-300' : 'text-stone-600'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
export default SectionHeading;
