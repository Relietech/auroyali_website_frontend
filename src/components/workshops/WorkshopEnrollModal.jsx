import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Award, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { workshopsData } from '../../data/workshops';
import { createLead } from '../../services/leadStore';

const easeCubic = [0.22, 1, 0.36, 1];

export function WorkshopEnrollModal({ isOpen, onClose, selectedWorkshop }) {
  const [currentWorkshopId, setCurrentWorkshopId] = useState(
    selectedWorkshop?.id || workshopsData[0]?.id
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: 'Architect / Designer',
    comments: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync when selectedWorkshop prop changes
  useEffect(() => {
    if (selectedWorkshop?.id) {
      setCurrentWorkshopId(selectedWorkshop.id);
    }
  }, [selectedWorkshop]);

  // Lock background scroll and pause Lenis smooth scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Pause Lenis smooth scroll while modal is open so it doesn't intercept wheel events
      if (window.lenis) {
        window.lenis.stop();
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        if (window.lenis) {
          window.lenis.start();
        }
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeWorkshop = workshopsData.find(w => w.id === currentWorkshopId) || workshopsData[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      createLead({
        category: 'workshop',
        source: 'Workshop Cohort Modal (/workshops)',
        title: `${activeWorkshop?.title || 'Workshop'} Enrollment`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profession: formData.profession,
        workshopTitle: activeWorkshop?.title || '',
        batch: activeWorkshop?.dates || activeWorkshop?.nextBatch || 'Upcoming Cohort',
        fee: activeWorkshop?.fee || '',
        location: activeWorkshop?.location || 'AuroYali Soil Lab & Block Yard, Auroville',
        service: 'Workshop Enrollment',
        message: formData.comments,
        comments: formData.comments,
        priority: 'high'
      });
    } catch (err) {
      console.error('Error logging workshop lead:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 850);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        data-lenis-prevent
        className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto"
      >
        
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#14100C]/80 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: easeCubic }}
          data-lenis-prevent
          className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-[24px] sm:rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.35)] border border-[#E5D7C5] overflow-hidden z-10 max-h-[92dvh] lg:h-[85vh] flex flex-col my-auto text-[#2F1F13] font-body"
        >
          {/* Close Button Top-Right Floating */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#2F1F13] border border-[#E5D7C5] flex items-center justify-center shadow-md transition-all duration-200 hover:rotate-90 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>

          <div 
            data-lenis-prevent
            className="flex flex-col lg:grid lg:grid-cols-12 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden"
          >
            
            {/* Left Sidebar / Workshop Card Preview */}
            <div className="lg:col-span-5 bg-[#1F1610] text-[#FAF7F2] p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-[#3D2D23]">
              
              {/* Background ambient glow & cover image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={activeWorkshop.coverImage} 
                  alt={activeWorkshop.title} 
                  className="w-full h-full object-cover opacity-20 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F1610] via-[#1F1610]/90 to-[#1F1610]/75" />
              </div>

              {/* Sidebar Content */}
              <div className="relative z-10 space-y-3 sm:space-y-5">
                
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#B5532F]/20 border border-[#B5532F]/40 text-[#C98A4B] text-[9px] sm:text-[11px] font-mono uppercase tracking-widest font-bold">
                  <Sparkles size={11} className="text-[#C98A4B]" />
                  <span>Auroville Masterclass</span>
                </div>

                {/* Workshop Title */}
                <div>
                  <h3 className="font-heading font-black text-lg sm:text-2xl lg:text-3xl leading-snug sm:leading-tight text-white pr-8 lg:pr-0">
                    {activeWorkshop.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs lg:text-sm text-[#FAF7F2]/80 font-light leading-relaxed mt-1 line-clamp-2 sm:line-clamp-none">
                    {activeWorkshop.tagline}
                  </p>
                </div>

                {/* Meta details: Compact 3-col grid on mobile / Stacked on desktop */}
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-1.5 sm:gap-2.5 pt-1">
                  
                  {/* Schedule */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 text-center lg:text-left text-[10px] sm:text-xs font-mono text-[#FAF7F2]/90 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-3">
                    <Calendar size={14} className="text-[#C98A4B] shrink-0 sm:w-4 sm:h-4" />
                    <div className="w-full overflow-hidden">
                      <span className="text-[8px] sm:text-[10px] text-white/50 block uppercase tracking-wider">Dates</span>
                      <span className="font-semibold block truncate">{activeWorkshop.dates.split('202')[0]}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 text-center lg:text-left text-[10px] sm:text-xs font-mono text-[#FAF7F2]/90 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-3">
                    <MapPin size={14} className="text-[#7A8B69] shrink-0 sm:w-4 sm:h-4" />
                    <div className="w-full overflow-hidden">
                      <span className="text-[8px] sm:text-[10px] text-white/50 block uppercase tracking-wider">Place</span>
                      <span className="font-semibold block truncate">Auroville</span>
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 text-center lg:text-left text-[10px] sm:text-xs font-mono text-[#FAF7F2]/90 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-3">
                    <Award size={14} className="text-[#B5532F] shrink-0 sm:w-4 sm:h-4" />
                    <div className="w-full overflow-hidden">
                      <span className="text-[8px] sm:text-[10px] text-white/50 block uppercase tracking-wider">Fee</span>
                      <span className="font-semibold text-[#C98A4B] block truncate">{activeWorkshop.fee}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Sidebar Footer Quote - desktop only */}
              <div className="relative z-10 pt-4 mt-4 border-t border-white/10 hidden lg:block">
                <p className="text-xs text-white/70 italic font-light leading-relaxed">
                  "Hands-on building with raw earth and bio-materials. Certificate granted upon completion."
                </p>
              </div>

            </div>

            {/* Right Form Area (Smooth Scrollable Container) */}
            <div 
              data-lenis-prevent
              className="lg:col-span-7 p-4 sm:p-6 md:p-8 bg-[#FAF7F2] overflow-y-auto min-h-0 flex-1 overscroll-contain"
            >
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 sm:py-12 space-y-4 sm:space-y-5"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#7A8B69]/15 text-[#7A8B69] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={36} className="sm:w-11 sm:h-11" />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#B5532F] font-bold">
                      Seat Reserved
                    </span>
                    <h4 className="font-heading font-black text-2xl sm:text-4xl text-[#2F1F13]">
                      Application Received!
                    </h4>
                  </div>

                  <p className="text-xs sm:text-sm text-[#524336] max-w-md mx-auto leading-relaxed font-light">
                    Thank you, <strong>{formData.name || 'Friend'}</strong>. Our workshop coordinator will review your registration and email your confirmation kit within 24 hours.
                  </p>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F1E8DC] border border-[#E5D7C5] text-xs font-mono text-[#2F1F13] max-w-md mx-auto space-y-1 text-left">
                    <div className="flex justify-between">
                      <span className="text-[#524336]">Course:</span>
                      <strong className="text-[#B5532F] truncate ml-2">{activeWorkshop.title}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#524336]">Dates:</span>
                      <strong>{activeWorkshop.dates}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-[#B5532F] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#9C4424] transition-all shadow-md active:scale-95 cursor-pointer mt-3 sm:mt-4"
                  >
                    Done & Return to Workshops
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 pb-4">
                  
                  {/* Header title */}
                  <div>
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[#B5532F] font-bold block mb-0.5">
                      Direct Enrollment
                    </span>
                    <h2 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-[#2F1F13] tracking-tight">
                      Masterclass Registration
                    </h2>
                  </div>

                  {/* Course Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center justify-between">
                      <span>Choose Masterclass Topic</span>
                      <span className="text-[10px] text-[#B5532F] font-normal">5 Cohorts Available</span>
                    </label>

                    <div className="relative">
                      <select
                        value={currentWorkshopId}
                        onChange={(e) => setCurrentWorkshopId(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 sm:py-3 pr-10 rounded-xl sm:rounded-2xl bg-white border border-[#E5D7C5] text-xs sm:text-sm font-medium text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 focus:border-[#B5532F] shadow-xs cursor-pointer transition-all"
                      >
                        {workshopsData.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#524336] pointer-events-none" />
                    </div>
                  </div>

                  {/* Personal info fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center gap-1.5">
                        <User size={12} className="text-[#B5532F]" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maya Chen"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] placeholder:text-[#524336]/40 focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 focus:border-[#B5532F] shadow-xs transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center gap-1.5">
                        <Mail size={12} className="text-[#B5532F]" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="maya@studio.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] placeholder:text-[#524336]/40 focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 focus:border-[#B5532F] shadow-xs transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone & Profession */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center gap-1.5">
                        <Phone size={12} className="text-[#B5532F]" />
                        <span>Phone / WhatsApp *</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] placeholder:text-[#524336]/40 focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 focus:border-[#B5532F] shadow-xs transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center gap-1.5">
                        <Briefcase size={12} className="text-[#B5532F]" />
                        <span>Profession</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.profession}
                          onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                          className="w-full appearance-none px-3.5 py-2.5 sm:py-3 pr-10 rounded-xl sm:rounded-2xl bg-white border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 focus:border-[#B5532F] shadow-xs cursor-pointer transition-all"
                        >
                          <option>Architect / Spatial Designer</option>
                          <option>Civil / Structural Engineer</option>
                          <option>Architecture Student / Researcher</option>
                          <option>Contractor / Master Builder</option>
                          <option>Homeowner / Eco Enthusiast</option>
                          <option>Artisan / Craftsperson</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#524336] pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Additional Note */}
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center gap-1.5">
                      <MessageSquare size={12} className="text-[#B5532F]" />
                      <span>Goals or Dietary Notes (Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tell us what you are hoping to build or any dietary preferences..."
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] placeholder:text-[#524336]/40 focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 focus:border-[#B5532F] shadow-xs resize-none transition-all"
                    />
                  </div>

                  {/* Guarantee info */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F4EDE2] border border-[#E3D6C4]">
                    <ShieldCheck size={13} className="text-[#7A8B69] shrink-0" />
                    <span className="text-[10px] sm:text-[11px] leading-snug text-[#524336]">
                      <strong className="text-[#2F1F13] font-semibold">No advance payment required.</strong> Seat verified within 24h.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#B5532F] via-[#A04625] to-[#865430] text-white font-mono text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer active:scale-98"
                    >
                      {isSubmitting ? (
                        <span>Reserving Your Seat...</span>
                      ) : (
                        <>
                          <span>Submit Registration</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default WorkshopEnrollModal;
