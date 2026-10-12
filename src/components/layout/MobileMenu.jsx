import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { siteInfo } from '../../data/siteInfo';

export function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  // Open services accordion automatically if on a services page
  const [isServicesOpen, setIsServicesOpen] = useState(() => location.pathname.startsWith('/services'));

  const prevPathname = React.useRef(location.pathname);

  // Close only when route actually changes, NOT on initial mount
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      onClose();
    }
  }, [location.pathname, onClose]);

  // Strictly lock background body & document scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.touchAction = originalTouchAction;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const serviceSublinks = [
    {
      shortTitle: 'Architecture',
      path: '/services/architecture',
    },
    {
      shortTitle: 'CSEB & Natural Construction',
      path: '/services/construction',
    },
    {
      shortTitle: 'Artisanal Carpentry & Bamboo',
      path: '/services/carpentry',
    },
    {
      shortTitle: 'Precision Metal Fabrication',
      path: '/services/metal-fabrication',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-[#2F1F13]/60 backdrop-blur-sm touch-none"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-[340px] sm:max-w-sm bg-[#FAF7F2] h-[100dvh] shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#E5D7C5] z-10 select-none"
      >
        {/* Top Header - Fixed & pinned */}
        <div className="shrink-0 px-5 py-4 border-b border-[#E5D7C5] flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#B5532F] text-white flex items-center justify-center font-heading text-base font-black shadow-sm">
              AY
            </div>
            <div>
              <span className="font-heading text-lg font-bold tracking-[0.16em] text-[#2F1F13] block leading-none">
                AUROYALI
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#B5532F] uppercase block mt-0.5">
                Earth & Architecture
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F1E8DC] hover:bg-[#B5532F] text-[#2F1F13] hover:text-white border border-[#E5D7C5] flex items-center justify-center transition-colors cursor-pointer shadow-xs active:scale-95"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main Navigation Links - The ONLY scrollable container */}
        <div className="flex-1 px-4 py-3 overflow-y-auto overflow-x-hidden overscroll-contain space-y-1.5 no-scrollbar">
          {/* Home */}
          <NavLink
            to="/"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-heading text-base font-bold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#B5532F] text-white shadow-sm'
                  : 'text-[#2F1F13] hover:bg-white/80 hover:text-[#B5532F]'
              }`
            }
          >
            <span>Home</span>
            <ArrowRight size={14} className="opacity-70" />
          </NavLink>

          {/* About Us */}
          <NavLink
            to="/about"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-heading text-base font-bold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#B5532F] text-white shadow-sm'
                  : 'text-[#2F1F13] hover:bg-white/80 hover:text-[#B5532F]'
              }`
            }
          >
            <span>About Us</span>
            <ArrowRight size={14} className="opacity-70" />
          </NavLink>

          {/* Services & Practices Accordion */}
          <div className="rounded-xl border border-[#E5D7C5] bg-white/70 overflow-hidden my-1 shadow-xs">
            <button
              type="button"
              onClick={() => setIsServicesOpen(prev => !prev)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 font-heading text-base font-bold tracking-wide text-[#2F1F13] hover:text-[#B5532F] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span>Services & Practices</span>
              </div>
              <ChevronDown
                size={15}
                className={`text-[#B5532F] transition-transform duration-300 ${
                  isServicesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isServicesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-2.5 pb-2.5 space-y-1 border-t border-[#E5D7C5]/60 bg-[#FAF7F2]/80"
                >
                  {serviceSublinks.map((sub, idx) => {
                    const isSubActive = location.pathname === sub.path;
                    return (
                      <NavLink
                        key={idx}
                        to={sub.path}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                          isSubActive
                            ? 'bg-[#B5532F] text-white shadow-xs font-bold'
                            : 'text-[#524336] hover:bg-white hover:text-[#B5532F]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubActive ? 'bg-white' : 'bg-[#B5532F]'}`} />
                          <span>{sub.shortTitle}</span>
                        </div>
                        <ArrowRight size={12} className={isSubActive ? 'text-white' : 'text-[#865430]/50'} />
                      </NavLink>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Projects & Portfolios */}
          <NavLink
            to="/projects"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-heading text-base font-bold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#B5532F] text-white shadow-sm'
                  : 'text-[#2F1F13] hover:bg-white/80 hover:text-[#B5532F]'
              }`
            }
          >
            <span>Projects & Portfolios</span>
            <ArrowRight size={14} className="opacity-70" />
          </NavLink>

          {/* Natural Building Workshops */}
          <NavLink
            to="/workshops"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-heading text-base font-bold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#B5532F] text-white shadow-sm'
                  : 'text-[#2F1F13] hover:bg-white/80 hover:text-[#B5532F]'
              }`
            }
          >
            <span>Natural Building Workshops</span>
            <ArrowRight size={14} className="opacity-70" />
          </NavLink>

          {/* Contact Us */}
          <NavLink
            to="/contact"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-heading text-base font-bold tracking-wide transition-all ${
                isActive
                  ? 'bg-[#B5532F] text-white shadow-sm'
                  : 'text-[#2F1F13] hover:bg-white/80 hover:text-[#B5532F]'
              }`
            }
          >
            <span>Contact Us</span>
            <ArrowRight size={14} className="opacity-70" />
          </NavLink>
        </div>

        {/* Footer Info & Action - Fixed & pinned */}
        <div className="shrink-0 p-4 sm:p-5 border-t border-[#E5D7C5] bg-white/85 backdrop-blur-md space-y-2.5">
          <div className="space-y-1.5 text-xs font-mono text-[#524336]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center shrink-0">
                <Phone size={11} className="text-[#B5532F]" />
              </div>
              <a href="tel:+919585550709" className="hover:text-[#B5532F] font-semibold transition-colors text-[11px] sm:text-xs">
                +91 9585550709
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center shrink-0">
                <Mail size={11} className="text-[#B5532F]" />
              </div>
              <a href="mailto:auroyali@auroville.org.in" className="hover:text-[#B5532F] transition-colors truncate text-[11px] sm:text-xs">
                auroyali@auroville.org.in
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center shrink-0">
                <MapPin size={11} className="text-[#B5532F]" />
              </div>
              <span className="text-[11px] sm:text-xs">Auroville, Tamil Nadu</span>
            </div>
          </div>

          <Link
            to="/contact"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#B5532F] to-[#865430] hover:brightness-110 text-white font-mono text-[11px] uppercase tracking-widest font-bold rounded-full transition-all shadow-md active:scale-98 text-center mt-1"
          >
            <span>Inquire Project</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default MobileMenu;
