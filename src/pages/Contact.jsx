import React from 'react';
import { ContactInfo } from '../components/contact/ContactInfo';
import { ContactForm } from '../components/contact/ContactForm';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

// ============================================================================
// AUROYALI CONTACT & COMPANY CONFIGURATION
// All editable contact details, social links, services, and map URLs are stored here.
// ============================================================================
export const CONTACT_CONFIG = {
  company: {
    name: "AuroYali",
    tagline: "A unit under Auroville Universal Town",
    about:
      "We work to manifest a new consciousness in the field of building construction. Our aim is to develop ourselves into a model organization in providing multi-disciplinary services and products necessary for construction.",
    services: [
      "Block making",
      "Architectural design",
      "Metal fabrication",
      "Carpentry works",
      "Painting",
      "Other"
    ]
  },
  contact: {
    address: "International Zone, Kottakarai Village, Auroville, Tamil Nadu – 605101, India",
    phone: "+91 89400 00126",
    phoneSecondary: "+91 95855 50709",
    landline: "0413-2622411",
    email: "auroyali@auroville.org.in",
    emailDesign: "auroyali-design@auroville.org.in",
    workingHours: "Monday – Saturday: 9:00 AM – 5:30 PM (IST)",
    socialLinks: {
      instagram: "https://www.instagram.com/auroyali_auroville/",
      facebook: "https://www.facebook.com/people/auroyali_auroville/100072066965911/",
      linkedin: "https://www.linkedin.com/company/auroyali/"
    },
    mapEmbedUrl: "https://maps.google.com/maps?q=Auroyali,+International+Zone,+Kottakarai+Village,+Auroville,+Tamil+Nadu+605101&t=&z=15&ie=UTF8&iwloc=&output=embed",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Auroyali,+International+Zone,+Kottakarai+Village,+Auroville,+Tamil+Nadu+605101"
  }
};

export function Contact() {
  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-24 bg-earth-50 dark:bg-stone-950 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 md:space-y-16">
        {/* Hero / Page Header */}
        <div className="max-w-3xl px-1 sm:px-0 pt-2 sm:pt-3">
          <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-1.5 sm:mb-2.5 font-semibold">
            {CONTACT_CONFIG.company.tagline}
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-earth-900 dark:text-stone-100 tracking-tight mb-2.5 sm:mb-3.5">
            Connect with {CONTACT_CONFIG.company.name}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-stone-700 dark:text-stone-300 font-light leading-relaxed">
            {CONTACT_CONFIG.company.about}
          </p>
        </div>

        {/* Form and Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-7 w-full">
            <ContactForm config={CONTACT_CONFIG} />
          </div>

          <div className="lg:col-span-5 w-full lg:sticky lg:top-28">
            <ContactInfo config={CONTACT_CONFIG} />
          </div>
        </div>

        {/* Map Section Placed Below */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl border border-earth-200 dark:border-stone-800 p-4 sm:p-8 md:p-10 shadow-xl space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-earth-100 dark:border-stone-800 pb-5 sm:pb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-1 font-semibold">
                Studio & Workshop Yard
              </span>
              <h2 className="font-heading text-xl sm:text-3xl font-bold text-earth-900 dark:text-stone-100">
                Find Us in Auroville
              </h2>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1 flex items-start sm:items-center gap-1.5 leading-snug">
                <MapPin size={16} className="text-clay shrink-0 mt-0.5 sm:mt-0" />
                <span>{CONTACT_CONFIG.contact.address}</span>
              </p>
            </div>

            <a
              href={CONTACT_CONFIG.contact.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-clay hover:bg-earth-800 text-white text-xs uppercase tracking-wider font-mono transition-colors shadow-md shrink-0 self-start sm:self-auto"
            >
              <Navigation size={14} />
              <span>Get Directions</span>
              <ExternalLink size={12} className="opacity-75" />
            </a>
          </div>

          {/* Map Frame */}
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-earth-200 dark:border-stone-800 h-72 sm:h-96 md:h-[420px] w-full bg-earth-100 dark:bg-stone-800 shadow-inner">
            <iframe
              title="AuroYali Location Map"
              src={CONTACT_CONFIG.contact.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
