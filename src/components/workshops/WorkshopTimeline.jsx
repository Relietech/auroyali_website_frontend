import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { workshopsData } from '../../data/workshops';

export function WorkshopTimeline({ onEnrollClick }) {
  return (
    <section className="py-20 bg-earth-50 dark:bg-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] font-semibold text-clay block mb-2">
              2026 – 2027 Academic Schedule
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-earth-900 dark:text-stone-100">
              Upcoming Cohort Schedule & Availability
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 font-mono max-w-sm">
            Due to our 1:6 master-to-student coaching ratio, each cohort is strictly capped at 12–18 participants.
          </p>
        </div>

        {/* Schedule Matrix Table / List */}
        <div className="bg-white dark:bg-stone-950 rounded-3xl border border-earth-200/90 dark:border-stone-800 shadow-md overflow-hidden">
          <div className="divide-y divide-earth-100 dark:divide-stone-800">
            {workshopsData.map((workshop, idx) => {
              const spotsLeft = workshop.totalSeats - workshop.bookedSeats;
              return (
                <div
                  key={workshop.id}
                  className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-earth-50/70 dark:hover:bg-stone-900/50 transition-colors"
                >
                  {/* Left: Date badge + Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="p-3.5 rounded-2xl bg-earth-100 dark:bg-stone-800 text-center min-w-[120px] shrink-0 border border-earth-200 dark:border-stone-700">
                      <span className="text-[10px] font-mono uppercase text-clay block font-semibold">
                        {workshop.duration}
                      </span>
                      <strong className="text-sm font-mono text-earth-900 dark:text-stone-100 block">
                        {workshop.dates.split('202')[0]}
                      </strong>
                      <span className="text-[10px] text-stone-400 font-mono">2026/2027</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 bg-earth-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full">
                        {workshop.categoryLabel}
                      </span>
                      <h4 className="font-heading text-xl sm:text-2xl font-bold text-earth-900 dark:text-stone-100">
                        {workshop.title}
                      </h4>
                      <p className="text-xs text-stone-500 font-light flex items-center gap-2">
                        <MapPin size={12} className="text-clay" /> {workshop.location} &bull; {workshop.hours}
                      </p>
                    </div>
                  </div>

                  {/* Right: Availability status + Action */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-earth-100 dark:border-stone-800">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-heading text-lg font-bold text-earth-900 dark:text-stone-100 block">
                        {workshop.fee}
                      </span>
                      <span className={`text-[11px] font-mono flex items-center gap-1 ${
                        spotsLeft <= 4 ? 'text-clay font-semibold' : 'text-sage'
                      }`}>
                        {spotsLeft <= 4 ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                        {spotsLeft} seats remaining
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEnrollClick(workshop)}
                      className="px-5 py-2.5 rounded-xl bg-earth-900 dark:bg-earth-100 text-stone-100 dark:text-earth-900 text-xs font-mono font-semibold hover:bg-clay dark:hover:bg-clay dark:hover:text-white transition-all shadow-sm flex items-center gap-2"
                    >
                      <span>Apply</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
export default WorkshopTimeline;
