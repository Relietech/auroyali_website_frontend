import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Search,
  X,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Eye,
  Send,
  FileText,
  User,
  Check,
  Flame,
  ChevronDown,
  Layers,
  Wrench,
  Compass,
  Palette,
  Boxes,
  Hammer,
  MoreVertical,
  GraduationCap,
  Calendar,
  Briefcase,
  BookOpen,
  MapPin,
  Award,
  Utensils,
  Target,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  getStoredLeads,
  createLead,
  updateLeadStatus,
  updateLeadPriority,
  updateLeadNotes,
  deleteLead,
  resetLeadsToDefault,
  exportLeadsToCSV,
  exportLeadsToJSON,
  subscribeToLeads,
  LEAD_STATUSES,
  CONTACT_SERVICES,
  WORKSHOP_PROGRAMS,
  WORKSHOP_PROFESSIONS,
  WORKSHOP_DETAILS
} from '../../services/leadStore';

// Helper to format relative time
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours === 1) return '1 hr ago';
  if (diffHours < 24) return `${diffHours} hrs ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

// Generate avatar initials from name
function getInitials(name) {
  if (!name) return 'AY';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper badge for contact services & workshops
function getServiceBadge(serviceName) {
  const norm = (serviceName || '').toLowerCase();
  if (norm.includes('workshop') || norm.includes('cohort')) {
    return {
      label: serviceName || 'Workshop Cohort',
      icon: GraduationCap,
      style: 'bg-purple-600/10 text-purple-800 border-purple-600/25'
    };
  }
  if (norm.includes('block')) {
    return {
      label: serviceName || 'Block making',
      icon: Boxes,
      style: 'bg-amber-600/10 text-amber-800 border-amber-600/20'
    };
  }
  if (norm.includes('carpentry')) {
    return {
      label: serviceName || 'Carpentry works',
      icon: Hammer,
      style: 'bg-amber-800/10 text-[#865430] border-[#865430]/25'
    };
  }
  if (norm.includes('metal')) {
    return {
      label: serviceName || 'Metal fabrication',
      icon: Wrench,
      style: 'bg-stone-600/10 text-stone-700 border-stone-600/20'
    };
  }
  if (norm.includes('architect') || norm.includes('design')) {
    return {
      label: serviceName || 'Architectural design',
      icon: Compass,
      style: 'bg-[#B5532F]/10 text-[#B5532F] border-[#B5532F]/20'
    };
  }
  if (norm.includes('paint')) {
    return {
      label: serviceName || 'Painting',
      icon: Palette,
      style: 'bg-emerald-600/10 text-emerald-800 border-emerald-600/20'
    };
  }
  return {
    label: serviceName || 'Other',
    icon: Layers,
    style: 'bg-stone-500/10 text-stone-700 border-stone-500/20'
  };
}

export function AdminLeads({ initialTab = 'contact' }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect whether current page is workshop inquiries or contact leads
  const isWorkshopRoute = location.pathname.includes('workshop');
  const activeTab = isWorkshopRoute || initialTab === 'workshop' ? 'workshop' : 'contact';

  const [leads, setLeads] = useState(() => getStoredLeads());
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modals & Drawers
  const [selectedLead, setSelectedLead] = useState(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [deletingTarget, setDeletingTarget] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  // Close row actions dropdown on outside click
  useEffect(() => {
    if (!openActionMenuId) return;
    const handleClickOutside = () => setOpenActionMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openActionMenuId]);

  // Subscribe to real-time store changes
  useEffect(() => {
    const unsub = subscribeToLeads((updated) => {
      setLeads(updated);
      if (selectedLead) {
        const refreshed = updated.find(l => l.id === selectedLead.id);
        if (refreshed) setSelectedLead(refreshed);
      }
    });
    return () => unsub();
  }, [selectedLead]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Independent metrics calculation for Contact Leads and Workshop Enquiries
  const metrics = useMemo(() => {
    const contactList = leads.filter(l => l.category !== 'workshop' && !l.workshopTitle);
    const workshopList = leads.filter(l => l.category === 'workshop' || !!l.workshopTitle);

    return {
      contact: {
        total: contactList.length,
        newCount: contactList.filter(l => l.status === 'new').length,
        followUp: contactList.filter(l => l.status === 'contacted' || l.status === 'in-review').length,
        converted: contactList.filter(l => l.status === 'converted' || l.status === 'responded').length,
        urgent: contactList.filter(l => l.priority === 'urgent' && l.status !== 'archived').length
      },
      workshop: {
        total: workshopList.length,
        newCount: workshopList.filter(l => l.status === 'new').length,
        followUp: workshopList.filter(l => l.status === 'contacted' || l.status === 'in-review').length,
        converted: workshopList.filter(l => l.status === 'converted' || l.status === 'responded').length,
        urgent: workshopList.filter(l => l.priority === 'urgent' && l.status !== 'archived').length
      }
    };
  }, [leads]);

  const currentMetrics = activeTab === 'workshop' ? metrics.workshop : metrics.contact;

  // Filtered leads strictly isolated to the active tab (NO mixing!)
  const filteredLeads = useMemo(() => {
    const baseDataset = leads.filter(lead => {
      const isWorkshop = lead.category === 'workshop' || !!lead.workshopTitle;
      return activeTab === 'workshop' ? isWorkshop : !isWorkshop;
    });

    return baseDataset.filter(lead => {
      // Filter by service or workshop program
      if (serviceFilter !== 'all') {
        if (activeTab === 'workshop') {
          const prog = lead.workshopTitle || lead.title || '';
          if (prog !== serviceFilter && !prog.includes(serviceFilter)) return false;
        } else {
          const srv = lead.projectDetails?.service || lead.title || '';
          if (srv !== serviceFilter && !srv.includes(serviceFilter)) return false;
        }
      }

      // Filter by status
      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false;
      }

      // Filter by priority
      if (priorityFilter !== 'all' && lead.priority !== priorityFilter) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesClient = lead.client?.name?.toLowerCase().includes(query) ||
          lead.client?.email?.toLowerCase().includes(query) ||
          lead.client?.phone?.includes(query) ||
          lead.client?.profession?.toLowerCase().includes(query) ||
          lead.client?.location?.toLowerCase().includes(query);
        const matchesContent = lead.title?.toLowerCase().includes(query) ||
          lead.workshopTitle?.toLowerCase().includes(query) ||
          lead.batch?.toLowerCase().includes(query) ||
          lead.message?.toLowerCase().includes(query) ||
          lead.internalNotes?.toLowerCase().includes(query) ||
          lead.projectDetails?.service?.toLowerCase().includes(query);
        if (!matchesClient && !matchesContent) return false;
      }

      return true;
    });
  }, [leads, activeTab, serviceFilter, statusFilter, priorityFilter, searchQuery]);

  // Tab switcher action that keeps route in sync
  const handleSwitchTab = (tab) => {
    setSearchQuery('');
    setServiceFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    if (tab === 'workshop') {
      navigate('/admin/workshop-inquiries');
    } else {
      navigate('/admin/inquiries');
    }
  };

  // Actions
  const handleStatusChange = (id, newStatus, e) => {
    if (e) e.stopPropagation();
    updateLeadStatus(id, newStatus);
    showToast(`Status updated to "${LEAD_STATUSES.find(s => s.id === newStatus)?.label || newStatus}"`);
  };

  const handleDeleteConfirm = () => {
    if (!deletingTarget) return;
    deleteLead(deletingTarget.id);
    if (selectedLead?.id === deletingTarget.id) {
      setSelectedLead(null);
    }
    setDeletingTarget(null);
    showToast(
      deletingTarget.category === 'workshop' || deletingTarget.workshopTitle
        ? 'Workshop inquiry removed'
        : 'Contact lead removed'
    );
  };

  const handleResetDefaults = () => {
    resetLeadsToDefault();
    setIsResetConfirmOpen(false);
    showToast('Reset sample inquiries to default records');
  };

  const resetAllFilters = () => {
    setServiceFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = serviceFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery !== '';

  const handleExportCSV = () => {
    exportLeadsToCSV(activeTab);
    showToast(`Exported ${activeTab === 'workshop' ? 'Workshop Enquiries' : 'Contact Leads'} to CSV`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-7 font-body select-none">

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#2F1F13] text-[#FAF7F2] text-xs font-mono shadow-2xl border border-[#E5D7C5]/30 pointer-events-none"
          >
            <Sparkles size={14} className="text-[#B5532F]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE TITLE & PRIMARY ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#E5D7C5]/70">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {activeTab === 'workshop' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-900 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                <GraduationCap size={12} className="text-purple-700" />
                <span>Workshop Enquiries & Cohorts</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                <Mail size={11} />
                <span>Contact Service Leads</span>
              </span>
            )}

            <span className="text-xs font-mono text-[#865430]/70">
              • {currentMetrics.total} Total {activeTab === 'workshop' ? 'Applications' : 'Inquiries'}
            </span>

            {currentMetrics.newCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {currentMetrics.newCount} New Unread
              </span>
            )}
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            {activeTab === 'workshop' ? 'Workshop Enquiries' : 'Contact Leads'}
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light max-w-2xl">
            {activeTab === 'workshop'
              ? 'Inbound participant applications, cohort batch registrations, and workshop inquiries from the Workshops page (/workshops).'
              : 'Inbound service quote requests, custom craft inquiries, and client architectural consultations from the Contact page (/contact).'}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Reset sample inquiries to default records"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#524336] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title={`Export ${activeTab === 'workshop' ? 'workshop enquiries' : 'contact leads'} to CSV`}
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={exportLeadsToJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#524336] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Download JSON backup"
          >
            <FileText size={13} />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewLeadModalOpen(true)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer ${
              activeTab === 'workshop'
                ? 'bg-purple-700 hover:bg-purple-800'
                : 'bg-[#B5532F] hover:bg-[#9C4424]'
            }`}
          >
            <Plus size={15} />
            <span>{activeTab === 'workshop' ? 'Record Workshop Lead' : 'Record Contact Lead'}</span>
          </button>
        </div>
      </div>

      {/* 2. DEDICATED KPI METRIC CARDS FOR THE ACTIVE CATEGORY */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Metric 1: Total for current view */}
        <div className={`rounded-2xl p-4 sm:p-4.5 border shadow-xs relative overflow-hidden group transition-all ${
          activeTab === 'workshop' ? 'bg-purple-500/[0.04] border-purple-200' : 'bg-white border-[#E5D7C5]'
        }`}>
          <div className="flex items-center justify-between text-[#865430]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              {activeTab === 'workshop' ? 'Workshop Enquiries' : 'Total Contact Leads'}
            </span>
            {activeTab === 'workshop' ? (
              <GraduationCap size={16} className="text-purple-700" />
            ) : (
              <MessageSquare size={16} className="text-[#B5532F]" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-heading font-black text-3xl sm:text-4xl tracking-tight tabular-nums ${
              activeTab === 'workshop' ? 'text-purple-900' : 'text-[#2F1F13]'
            }`}>
              {currentMetrics.total}
            </span>
            <span className="text-xs text-[#7A8B69] font-mono font-bold">
              {activeTab === 'workshop' ? 'applicants' : 'inquiries'}
            </span>
          </div>
          <p className="text-[11px] text-[#524336]/70 mt-0.5">
            {activeTab === 'workshop' ? 'Hands-on cohort registrations' : 'Service & architectural quotes'}
          </p>
        </div>

        {/* Metric 2: Needs Action / Fresh Unread */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-[#865430]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Needs Action</span>
            <Sparkles size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl sm:text-4xl text-emerald-700 tracking-tight tabular-nums">
              {currentMetrics.newCount}
            </span>
            <span className="text-xs text-emerald-600 font-mono font-bold">fresh unread</span>
          </div>
          <p className="text-[11px] text-[#524336]/70 mt-0.5">
            {activeTab === 'workshop' ? 'Awaiting applicant response' : 'Awaiting quote follow-up'}
          </p>
        </div>

        {/* Metric 3: In Discussion / Follow-Up */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-[#865430]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              {activeTab === 'workshop' ? 'In Communication' : 'In Discussion'}
            </span>
            {activeTab === 'workshop' ? (
              <BookOpen size={16} className="text-amber-700" />
            ) : (
              <FileText size={16} className="text-amber-700" />
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl sm:text-4xl text-amber-800 tracking-tight tabular-nums">
              {currentMetrics.followUp}
            </span>
            <span className="text-xs text-amber-700 font-mono font-bold">in review</span>
          </div>
          <p className="text-[11px] text-[#524336]/70 mt-0.5">
            {activeTab === 'workshop' ? 'Cohort screening & date alignment' : 'Estimates & proposal discussions'}
          </p>
        </div>

        {/* Metric 4: Converted / Won */}
        <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-teal-500/40 transition-colors">
          <div className="flex items-center justify-between text-[#865430]">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              {activeTab === 'workshop' ? 'Confirmed Seats' : 'Won & Converted'}
            </span>
            <Check size={16} className="text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl sm:text-4xl text-teal-800 tracking-tight tabular-nums">
              {currentMetrics.converted}
            </span>
            <span className="text-xs text-teal-700 font-mono font-bold">confirmed</span>
          </div>
          <p className="text-[11px] text-[#524336]/70 mt-0.5">
            {activeTab === 'workshop' ? 'Seats finalized & confirmed' : 'Client contract signed'}
          </p>
        </div>
      </section>

      {/* 3. SEPARATE SECTION SWITCHER & SEARCH/FILTERS TOOLBAR */}
      <section className="bg-white rounded-2xl p-3.5 sm:p-4.5 border border-[#E5D7C5] shadow-xs space-y-3.5">
        
        {/* Clean 2-Way Section Switcher (NO "All Leads" combined tab) */}
        <div className="flex items-center justify-between gap-2 border-b border-[#E5D7C5]/60 pb-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 1. Contact Service Leads Tab */}
            <button
              type="button"
              onClick={() => handleSwitchTab('contact')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-[#B5532F] text-white shadow-md'
                  : 'bg-[#FAF7F2] hover:bg-[#F3EBE0] text-[#524336] border border-[#E5D7C5]'
              }`}
            >
              <Mail size={13} />
              <span>Contact Service Leads</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] tabular-nums font-bold ${
                activeTab === 'contact'
                  ? 'bg-white/20 text-white'
                  : 'bg-white text-[#865430] border border-[#E5D7C5]'
              }`}>
                {metrics.contact.total}
              </span>
            </button>

            {/* 2. Workshop Enquiries Tab */}
            <button
              type="button"
              onClick={() => handleSwitchTab('workshop')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'workshop'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-900 border border-purple-500/25'
              }`}
            >
              <GraduationCap size={14} className={activeTab === 'workshop' ? 'text-white' : 'text-purple-700'} />
              <span>Workshop Enquiries</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] tabular-nums font-bold ${
                activeTab === 'workshop'
                  ? 'bg-white/20 text-white'
                  : 'bg-purple-700 text-white'
              }`}>
                {metrics.workshop.total}
              </span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#865430]/70 hidden md:inline">
            Showing {filteredLeads.length} of {currentMetrics.total} {activeTab === 'workshop' ? 'applications' : 'leads'}
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#865430]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'workshop'
                  ? 'Search applicant name, workshop program, cohort batch, email, profession...'
                  : 'Search client name, service requested, phone, email, project brief...'
              }
              className="w-full pl-8.5 pr-8 py-2 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2]/60 focus:bg-white text-xs text-[#2F1F13] placeholder-[#865430]/60 focus:outline-none focus:border-[#B5532F] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#865430] hover:text-[#2F1F13] p-1 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Reset */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            
            {/* Dedicated Service / Program Filter */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E5D7C5] rounded-xl px-2.5 py-1.5 text-xs font-mono">
              <span className="text-[#865430] uppercase text-[10px] font-bold">
                {activeTab === 'workshop' ? 'Program:' : 'Service:'}
              </span>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="bg-transparent text-[#2F1F13] font-semibold focus:outline-none cursor-pointer text-xs max-w-[160px] truncate"
              >
                <option value="all">
                  {activeTab === 'workshop' ? 'All Workshop Programs' : 'All Contact Services'}
                </option>
                {activeTab === 'workshop' ? (
                  WORKSHOP_PROGRAMS.map(prog => (
                    <option key={prog} value={prog}>{prog}</option>
                  ))
                ) : (
                  CONTACT_SERVICES.map(srv => (
                    <option key={srv} value={srv}>{srv}</option>
                  ))
                )}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E5D7C5] rounded-xl px-2.5 py-1.5 text-xs font-mono">
              <span className="text-[#865430] uppercase text-[10px] font-bold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-[#2F1F13] font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Statuses</option>
                {LEAD_STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Priority Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E5D7C5] rounded-xl px-2.5 py-1.5 text-xs font-mono">
              <span className="text-[#865430] uppercase text-[10px] font-bold">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent text-[#2F1F13] font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#B5532F]/10 hover:bg-[#B5532F]/20 text-[#B5532F] text-xs font-mono font-bold transition-colors cursor-pointer"
                title="Reset search and filters"
              >
                <X size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. SEPARATE DEDICATED TABLES FOR CONTACT LEADS VS WORKSHOP ENQUIRIES */}
      <div className="bg-white rounded-2xl border border-[#E5D7C5] shadow-xs overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center mx-auto text-[#865430]">
              <Search size={20} />
            </div>
            <h3 className="font-heading text-lg font-bold text-[#2F1F13]">
              {activeTab === 'workshop' ? 'No workshop applications found' : 'No contact leads found'}
            </h3>
            <p className="text-xs text-[#524336] max-w-sm mx-auto">
              {activeTab === 'workshop'
                ? 'No workshop applications match your current search query or filter selection.'
                : 'No client service quote requests match your current search query or filter selection.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EBE0] border border-[#E5D7C5] text-[#B5532F] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
        ) : activeTab === 'workshop' ? (
          /* ================================================================ */
          /* TABLE A: DEDICATED WORKSHOP ENQUIRIES & COHORTS TABLE            */
          /* ================================================================ */
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-200 bg-purple-500/[0.04] text-purple-900 text-[10px] font-mono uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4 sm:px-5">Applicant Contact</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Workshop Program & Fee</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Scheduled Cohort / Batch</th>
                  <th className="py-3.5 px-4">Profession</th>
                  <th className="py-3.5 px-4">Pipeline Status</th>
                  <th className="py-3.5 px-4">Received</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D7C5]/60 text-xs text-[#2F1F13]">
                {filteredLeads.map((lead, index) => {
                  const statusObj = LEAD_STATUSES.find(s => s.id === lead.status) || LEAD_STATUSES[0];
                  const initials = getInitials(lead.client?.name);
                  const workshopDetail = WORKSHOP_DETAILS[lead.workshopTitle] || {};
                  const displayFee = lead.fee || workshopDetail.fee || '₹14,000';
                  const displayBatch = lead.batch || workshopDetail.dates || 'Upcoming Cohort';
                  const applicantProfession = lead.client?.profession || lead.profession || 'Participant';

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`hover:bg-purple-500/[0.03] transition-colors cursor-pointer group ${
                        lead.status === 'new' ? 'bg-purple-500/[0.04]' : ''
                      }`}
                    >
                      {/* Applicant Contact */}
                      <td className="py-4 px-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            lead.priority === 'urgent'
                              ? 'bg-red-500/15 text-red-700 border border-red-500/25'
                              : 'bg-purple-500/10 text-purple-800 border border-purple-500/25'
                          }`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-sm text-[#2F1F13] group-hover:text-purple-900 transition-colors truncate">
                                {lead.client?.name || 'Workshop Applicant'}
                              </span>
                              {lead.priority === 'urgent' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-red-500/15 text-red-700 border border-red-500/25 shrink-0">
                                  Urgent
                                </span>
                              )}
                              {lead.priority === 'high' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 border border-amber-500/25 shrink-0">
                                  High
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2.5 text-[11px] text-[#524336] mt-0.5 flex-wrap">
                              {lead.client?.phone && (
                                <span className="flex items-center gap-1 font-mono text-[#524336]">
                                  <Phone size={10} className="text-purple-700" />
                                  {lead.client.phone}
                                </span>
                              )}
                              {lead.client?.email && (
                                <span className="font-mono text-[#865430]/70 truncate max-w-[170px]">
                                  {lead.client.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Workshop Program & Fee */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5 max-w-[230px]">
                          <div className="flex items-start gap-1.5">
                            <GraduationCap size={14} className="text-purple-700 shrink-0 mt-0.5" />
                            <span className="font-heading font-bold text-xs text-[#2F1F13] group-hover:text-purple-900 transition-colors leading-snug">
                              {lead.workshopTitle || lead.title || 'Hands-on Workshop'}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200/70 text-[10px] font-mono font-bold text-purple-900">
                            <span>Tuition:</span>
                            <span className="text-[#B5532F]">{displayFee}</span>
                          </div>
                        </div>
                      </td>

                      {/* Scheduled Cohort / Batch */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold bg-purple-500/10 text-purple-900 border-purple-500/25">
                          <Calendar size={11} className="text-purple-700 shrink-0" />
                          <span>{displayBatch}</span>
                        </div>
                      </td>

                      {/* Applicant Profession */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono text-[#524336] bg-[#FAF7F2] border-[#E5D7C5]">
                          <Briefcase size={11} className="text-[#865430] shrink-0" />
                          <span>{applicantProfession}</span>
                        </div>
                      </td>

                      {/* Pipeline Status Dropdown */}
                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value, e)}
                            className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-xl border text-[11px] font-mono uppercase tracking-wider font-bold cursor-pointer transition-all focus:outline-none ${statusObj.color}`}
                          >
                            {LEAD_STATUSES.map((st) => (
                              <option key={st.id} value={st.id} className="bg-white text-[#2F1F13] font-body text-xs">
                                {st.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      {/* Received Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-[11px] font-mono text-[#524336]">
                          <span className="block font-semibold text-[#2F1F13]">
                            {formatRelativeTime(lead.createdAt)}
                          </span>
                          <span className="text-[10px] text-[#865430]/70">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      {/* Row Actions Menu */}
                      <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap relative" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(openActionMenuId === lead.id ? null : lead.id);
                            }}
                            className={`w-8 h-8 inline-flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                              openActionMenuId === lead.id
                                ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                                : 'text-[#865430] hover:text-purple-800 bg-white hover:bg-[#FAF7F2] border-[#E5D7C5]'
                            }`}
                            title="Actions menu"
                          >
                            <MoreVertical size={15} />
                          </button>

                          {openActionMenuId === lead.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute right-0 z-40 w-44 bg-white rounded-xl shadow-xl border border-[#E5D7C5] py-1 text-xs font-mono text-[#2F1F13] divide-y divide-[#F5EFE6] ${
                                index >= filteredLeads.length - 2 && filteredLeads.length >= 3
                                  ? 'bottom-full mb-1.5'
                                  : 'top-full mt-1.5'
                              }`}
                            >
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setSelectedLead(lead);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#524336] hover:text-purple-800 hover:bg-[#FAF7F2] transition-colors cursor-pointer text-left"
                                >
                                  <Eye size={13} className="text-[#865430]" />
                                  <span>View Application</span>
                                </button>

                                {lead.client?.phone && (
                                  <a
                                    href={`https://wa.me/91${lead.client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Hello ${lead.client.name}, thank you for enrolling in AuroYali's ${lead.workshopTitle || 'Workshop'}. We are pleased to confirm your interest.`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => setOpenActionMenuId(null)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-emerald-700 hover:bg-emerald-500/10 transition-colors text-left"
                                  >
                                    <Send size={13} className="text-emerald-600" />
                                    <span>WhatsApp</span>
                                  </a>
                                )}

                                {lead.client?.email && (
                                  <a
                                    href={`mailto:${lead.client.email}?subject=${encodeURIComponent(
                                      `AuroYali Workshop Enrollment - ${lead.workshopTitle || 'Cohort Details'}`
                                    )}`}
                                    onClick={() => setOpenActionMenuId(null)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[#524336] hover:text-purple-800 hover:bg-[#FAF7F2] transition-colors text-left"
                                  >
                                    <Mail size={13} className="text-[#865430]" />
                                    <span>Send Email</span>
                                  </a>
                                )}
                              </div>

                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setDeletingTarget(lead);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-medium"
                                >
                                  <Trash2 size={13} className="text-red-500" />
                                  <span>Delete Inquiry</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ================================================================ */
          /* TABLE B: DEDICATED CONTACT LEADS TABLE                           */
          /* ================================================================ */
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5D7C5] bg-[#FAF7F2]/80 text-[#865430] text-[10px] font-mono uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 sm:px-5">Client Contact</th>
                  <th className="py-3.5 px-4">Service Requested</th>
                  <th className="py-3.5 px-4 min-w-[240px]">Project Scope & Notes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Received</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5D7C5]/60 text-xs text-[#2F1F13]">
                {filteredLeads.map((lead, index) => {
                  const statusObj = LEAD_STATUSES.find(s => s.id === lead.status) || LEAD_STATUSES[0];
                  const initials = getInitials(lead.client?.name);
                  const serviceBadge = getServiceBadge(lead.projectDetails?.service || lead.title);
                  const ServiceIcon = serviceBadge.icon;

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`hover:bg-[#FAF7F2]/60 transition-colors cursor-pointer group ${
                        lead.status === 'new' ? 'bg-emerald-500/[0.03]' : ''
                      }`}
                    >
                      {/* Client Contact */}
                      <td className="py-4 px-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            lead.priority === 'urgent'
                              ? 'bg-red-500/15 text-red-700 border border-red-500/25'
                              : 'bg-[#FAF7F2] text-[#865430] border border-[#E5D7C5]'
                          }`}>
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-sm text-[#2F1F13] group-hover:text-[#B5532F] transition-colors truncate">
                                {lead.client?.name || 'Inbound Prospect'}
                              </span>
                              {lead.priority === 'urgent' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-red-500/15 text-red-700 border border-red-500/25 shrink-0">
                                  Urgent
                                </span>
                              )}
                              {lead.priority === 'high' && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 border border-amber-500/25 shrink-0">
                                  High
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-3 text-[11px] text-[#524336] mt-0.5 flex-wrap">
                              {lead.client?.phone && (
                                <span className="flex items-center gap-1 font-mono text-[#524336]">
                                  <Phone size={10} className="text-[#865430]" />
                                  {lead.client.phone}
                                </span>
                              )}
                              {lead.client?.email && (
                                <span className="font-mono text-[#865430]/70 truncate max-w-[170px]">
                                  {lead.client.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Service Requested */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold ${serviceBadge.style}`}>
                          <ServiceIcon size={12} />
                          <span>{serviceBadge.label}</span>
                        </span>
                      </td>

                      {/* Project Scope & Notes */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-[280px]">
                          <p className="text-xs text-[#524336] line-clamp-2 leading-relaxed font-light">
                            {lead.message || 'No project description provided.'}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {lead.projectDetails?.budget && (
                              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5] text-[#865430]">
                                {lead.projectDetails.budget}
                              </span>
                            )}
                            {lead.projectDetails?.timeline && (
                              <span className="text-[10px] font-mono text-[#865430]/80">
                                {lead.projectDetails.timeline}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Pipeline Status Dropdown */}
                      <td className="py-4 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value, e)}
                            className={`appearance-none pl-2.5 pr-7 py-1.5 rounded-xl border text-[11px] font-mono uppercase tracking-wider font-bold cursor-pointer transition-all focus:outline-none ${statusObj.color}`}
                          >
                            {LEAD_STATUSES.map((st) => (
                              <option key={st.id} value={st.id} className="bg-white text-[#2F1F13] font-body text-xs">
                                {st.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      {/* Received Date */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-[11px] font-mono text-[#524336]">
                          <span className="block font-semibold text-[#2F1F13]">
                            {formatRelativeTime(lead.createdAt)}
                          </span>
                          <span className="text-[10px] text-[#865430]/70">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </td>

                      {/* Row Actions Menu */}
                      <td className="py-4 px-4 sm:px-5 text-right whitespace-nowrap relative" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenuId(openActionMenuId === lead.id ? null : lead.id);
                            }}
                            className={`w-8 h-8 inline-flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                              openActionMenuId === lead.id
                                ? 'bg-[#B5532F] text-white border-[#B5532F] shadow-sm'
                                : 'text-[#865430] hover:text-[#B5532F] bg-white hover:bg-[#FAF7F2] border-[#E5D7C5]'
                            }`}
                            title="Actions menu"
                          >
                            <MoreVertical size={15} />
                          </button>

                          {openActionMenuId === lead.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute right-0 z-40 w-44 bg-white rounded-xl shadow-xl border border-[#E5D7C5] py-1 text-xs font-mono text-[#2F1F13] divide-y divide-[#F5EFE6] ${
                                index >= filteredLeads.length - 2 && filteredLeads.length >= 3
                                  ? 'bottom-full mb-1.5'
                                  : 'top-full mt-1.5'
                              }`}
                            >
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setSelectedLead(lead);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[#524336] hover:text-[#B5532F] hover:bg-[#FAF7F2] transition-colors cursor-pointer text-left"
                                >
                                  <Eye size={13} className="text-[#865430]" />
                                  <span>View Details</span>
                                </button>

                                {lead.client?.phone && (
                                  <a
                                    href={`https://wa.me/91${lead.client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Hello ${lead.client.name}, thank you for contacting AuroYali regarding your ${lead.projectDetails?.service || 'inquiry'}.`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => setOpenActionMenuId(null)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-emerald-700 hover:bg-emerald-500/10 transition-colors text-left"
                                  >
                                    <Send size={13} className="text-emerald-600" />
                                    <span>WhatsApp</span>
                                  </a>
                                )}

                                {lead.client?.email && (
                                  <a
                                    href={`mailto:${lead.client.email}?subject=${encodeURIComponent(
                                      `AuroYali Inquiry Response - ${lead.projectDetails?.service || 'Contact Inquiry'}`
                                    )}`}
                                    onClick={() => setOpenActionMenuId(null)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-[#524336] hover:text-[#B5532F] hover:bg-[#FAF7F2] transition-colors text-left"
                                  >
                                    <Mail size={13} className="text-[#865430]" />
                                    <span>Send Email</span>
                                  </a>
                                )}
                              </div>

                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setDeletingTarget(lead);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-medium"
                                >
                                  <Trash2 size={13} className="text-red-500" />
                                  <span>Delete Lead</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. SLIDE-OVER DETAIL DRAWER */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailDrawer
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onStatusChange={(status) => handleStatusChange(selectedLead.id, status)}
            onPriorityChange={(priority) => {
              updateLeadPriority(selectedLead.id, priority);
              showToast(`Priority set to ${priority.toUpperCase()}`);
            }}
            onSaveNotes={(notes) => {
              updateLeadNotes(selectedLead.id, notes);
              showToast('Internal studio notes saved');
            }}
            onDelete={() => setDeletingTarget(selectedLead)}
          />
        )}
      </AnimatePresence>

      {/* 6. MANUAL LEAD ENTRY MODAL */}
      <AnimatePresence>
        {isNewLeadModalOpen && (
          <NewLeadModal
            defaultCategory={activeTab}
            onClose={() => setIsNewLeadModalOpen(false)}
            onSave={(newLeadData) => {
              createLead(newLeadData);
              setIsNewLeadModalOpen(false);
              showToast(
                newLeadData.category === 'workshop'
                  ? 'Workshop enrollment recorded successfully'
                  : 'Contact lead recorded successfully'
              );
            }}
          />
        )}
      </AnimatePresence>

      {/* 7. DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E5D7C5] shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 size={22} />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="font-heading text-lg font-bold text-[#2F1F13]">
                  {deletingTarget?.category === 'workshop' || deletingTarget?.workshopTitle
                    ? 'Delete Workshop Inquiry?'
                    : 'Delete Contact Lead?'}
                </h3>
                <p className="text-xs text-[#524336] leading-relaxed">
                  Are you sure you want to remove the {deletingTarget?.category === 'workshop' || deletingTarget?.workshopTitle ? 'workshop application' : 'contact inquiry'} from{' '}
                  <strong className="text-[#2F1F13]">{deletingTarget.client?.name}</strong>? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingTarget(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2] text-[#524336] text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#F3EBE0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Yes, Delete Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. RESET DEFAULT CONFIRMATION MODAL */}
      <AnimatePresence>
        {isResetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E5D7C5] shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <RotateCcw size={22} />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="font-heading text-lg font-bold text-[#2F1F13]">
                  Reset Sample Records?
                </h3>
                <p className="text-xs text-[#524336] leading-relaxed">
                  This will reload AuroYali's sample records for both general service inquiries (block making, carpentry, architectural design, metal fabrication, painting) and hands-on workshop cohort enrollments.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2] text-[#524336] text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#F3EBE0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ============================================================================
// SUBCOMPONENT: SLIDE-OVER DETAIL DRAWER
// ============================================================================
function LeadDetailDrawer({
  lead,
  onClose,
  onStatusChange,
  onPriorityChange,
  onSaveNotes,
  onDelete
}) {
  const [internalNotesText, setInternalNotesText] = useState(lead.internalNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(!lead.internalNotes);

  useEffect(() => {
    setInternalNotesText(lead.internalNotes || '');
    setIsEditingNotes(!lead.internalNotes);
  }, [lead]);

  // Lock background body scroll and pause Lenis while drawer is open
  useEffect(() => {
    if (window.lenis) {
      window.lenis.stop();
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, []);

  const handleNotesSubmit = (e, andMarkContacted = false) => {
    if (e) e.preventDefault();
    onSaveNotes(internalNotesText);
    if (andMarkContacted && lead.status === 'new') {
      onStatusChange('contacted');
    }
    setIsEditingNotes(false);
  };

  const isWorkshop = lead.category === 'workshop' || !!lead.workshopTitle;
  const statusObj = LEAD_STATUSES.find(s => s.id === lead.status) || LEAD_STATUSES[0];
  const serviceBadge = getServiceBadge(lead.projectDetails?.service || lead.title);
  const ServiceIcon = serviceBadge.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"
      data-lenis-prevent
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-full bg-white shadow-2xl border-l border-[#E5D7C5] flex flex-col font-body overflow-hidden"
        data-lenis-prevent
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5D7C5] bg-[#FAF7F2] flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {isWorkshop ? (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-widest font-bold border bg-purple-500/10 text-purple-800 border-purple-500/25">
                  <GraduationCap size={12} className="inline mr-1 -mt-0.5" />
                  Workshop Cohort Lead
                </span>
              ) : (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-widest font-bold border ${serviceBadge.style}`}>
                  <ServiceIcon size={11} className="inline mr-1 -mt-0.5" />
                  {serviceBadge.label}
                </span>
              )}

              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-widest font-bold border ${statusObj.color}`}>
                {statusObj.label}
              </span>
              <span className="text-[10px] font-mono text-[#865430] bg-white border border-[#E5D7C5] px-2 py-0.5 rounded-md">
                {lead.source || (isWorkshop ? 'Workshops Page (/workshops)' : 'Contact Page (/contact)')}
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#2F1F13] leading-snug">
              {lead.client?.name || 'Inbound Prospect'}
            </h2>
            <p className="text-xs text-[#524336] mt-0.5">
              Submitted: {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-[#E5D7C5] bg-white text-[#524336] hover:text-[#B5532F] transition-colors cursor-pointer"
            title="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 sm:space-y-6 overscroll-contain"
        >

          {/* QUICK DIRECT CONTACT BUTTONS */}
          <div className="grid grid-cols-3 gap-2.5">
            {lead.client?.phone ? (
              <a
                href={`https://wa.me/91${lead.client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  isWorkshop
                    ? `Hello ${lead.client.name}, thank you for applying for the ${lead.workshopTitle || 'Masterclass Workshop'} (${lead.batch || 'Upcoming Cohort'}). We are reviewing your registration and have reserved your seat.`
                    : `Hello ${lead.client.name}, thank you for contacting AuroYali regarding your ${lead.projectDetails?.service || 'inquiry'}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold tracking-wider transition-all shadow-xs cursor-pointer"
              >
                <Send size={13} />
                <span>WhatsApp</span>
              </a>
            ) : (
              <span className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-stone-100 text-stone-400 text-xs font-mono">
                No Phone
              </span>
            )}

            {lead.client?.phone ? (
              <a
                href={`tel:${lead.client.phone}`}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#2F1F13] hover:bg-[#1B140E] text-white text-xs font-mono font-bold tracking-wider transition-all shadow-xs cursor-pointer"
              >
                <Phone size={13} />
                <span>Call Client</span>
              </a>
            ) : (
              <span className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-stone-100 text-stone-400 text-xs font-mono">
                No Phone
              </span>
            )}

            {lead.client?.email ? (
              <a
                href={`mailto:${lead.client.email}?subject=${encodeURIComponent(
                  isWorkshop
                    ? `AuroYali Workshop Enrollment - ${lead.workshopTitle || 'Cohort Details'} (${lead.batch || 'Upcoming Cohort'})`
                    : `AuroYali Inquiry Response - ${lead.projectDetails?.service || 'Contact Inquiry'}`
                )}`}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EBE0] border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono font-bold tracking-wider transition-all cursor-pointer"
              >
                <Mail size={13} />
                <span>Email</span>
              </a>
            ) : (
              <span className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-stone-100 text-stone-400 text-xs font-mono">
                No Email
              </span>
            )}
          </div>

          {isWorkshop ? (
            /* ============================================================== */
            /* WORKSHOP APPLICATION DOSSIER (ALL FORM FIELDS)                 */
            /* ============================================================== */
            <>
              {/* 1. MASTERCLASS COHORT & CURRICULUM CARD */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-500/[0.05] border border-purple-500/25 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-mono uppercase tracking-widest text-purple-900 font-bold flex items-center gap-1.5">
                    <GraduationCap size={15} className="text-purple-700" />
                    Enrolled Workshop Program
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                    AuroYali Academy
                  </span>
                </div>

                <div className="space-y-3 text-xs text-[#2F1F13]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block">Workshop Program</span>
                    <span className="font-heading font-bold text-base text-[#2F1F13] block mt-0.5">
                      {lead.workshopTitle || lead.title || 'Auroville Hands-on Workshop'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-purple-500/15">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#865430] block">Scheduled Cohort / Dates</span>
                      <div className="flex items-center gap-1.5 text-purple-900 font-mono font-semibold mt-0.5">
                        <Calendar size={12} className="text-purple-700 shrink-0" />
                        <span>{lead.batch || WORKSHOP_DETAILS[lead.workshopTitle]?.dates || 'Upcoming Cohort'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#865430] block">Tuition Fee</span>
                      <div className="flex items-center gap-1.5 font-mono font-bold text-[#B5532F] mt-0.5">
                        <span className="px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
                          {lead.fee || WORKSHOP_DETAILS[lead.workshopTitle]?.fee || '₹14,000'}
                        </span>
                        <span className="text-[10px] text-[#865430] font-normal">(Includes materials & meals)</span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-mono uppercase text-[#865430] block">Training Venue & Soil Lab</span>
                      <div className="flex items-center gap-1.5 text-[#2F1F13] font-semibold mt-0.5">
                        <MapPin size={12} className="text-purple-700 shrink-0" />
                        <span>{lead.location || WORKSHOP_DETAILS[lead.workshopTitle]?.location || 'AuroYali Soil Lab & Block Yard, Auroville'}</span>
                      </div>
                    </div>

                    {WORKSHOP_DETAILS[lead.workshopTitle]?.certificate && (
                      <div className="sm:col-span-2 flex items-center gap-1.5 text-[11px] font-mono text-purple-900 bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-xl">
                        <Award size={14} className="text-purple-700 shrink-0" />
                        <span>{WORKSHOP_DETAILS[lead.workshopTitle]?.certificate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. APPLICANT PROFILE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] space-y-3.5">
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#865430] font-bold flex items-center gap-1.5">
                  <User size={13} className="text-[#B5532F]" />
                  Applicant Profile
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-[#2F1F13]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block">Full Name</span>
                    <span className="font-semibold text-sm">{lead.client?.name || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block">Profession</span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono text-[#524336] bg-white border-[#E5D7C5] mt-0.5">
                      <Briefcase size={11} className="text-[#865430]" />
                      <span>{lead.client?.profession || lead.profession || 'Participant'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block">Phone / WhatsApp</span>
                    <span className="font-mono font-semibold">{lead.client?.phone || 'N/A'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block">Email Address</span>
                    <span className="font-mono truncate block">{lead.client?.email || 'N/A'}</span>
                  </div>

                  {lead.client?.location && (
                    <div className="sm:col-span-2">
                      <span className="text-[10px] font-mono uppercase text-[#865430] block">City / Origin</span>
                      <span className="font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-[#865430]" />
                        {lead.client.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. GOALS & PROJECT INTENT */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#865430] font-bold flex items-center gap-1.5">
                  <Target size={13} className="text-[#B5532F]" />
                  Stated Learning Goals & Intent
                </span>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] leading-relaxed whitespace-pre-line font-light">
                  {lead.learningGoals || lead.comments || lead.message || 'No specific goals provided by applicant.'}
                </div>
              </div>
            </>
          ) : (
            /* ============================================================== */
            /* STANDARD CONTACT / SERVICE INQUIRY CARD                        */
            /* ============================================================== */
            <>
              {/* CLIENT PROFILE BOX */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] space-y-3.5">
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#865430] font-bold flex items-center gap-1.5">
                  <User size={13} className="text-[#B5532F]" />
                  Client Profile & Service
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-[#2F1F13]">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block">Full Name</span>
                    <span className="font-semibold">{lead.client?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block">Phone Contact</span>
                    <span className="font-mono font-semibold">{lead.client?.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block">Email Address</span>
                    <span className="font-mono truncate block">{lead.client?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#865430] block mb-1">
                      Service Requested
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold ${serviceBadge.style}`}>
                      <ServiceIcon size={12} />
                      <span>{serviceBadge.label}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* MESSAGE BRIEF */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#865430] font-bold flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-[#B5532F]" />
                  Inquiry Message Brief
                </span>
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] leading-relaxed whitespace-pre-line font-light">
                  {lead.message || 'No additional notes provided.'}
                </div>
              </div>
            </>
          )}

          {/* ADMIN POST-CONTACT NOTES */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#865430] font-bold flex items-center gap-1.5">
                  <FileText size={13} className="text-amber-600" />
                  Admin Post-Contact Notes & Log
                </h4>
                <p className="text-[10px] text-[#865430]/70 font-mono mt-0.5">
                  Filled by admin after contacting the applicant with discussion details
                </p>
              </div>
              {!isEditingNotes && lead.internalNotes && (
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(true)}
                  className="text-xs font-mono text-[#B5532F] hover:underline cursor-pointer"
                >
                  Edit Note
                </button>
              )}
            </div>

            {isEditingNotes ? (
              <form onSubmit={(e) => handleNotesSubmit(e, false)} className="space-y-2.5">
                <textarea
                  rows={3}
                  value={internalNotesText}
                  onChange={(e) => setInternalNotesText(e.target.value)}
                  placeholder={
                    isWorkshop
                      ? "Record notes after contacting the applicant (seat confirmed, payment status, arrival date, dietary preferences)..."
                      : "Record notes after contacting the client (call outcome, quote discussed, meeting schedule, material preferences)..."
                  }
                  className="w-full p-3 rounded-xl border border-[#E5D7C5] bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-[#B5532F] leading-relaxed"
                />
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {lead.internalNotes && (
                    <button
                      type="button"
                      onClick={() => {
                        setInternalNotesText(lead.internalNotes || '');
                        setIsEditingNotes(false);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#E5D7C5] text-xs font-mono text-[#524336] cursor-pointer hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                  )}
                  {lead.status === 'new' && (
                    <button
                      type="button"
                      onClick={(e) => handleNotesSubmit(e, true)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                      title="Save notes and update pipeline status to Contacted"
                    >
                      Save & Mark Contacted
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3.5 rounded-xl bg-white border border-[#E5D7C5] text-xs text-[#2F1F13] whitespace-pre-line leading-relaxed font-light">
                {lead.internalNotes}
              </div>
            )}
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E5D7C5] bg-[#FAF7F2] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#865430] font-bold">Status:</span>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-[#E5D7C5] bg-white text-xs font-mono font-bold text-[#2F1F13] cursor-pointer"
            >
              {LEAD_STATUSES.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// SUBCOMPONENT: RECORD INBOUND LEAD MODAL (CONTACT OR WORKSHOP)
// ============================================================================
function NewLeadModal({ onClose, onSave, defaultCategory = 'contact' }) {
  const [leadCategory, setLeadCategory] = useState(defaultCategory); // 'contact' | 'workshop'
  const initialWorkshop = WORKSHOP_PROGRAMS[0] || 'CSEB Workshop (Compressed Stabilised Earth Blocks)';
  const initialDetail = WORKSHOP_DETAILS[initialWorkshop] || {};

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    service: CONTACT_SERVICES[0] || 'Block making',
    workshopTitle: initialWorkshop,
    batch: initialDetail.dates || '02 – 05 December 2026',
    fee: initialDetail.fee || '₹14,000',
    workshopLocation: initialDetail.location || 'AuroYali Soil Lab & Block Yard, Auroville',
    profession: WORKSHOP_PROFESSIONS[0] || 'Architect / Spatial Designer',
    dietaryNotes: '',
    message: '',
    priority: 'normal',
    status: 'new'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleWorkshopChange = (e) => {
    const prog = e.target.value;
    const detail = WORKSHOP_DETAILS[prog] || {};
    setFormData(prev => ({
      ...prev,
      workshopTitle: prog,
      batch: detail.dates || prev.batch,
      fee: detail.fee || prev.fee,
      workshopLocation: detail.location || prev.workshopLocation
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Client name is required';
    if (!formData.phone.trim() && !formData.email.trim()) {
      newErrors.phone = 'Either phone or email is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (leadCategory === 'workshop') {
      onSave({
        category: 'workshop',
        source: 'Admin Manual Entry (Workshop)',
        title: `${formData.workshopTitle} Enrollment`,
        workshopTitle: formData.workshopTitle,
        batch: formData.batch,
        fee: formData.fee,
        location: formData.workshopLocation,
        profession: formData.profession,
        dietaryNotes: formData.dietaryNotes,
        learningGoals: formData.message,
        comments: formData.message,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        clientLocation: formData.city,
        service: 'Workshop Enrollment',
        message: formData.message,
        priority: formData.priority,
        status: formData.status
      });
    } else {
      onSave({
        category: 'contact',
        source: 'Admin Manual Entry (Contact Page)',
        title: `${formData.service} Inquiry`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        clientLocation: formData.city,
        service: formData.service,
        message: formData.message,
        priority: formData.priority,
        status: formData.status
      });
    }
  };

  useEffect(() => {
    if (window.lenis) {
      window.lenis.stop();
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      data-lenis-prevent
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto overscroll-contain p-6 border border-[#E5D7C5] shadow-2xl font-body space-y-5"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5532F] font-bold">
              Manual Inbound Logging
            </span>
            <h3 className="font-heading text-xl font-bold text-[#2F1F13]">
              Record Inbound Lead
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-[#E5D7C5] hover:bg-[#FAF7F2] text-[#524336] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Switcher in Modal */}
        <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E5D7C5]">
          <button
            type="button"
            onClick={() => setLeadCategory('contact')}
            className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              leadCategory === 'contact'
                ? 'bg-[#B5532F] text-white shadow-xs'
                : 'text-[#524336] hover:text-[#2F1F13]'
            }`}
          >
            <Mail size={13} />
            <span>Contact / Service Lead</span>
          </button>

          <button
            type="button"
            onClick={() => setLeadCategory('workshop')}
            className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              leadCategory === 'workshop'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-[#524336] hover:text-[#2F1F13]'
            }`}
          >
            <GraduationCap size={14} />
            <span>Workshop Enrollment</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {leadCategory === 'workshop' ? (
            /* Workshop Specific Fields */
            <div className="p-4 rounded-xl bg-purple-500/[0.04] border border-purple-500/20 space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-purple-950 font-bold mb-1">
                  Workshop Program *
                </label>
                <select
                  name="workshopTitle"
                  value={formData.workshopTitle}
                  onChange={handleWorkshopChange}
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-white text-xs font-semibold text-[#2F1F13] focus:outline-none focus:border-purple-600 cursor-pointer"
                >
                  {WORKSHOP_PROGRAMS.map(prog => (
                    <option key={prog} value={prog}>{prog}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-purple-950 font-bold mb-1">
                    Scheduled Batch / Date
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    placeholder="e.g. 02 – 05 December 2026"
                    className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-purple-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-purple-950 font-bold mb-1">
                    Tuition Fee
                  </label>
                  <input
                    type="text"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    placeholder="e.g. ₹14,000"
                    className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-purple-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-purple-950 font-bold mb-1">
                  Training Venue & Soil Lab
                </label>
                <input
                  type="text"
                  name="workshopLocation"
                  value={formData.workshopLocation}
                  onChange={handleChange}
                  placeholder="e.g. AuroYali Soil Lab & Block Yard, Auroville"
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-purple-950 font-bold mb-1">
                  Applicant Profession *
                </label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-purple-600 cursor-pointer font-medium"
                >
                  {WORKSHOP_PROFESSIONS.map(prof => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            /* Contact Service Selector */
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#865430] font-bold mb-1.5">
                Service Requested *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CONTACT_SERVICES.map(srv => (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, service: srv }))}
                    className={`py-2 px-2.5 rounded-xl border font-mono text-[11px] tracking-wide font-bold transition-all text-left ${
                      formData.service === srv
                        ? 'bg-[#B5532F] text-white border-[#B5532F]'
                        : 'bg-[#FAF7F2] text-[#524336] border-[#E5D7C5] hover:border-[#B5532F]/50'
                    }`}
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#865430] font-bold mb-1">
                Client / Applicant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Tara Nair"
                className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2]/50 focus:bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-[#B5532F]"
              />
              {errors.name && <span className="text-red-600 text-[10px] mt-1 block">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#865430] font-bold mb-1">
                Phone Number (WhatsApp)
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9845019823"
                className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2]/50 focus:bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-[#B5532F]"
              />
              {errors.phone && <span className="text-red-600 text-[10px] mt-1 block">{errors.phone}</span>}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#865430] font-bold mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@example.com"
                className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2]/50 focus:bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-[#B5532F]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#865430] font-bold mb-1">
                City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Auroville / Chennai / Bangalore"
                className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2]/50 focus:bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-[#B5532F]"
              />
            </div>
          </div>

          {/* Message / Brief */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#865430] font-bold mb-1">
              {leadCategory === 'workshop' ? 'Goals or What are you hoping to build? (Optional)' : 'Inquiry / Project Brief'}
            </label>
            <textarea
              rows={3}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={leadCategory === 'workshop' ? 'e.g. Hoping to build a natural earth retreat in Auroville or learn rammed earth vaulting...' : 'What are the specific requirements, questions, or project timeline?'}
              className="w-full p-3 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2]/50 focus:bg-white text-xs text-[#2F1F13] focus:outline-none focus:border-[#B5532F]"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#865430] font-bold mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-white text-xs font-mono uppercase font-bold text-[#2F1F13]"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#865430] font-bold mb-1">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-[#E5D7C5] bg-white text-xs font-mono uppercase font-bold text-[#2F1F13]"
              >
                {LEAD_STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E5D7C5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2] text-[#524336] text-xs font-mono uppercase tracking-wider font-semibold hover:bg-[#F3EBE0] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-wider font-bold shadow-md cursor-pointer"
            >
              Save {leadCategory === 'workshop' ? 'Workshop Lead' : 'Contact Lead'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
