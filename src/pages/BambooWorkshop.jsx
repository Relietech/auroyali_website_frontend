import React, { useState } from 'react';
import { PageBanner } from '../components/common/PageBanner';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { workshopsData } from '../data/workshops';
import { WorkshopEnrollModal } from '../components/workshops/WorkshopEnrollModal';
import { 
  Calendar, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Clock, 
  Award, 
  Wrench, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Layers, 
  Trees, 
  Check, 
  FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function BambooWorkshop() {
  const workshop = workshopsData[0]; // Structural Bamboo Masterclass
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const spotsLeft = workshop.totalSeats - workshop.bookedSeats;

  return (
    <div className="min-h-screen bg-earth-50 dark:bg-stone-900 text-earth-900 dark:text-stone-100">
      
      {/* 1. Immersive Hero Banner */}
      <PageBanner
        title={workshop.title}
        subtitle="An intensive 5-day physical masterclass in Auroville exploring species biology, non-toxic borax preservation, fish-mouth joinery, and team raising a 6-meter reciprocal pavilion."
        breadcrumb="Bamboo Masterclass"
        bgImage="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1920&q=80"
        tag="Auroville Masterclass Series"
      />

      {/* 2. Sticky Quick-Action Bar */}
      <div className="bg-earth-900 text-stone-100 py-4 px-4 sm:px-8 sticky top-20 z-30 shadow-md border-b border-earth-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="hidden sm:inline text-stone-400">Next Cohort:</span>
            <span className="text-clay font-bold flex items-center gap-1.5">
              <Calendar size={14} /> {workshop.dates}
            </span>
            <span className="hidden md:inline text-stone-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-sage">
              <Users size={14} /> {spotsLeft} seats left
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="font-heading text-xl font-bold text-white leading-none">
                {workshop.fee}
              </span>
              <span className="text-[10px] text-stone-400 font-mono block">
                / {workshop.internationalFee}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-clay text-white text-xs font-mono font-bold hover:bg-clay/90 transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Apply for Admission</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Syllabus & Deep Dive (8 Cols) */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* Overview & Philosophy */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] font-semibold text-clay block mb-2">
                    Direct Hands-On Pedagogy
                  </span>
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold text-earth-900 dark:text-stone-100">
                    Vegetable Steel: Bridging Biology & Structural Engineering
                  </h2>
                </div>

                <p className="body-text text-stone-700 dark:text-stone-300 font-light leading-relaxed">
                  Bamboo possesses a tensile strength comparable to mild steel and a compressive capacity exceeding concrete when properly handled. Yet, building reliably with natural round poles requires deep tactile understanding: knowing when to harvest relative to lunar sap cycles, how to neutralize starch without carcinogens, and how to execute geometric joints that never crush under load.
                </p>

                {/* 3 Highlight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-earth-200 dark:border-stone-700">
                    <Trees className="text-clay mb-2" size={20} />
                    <strong className="text-sm font-heading font-bold text-earth-900 dark:text-stone-100 block">
                      Local Species
                    </strong>
                    <span className="text-xs text-stone-500 font-light">
                      Dendrocalamus strictus & Bambusa balcooa
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-earth-200 dark:border-stone-700">
                    <ShieldCheck className="text-sage mb-2" size={20} />
                    <strong className="text-sm font-heading font-bold text-earth-900 dark:text-stone-100 block">
                      Zero Toxicity
                    </strong>
                    <span className="text-xs text-stone-500 font-light">
                      Borax-Boric Hot Immersion (50-Yr Durability)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-earth-200 dark:border-stone-700">
                    <Layers className="text-earth-600 mb-2" size={20} />
                    <strong className="text-sm font-heading font-bold text-earth-900 dark:text-stone-100 block">
                      1:1 Scale Build
                    </strong>
                    <span className="text-xs text-stone-500 font-light">
                      Raise a 6m Reciprocal Structural Pavilion
                    </span>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Interactive Syllabus Breakdown */}
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-mono uppercase tracking-[0.25em] font-semibold text-clay block mb-2">
                    5-Day Curriculum
                  </span>
                  <h3 className="font-heading text-3xl font-bold text-earth-900 dark:text-stone-100">
                    Step-by-Step Daily Learning Plan
                  </h3>
                </div>

                {/* Tab buttons */}
                <div className="flex flex-wrap gap-2">
                  {workshop.modules.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveTab(idx)}
                      className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all ${
                        activeTab === idx
                          ? 'bg-clay text-white font-bold shadow-md'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-earth-100 dark:hover:bg-stone-700 border border-earth-200 dark:border-stone-700'
                      }`}
                    >
                      {m.day}
                    </button>
                  ))}
                </div>

                {/* Active Tab Panel */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 rounded-3xl bg-white dark:bg-stone-800/90 border border-earth-200 dark:border-stone-700 shadow-md space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-earth-100 dark:border-stone-700">
                      <div>
                        <span className="text-xs font-mono uppercase tracking-wider text-clay font-semibold block">
                          {workshop.modules[activeTab].day} Intensive
                        </span>
                        <h4 className="font-heading text-2xl font-bold text-earth-900 dark:text-stone-100">
                          {workshop.modules[activeTab].title}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-stone-500 bg-earth-100 dark:bg-stone-900 px-3 py-1 rounded-lg">
                        {workshop.modules[activeTab].hours}
                      </span>
                    </div>

                    <p className="body-text text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                      {workshop.modules[activeTab].details}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-stone-500">
                      <span className="bg-earth-50 dark:bg-stone-900 px-2.5 py-1 rounded-md border border-earth-100 dark:border-stone-800">
                        &bull; Yard Exercises
                      </span>
                      <span className="bg-earth-50 dark:bg-stone-900 px-2.5 py-1 rounded-md border border-earth-100 dark:border-stone-800">
                        &bull; Safety Briefing
                      </span>
                      <span className="bg-earth-50 dark:bg-stone-900 px-2.5 py-1 rounded-md border border-earth-100 dark:border-stone-800">
                        &bull; 1-on-1 Joinery Critique
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Tools & Equipment Mastered */}
              <div className="p-8 rounded-3xl bg-earth-100/70 dark:bg-stone-800/70 border border-earth-200 dark:border-stone-700 space-y-4">
                <div className="flex items-center gap-2 text-clay">
                  <Wrench size={20} />
                  <h4 className="font-heading text-2xl font-bold text-earth-900 dark:text-stone-100">
                    Professional Tools You Will Master:
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workshop.tools.map((tool, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300 bg-white/80 dark:bg-stone-900/80 p-3 rounded-xl border border-earth-200/60 dark:border-stone-800">
                      <CheckCircle2 size={15} className="text-clay shrink-0" />
                      <span>{tool}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What is Included in Tuition */}
              <div className="space-y-4">
                <h4 className="font-heading text-2xl font-bold text-earth-900 dark:text-stone-100">
                  What is Included in Your Workshop Fee:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "All structural bamboo poles & steel node hardware",
                    "Individual safety PPE kit & Japanese saw usage",
                    "Daily wholesome organic farm-to-table lunch & teas",
                    "Auroville Green Practices (AGP) Official Certificate",
                    "AuroYali Bamboo Joinery Blueprint CAD Archive",
                    "Guided architectural tour of Auroville bamboo pavilions"
                  ].map((inc, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300 p-2">
                      <CheckCircle2 size={16} className="text-clay shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor Spotlight */}
              {workshop.instructor && (
                <div className="p-8 rounded-3xl bg-white dark:bg-stone-800 border border-earth-200 dark:border-stone-700 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <img
                    src={workshop.instructor.avatar}
                    alt={workshop.instructor.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-clay/30 shrink-0"
                  />
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-[10px] uppercase tracking-widest font-mono text-clay font-semibold block">
                      Lead Instructor Spotlight
                    </span>
                    <h4 className="font-heading text-2xl font-bold text-earth-900 dark:text-stone-100">
                      {workshop.instructor.name}
                    </h4>
                    <p className="text-xs text-stone-500 font-mono">
                      {workshop.instructor.role} &bull; {workshop.instructor.experience}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed pt-1">
                      Pioneered numerous curvilinear public and residential bamboo structures across South India. Passionate about passing down uncompromised craftsman rigor to the next generation of architects.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Sticky Admission Sidebar (4 Cols) */}
            <div className="lg:col-span-4 sticky top-36 space-y-6">
              
              <div className="bg-white dark:bg-stone-950 p-8 rounded-[2rem] border border-earth-200 dark:border-stone-800 space-y-6 shadow-2xl">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-clay font-mono block mb-1 font-bold">
                    Cohort Admission Open
                  </span>
                  <h4 className="font-heading text-3xl font-bold text-earth-900 dark:text-stone-100">
                    Reserve Your Bench
                  </h4>
                </div>

                <div className="p-5 rounded-2xl bg-earth-50 dark:bg-stone-900 border border-earth-200 dark:border-stone-800 space-y-1">
                  <span className="text-[11px] text-stone-500 font-mono block">Tuition Fee</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl text-clay font-bold">{workshop.fee}</span>
                    <span className="text-xs text-stone-400 font-mono">/ {workshop.internationalFee}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">Inclusive of all tools, materials, meals & tax</span>
                </div>

                <div className="space-y-3.5 text-xs text-stone-600 dark:text-stone-300 font-mono">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-clay shrink-0" />
                    <span>{workshop.dates}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-sage shrink-0" />
                    <span>{workshop.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users size={16} className="text-earth-600 shrink-0" />
                    <span>Strict cap: {workshop.totalSeats} ({spotsLeft} remaining)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Award size={16} className="text-clay shrink-0" />
                    <span>Official AGP Certification</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 rounded-xl bg-clay text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-clay/90 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Apply for Admission</span>
                </button>

                <p className="text-[11px] text-stone-400 text-center font-mono leading-relaxed">
                  Direct admission is processed on a first-come, first-served basis. No deposit required at initial application.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Global Interactive Modal */}
      <WorkshopEnrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedWorkshop={workshop}
      />

    </div>
  );
}
export default BambooWorkshop;
