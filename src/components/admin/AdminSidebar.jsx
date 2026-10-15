import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Users,
  GraduationCap,
  MessageSquare,
  ArrowUpRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  ShieldCheck,
  FolderGit2,
  Box,
  Layers,
  Hammer,
  Compass,
  Flame,
  HardHat,
  Briefcase
} from 'lucide-react';
import { getStoredLeads, subscribeToLeads } from '../../services/leadStore';

// Services Studios grouped in collapsible dropdown
const SERVICES_MENU = {
  name: 'Services Studios',
  shortName: 'Services',
  icon: Briefcase,
  subItems: [
    {
      name: 'Architecture Studio',
      path: '/admin/architecture',
      icon: Compass,
      matchPaths: ['/admin/architecture', '/admin/architecture-studio']
    },
    {
      name: 'Construction Studio',
      path: '/admin/construction',
      icon: HardHat,
      matchPaths: ['/admin/construction', '/admin/construction-studio']
    },
    {
      name: 'Carpentry Studio',
      path: '/admin/carpentry',
      icon: Hammer,
      matchPaths: ['/admin/carpentry', '/admin/carpentry-studio']
    },
    {
      name: 'Metal Studio',
      path: '/admin/metal-fabrication',
      icon: Flame,
      matchPaths: ['/admin/metal-fabrication', '/admin/metal-studio']
    }
  ]
};

// Inbound Leads grouped in collapsible dropdown
const LEADS_MENU = {
  name: 'Leads',
  shortName: 'Leads',
  icon: MessageSquare,
  subItems: [
    {
      name: 'Contact Leads',
      path: '/admin/inquiries',
      icon: MessageSquare,
      matchPaths: ['/admin/inquiries', '/admin/leads'],
      leadType: 'contact'
    },
    {
      name: 'Workshop Enquiries',
      path: '/admin/workshop-inquiries',
      icon: GraduationCap,
      matchPaths: ['/admin/workshop-inquiries', '/admin/workshop-leads'],
      leadType: 'workshop'
    }
  ]
};

const NAV_ITEMS_BEFORE = [
  {
    name: 'Projects & Portfolio',
    path: '/admin/projects',
    icon: Building2
  }
];

const NAV_ITEMS_AFTER = [
  {
    name: 'Hero 3D Studio',
    path: '/admin/hero-3d',
    icon: Box
  },
  {
    name: '3D Material Studio',
    path: '/admin/material-studio',
    icon: Layers
  },
  {
    name: 'About Team & Guild',
    path: '/admin/team',
    icon: Users
  },
  {
    name: 'Workshops & Cohorts',
    path: '/admin/workshops',
    icon: GraduationCap
  }
];

