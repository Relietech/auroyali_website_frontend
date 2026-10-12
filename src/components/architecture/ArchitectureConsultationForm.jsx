import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  CheckCircle, 
  Home, 
  Building2, 
  GraduationCap, 
  Hammer, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Sparkles,
  Compass
} from 'lucide-react';
import { siteInfo } from '../../data/siteInfo';

const projectTypes = [
  { id: "residential", label: "Residential Eco-Villa", icon: Home },
  { id: "extension", label: "Home Extension / Renovation", icon: Hammer },
  { id: "institutional", label: "Institutional / Academy", icon: GraduationCap },
  { id: "commercial", label: "Commercial / Vaulted Space", icon: Building2 }
];

const timelineOptions = ["Immediate (1-3 Months)", "Upcoming (3-6 Months)", "Planning (6-12 Months)", "Just Exploring Ideas"];

export function ArchitectureConsultationForm() {
  const [projectType, setProjectType] = useState("residential");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    plotArea: "",
    timeline: "Upcoming (3-6 Months)",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="consultation-section" className="py-20 lg:py-28 bg-earth-50 relative overflow-hidden">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-clay/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Studio Contact & Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-clay/10 text-clay font-mono text-xs uppercase tracking-widest font-semibold">
                <Sparkles size={12} /> Studio Consultation
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-earth-900 leading-tight">
                Let&rsquo;s Discuss Your Architectural Vision
              </h2>
              <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
                Whether you have an empty plot of land in Auroville, Pondicherry, or anywhere in India, our architects are ready to guide you through feasibility, concept, and execution.
              </p>
            </div>

            {/* Direct Studio Contacts Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-earth-200/90 shadow-md space-y-6">
              <h4 className="font-heading text-xl font-bold text-earth-900 flex items-center gap-2">
                <Compass size={20} className="text-clay" /> AuroYali Architectural Office
              </h4>

              <div className="space-y-4 text-sm text-stone-700">
                <div className="flex items-start gap-3.5">
                  <MapPin size={18} className="text-clay shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-earth-900 block">Studio Location</span>
                    <span className="text-stone-600 font-light text-xs">
                      {siteInfo.location.address}, {siteInfo.location.city}, {siteInfo.location.state} - {siteInfo.location.pincode}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone size={18} className="text-clay shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-earth-900 block">Architectural Inquiries</span>
                    <a href={`tel:${siteInfo.contact.phone}`} className="text-stone-600 font-mono text-xs hover:text-clay">
                      {siteInfo.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail size={18} className="text-clay shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-earth-900 block">Direct Email</span>
                    <a href={`mailto:${siteInfo.contact.emailGeneral}`} className="text-stone-600 font-mono text-xs hover:text-clay">
                      {siteInfo.contact.emailGeneral}
                    </a>
                  </div>
                </div>
              </div>

              {/* Consultation Note */}
              <div className="p-4 rounded-2xl bg-earth-100/70 border border-earth-200 text-xs text-stone-600 font-light">
                🌿 We provide in-person site consultations across Tamil Nadu & Pondicherry, as well as digital consultations worldwide.
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Consultation Planner (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-earth-200/90 p-6 sm:p-8 lg:p-10 shadow-xl">
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-sage/20 text-sage flex items-center justify-center mx-auto">
                    <CheckCircle size={36} />
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-earth-900">
                    Consultation Request Received!
                  </h3>
                  <p className="text-stone-600 max-w-md mx-auto text-sm sm:text-base font-light">
                    Thank you, <span className="font-semibold text-earth-900">{formData.name}</span>. Our lead architects have received your project details and will contact you within 24-48 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-clay text-white text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Step 1: Project Type */}
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider font-semibold text-earth-900 mb-2.5">
                      1. Select Project Typology
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
                      {projectTypes.map((type) => {
                        const TypeIcon = type.icon;
                        const isSelected = projectType === type.id;
                        return (
                          <button
                            type="button"
                            key={type.id}
                            onClick={() => setProjectType(type.id)}
                            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-earth-100 border-clay text-earth-900 ring-1 ring-clay'
                                : 'bg-earth-50 hover:bg-earth-100/60 border-earth-200 text-stone-700'
                            }`}
                          >
                            <TypeIcon size={16} className={isSelected ? 'text-clay' : 'text-stone-500'} />
                            <span className="text-xs font-medium">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Client Info Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-earth-900 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anandha Krishnan"
                        className="w-full px-4 py-3 rounded-xl bg-earth-50 border border-earth-200 text-sm focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-earth-900 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. anand@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-earth-50 border border-earth-200 text-sm focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-earth-900 mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-earth-50 border border-earth-200 text-sm focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-earth-900 mb-1.5">
                        Site Location / City *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Auroville / Chennai / Bangalore"
                        className="w-full px-4 py-3 rounded-xl bg-earth-50 border border-earth-200 text-sm focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
                      />
                    </div>
                  </div>

                  {/* Step 3: Timeline & Plot Area */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-earth-900 mb-1.5">
                        Estimated Plot / Built Area
                      </label>
                      <input
                        type="text"
                        value={formData.plotArea}
                        onChange={(e) => setFormData({ ...formData, plotArea: e.target.value })}
                        placeholder="e.g. 2,500 sq.ft or 1 Acre"
                        className="w-full px-4 py-3 rounded-xl bg-earth-50 border border-earth-200 text-sm focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-earth-900 mb-1.5">
                        Project Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-earth-50 border border-earth-200 text-sm focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
                      >
                        {timelineOptions.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Step 4: Vision & Message */}
                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-earth-900 mb-1.5">
                      Tell us about your spatial aspirations & vision
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share any specific requirements: courtyards, CSEB walls, number of bedrooms, eco-features, etc."
                      className="w-full px-4 py-3 rounded-xl bg-earth-50 border border-earth-200 text-sm focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-full bg-clay hover:bg-clay/90 text-white font-mono text-xs uppercase tracking-widest font-semibold transition-all shadow-lg hover:shadow-clay/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Architectural Consultation</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-stone-500 font-light">
                    🔒 We respect your privacy. Your information is only used by AuroYali architects for this consultation.
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default ArchitectureConsultationForm;
