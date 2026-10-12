import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Instagram, Facebook, Linkedin } from 'lucide-react';

export function ContactInfo({ config }) {
  const company = config?.company || {
    name: "AuroYali",
    tagline: "A unit under Auroville Universal Town",
    about: "We work to manifest a new consciousness in the field of building construction."
  };

  const contact = config?.contact || {
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
    }
  };

  return (
    <div className="bg-earth-900 text-stone-100 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-earth-800 space-y-6 sm:space-y-8 shadow-2xl h-full flex flex-col justify-between w-full">
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-1.5 sm:mb-2 font-semibold">
            {company.tagline}
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl text-earth-50 font-bold mb-2 sm:mb-3">
            Contact {company.name}
          </h3>
          <p className="text-stone-300 font-light text-xs sm:text-sm md:text-base leading-relaxed">
            Reach out to our team for multidisciplinary construction services, consultations, architectural planning, and custom building inquiries.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5 pt-1 sm:pt-2">
          {/* Address */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-earth-800 text-clay shrink-0">
              <MapPin size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono block">
                Office & Workshop Address
              </span>
              <p className="text-stone-100 font-medium text-xs sm:text-sm mt-0.5 leading-snug">
                {contact.address}
              </p>
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-earth-800 text-clay shrink-0">
              <Phone size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono block">
                Direct Lines & WhatsApp
              </span>
              <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1">
                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-stone-100 hover:text-clay text-sm sm:text-base font-semibold transition-colors block"
                >
                  {contact.phone}
                </a>
                {contact.phoneSecondary && (
                  <>
                    <span className="text-stone-500 text-xs">&bull;</span>
                    <a
                      href={`tel:${contact.phoneSecondary.replace(/[^0-9+]/g, '')}`}
                      className="text-stone-300 hover:text-clay text-xs sm:text-sm transition-colors block"
                    >
                      {contact.phoneSecondary}
                    </a>
                  </>
                )}
              </div>
              {contact.landline && (
                <span className="text-stone-400 text-xs block">
                  Landline: <a href={`tel:${contact.landline.replace(/[^0-9+]/g, '')}`} className="hover:text-clay">{contact.landline}</a>
                </span>
              )}
            </div>
          </div>

          {/* Email Addresses */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-earth-800 text-clay shrink-0">
              <Mail size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono block">
                Email Correspondence
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="text-stone-100 hover:text-clay text-xs sm:text-sm font-medium transition-colors block break-all"
              >
                {contact.email} <span className="text-[11px] sm:text-xs text-stone-400 font-normal">(Construction & General)</span>
              </a>
              {contact.emailDesign && (
                <a
                  href={`mailto:${contact.emailDesign}`}
                  className="text-stone-300 hover:text-clay text-xs transition-colors block break-all"
                >
                  {contact.emailDesign} <span className="text-stone-400">(Architecture & Design)</span>
                </a>
              )}
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-earth-800 text-clay shrink-0">
              <Clock size={18} className="sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono block">
                Working Hours
              </span>
              <p className="text-stone-200 text-xs sm:text-sm mt-0.5">
                {contact.workingHours}
              </p>
            </div>
          </div>

          {/* Social Links */}
          {contact.socialLinks && (
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-earth-800 text-clay shrink-0">
                <ShieldCheck size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 w-full">
                <span className="text-xs uppercase tracking-wider text-stone-400 font-mono block mb-2">
                  Social Channels
                </span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {contact.socialLinks.instagram && contact.socialLinks.instagram !== 'none' && (
                    <a
                      href={contact.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="AuroYali Instagram"
                      className="px-2.5 py-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-earth-800 hover:bg-clay text-stone-200 hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Instagram size={15} />
                      <span>Instagram</span>
                    </a>
                  )}
                  {contact.socialLinks.facebook && contact.socialLinks.facebook !== 'none' && (
                    <a
                      href={contact.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="AuroYali Facebook"
                      className="px-2.5 py-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-earth-800 hover:bg-clay text-stone-200 hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Facebook size={15} />
                      <span>Facebook</span>
                    </a>
                  )}
                  {contact.socialLinks.linkedin && contact.socialLinks.linkedin !== 'none' && (
                    <a
                      href={contact.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="AuroYali LinkedIn"
                      className="px-2.5 py-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-earth-800 hover:bg-clay text-stone-200 hover:text-white transition-colors inline-flex items-center gap-1.5 text-xs font-medium"
                    >
                      <Linkedin size={15} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Unit Badge */}
      <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-earth-800/80 border border-earth-700/60 text-xs text-stone-300 flex items-center gap-2.5 sm:gap-3 mt-4 sm:mt-6">
        <ShieldCheck size={22} className="text-sage shrink-0" />
        <span className="text-[11px] sm:text-xs">{company.tagline} &bull; Model Construction Organization</span>
      </div>
    </div>
  );
}

export default ContactInfo;
