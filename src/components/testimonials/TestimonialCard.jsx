import React from 'react';
import { Star, Quote } from 'lucide-react';

export function TestimonialCard({ testimonial }) {
  if (!testimonial) return null;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-earth-200/80 shadow-md flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-6 right-6 text-earth-200 dark:text-stone-800 -z-0">
        <Quote size={48} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-1 text-clay mb-6">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>

        <p className="font-heading text-lg md:text-xl text-stone-800 dark:text-stone-200 font-normal italic leading-relaxed mb-8">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-earth-100 dark:border-stone-800 relative z-10">
        <img
          src={testimonial.avatar}
          alt={testimonial.author}
          className="w-12 h-12 rounded-full object-cover border-2 border-clay"
        />
        <div>
          <h4 className="font-heading text-lg font-bold text-earth-900 dark:text-stone-100 leading-snug">
            {testimonial.author}
          </h4>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-mono block">
            {testimonial.role} &bull; {testimonial.location}
          </span>
        </div>
      </div>
    </div>
  );
}
export default TestimonialCard;
