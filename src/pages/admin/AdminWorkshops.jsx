import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Download,
  AlertCircle,
  Camera,
  Layers,
  LayoutGrid,
  Image as ImageIcon
} from 'lucide-react';
import {
  getStoredOfferedWorkshops,
  deleteOfferedWorkshop,
  reorderOfferedWorkshops,
  resetOfferedWorkshopsToDefault,
  exportWorkshopsToJSON,
  subscribeToWorkshops,
  getStoredGalleryItems,
  deleteGalleryItem,
  reorderGalleryItems,
  resetGalleryItemsToDefault,
  exportGalleryToJSON,
  subscribeToGallery,
  GALLERY_CATEGORIES
} from '../../services/workshopStore';

export function AdminWorkshops() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'gallery' ? 'gallery' : 'programs';

  // Workshops State (What We Offer)
  const [workshops, setWorkshops] = useState(() => getStoredOfferedWorkshops());
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingTarget, setDeletingTarget] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Gallery State (Created Gallery of Techniques & Work)
  const [galleryItems, setGalleryItems] = useState(() => getStoredGalleryItems());
  const [gallerySearchQuery, setGallerySearchQuery] = useState('');
  const [activeGalleryCat, setActiveGalleryCat] = useState('all');
  const [deletingGalleryTarget, setDeletingGalleryTarget] = useState(null);
  const [isResetGalleryConfirmOpen, setIsResetGalleryConfirmOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  // Subscribe to workshop & gallery store changes
  useEffect(() => {
    const unsubWorkshops = subscribeToWorkshops((updated) => {
      setWorkshops(updated);
    });
    const unsubGallery = subscribeToGallery((updated) => {
      setGalleryItems(updated);
    });
    return () => {
      unsubWorkshops();
      unsubGallery();
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleTabChange = (tab) => {
    if (tab === 'gallery') {
      setSearchParams({ tab: 'gallery' });
    } else {
      setSearchParams({});
    }
  };

  // Workshop Programs Metrics
  const metrics = useMemo(() => {
    const total = workshops.length;
    const totalModules = workshops.reduce((acc, curr) => acc + (curr.modules?.length || 0), 0);
    const avgModules = total > 0 ? (totalModules / total).toFixed(1) : 0;
    return { total, totalModules, avgModules };
  }, [workshops]);

  // Gallery Metrics
  const galleryMetrics = useMemo(() => {
    const total = galleryItems.length;
    const tallCount = galleryItems.filter((i) => i.tall).length;
    const categoriesCount = new Set(galleryItems.map((i) => i.category)).size;
    return { total, tallCount, categoriesCount };
  }, [galleryItems]);

  // Filtered workshops based on search
  const filteredWorkshops = useMemo(() => {
    if (!searchQuery.trim()) return workshops;
    const query = searchQuery.toLowerCase().trim();
    return workshops.filter((w) => {
      return (
        w.title?.toLowerCase().includes(query) ||
        w.tag?.toLowerCase().includes(query) ||
        w.desc?.toLowerCase().includes(query) ||
        w.num?.toLowerCase().includes(query) ||
        w.modules?.some((m) => m?.toLowerCase().includes(query))
      );
    });
  }, [workshops, searchQuery]);

  // Filtered gallery items based on category & search
  const filteredGalleryItems = useMemo(() => {
    let items = galleryItems;
    if (activeGalleryCat !== 'all') {
      items = items.filter((i) => i.category === activeGalleryCat);
    }
    if (gallerySearchQuery.trim()) {
      const q = gallerySearchQuery.toLowerCase().trim();
      items = items.filter((i) => {
        return (
          i.title?.toLowerCase().includes(q) ||
          i.caption?.toLowerCase().includes(q) ||
          i.categoryLabel?.toLowerCase().includes(q)
        );
      });
    }
    return items;
  }, [galleryItems, activeGalleryCat, gallerySearchQuery]);

  // ----------------- Workshop Handlers -----------------
  const handleConfirmDelete = () => {
    if (!deletingTarget) return;
    deleteOfferedWorkshop(deletingTarget.id);
    showToast(`Deleted "${deletingTarget.title}"`);
    setDeletingTarget(null);
  };

  const handleMoveOrder = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= workshops.length) return;

    const updated = [...workshops];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);

    reorderOfferedWorkshops(updated);
    showToast(`Repositioned "${moved.title}" to #${targetIdx + 1}`);
  };

  const handleResetDefaults = () => {
    resetOfferedWorkshopsToDefault();
    showToast('Reset all workshop offerings to default portfolio seed');
    setIsResetConfirmOpen(false);
  };

  // ----------------- Gallery Handlers -----------------
  const handleConfirmDeleteGallery = () => {
    if (!deletingGalleryTarget) return;
    deleteGalleryItem(deletingGalleryTarget.id);
    showToast(`Deleted photo "${deletingGalleryTarget.title}"`);
    setDeletingGalleryTarget(null);
  };

  const handleMoveGalleryOrder = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= galleryItems.length) return;

    const updated = [...galleryItems];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);

    reorderGalleryItems(updated);
    showToast(`Repositioned "${moved.title}"`);
  };

  const handleResetGalleryDefaults = () => {
    resetGalleryItemsToDefault();
    showToast('Reset all gallery photos to default seed portfolio');
    setIsResetGalleryConfirmOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body">
      
      {/* 1. TOP HERO / COMMAND BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              {activeTab === 'programs' ? <GraduationCap size={11} /> : <Camera size={11} />}
              <span>{activeTab === 'programs' ? 'What We Offer Management' : 'Gallery of Techniques & Work'}</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              {activeTab === 'programs'
                ? `${metrics.total} Active Workshop Programs`
                : `${galleryMetrics.total} Curated Technique Photos`}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            Workshops & Cohorts
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light">
            Manage the active hands-on workshop programs, modules, and cover imagery featured in the "We offer" and "Created" gallery sections.
          </p>
        </div>

        {/* Action CTAs: Switches according to active tab */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {activeTab === 'programs' ? (
            <>
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Reset workshops back to default seed portfolio"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={exportWorkshopsToJSON}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#524336] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Download full workshops catalog as JSON"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Export JSON</span>
              </button>

              <a
                href="/workshops#we-offer"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#7A8B69] text-[#2F1F13] hover:text-[#7A8B69] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="View public 'We offer' section on website"
              >
                <ExternalLink size={13} className="text-[#7A8B69]" />
                <span className="hidden sm:inline">View Public Page</span>
              </a>

              <Link
                to="/admin/workshops/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Workshop</span>
              </Link>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsResetGalleryConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Reset gallery photos back to default seed"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={exportGalleryToJSON}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#524336] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Download full gallery catalog as JSON"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Export JSON</span>
              </button>

              <a
                href="/workshops#gallery"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#7A8B69] text-[#2F1F13] hover:text-[#7A8B69] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="View public 'Created' gallery on website"
              >
                <ExternalLink size={13} className="text-[#7A8B69]" />
                <span className="hidden sm:inline">View Public Gallery</span>
              </a>

              <Link
                to="/admin/workshops/gallery/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Gallery Photo</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 2. SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#E5D7C5] overflow-x-auto pb-0.5 no-scrollbar">
        <button
          type="button"
          onClick={() => handleTabChange('programs')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'programs'
              ? 'border-[#B5532F] text-[#B5532F]'
              : 'border-transparent text-[#524336] hover:text-[#2F1F13]'
          }`}
        >
          <GraduationCap size={15} />
          <span>What We Offer Programs</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'programs' ? 'bg-[#B5532F]/15 text-[#B5532F]' : 'bg-[#FAF7F2] text-[#865430]'
          }`}>
            {metrics.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('gallery')}
          className={`flex items-center gap-2 py-3 px-4 border-b-2 font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'gallery'
              ? 'border-[#B5532F] text-[#B5532F]'
              : 'border-transparent text-[#524336] hover:text-[#2F1F13]'
          }`}
        >
          <Camera size={15} />
          <span>Techniques & Work Gallery ("Created")</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'gallery' ? 'bg-[#B5532F]/15 text-[#B5532F]' : 'bg-[#FAF7F2] text-[#865430]'
          }`}>
            {galleryMetrics.total}
          </span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: WHAT WE OFFER PROGRAMS
          ========================================================================= */}
      {activeTab === 'programs' && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          {/* SECTION STATS OVERVIEW - KPI CARDS */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {/* Total Programs */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#B5532F]/40 transition-colors">
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Total Programs</span>
                <GraduationCap size={16} className="text-[#B5532F]" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans font-black text-3xl sm:text-4xl text-[#2F1F13] tracking-tight tabular-nums">
                  {metrics.total}
                </span>
                <span className="text-xs text-[#7A8B69] font-mono font-bold">active</span>
              </div>
              <p className="text-[11px] text-[#524336]/70 mt-1">Displayed in "We offer" showcase</p>
            </div>

            {/* Total Modules */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#7A8B69]/40 transition-colors">
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Learning Modules</span>
                <CheckCircle2 size={16} className="text-[#7A8B69]" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans font-black text-3xl sm:text-4xl text-[#7A8B69] tracking-tight tabular-nums">
                  {metrics.totalModules}
                </span>
                <span className="text-xs text-[#524336]/60 font-mono">syllabi</span>
              </div>
              <p className="text-[11px] text-[#524336]/70 mt-1">Hands-on practical topics taught</p>
            </div>

            {/* Curriculum Depth */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#C98A4B]/40 transition-colors">
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Curriculum Depth</span>
                <BookOpen size={16} className="text-[#C98A4B]" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans font-black text-3xl sm:text-4xl text-[#C98A4B] tracking-tight tabular-nums">
                  {metrics.avgModules}
                </span>
                <span className="text-xs text-[#524336]/60 font-mono">avg / workshop</span>
              </div>
              <p className="text-[11px] text-[#524336]/70 mt-1">Modules per program</p>
            </div>

            {/* Live Status */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#865430]/40 transition-colors">
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Store Status</span>
                <Sparkles size={16} className="text-[#B5532F]" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans font-black text-xl sm:text-2xl text-[#2F1F13] tracking-tight">
                  Synchronized
                </span>
              </div>
              <p className="text-[11px] text-[#7A8B69] mt-1 font-mono font-semibold">● Real-time updates live</p>
            </div>
          </section>

          {/* SEARCH & CONTROLS TOOLBAR */}
          <section className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E5D7C5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#524336] font-bold">
                What We Offer Catalog
              </span>
              <span className="text-xs text-[#865430]/40">•</span>
              <span className="text-xs font-mono text-[#865430]">
                {filteredWorkshops.length} {filteredWorkshops.length === 1 ? 'Program' : 'Programs'}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80 shrink-0">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#865430]" />
              <input
                type="text"
                placeholder="Search by title, tag, or modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#865430] hover:text-red-500 cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </section>

          {/* WORKSHOPS LIST */}
          {filteredWorkshops.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E5D7C5] space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center mx-auto text-[#B5532F]">
                <GraduationCap size={24} />
              </div>
              <h3 className="font-heading font-bold text-2xl text-[#2F1F13]">No workshop programs found</h3>
              <p className="text-xs sm:text-sm text-[#524336] max-w-sm mx-auto">
                {searchQuery
                  ? `No workshops matching "${searchQuery}". Try clearing your search.`
                  : 'There are currently no workshop programs listed.'}
              </p>
              <Link
                to="/admin/workshops/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] text-white text-xs font-mono uppercase font-bold shadow-2xs cursor-pointer hover:bg-[#9C4424] transition-colors"
              >
                <Plus size={14} />
                <span>Add New Workshop</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5D7C5] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5D7C5] bg-[#FAF7F2] text-[11px] font-mono uppercase tracking-wider text-[#524336]">
                      <th className="py-3 px-3 w-16 text-center font-semibold">Order</th>
                      <th className="py-3 px-4 font-semibold min-w-[240px]">Program & Cover</th>
                      <th className="py-3 px-4 font-semibold min-w-[180px]">Discipline</th>
                      <th className="py-3 px-4 font-semibold min-w-[220px]">Description</th>
                      <th className="py-3 px-4 font-semibold min-w-[220px]">Learning Modules</th>
                      <th className="py-3 px-4 font-semibold text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1E8DC] text-xs font-sans">
                    {filteredWorkshops.map((workshop, idx) => (
                      <tr
                        key={workshop.id}
                        className="hover:bg-[#FAF7F2]/80 bg-white transition-colors group"
                      >
                        {/* Order Number */}
                        <td className="py-3.5 px-3 text-center align-middle">
                          <span className="font-heading font-black text-base sm:text-lg text-[#B5532F] tabular-nums leading-none">
                            {workshop.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)}
                          </span>
                        </td>

                        {/* Program & Cover */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-[#FAF7F2] border border-[#E5D7C5] relative shadow-2xs group/img flex items-center justify-center">
                              {workshop.image ? (
                                <img
                                  src={workshop.image}
                                  alt={workshop.alt || workshop.title}
                                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <GraduationCap size={16} className="text-[#B5532F]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-heading font-bold text-sm text-[#2F1F13] group-hover:text-[#B5532F] transition-colors leading-tight">
                                {workshop.title}
                              </h4>
                            </div>
                          </div>
                        </td>

                        {/* Discipline Tag */}
                        <td className="py-3.5 px-4 align-middle">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#FAF7F2] border border-[#E5D7C5] text-[#B5532F]">
                            {workshop.tag}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 align-middle text-[#524336]">
                          <p className="line-clamp-2 text-xs font-light leading-relaxed max-w-xs">
                            {workshop.desc}
                          </p>
                        </td>

                        {/* Learning Modules */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7A8B69]/10 text-[#5C6E4B] border border-[#7A8B69]/20">
                                {workshop.modules?.length || 0} Modules
                              </span>
                            </div>
                            {workshop.modules && workshop.modules.length > 0 && (
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {workshop.modules.slice(0, 2).map((m, mIdx) => (
                                  <span
                                    key={mIdx}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5] text-[10px] font-mono text-[#524336] truncate max-w-[130px]"
                                  >
                                    <CheckCircle2 size={9} className="text-[#7A8B69] shrink-0" />
                                    <span className="truncate">{m}</span>
                                  </span>
                                ))}
                                {workshop.modules.length > 2 && (
                                  <span className="text-[10px] font-mono text-[#865430]/80 self-center">
                                    +{workshop.modules.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3.5 px-4 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/admin/workshops/edit/${workshop.id}`}
                              className="p-1.5 rounded-lg border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                              title={`Edit ${workshop.title}`}
                            >
                              <Edit2 size={13} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeletingTarget(workshop)}
                              className="p-1.5 rounded-lg border border-[#E5D7C5] hover:border-red-400 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title={`Delete ${workshop.title}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: GALLERY OF TECHNIQUES & WORK ("Created")
          ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          {/* GALLERY STATS OVERVIEW - KPI CARDS */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {/* Total Photos */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#B5532F]/40 transition-colors">
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Total Gallery Photos</span>
                <Camera size={16} className="text-[#B5532F]" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans font-black text-3xl sm:text-4xl text-[#2F1F13] tracking-tight tabular-nums">
                  {galleryMetrics.total}
                </span>
                <span className="text-xs text-[#7A8B69] font-mono font-bold">curated</span>
              </div>
              <p className="text-[11px] text-[#524336]/70 mt-1">Live in "Created" bento grid</p>
            </div>

            {/* Technique Disciplines */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#7A8B69]/40 transition-colors">
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Disciplines</span>
                <Layers size={16} className="text-[#7A8B69]" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans font-black text-3xl sm:text-4xl text-[#7A8B69] tracking-tight tabular-nums">
                  {galleryMetrics.categoriesCount}
                </span>
                <span className="text-xs text-[#524336]/60 font-mono">categories</span>
              </div>
              <p className="text-[11px] text-[#524336]/70 mt-1">Earth, Vaults, Bamboo & Plasters</p>
            </div>

            {/* Tall Bento Features */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#C98A4B]/40 transition-colors">
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Tall Feature Tiles</span>
                <LayoutGrid size={16} className="text-[#C98A4B]" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans font-black text-3xl sm:text-4xl text-[#C98A4B] tracking-tight tabular-nums">
                  {galleryMetrics.tallCount}
                </span>
                <span className="text-xs text-[#524336]/60 font-mono">vertical spans</span>
              </div>
              <p className="text-[11px] text-[#524336]/70 mt-1">2x height anchor cards in mosaic</p>
            </div>

            {/* Live Synchronized */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E5D7C5] shadow-xs relative overflow-hidden group hover:border-[#865430]/40 transition-colors">
              <div className="flex items-center justify-between text-[#865430]">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Gallery Sync</span>
                <Sparkles size={16} className="text-[#B5532F]" />
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="font-sans font-black text-xl sm:text-2xl text-[#2F1F13] tracking-tight">
                  Synchronized
                </span>
              </div>
              <p className="text-[11px] text-[#7A8B69] mt-1 font-mono font-semibold">● Updates website in real-time</p>
            </div>
          </section>

          {/* GALLERY CONTROLS & CATEGORY FILTER BAR */}
          <section className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E5D7C5] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            {/* Left: Category Segmented Switcher */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-[#FAF7F2] rounded-xl border border-[#E5D7C5]">
              {GALLERY_CATEGORIES.map((cat) => {
                const isActive = activeGalleryCat === cat.id;
                const count = cat.id === 'all'
                  ? galleryItems.length
                  : galleryItems.filter((i) => i.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveGalleryCat(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#B5532F] text-white font-bold shadow-xs'
                        : 'text-[#524336] hover:text-[#2F1F13] hover:bg-white/70 font-semibold'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isActive
                          ? 'bg-black/20 text-white'
                          : 'bg-white border border-[#E5D7C5] text-[#865430]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Search Input + Counter */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline text-xs font-mono text-[#865430]/80 whitespace-nowrap">
                {filteredGalleryItems.length} {filteredGalleryItems.length === 1 ? 'photo' : 'photos'}
              </span>

              <div className="relative w-full sm:w-72">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#865430]" />
                <input
                  type="text"
                  placeholder="Search photo, caption, discipline..."
                  value={gallerySearchQuery}
                  onChange={(e) => setGallerySearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
                {gallerySearchQuery && (
                  <button
                    type="button"
                    onClick={() => setGallerySearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#865430] hover:text-red-500 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* GALLERY TABLE */}
          {filteredGalleryItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E5D7C5] space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center mx-auto text-[#B5532F]">
                <Camera size={24} />
              </div>
              <h3 className="font-heading font-bold text-2xl text-[#2F1F13]">No gallery photos found</h3>
              <p className="text-xs sm:text-sm text-[#524336] max-w-sm mx-auto">
                {gallerySearchQuery
                  ? `No photos matching "${gallerySearchQuery}". Try clearing search or choosing another category.`
                  : 'There are currently no photos in this gallery category.'}
              </p>
              <Link
                to="/admin/workshops/gallery/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] text-white text-xs font-mono uppercase font-bold shadow-2xs cursor-pointer hover:bg-[#9C4424] transition-colors"
              >
                <Plus size={14} />
                <span>Add Gallery Photo</span>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E5D7C5] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5D7C5] bg-[#FAF7F2] text-[11px] font-mono uppercase tracking-wider text-[#524336]">
                      <th className="py-3 px-3 w-16 text-center font-semibold">Order</th>
                      <th className="py-3 px-4 font-semibold min-w-[240px]">Photo & Technique Title</th>
                      <th className="py-3 px-4 font-semibold min-w-[160px]">Category</th>
                      <th className="py-3 px-4 font-semibold min-w-[140px]">Bento Format</th>
                      <th className="py-3 px-4 font-semibold min-w-[240px]">Technique Caption</th>
                      <th className="py-3 px-4 font-semibold text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1E8DC] text-xs font-sans">
                    {filteredGalleryItems.map((item, idx) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#FAF7F2]/80 bg-white transition-colors group"
                      >
                        {/* Order Number */}
                        <td className="py-3.5 px-3 text-center align-middle">
                          <span className="font-heading font-black text-base sm:text-lg text-[#B5532F] tabular-nums leading-none">
                            {idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`}
                          </span>
                        </td>

                        {/* Photo Thumbnail & Title */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-[#FAF7F2] border border-[#E5D7C5] relative shadow-2xs group/thumb flex items-center justify-center">
                              {item.img ? (
                                <img
                                  src={item.img}
                                  alt={item.title}
                                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <Camera size={16} className="text-[#B5532F]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-heading font-bold text-sm text-[#2F1F13] group-hover:text-[#B5532F] transition-colors leading-tight">
                                {item.title}
                              </h4>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 align-middle">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#FAF7F2] border border-[#E5D7C5] text-[#B5532F]">
                            {item.categoryLabel || item.category}
                          </span>
                        </td>

                        {/* Bento Format */}
                        <td className="py-3.5 px-4 align-middle">
                          {item.tall ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C98A4B]/10 text-[#9C6529] border border-[#C98A4B]/20">
                              <Layers size={10} />
                              <span>Tall (2x Span)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#524336] bg-[#FAF7F2] border border-[#E5D7C5]">
                              <LayoutGrid size={10} />
                              <span>Standard (1x)</span>
                            </span>
                          )}
                        </td>

                        {/* Caption */}
                        <td className="py-3.5 px-4 align-middle text-[#524336]">
                          <p className="line-clamp-2 text-xs font-light leading-relaxed max-w-sm">
                            {item.caption || <span className="italic text-[#865430]/50">No caption provided</span>}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/admin/workshops/gallery/edit/${item.id}`}
                              className="p-1.5 rounded-lg border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                              title={`Edit ${item.title}`}
                            >
                              <Edit2 size={13} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeletingGalleryTarget(item)}
                              className="p-1.5 rounded-lg border border-[#E5D7C5] hover:border-red-400 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title={`Delete ${item.title}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE WORKSHOP PROGRAM CONFIRMATION */}
      {/* ======================================================== */}
      {deletingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5D7C5] p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-heading font-black text-xl text-[#2F1F13]">
                Delete Workshop Program?
              </h3>
              <p className="text-xs text-[#524336] leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-[#2F1F13]">"{deletingTarget.title}"</span> from the "We offer" showcase?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTarget(null)}
                className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-[#524336] hover:bg-[#FAF7F2] text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE GALLERY PHOTO CONFIRMATION */}
      {/* ======================================================== */}
      {deletingGalleryTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5D7C5] p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-heading font-black text-xl text-[#2F1F13]">
                Delete Gallery Photo?
              </h3>
              <p className="text-xs text-[#524336] leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-[#2F1F13]">"{deletingGalleryTarget.title}"</span> from the "Created" techniques mosaic?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingGalleryTarget(null)}
                className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-[#524336] hover:bg-[#FAF7F2] text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteGallery}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RESET WORKSHOPS TO DEFAULTS CONFIRMATION */}
      {/* ======================================================== */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5D7C5] p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle size={20} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-heading font-black text-xl text-[#2F1F13]">
                Reset to Default Portfolio Seed?
              </h3>
              <p className="text-xs text-[#524336] leading-relaxed">
                This will restore the 5 original AuroYali workshop programs (CSEB, Rammed Earth, Ferro Cement, Timbrel Vault, and Natural Plasters). Any custom additions will be replaced.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-[#524336] hover:bg-[#FAF7F2] text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RESET GALLERY TO DEFAULTS CONFIRMATION */}
      {/* ======================================================== */}
      {isResetGalleryConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5D7C5] p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle size={20} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-heading font-black text-xl text-[#2F1F13]">
                Reset Gallery to Default Portfolio Seed?
              </h3>
              <p className="text-xs text-[#524336] leading-relaxed">
                This will restore the 10 original curated technique photos across Earth & CSEB, Vaults & Shells, Bamboo Craft, and Natural Plasters.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetGalleryConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-[#524336] hover:bg-[#FAF7F2] text-xs uppercase tracking-wider font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetGalleryDefaults}
                className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer"
              >
                Reset Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOAST NOTIFICATION */}
      {/* ======================================================== */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1B140E] text-[#FAF7F2] border border-[#382B21] shadow-2xl text-xs font-mono"
          >
            <CheckCircle2 size={16} className="text-[#7A8B69]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AdminWorkshops;
