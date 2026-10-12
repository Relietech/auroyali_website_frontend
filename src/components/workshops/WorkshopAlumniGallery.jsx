import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, Sparkles } from 'lucide-react';

const ALUMNI_TESTIMONIALS = [
  {
    quote: "Building the 6-meter reciprocal bamboo dome on Day 4 completely shifted how I think about parametric architecture. No software simulation can replace holding the culms and feeling the tension lock into place.",
    author: "Ar. Rahul Varma",
    role: "Studio Principal, Bangalore",
    program: "Structural Bamboo Masterclass"
  },
  {
    quote: "The soil mechanics lab and Catalan vaulting exercises gave me the confidence to design our entire ecological retreat without standard reinforced concrete slabs.",
    author: "Sophie Dubois",
    role: "Sustainable Building Researcher, Paris",
    program: "CSEB & Earth Masonry"
  },
  {
    quote: "Working with 2-year cellar aged lime putty and burnishing with olive oil soap on river stones felt like a sacred craft initiation. Camille is an exceptional master.",
    author: "Ananya Iyer",
    role: "Interior Architect, Mumbai",
    program: "Lime & Moroccan Tadelakt"
  }
];

const GALLERY_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
    caption: "Bamboo reciprocal dome framing sprint",
    tag: "Auroville Yard"
  },
  {
    src: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
    caption: "Interlocking CSEB hydraulic block press in action",
    tag: "Earth Lab"
  },
  {
    src: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
    caption: "Traditional mortise and tenon timber assembly",
    tag: "Wood Atelier"
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    caption: "Hand-burnished breathable Tadelakt wall finish",
    tag: "Lime Finishes"
  }
];

export function WorkshopAlumniGallery() {
  return (
    <section className="py-24 bg-[#faf6f1] dark:bg-stone-950 border-t border-earth-200/80 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] font-semibold text-clay block mb-3">
            Life in the Yard
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-earth-900 dark:text-stone-100 tracking-tight leading-tight">
            Crafted with Mud, Wood & Sweat
          </h2>
          <p className="body-text text-stone-600 dark:text-stone-400 mt-4 font-light">
            Every cohort leaves behind a lasting structural creation in Auroville. Here is what our participants have built and experienced.
          </p>
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {GALLERY_PHOTOS.map((photo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-earth-950 shadow-md border border-earth-200 dark:border-stone-800"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-earth-100 border border-white/10 uppercase tracking-wider">
                  {photo.tag}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-xs font-heading text-base font-bold text-white leading-snug">
                  {photo.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials 3-Card Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ALUMNI_TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-earth-200/90 dark:border-stone-800 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-clay">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-light italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-earth-100 dark:border-stone-800">
                <strong className="font-heading text-base font-bold text-earth-900 dark:text-stone-100 block">
                  {t.author}
                </strong>
                <span className="text-[11px] font-mono text-stone-500 block">
                  {t.role}
                </span>
                <span className="text-[10px] font-mono text-clay uppercase tracking-wider block mt-1">
                  Cohort: {t.program}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
export default WorkshopAlumniGallery;