export function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) {
  const location = useLocation();

  // Check if current route is within any of the 4 Services Studios
  const isAnyServiceActive = SERVICES_MENU.subItems.some((sub) =>
    sub.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(`${p}/`))
  );

  const [isServicesOpen, setIsServicesOpen] = useState(() => isAnyServiceActive);

  // Auto-expand Services dropdown when user visits any service route
  useEffect(() => {
    if (isAnyServiceActive) {
      setIsServicesOpen(true);
    }
  }, [isAnyServiceActive]);

  // Check if current route is within any of the Leads routes
  const isAnyLeadActive = LEADS_MENU.subItems.some((sub) =>
    sub.matchPaths.some(p => location.pathname === p || location.pathname.startsWith(`${p}/`))
  );

  const [isLeadsOpen, setIsLeadsOpen] = useState(() => isAnyLeadActive);

  // Auto-expand Leads dropdown when user visits any leads route
  useEffect(() => {
    if (isAnyLeadActive) {
      setIsLeadsOpen(true);
    }
  }, [isAnyLeadActive]);

  const [unreadCounts, setUnreadCounts] = useState(() => {
    try {
      const all = getStoredLeads();
      return {
        contact: all.filter(l => l.status === 'new' && l.category !== 'workshop' && !l.workshopTitle).length,
        workshop: all.filter(l => l.status === 'new' && (l.category === 'workshop' || !!l.workshopTitle)).length
      };
    } catch {
      return { contact: 0, workshop: 0 };
    }
  });

  useEffect(() => {
    const unsub = subscribeToLeads((leads) => {
      setUnreadCounts({
        contact: leads.filter(l => l.status === 'new' && l.category !== 'workshop' && !l.workshopTitle).length,
        workshop: leads.filter(l => l.status === 'new' && (l.category === 'workshop' || !!l.workshopTitle)).length
      });
    });
    return () => unsub();
  }, []);

  const renderSingleNavItem = (item) => {
    const Icon = item.icon;
    const isContactLead = item.leadType === 'contact';
    const isWorkshopLead = item.leadType === 'workshop';
    const unreadCount = isContactLead 
      ? unreadCounts.contact 
      : (isWorkshopLead ? unreadCounts.workshop : 0);

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={onCloseMobile}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs transition-all relative group ${
            isActive
              ? isWorkshopLead
                ? 'bg-purple-700 text-white shadow-md font-bold'
                : 'bg-[#B5532F] text-white shadow-md font-bold'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`
        }
      >
        <Icon size={17} className="shrink-0" />
        
        {!isCollapsed && (
          <span className="truncate flex-1 tracking-wider uppercase text-[11px]">
            {item.name}
          </span>
        )}

        {/* Collapsed dot indicator for unread leads */}
        {isCollapsed && unreadCount > 0 && (
          <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
            isWorkshopLead ? 'bg-purple-400' : 'bg-emerald-400'
          } animate-pulse`} />
        )}

        {/* Tooltip on collapsed desktop view */}
        {isCollapsed && (
          <div className="hidden md:group-hover:block absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-[#2F1F13] text-white text-xs whitespace-nowrap shadow-xl z-50 border border-[#E5D7C5]/20 pointer-events-none">
            {item.name} {unreadCount > 0 ? `(${unreadCount} new)` : ''}
          </div>
        )}
      </NavLink>
    );
  };

  const sidebarContent = (
    <div className="h-full w-full flex flex-col bg-[#1B140E] text-[#FAF7F2] border-r border-[#382B21] select-none font-body overflow-hidden">
      
      {/* 1. BRAND HEADER (Pinned at top) */}
      <div className="shrink-0 p-4 sm:p-5 border-b border-[#382B21] flex items-center justify-between bg-[#1B140E]">
        <Link
          to="/admin/projects"
          className="flex items-center gap-3 group overflow-hidden"
          title="AuroYali Admin Console"
        >
          <div className="w-10 h-10 rounded-full bg-[#B5532F] text-white flex items-center justify-center font-heading text-lg font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
            AY
          </div>

          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="font-heading text-lg font-bold tracking-[0.16em] text-white block leading-tight truncate">
                AUROYALI
              </span>
              <span className="text-[9px] font-mono tracking-widest text-[#C98A4B] uppercase block">
                Studio Console
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* 2. NAVIGATION LINKS (Scrolls independently when there are many links) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-1.5 custom-admin-scrollbar">
        {!isCollapsed && (
          <span className="px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 font-bold block mb-2">
            Management
          </span>
        )}

        {/* Projects & Portfolio */}
        {NAV_ITEMS_BEFORE.map(renderSingleNavItem)}

        {/* SERVICES DROPDOWN GROUP */}
        {!isCollapsed ? (
          <div className="space-y-1 pt-0.5">
            <button
              type="button"
              onClick={() => setIsServicesOpen(prev => !prev)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer group ${
                isAnyServiceActive
                  ? 'bg-white/10 text-white font-bold border-l-2 border-[#B5532F]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Briefcase size={17} className={`shrink-0 ${isAnyServiceActive ? 'text-[#B5532F]' : 'text-white/70 group-hover:text-white'}`} />
                <span className="truncate tracking-wider uppercase text-[11px]">
                  Services Studios
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-[9px] font-mono">
                  4
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-white/50 group-hover:text-white ${
                    isServicesOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Collapsible Sub-menu items */}
            <AnimatePresence initial={false}>
              {isServicesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden pl-2 ml-4 border-l border-white/15 space-y-1 my-1"
                >
                  {SERVICES_MENU.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = sub.matchPaths.some(
                      p => location.pathname === p || location.pathname.startsWith(`${p}/`)
                    );

                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={onCloseMobile}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-[11px] transition-all group ${
                          isSubActive
                            ? 'bg-[#B5532F] text-white shadow-xs font-bold'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <SubIcon size={14} className="shrink-0" />
                        <span className="truncate tracking-wider uppercase text-[10.5px]">
                          {sub.name}
                        </span>
                      </NavLink>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Collapsed Sidebar: Hover Flyout Popover for Services */
          <div className="relative group">
            <button
              type="button"
              className={`w-full flex items-center justify-center p-2.5 rounded-xl font-mono text-xs transition-all ${
                isAnyServiceActive
                  ? 'bg-[#B5532F] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase size={17} />
              {isAnyServiceActive && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8782A] animate-pulse" />
              )}
            </button>

            {/* Flyout popover on hover */}
            <div className="hidden group-hover:block absolute left-full top-0 ml-3 w-56 rounded-xl bg-[#1B140E] border border-[#382B21] shadow-2xl p-2 z-50 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#C98A4B] font-bold border-b border-[#382B21] mb-1 flex items-center justify-between">
                <span>Services Studios</span>
                <span className="text-white/40">4</span>
              </div>
              {SERVICES_MENU.subItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = sub.matchPaths.some(
                  p => location.pathname === p || location.pathname.startsWith(`${p}/`)
                );
                return (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                      isSubActive
                        ? 'bg-[#B5532F] text-white font-bold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <SubIcon size={14} className="shrink-0" />
                    <span className="truncate text-[11px] uppercase tracking-wider">{sub.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Admin Navigation Items */}
        {NAV_ITEMS_AFTER.map(renderSingleNavItem)}

        {/* LEADS DROPDOWN GROUP */}
        {!isCollapsed ? (
          <div className="space-y-1 pt-0.5">
            <button
              type="button"
              onClick={() => setIsLeadsOpen(prev => !prev)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer group ${
                isAnyLeadActive
                  ? 'bg-white/10 text-white font-bold border-l-2 border-[#B5532F]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <MessageSquare size={17} className={`shrink-0 ${isAnyLeadActive ? 'text-[#B5532F]' : 'text-white/70 group-hover:text-white'}`} />
                <span className="truncate tracking-wider uppercase text-[11px]">
                  Leads
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {unreadCounts.contact + unreadCounts.workshop > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#E8782A] text-white text-[9px] font-mono font-bold animate-pulse">
                    {unreadCounts.contact + unreadCounts.workshop}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-[9px] font-mono">
                    2
                  </span>
                )}
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 text-white/50 group-hover:text-white ${
                    isLeadsOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Collapsible Sub-menu items for Leads */}
            <AnimatePresence initial={false}>
              {isLeadsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden pl-2 ml-4 border-l border-white/15 space-y-1 my-1"
                >
                  {LEADS_MENU.subItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = sub.matchPaths.some(
                      p => location.pathname === p || location.pathname.startsWith(`${p}/`)
                    );
                    const subUnread = sub.leadType === 'contact' ? unreadCounts.contact : unreadCounts.workshop;

                    return (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        onClick={onCloseMobile}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg font-mono text-[11px] transition-all group ${
                          isSubActive
                            ? 'bg-[#B5532F] text-white shadow-xs font-bold'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <SubIcon size={14} className="shrink-0" />
                          <span className="truncate tracking-wider uppercase text-[10.5px]">
                            {sub.name}
                          </span>
                        </div>
                        {subUnread > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold shrink-0 ${
                            isSubActive ? 'bg-white text-[#B5532F]' : 'bg-[#E8782A] text-white'
                          }`}>
                            {subUnread}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Collapsed Sidebar: Hover Flyout Popover for Leads */
          <div className="relative group">
            <button
              type="button"
              className={`w-full flex items-center justify-center p-2.5 rounded-xl font-mono text-xs transition-all relative ${
                isAnyLeadActive
                  ? 'bg-[#B5532F] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare size={17} />
              {unreadCounts.contact + unreadCounts.workshop > 0 ? (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#E8782A] border-2 border-[#1B140E] animate-pulse" />
              ) : isAnyLeadActive ? (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E8782A]" />
              ) : null}
            </button>

            {/* Flyout popover on hover */}
            <div className="hidden group-hover:block absolute left-full top-0 ml-3 w-56 rounded-xl bg-[#1B140E] border border-[#382B21] shadow-2xl p-2 z-50 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#C98A4B] font-bold border-b border-[#382B21] mb-1 flex items-center justify-between">
                <span>Leads</span>
                {unreadCounts.contact + unreadCounts.workshop > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#E8782A] text-white text-[9px] font-bold">
                    {unreadCounts.contact + unreadCounts.workshop} NEW
                  </span>
                ) : (
                  <span className="text-white/40">2</span>
                )}
              </div>
              {LEADS_MENU.subItems.map((sub) => {
                const SubIcon = sub.icon;
                const isSubActive = sub.matchPaths.some(
                  p => location.pathname === p || location.pathname.startsWith(`${p}/`)
                );
                const subUnread = sub.leadType === 'contact' ? unreadCounts.contact : unreadCounts.workshop;

                return (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                      isSubActive
                        ? 'bg-[#B5532F] text-white font-bold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <SubIcon size={14} className="shrink-0" />
                      <span className="truncate text-[11px] uppercase tracking-wider">{sub.name}</span>
                    </div>
                    {subUnread > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold shrink-0 ${
                        isSubActive ? 'bg-white text-[#B5532F]' : 'bg-[#E8782A] text-white'
                      }`}>
                        {subUnread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM FOOTER ACTIONS (Pinned at bottom of sidebar, dark background) */}
      <div className="shrink-0 p-3 sm:p-4 border-t border-[#382B21] space-y-2 bg-[#1B140E] mt-auto">
        {/* Workspace pill */}
        {!isCollapsed && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C98A4B] uppercase tracking-wider">
              <Sparkles size={11} />
              <span>Auroville Studio</span>
            </div>
            <p className="text-[10px] text-white/60 leading-relaxed font-light">
              Bioclimatic spatial registry & craft database.
            </p>
          </div>
        )}

        {/* Public Website Link */}
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider transition-all border border-white/10 group"
          title="Open public website in new tab"
        >
          <div className="flex items-center gap-2.5 truncate">
            <FolderGit2 size={15} className="shrink-0 text-[#C98A4B]" />
            {!isCollapsed && <span className="truncate">Public Website</span>}
          </div>
          <ArrowUpRight size={13} className="shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>

        {/* Desktop Collapse Button */}
        <div className="hidden md:flex justify-end pt-0.5">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer w-full flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase tracking-wider"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={14} />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 z-30 h-full ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex" data-lenis-prevent>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AdminSidebar;
