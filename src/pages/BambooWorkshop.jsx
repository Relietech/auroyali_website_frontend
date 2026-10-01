import React from 'react';
import { PageBanner } from '../components/common/PageBanner';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { workshopsData } from '../data/testimonials';
import { Calendar, CheckCircle2, MapPin, Users } from 'lucide-react';

export function BambooWorkshop() {
  const workshop = workshopsData[0];

  return (
    <div>
      <PageBanner
        title={workshop.title}
        subtitle="An intensive 5-day hands-on masterclass in Auroville exploring non-toxic preservation, structural joinery, and full-scale reciprocal dome construction."
        breadcrumb="Bamboo Masterclass"
        bgImage="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1800&q=80"
        tag="Auroville Hands-On Masterclass"
      />

      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-8 space-y-10">
              <div>
                <SectionHeading
                  tag="Comprehensive Syllabus"
                  title="5 Days of Direct Studio & Yard Mastery"
                />
                <p className="body-text text-stone-700 leading-relaxed font-light">
                  Bamboo is often referred to as "vegetable steel" with extraordinary tensile resilience and rapid renewable growth. This course demystifies everything from harvesting physiology to precision CNC hybrid joints and hyperbolic paraboloid space framing.
                </p>
              </div>

              <div className="space-y-4">
                {workshop.modules.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-earth-200 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xl font-bold text-earth-900">
                        {m.title}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-clay font-mono">
                        Day 0{idx + 1}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 font-light leading-relaxed">
                      {m.details}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-8 rounded-3xl bg-earth-100/70 border border-earth-200 space-y-4">
                <h4 className="font-heading text-2xl font-bold text-earth-900">
                  What is Included in Your Workshop Fee:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "All raw bamboo poles and steel hardware for construction",
                    "Safety PPE gear & specialized Japanese bamboo saws/drills",
                    "Daily wholesome organic farm-to-table lunch & refreshments",
                    "Auroville Green Practices (AGP) Official Completion Certificate",
                    "AuroYali Bamboo Joinery Blueprint Manual (PDF + Physical)",
                    "Guided architectural tour of Auroville earth & bamboo pavilions"
                  ].map((inc, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                      <CheckCircle2 size={16} className="text-clay shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-earth-900 text-stone-100 p-8 rounded-3xl border border-earth-800 space-y-6 shadow-2xl">
                <div>
                  <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-1">
                    Registration Open
                  </span>
                  <h4 className="font-heading text-3xl font-bold text-earth-50">
                    Reserve Your Seat
                  </h4>
                </div>

                <div className="p-4 rounded-xl bg-earth-800/80 border border-earth-700 space-y-1">
                  <span className="text-[11px] text-stone-400 font-mono block">Tuition Fee</span>
                  <span className="font-heading text-3xl text-clay font-bold">{workshop.fee.split(' ')[0]}</span>
                  <span className="text-xs text-stone-400 block">Inclusive of all taxes & certification</span>
                </div>

                <div className="space-y-3 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-clay" />
                    <span>{workshop.dates}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-clay" />
                    <span>{workshop.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-clay" />
                    <span>Strict cap: {workshop.seats}</span>
                  </div>
                </div>

                <Button to="/contact" variant="clay" className="w-full">
                  Apply for Admission
                </Button>

                <p className="text-[11px] text-stone-400 text-center font-mono">
                  Early bird registrations receive complimentary soil testing field kit.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
export default BambooWorkshop;
