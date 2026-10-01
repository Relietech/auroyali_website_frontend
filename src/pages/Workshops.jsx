import React from 'react';
import { PageBanner } from '../components/common/PageBanner';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { workshopsData } from '../data/testimonials';
import { Calendar, MapPin, CheckCircle, Users } from 'lucide-react';

export function Workshops() {
  return (
    <div>
      <PageBanner
        title="Hands-On Natural Building Workshops"
        subtitle="Learn time-tested earth masonry, non-toxic bamboo joinery, and sustainable architectural design directly from Auroville master builders."
        breadcrumb="Workshops"
        bgImage="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1800&q=80"
        tag="Auroville Green Practices"
      />

      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Upcoming Masterclasses"
            title="Immersion Programs in Auroville"
            subtitle="Our intensive hands-on workshops are designed for architects, civil engineers, design students, and ecological builders seeking practical site mastery."
          />

          <div className="space-y-12">
            {workshopsData.map((workshop) => (
              <div
                key={workshop.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-12 border border-earth-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
              >
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full bg-earth-100 text-clay text-xs font-mono font-medium">
                      {workshop.duration}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-sage/20 text-sage text-xs font-mono font-medium">
                      {workshop.seats}
                    </span>
                  </div>

                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-earth-900 dark:text-stone-100">
                    {workshop.title}
                  </h3>

                  <p className="body-text text-stone-600 dark:text-stone-400 font-light leading-relaxed">
                    {workshop.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {workshop.highlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                        <CheckCircle size={15} className="text-clay shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-earth-100 dark:border-stone-800">
                    <Button to="/workshops/bamboo" variant="clay" size="md">
                      View Syllabus & Enroll
                    </Button>
                    <span className="text-sm font-semibold text-earth-900 dark:text-stone-100 font-mono">
                      Fee: {workshop.fee}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-earth-100/60 dark:bg-stone-800/60 p-6 rounded-2xl border border-earth-200 dark:border-stone-700 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-clay shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-mono block">Batch Schedule</span>
                      <strong className="text-xs text-stone-800 dark:text-stone-200">{workshop.dates}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-clay shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-mono block">Venue</span>
                      <span className="text-xs text-stone-700 dark:text-stone-300">{workshop.location}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users size={18} className="text-clay shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-mono block">Target Cohort</span>
                      <span className="text-xs text-stone-700 dark:text-stone-300">{workshop.level}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
export default Workshops;
