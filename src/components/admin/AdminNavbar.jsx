import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Download,
  Bell,
  ArrowUpRight
} from 'lucide-react';
import { exportProjectsToJSON } from '../../services/projectStore';

export function AdminNavbar({ onOpenMobileMenu }) {
  const location = useLocation();

  // Simple breadcrumb determination
  const getBreadcrumb = () => {
    if (location.pathname.includes('/admin/hero')) return 'Hero 3D Studio & Model Manager';
    if (location.pathname.includes('/admin/material')) return '3D Material Studio Manager';
    if (location.pathname.includes('/admin/team')) return 'About Page Team & Guild';
    if (location.pathname.includes('/admin/projects')) return 'Projects Management';
    if (location.pathname.includes('/admin/workshops')) return 'Workshops & Offerings';
    if (location.pathname.includes('/admin/workshop-inquiries') || location.pathname.includes('/admin/workshop-leads')) return 'Workshop Enquiries & Cohorts';
    if (location.pathname.includes('/admin/inquiries') || location.pathname.includes('/admin/leads')) return 'Contact Inbound Leads';
    return 'Console Overview';
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5D7C5] px-4 sm:px-6 lg:px-8 py-3 transition-all select-none font-body">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2] text-[#2F1F13] hover:text-[#B5532F] transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5532F] font-bold">
                Console
              </span>
              <span className="text-xs text-[#865430]/40">/</span>
              <span className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold truncate max-w-[200px] sm:max-w-none">
                {getBreadcrumb()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status pill, quick export, public site link, user profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Sync Status */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A8B69]/10 border border-[#7A8B69]/25 text-[#5C6E4B] text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B69] animate-pulse" />
            <span>Store Synced</span>
          </div>

          {/* Quick Export JSON */}
          <button
            type="button"
            onClick={exportProjectsToJSON}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EBE0] border border-[#E5D7C5] text-[#524336] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            title="Download JSON portfolio backup"
          >
            <Download size={13} />
            <span className="hidden lg:inline">Export</span>
          </button>

          {/* Public Website Link */}
          <Link
            to="/projects"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95"
            title="Open visitor website in new tab"
          >
            <span>Live Site</span>
            <ArrowUpRight size={13} className="text-[#B5532F]" />
          </Link>

          {/* Admin Avatar */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-[#E5D7C5]">
            <div className="w-8 h-8 rounded-full bg-[#2F1F13] text-[#FAF7F2] font-mono text-xs flex items-center justify-center font-bold shadow-xs">
              AD
            </div>
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-[#2F1F13] block leading-none">
                Studio Admin
              </span>
              <span className="text-[9px] font-mono text-[#865430] block uppercase tracking-wider mt-0.5">
                Curator
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}

export default AdminNavbar;
