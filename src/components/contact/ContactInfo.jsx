import React from 'react';
import { siteInfo } from '../../data/siteInfo';
import { MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export function ContactInfo() {
  return (
    <div className="bg-earth-900 text-stone-100 rounded-3xl p-8 md:p-12 border border-earth-800 space-y-8 shadow-2xl h-full flex flex-col justify-between">
      <div>
        <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-2">
          Direct Studio Details
        </span>
        <h3 className="font-heading text-3xl md:text-4xl text-earth-50 mb-4">
          Visit Our Auroville Studio
        </h3>
        <p className="text-stone-300 font-light text-sm md:text-base leading-relaxed mb-8">
          We welcome clients, collaborating architects, and workshop participants to our natural design studios and soil testing yard in the International Zone.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-earth-800 text-clay shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono block">
                Office & Workshops
              </span>
              <p className="text-stone-100 text-sm font-medium mt-0.5">
                {siteInfo.location.address}
              </p>
              <p className="text-stone-400 text-xs">
                {siteInfo.location.city}, {siteInfo.location.state} - {siteInfo.location.pincode}, {siteInfo.location.country}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-earth-800 text-clay shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono block">
                Direct Line / WhatsApp
              </span>
              <a
                href={`tel:${siteInfo.contact.phone}`}
                className="text-stone-100 hover:text-clay text-base font-semibold transition-colors mt-0.5 block"
              >
                {siteInfo.contact.phone}
              </a>
              <span className="text-stone-400 text-xs">Mon – Sat, 8:30 AM – 5:30 PM IST</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-earth-800 text-clay shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono block">
                Email Correspondence
              </span>
              <a
                href={`mailto:${siteInfo.contact.emailGeneral}`}
                className="text-stone-100 hover:text-clay text-sm font-medium transition-colors block mt-0.5"
              >
                {siteInfo.contact.emailGeneral} (General)
              </a>
              <a
                href={`mailto:${siteInfo.contact.emailDesign}`}
                className="text-stone-400 hover:text-clay text-xs transition-colors block"
              >
                {siteInfo.contact.emailDesign} (Architecture/Portfolio)
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-earth-800/80 border border-earth-700/60 text-xs text-stone-300 flex items-center gap-3">
        <ShieldCheck size={28} className="text-sage shrink-0" />
        <span>Auroville Foundation Registered Unit &bull; Bioclimatic Architectural Practice</span>
      </div>
    </div>
  );
}
export default ContactInfo;
