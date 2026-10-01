import React from 'react';
import { PageBanner } from '../components/common/PageBanner';
import { SectionHeading } from '../components/common/SectionHeading';
import { testimonialsData } from '../data/testimonials';
import { TestimonialCard } from '../components/testimonials/TestimonialCard';
import { Button } from '../components/common/Button';
import { Star } from 'lucide-react';

export function Testimonials() {
  return (
    <div>
      <PageBanner
        title="What Our Clients & Collaborators Say"
        subtitle="Endorsements and experiences from private homeowners, institutional clients, and ecological researchers who built with AuroYali."
        breadcrumb="Testimonials"
        bgImage="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80"
        tag="Client Voices"
      />

      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            tag="Auroville & Beyond"
            title="A Legacy of Integrity, Craftsmanship & Warmth"
            subtitle="Every structure we construct is a lasting relationship. Here is what patrons share about our collaborative design and building journey."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {testimonialsData.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-earth-100/60 border border-earth-200 text-center max-w-4xl mx-auto space-y-4">
            <div className="flex justify-center text-clay">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} fill="currentColor" />
              ))}
            </div>
            <p className="font-heading text-2xl md:text-3xl text-earth-900 italic font-light">
              "The air inside our AuroYali home feels completely alive. We haven't turned on an air-conditioner in three years, and our electricity consumption is practically zero."
            </p>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-mono block">
              Residential Patron, Kottakarai Auroville
            </span>
          </div>
        </div>
      </section>

      <section className="py-20 bg-earth-900 text-stone-100 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h3 className="font-heading text-3xl md:text-5xl text-earth-50">
            Build with Consciousness
          </h3>
          <p className="body-text text-stone-300 font-light">
            Let us help you design and build a healthy, sustainable sanctuary that respects both the earth and your lifestyle.
          </p>
          <div className="pt-2">
            <Button to="/contact" variant="clay" size="lg">
              Start Your Project Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Testimonials;
