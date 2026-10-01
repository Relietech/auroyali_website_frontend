import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, ChevronDown } from 'lucide-react';
import { siteInfo } from '../../data/siteInfo';
import { ServicesDropdown } from './ServicesDropdown';
import { MobileMenu } from './MobileMenu';
import { useScrollPosition } from '../../hooks/useScrollPosition';

export function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isScrolled } = useScrollPosition();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-earth-50/95 backdrop-blur-md shadow-md py-3.5 border-b border-earth-200/60'
            : 'bg-earth-50/80 backdrop-blur-sm py-4 border-b border-earth-200/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-clay text-white flex items-center justify-center font-heading text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                AY
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold tracking-[0.2em] text-earth-900 leading-none">
                  AUROYALI
                </span>
                <span className="text-[10px] tracking-widest uppercase text-earth-700 font-sans font-medium mt-0.5">
                  Auroville Architecture
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link relative py-1 font-medium transition-colors ${
                    isActive ? 'text-clay font-bold' : 'text-earth-900 hover:text-clay'
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `nav-link relative py-1 font-medium transition-colors ${
                    isActive ? 'text-clay font-bold' : 'text-earth-900 hover:text-clay'
                  }`
                }
              >
                About
              </NavLink>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  className="nav-link flex items-center gap-1.5 py-1 text-earth-900 font-medium hover:text-clay transition-colors"
                >
                  Services <ChevronDown size={14} className={`transition-transform duration-200 ${isServicesOpen ? 'rotate-180 text-clay' : ''}`} />
                </button>
                {isServicesOpen && (
                  <ServicesDropdown onClose={() => setIsServicesOpen(false)} />
                )}
              </div>

              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `nav-link relative py-1 font-medium transition-colors ${
                    isActive ? 'text-clay font-bold' : 'text-earth-900 hover:text-clay'
                  }`
                }
              >
                Projects
              </NavLink>

              <NavLink
                to="/workshops"
                className={({ isActive }) =>
                  `nav-link relative py-1 font-medium transition-colors ${
                    isActive ? 'text-clay font-bold' : 'text-earth-900 hover:text-clay'
                  }`
                }
              >
                Workshops
              </NavLink>

              <NavLink
                to="/testimonials"
                className={({ isActive }) =>
                  `nav-link relative py-1 font-medium transition-colors ${
                    isActive ? 'text-clay font-bold' : 'text-earth-900 hover:text-clay'
                  }`
                }
              >
                Testimonials
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `nav-link relative py-1 font-medium transition-colors ${
                    isActive ? 'text-clay font-bold' : 'text-earth-900 hover:text-clay'
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/contact"
                className="px-5 py-2.5 bg-earth-900 hover:bg-clay text-white rounded-full text-xs uppercase tracking-widest font-medium transition-all shadow-md hover:shadow-lg"
              >
                Inquire Project
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 lg:hidden rounded-lg bg-earth-200 text-earth-900 hover:text-clay transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
export default Navbar;
