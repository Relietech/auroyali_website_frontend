import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { X, Phone, Mail, MapPin } from 'lucide-react';
import { siteInfo } from '../../data/siteInfo';

export function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative ml-auto w-full max-w-sm bg-earth-50 dark:bg-stone-900 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-earth-200 dark:border-stone-800">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-earth-200 dark:border-stone-800">
            <div>
              <span className="font-heading text-2xl font-bold tracking-widest text-earth-900 dark:text-stone-100">
                AUROYALI
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-clay font-mono">
                Auroville &bull; Tamil Nadu
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-earth-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="py-6 flex flex-col space-y-4">
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `text-lg font-heading tracking-wide transition-colors ${
                  isActive ? 'text-clay font-semibold' : 'text-stone-800 dark:text-stone-200'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              onClick={onClose}
              className={({ isActive }) =>
                `text-lg font-heading tracking-wide transition-colors ${
                  isActive ? 'text-clay font-semibold' : 'text-stone-800 dark:text-stone-200'
                }`
              }
            >
              About Us
            </NavLink>

            <div className="pt-2 pb-1 border-y border-earth-200/60 dark:border-stone-800/60 space-y-2">
              <span className="text-xs uppercase tracking-widest text-stone-400 font-mono block mb-2">
                Services & Practices
              </span>
              <Link
                to="/services/architecture"
                onClick={onClose}
                className="block text-sm text-stone-700 dark:text-stone-300 hover:text-clay py-1 pl-2 border-l-2 border-transparent hover:border-clay"
              >
                Bioclimatic Architecture
              </Link>
              <Link
                to="/services/construction"
                onClick={onClose}
                className="block text-sm text-stone-700 dark:text-stone-300 hover:text-clay py-1 pl-2 border-l-2 border-transparent hover:border-clay"
              >
                CSEB & Natural Construction
              </Link>
              <Link
                to="/services/carpentry"
                onClick={onClose}
                className="block text-sm text-stone-700 dark:text-stone-300 hover:text-clay py-1 pl-2 border-l-2 border-transparent hover:border-clay"
              >
                Artisanal Carpentry & Bamboo
              </Link>
              <Link
                to="/services/metal-fabrication"
                onClick={onClose}
                className="block text-sm text-stone-700 dark:text-stone-300 hover:text-clay py-1 pl-2 border-l-2 border-transparent hover:border-clay"
              >
                Precision Metal Fabrication
              </Link>
            </div>

            <NavLink
              to="/projects"
              onClick={onClose}
              className={({ isActive }) =>
                `text-lg font-heading tracking-wide transition-colors ${
                  isActive ? 'text-clay font-semibold' : 'text-stone-800 dark:text-stone-200'
                }`
              }
            >
              Projects & Portfolios
            </NavLink>
            <NavLink
              to="/workshops"
              onClick={onClose}
              className={({ isActive }) =>
                `text-lg font-heading tracking-wide transition-colors ${
                  isActive ? 'text-clay font-semibold' : 'text-stone-800 dark:text-stone-200'
                }`
              }
            >
              Natural Building Workshops
            </NavLink>

            <NavLink
              to="/contact"
              onClick={onClose}
              className={({ isActive }) =>
                `text-lg font-heading tracking-wide transition-colors ${
                  isActive ? 'text-clay font-semibold' : 'text-stone-800 dark:text-stone-200'
                }`
              }
            >
              Contact Us
            </NavLink>
          </nav>
        </div>

        <div className="pt-6 border-t border-earth-200 dark:border-stone-800 space-y-3 text-xs text-stone-600 dark:text-stone-400">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-clay" />
            <a href={`tel:${siteInfo.contact.phone}`} className="hover:underline">
              {siteInfo.contact.phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-clay" />
            <a href={`mailto:${siteInfo.contact.emailGeneral}`} className="hover:underline">
              {siteInfo.contact.emailGeneral}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-clay" />
            <span>{siteInfo.location.city}, {siteInfo.location.state}</span>
          </div>

          <Link
            to="/contact"
            onClick={onClose}
            className="w-full mt-4 block text-center py-2.5 px-4 bg-clay hover:bg-earth-700 text-white font-medium rounded-full transition-colors text-xs tracking-wider uppercase"
          >
            Consult Our Architects
          </Link>
        </div>
      </div>
    </div>
  );
}
export default MobileMenu;
