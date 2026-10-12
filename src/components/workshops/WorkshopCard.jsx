import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Layers,
  Wrench,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '../common/Button';

export function WorkshopCard({ workshop, onEnrollClick }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [showAllModules, setShowAllModules] = useState(false);

  const spotsLeft = workshop.totalSeats - workshop.bookedSeats;
  const progressPercent = Math.round((workshop.bookedSeats / workshop.totalSeats) * 100);

  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-white dark:bg-stone-900 rounded-[2rem] border border-earth-200/90 dark:border-stone-800 shadow-[0_12px_40px_rgba(47,31,19,0.06)] hover:shadow-[0_24px_60px_rgba(47,31,19,0.12)] transition-all duration-500 overflow-hidden"
    >
      {/* Top Banner Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-clay via-earth-400 to-sage" />

      <div className="p-6 sm:p-8 lg:p-10 space-y-8">
        
        {/* Header Grid: Media + Core Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-earth-950 border border-earth-200/60 shadow-md group">
              <img 
                src={workshop.coverImage} 
                alt={workshop.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-transparent to-black/20" />
              
              {/* Category & Status Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-earth-950/85 backdrop-blur-md text-earth-100 text-[11px] font-mono tracking-wider border border-white/10 uppercase">
                  {workshop.categoryLabel}
                </span>

                <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wider shadow-sm ${
                  spotsLeft <= 4 
                    ? 'bg-clay text-white animate-pulse' 
                    : 'bg-white/90 text-earth-900 backdrop-blur-md'
                }`}>
                  {workshop.status}
                </span>
              </div>

              {/* Bottom Quick Info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-200 font-mono">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <Clock size={13} className="text-clay" /> {workshop.duration}
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <Users size={13} className="text-sage" /> {spotsLeft} spots left
                </span>
              </div>
            </div>

            {/* Live Seat Availability Gauge */}
            <div className="mt-4 p-3 rounded-xl bg-earth-50 dark:bg-stone-800/80 border border-earth-200/80 dark:border-stone-700/80 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-stone-500 dark:text-stone-400">Cohort Capacity</span>
                <span className="font-semibold text-earth-900 dark:text-stone-200">
                  {workshop.bookedSeats} of {workshop.totalSeats} booked ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-earth-200 dark:bg-stone-700 overflow-hidden">
                <div 
                  className="h-full bg-clay transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Instructor Micro Profile */}
            {workshop.instructor && (
              <div className="mt-4 flex items-center gap-3.5 p-3 rounded-xl bg-white dark:bg-stone-800 border border-earth-100 dark:border-stone-700/60 shadow-sm">
                <img 
                  src={workshop.instructor.avatar} 
                  alt={workshop.instructor.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-clay/30"
                />
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">Lead Mentorship</span>
                  <strong className="text-earth-900 dark:text-stone-100 block font-heading text-base leading-tight">
                    {workshop.instructor.name}
                  </strong>
                  <span className="text-stone-500 dark:text-stone-400 text-[11px] block">
                    {workshop.instructor.experience}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & Tagline */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 font-mono">
                <span className="flex items-center gap-1.5 text-clay font-medium">
                  <Calendar size={14} /> {workshop.dates}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-sage" /> Auroville, India
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Award size={14} className="text-earth-600" /> AGP Certified
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-earth-900 dark:text-stone-100 leading-tight">
                {workshop.title}
              </h3>

              <p className="text-sm font-light text-stone-600 dark:text-stone-300 leading-relaxed">
                {workshop.description}
              </p>
            </div>

            {/* Key Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {workshop.highlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300 bg-earth-50/70 dark:bg-stone-800/50 p-2.5 rounded-xl border border-earth-100 dark:border-stone-800">
                  <CheckCircle2 size={15} className="text-clay shrink-0 mt-0.5" />
                  <span className="leading-snug">{hl}</span>
                </div>
              ))}
            </div>

            {/* Tools Mastered Pills */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider font-mono text-stone-400 block flex items-center gap-1.5">
                <Wrench size={13} className="text-clay" /> Tools & Techniques Mastered:
              </span>
              <div className="flex flex-wrap gap-2">
                {workshop.tools.map((tool, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-earth-100/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-mono border border-earth-200/60 dark:border-stone-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Syllabus Day-by-Day Inspection Drawer */}
        <div className="pt-6 border-t border-earth-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-clay" />
              <h4 className="font-heading text-lg font-bold text-earth-900 dark:text-stone-100">
                Interactive Daily Curriculum Breakdown
              </h4>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              {workshop.modules.length} Modules &bull; {workshop.hours}
            </span>
          </div>

          {/* Day Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {workshop.modules.map((m, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveDayIdx(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                  activeDayIdx === idx
                    ? 'bg-clay text-white shadow-sm font-semibold'
                    : 'bg-earth-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-earth-200 dark:hover:bg-stone-700'
                }`}
              >
                {m.day}
              </button>
            ))}
          </div>

          {/* Active Day Detail Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDayIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="p-5 rounded-2xl bg-earth-50/80 dark:bg-stone-800/90 border border-earth-200/80 dark:border-stone-700 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-heading text-lg font-bold text-earth-900 dark:text-stone-100">
                  {workshop.modules[activeDayIdx].day}: {workshop.modules[activeDayIdx].title}
                </span>
                <span className="text-[11px] font-mono text-clay bg-white dark:bg-stone-900 px-2.5 py-0.5 rounded-md border border-earth-200/60 dark:border-stone-700">
                  {workshop.modules[activeDayIdx].hours}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                {workshop.modules[activeDayIdx].details}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pricing & Footer Actions Bar */}
        <div className="pt-6 border-t border-earth-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-6 bg-earth-50/50 dark:bg-stone-950/40 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 lg:-mx-10 lg:-mb-10 p-6 sm:p-8">
          
          {/* Tuition Fee Breakdown */}
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-bold text-earth-900 dark:text-stone-100">
                {workshop.fee}
              </span>
              <span className="text-sm font-mono text-stone-500">
                / {workshop.internationalFee}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
              {workshop.feeDetails}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to={workshop.slug === 'bamboo-workshop' ? '/workshops/bamboo' : `/workshops/${workshop.slug}`}
              className="px-5 py-3 rounded-xl border border-earth-300 dark:border-stone-700 text-xs font-mono font-medium text-earth-900 dark:text-stone-200 hover:bg-earth-100 dark:hover:bg-stone-800 transition-colors flex-1 sm:flex-none text-center"
            >
              Full Details
            </Link>

            <button
              type="button"
              onClick={() => onEnrollClick(workshop)}
              className="px-6 py-3 rounded-xl bg-clay text-white text-xs font-mono font-semibold hover:bg-clay/90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 flex-1 sm:flex-none group"
            >
              <span>Quick Reserve</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </motion.article>
  );
}
export default WorkshopCard;
