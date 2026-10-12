import React from 'react';
import { motion } from 'framer-motion';
import { School, Users, Calendar, MapPin, CheckCircle2, Mail, Phone, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { customGroupInfo } from '../../data/workshops';

export function CustomGroupWorkshopSection({ onInquireClick }) {
  return (
    <section className="py-24 bg-earth-900 text-stone-100 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-clay/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sage/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-earth-800 border border-earth-700 text-clay text-xs font-mono font-medium">
              <School size={14} />
              <span>For Architecture Colleges & Institutions</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-earth-50 tracking-tight leading-tight">
              {customGroupInfo.title}
            </h2>

            <p className="body-text text-stone-300 font-light leading-relaxed">
              {customGroupInfo.description}
            </p>

            <div className="space-y-3 pt-2">
              {customGroupInfo.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-200">
                  <CheckCircle2 size={16} className="text-clay shrink-0 mt-0.5" />
                  <span className="leading-snug">{feature}</span>
                </div>
              ))}
            </div>

            {/* Quick Contact Line */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-stone-300 border-t border-earth-800">
              <a 
                href={`mailto:${customGroupInfo.contactEmail}?subject=University Workshop Inquiry at AuroYali`}
                className="flex items-center gap-2 text-earth-200 hover:text-clay transition-colors"
              >
                <Mail size={15} className="text-clay" />
                <span>{customGroupInfo.contactEmail}</span>
              </a>

              <a 
                href={`tel:${customGroupInfo.contactPhone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 text-earth-200 hover:text-clay transition-colors"
              >
                <Phone size={15} className="text-clay" />
                <span>{customGroupInfo.contactPhone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Card */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl bg-earth-800/90 border border-earth-700/80 shadow-2xl backdrop-blur-md space-y-6">
              
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-clay tracking-widest block font-bold">
                  Curate a Tailored Program
                </span>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Bring Your Cohort to Auroville
                </h3>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Tell us your preferred batch size, dates, and focus areas (Bamboo, Earth/CSEB, Ferrocement, Roofing, or Oxide Plasters).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-earth-900/80 border border-earth-700/60 space-y-2 text-xs font-mono text-stone-300">
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Typical Cohort Size:</span>
                  <span className="font-bold text-white">15 to 40 Students</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Duration Range:</span>
                  <span className="font-bold text-white">3 Days to 10 Days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Location:</span>
                  <span className="font-bold text-white">AuroYali Yard, Auroville</span>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${customGroupInfo.contactEmail}?subject=University/Group Workshop Inquiry&body=Hello AuroYali Team,%0D%0A%0D%0AWe would like to organize a custom workshop for our institution:%0D%0A- Institution Name:%0D%0A- Number of Participants:%0D%0A- Preferred Dates:%0D%0A- Focus Topics (Bamboo / CSEB / Ferrocement / Alternative Roofing / Lime):%0D%0A%0D%0AThank you!`}
                  className="w-full py-4 rounded-xl bg-clay text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-clay/90 transition-all shadow-lg flex items-center justify-center gap-2 text-center"
                >
                  <Sparkles size={16} />
                  <span>Request Institutional Proposal</span>
                </a>

                <p className="text-[11px] text-stone-400 text-center font-mono">
                  Direct reply within 24 hours with custom itinerary & fee structure.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
export default CustomGroupWorkshopSection;
