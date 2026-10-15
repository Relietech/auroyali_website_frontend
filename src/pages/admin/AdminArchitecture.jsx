import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Plus,
  Upload,
  ExternalLink,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Eye,
  X,
  Layers,
  ArrowRight,
  Link as LinkIcon,
  HelpCircle,
  Maximize2,
  Check,
  ChevronUp,
  ChevronDown,
  Palette,
  Lightbulb,
  FileText,
  Users,
  HardHat,
  Trees,
  Armchair,
  Save,
  MessageSquare
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  getStoredArchitectureData,
  updateArchitectureHero,
  updateArchitectureOverview,
  updateProcessSection,
  deleteProcessStep,
  reorderProcessSteps,
  updateAlliedSection,
  deleteAlliedService,
  reorderAlliedServices,
  updateArchitectureCTA,
  resetArchitectureToDefault,
  subscribeToArchitecture,
  readImageFileAsDataUrl,
  getArchitectureIcon,
  ARCHITECTURE_ICONS,
  DEFAULT_ARCHITECTURE_DATA
} from '../../services/architectureStore';

export function AdminArchitecture() {
  const [data, setData] = useState(() => getStoredArchitectureData());
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(currentTabParam || 'hero'); // 'hero' | 'overview' | 'process' | 'allied' | 'cta'
  const [toast, setToast] = useState(null);

  // Sync tab with search params when URL changes
  useEffect(() => {
    if (currentTabParam && ['hero', 'overview', 'process', 'allied', 'cta'].includes(currentTabParam)) {
      setActiveTab(currentTabParam);
    }
  }, [currentTabParam]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Tab 1: Hero Form State
  const [heroForm, setHeroForm] = useState(data.hero || DEFAULT_ARCHITECTURE_DATA.hero);
  const [heroImageInputMode, setHeroImageInputMode] = useState('upload');
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isHeroDragging, setIsHeroDragging] = useState(false);
  const heroFileInputRef = useRef(null);

  // Tab 2: Overview Form State
  const [overviewForm, setOverviewForm] = useState(data.overview || DEFAULT_ARCHITECTURE_DATA.overview);
  const [newHighlightInput, setNewHighlightInput] = useState('');
  const [overviewImageInputMode, setOverviewImageInputMode] = useState('upload');
  const [isUploadingOverview, setIsUploadingOverview] = useState(false);
  const [isOverviewDragging, setIsOverviewDragging] = useState(false);
  const overviewFileInputRef = useRef(null);

  // Tab 3: Process Section State
  const [processSectionForm, setProcessSectionForm] = useState(data.processSection || DEFAULT_ARCHITECTURE_DATA.processSection);

  // Tab 4: Allied Section State
  const [alliedSectionForm, setAlliedSectionForm] = useState(data.alliedSection || DEFAULT_ARCHITECTURE_DATA.alliedSection);

  // Tab 5: Bottom CTA Form State
  const [ctaForm, setCtaForm] = useState(data.ctaBanner || DEFAULT_ARCHITECTURE_DATA.ctaBanner);
  const [ctaImageInputMode, setCtaImageInputMode] = useState('upload');
  const [isUploadingCta, setIsUploadingCta] = useState(false);
  const [isCtaDragging, setIsCtaDragging] = useState(false);

  // Generic Deletion Dialog State
  const [deleteDialog, setDeleteDialog] = useState(null); // { type: 'step'|'allied', item: obj }

  // Reset to Factory Defaults Dialog State
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Toast feedback helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync state with architectureStore event bus
  useEffect(() => {
    const unsub = subscribeToArchitecture((updated) => {
      setData(updated);
      setHeroForm(updated.hero || DEFAULT_ARCHITECTURE_DATA.hero);
      setOverviewForm(updated.overview || DEFAULT_ARCHITECTURE_DATA.overview);
      setProcessSectionForm(updated.processSection || DEFAULT_ARCHITECTURE_DATA.processSection);
      setAlliedSectionForm(updated.alliedSection || DEFAULT_ARCHITECTURE_DATA.alliedSection);
      setCtaForm(updated.ctaBanner || DEFAULT_ARCHITECTURE_DATA.ctaBanner);
    });
    return () => unsub();
  }, []);

  // Handlers for Tab 1: Hero Banner
  const handleSaveHero = (e) => {
    e?.preventDefault();
    if (!heroForm.title.trim()) {
      showToast('Page title cannot be empty', 'error');
      return;
    }
    updateArchitectureHero(heroForm);
    showToast('Hero banner settings saved successfully');
  };

  const processHeroFile = async (file) => {
    if (!file) return;
    try {
      setIsUploadingHero(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1920, 0.85);
      setHeroForm((prev) => ({ ...prev, bgImage: dataUrl }));
      showToast('Hero image uploaded successfully');
    } catch (err) {
      showToast(err.message || 'Failed to process uploaded image', 'error');
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleHeroFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processHeroFile(file);
    }
    e.target.value = '';
  };

  // Handlers for Tab 2: Overview & Ethos
  const handleSaveOverview = (e) => {
    e?.preventDefault();
    if (!overviewForm.heading.trim()) {
      showToast('Main heading cannot be empty', 'error');
      return;
    }
    updateArchitectureOverview(overviewForm);
    showToast('Overview & Approach saved successfully');
  };

  const processOverviewFile = async (file) => {
    if (!file) return;
    try {
      setIsUploadingOverview(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1400, 0.85);
      setOverviewForm((prev) => ({ ...prev, image: dataUrl }));
      showToast('Studio image uploaded successfully');
    } catch (err) {
      showToast(err.message || 'Failed to process uploaded image', 'error');
    } finally {
      setIsUploadingOverview(false);
    }
  };

  const handleOverviewFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processOverviewFile(file);
    }
    e.target.value = '';
  };

  const processCtaFile = async (file) => {
    if (!file) return;
    try {
      setIsUploadingCta(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1920, 0.85);
      setCtaForm((prev) => ({ ...prev, bgImage: dataUrl }));
      showToast('CTA banner image uploaded successfully');
    } catch (err) {
      showToast(err.message || 'Failed to process uploaded image', 'error');
    } finally {
      setIsUploadingCta(false);
    }
  };

  const handleCtaFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processCtaFile(file);
    }
    e.target.value = '';
  };

  const handleAddHighlight = () => {
    const text = newHighlightInput.trim();
    if (!text) return;
    if (overviewForm.highlights.includes(text)) {
      showToast('This highlight already exists', 'error');
      return;
    }
    setOverviewForm((prev) => ({
      ...prev,
      highlights: [...(prev.highlights || []), text]
    }));
    setNewHighlightInput('');
  };

  const handleRemoveHighlight = (idx) => {
    setOverviewForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx)
    }));
  };

  // Handlers for Tab 3: Process Steps
  const handleSaveProcessSectionHeader = (e) => {
    e?.preventDefault();
    updateProcessSection(processSectionForm);
    showToast('Process section header updated');
  };

  const handleMoveStep = (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.processSteps.length) return;
    const newSteps = [...data.processSteps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    reorderProcessSteps(newSteps);
    showToast('Process steps reordered');
  };

  // Handlers for Tab 4: Allied Services
  const handleSaveAlliedSectionHeader = (e) => {
    e?.preventDefault();
    updateAlliedSection(alliedSectionForm);
    showToast('Allied section header updated');
  };

  const handleMoveAllied = (index, direction) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.alliedServices.length) return;
    const newServices = [...data.alliedServices];
    const temp = newServices[index];
    newServices[index] = newServices[targetIdx];
    newServices[targetIdx] = temp;
    reorderAlliedServices(newServices);
    showToast('Allied services reordered');
  };

  // Handlers for Tab 5: Bottom CTA
  const handleSaveCTA = (e) => {
    e?.preventDefault();
    if (!ctaForm.heading.trim()) {
      showToast('CTA heading is required', 'error');
      return;
    }
    updateArchitectureCTA(ctaForm);
    showToast('Bottom CTA banner saved');
  };

  // Execution of Deletions
  const handleConfirmDelete = () => {
    if (!deleteDialog) return;
    if (deleteDialog.type === 'step') {
      deleteProcessStep(deleteDialog.item.id);
      showToast(`Deleted step "${deleteDialog.item.title}"`);
    } else if (deleteDialog.type === 'allied') {
      deleteAlliedService(deleteDialog.item.id);
      showToast(`Deleted service "${deleteDialog.item.title}"`);
    }
    setDeleteDialog(null);
  };

  // Reset to Defaults
  const handleConfirmReset = () => {
    resetArchitectureToDefault();
    setResetConfirmOpen(false);
    showToast('Architecture data restored to factory defaults', 'warning');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border text-xs font-mono uppercase tracking-wider backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : toast.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-[#2F1F13] text-white border-[#B5532F]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle size={16} className="text-rose-500 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle size={16} className="text-amber-500 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-[#C98A4B] shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE TITLE & PRIMARY ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Compass size={11} />
              <span>Architecture Studio</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              Bioclimatic & Spatial Registry
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            Architecture Studio Console
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light max-w-2xl">
            Manage hero banner, ethos & approach, 6-step architectural process, and allied design disciplines displayed on the public Architecture page.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/services/architecture"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95"
            title="Preview public architecture page"
          >
            <ExternalLink size={13} className="text-[#B5532F]" />
            <span className="hidden sm:inline">View Public Page</span>
          </Link>

          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Reset to factory default architecture data"
          >
            <RotateCw size={13} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#865430] tracking-wider block">
            Process Steps
          </span>
          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#2F1F13] mt-1 block">
            {data.processSteps.length}
          </span>
          <span className="text-[11px] text-[#B5532F] font-mono mt-0.5 block">
            Step 01 to {data.processSteps.length.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#865430] tracking-wider block">
            Allied Disciplines
          </span>
          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#2F1F13] mt-1 block">
            {data.alliedServices.length}
          </span>
          <span className="text-[11px] text-[#7A8B69] font-mono mt-0.5 block">
            Full-width Rows
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#865430] tracking-wider block">
            Ethos Highlights
          </span>
          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#2F1F13] mt-1 block">
            {data.overview.highlights?.length || 0}
          </span>
          <span className="text-[11px] text-[#524336]/80 font-mono mt-0.5 block">
            Bullet Pills
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#865430] tracking-wider block">
            Storage Engine
          </span>
          <span className="font-heading text-2xl sm:text-3xl font-bold text-[#B5532F] mt-1 block">
            Reactive
          </span>
          <span className="text-[11px] text-[#524336]/80 font-mono mt-0.5 block">
            Instant Client Sync
          </span>
        </div>
      </section>

      {/* 3. TAB PILLS */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 border-b border-[#E5D7C5]/60 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {[
          { id: 'hero', label: '1. Hero & Banner', icon: ImageIcon },
          { id: 'overview', label: '2. Ethos & Overview', icon: Sparkles },
          { id: 'process', label: `3. Process Steps (${data.processSteps.length})`, icon: Lightbulb },
          { id: 'allied', label: `4. Allied Services (${data.alliedServices.length})`, icon: Layers },
          { id: 'cta', label: '5. Bottom CTA', icon: ArrowRight }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#2F1F13] text-white shadow-xs font-bold'
                  : 'bg-white text-[#524336] hover:text-[#2F1F13] hover:bg-[#FAF7F2] border border-[#E5D7C5]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#C98A4B]' : 'text-[#865430]/70'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & BANNER */}
      {activeTab === 'hero' && (
        <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5]/60 pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2F1F13] flex items-center gap-2">
                <ImageIcon size={18} className="text-[#B5532F]" />
                <span>Page Banner & Hero Configuration</span>
              </h2>
              <p className="text-xs text-[#524336] mt-0.5">
                Controls the top parallax banner with title, breadcrumb tag, and high-resolution backdrop.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveHero}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Save size={14} />
              <span>Save Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={heroForm.title}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    placeholder="e.g. Architecture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                    Breadcrumb Tag
                  </label>
                  <input
                    type="text"
                    value={heroForm.tag}
                    onChange={(e) => setHeroForm({ ...heroForm, tag: e.target.value })}
                    placeholder="e.g. Services"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Breadcrumb Text
                </label>
                <input
                  type="text"
                  value={heroForm.breadcrumb}
                  onChange={(e) => setHeroForm({ ...heroForm, breadcrumb: e.target.value })}
                  placeholder="e.g. Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Subtitle / Tagline
                </label>
                <textarea
                  rows={3}
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                  placeholder="Brief description for the banner..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white resize-y transition-colors"
                />
              </div>

              {/* Image Selection (Upload or URL) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-[#B5532F]" />
                    <span>Banner Background Image</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {heroForm.bgImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeroForm(prev => ({ ...prev, bgImage: '' }));
                          showToast('Banner background image deleted');
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-600 hover:text-rose-700 cursor-pointer transition-colors"
                        title="Delete banner image"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    )}
                    <div className="flex rounded-lg bg-[#FAF7F2] p-0.5 border border-[#E5D7C5] text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setHeroImageInputMode('upload')}
                        className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                          heroImageInputMode === 'upload' ? 'bg-[#B5532F] text-white font-bold shadow-xs' : 'text-[#524336] hover:text-[#2F1F13]'
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroImageInputMode('url')}
                        className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                          heroImageInputMode === 'url' ? 'bg-[#B5532F] text-white font-bold shadow-xs' : 'text-[#524336] hover:text-[#2F1F13]'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>
                </div>

                {heroImageInputMode === 'url' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={heroForm.bgImage}
                        onChange={(e) => setHeroForm({ ...heroForm, bgImage: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:outline-none focus:border-[#B5532F] focus:bg-white"
                      />
                      {heroForm.bgImage && (
                        <button
                          type="button"
                          onClick={() => {
                            setHeroForm(prev => ({ ...prev, bgImage: '' }));
                            showToast('Banner image deleted');
                          }}
                          className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                          title="Delete image URL"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-[#865430]/70">
                      Paste a direct public image link (Unsplash, CDN, or hosted asset).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Drag and Drop Upload Dropzone with Native File Trigger */}
                    <label
                      onDragOver={(e) => { e.preventDefault(); setIsHeroDragging(true); }}
                      onDragLeave={() => setIsHeroDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsHeroDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processHeroFile(file);
                      }}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer group text-center min-h-[140px] ${
                        isHeroDragging
                          ? 'border-[#B5532F] bg-[#B5532F]/10 scale-[1.01]'
                          : 'border-[#E5D7C5] hover:border-[#B5532F] bg-[#FAF7F2] hover:bg-[#FAF7F2]/80'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleHeroFileUpload}
                        className="sr-only"
                      />
                      <div className="w-12 h-12 rounded-full bg-white border border-[#E5D7C5] group-hover:border-[#B5532F] flex items-center justify-center text-[#B5532F] mb-2.5 transition-colors shadow-2xs">
                        {isUploadingHero ? (
                          <div className="w-5 h-5 border-2 border-[#B5532F] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload size={22} />
                        )}
                      </div>
                      <span className="text-xs font-mono uppercase font-bold text-[#2F1F13] group-hover:text-[#B5532F] transition-colors">
                        {isUploadingHero ? 'Processing & Optimizing Image...' : 'Click or Drag Image File to Upload'}
                      </span>
                      <span className="text-[11px] text-[#524336]/70 mt-1 font-light">
                        Supports JPG, PNG, WebP (auto-optimized for web)
                      </span>
                    </label>

                    {/* Active Uploaded Image Indicator */}
                    {heroForm.bgImage && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={heroForm.bgImage}
                            alt="Active Hero Preview"
                            className="w-14 h-10 rounded-lg object-cover border border-[#E5D7C5] shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="text-xs font-mono text-[#2F1F13] font-bold block truncate">
                              Active Banner Photo
                            </span>
                            <span className="text-[10px] font-mono text-[#865430] block">
                              {heroForm.bgImage.startsWith('data:') ? 'Local Upload (Compressed)' : 'Web URL'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="px-3 py-1.5 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[11px] font-mono text-[#524336] hover:text-[#2F1F13] cursor-pointer transition-colors shadow-2xs">
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              onChange={handleHeroFileUpload}
                              className="sr-only"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setHeroForm(prev => ({ ...prev, bgImage: '' }));
                              showToast('Banner image deleted');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-mono cursor-pointer transition-colors"
                            title="Delete image"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Banner Preview */}
            <div className="lg:col-span-5 space-y-2">
              <span className="block text-[11px] font-mono uppercase text-[#865430] tracking-wider font-semibold">
                Live Banner Preview
              </span>
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-[#2F1F13] border border-[#E5D7C5] flex flex-col justify-end p-5 shadow-md group">
                {heroForm.bgImage && (
                  <img
                    src={heroForm.bgImage}
                    alt="Banner Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-65"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Hover Action Overlay */}
                {heroForm.bgImage && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 z-20">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#2F1F13] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer hover:bg-[#FAF7F2] transition-colors shadow-md">
                      <Upload size={13} className="text-[#B5532F]" />
                      <span>Upload New</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleHeroFileUpload}
                        className="sr-only"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroForm(prev => ({ ...prev, bgImage: '' }));
                        showToast('Banner image deleted');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer hover:bg-rose-700 transition-colors shadow-md"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
                
                <div className="relative z-10 space-y-1.5">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-[#B5532F] text-white text-[9px] font-mono uppercase tracking-widest font-bold">
                    {heroForm.tag || 'Services'}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white leading-tight">
                    {heroForm.title || 'Architecture'}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 font-light">
                    {heroForm.subtitle || 'Creating both traditional and modern architecture...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: ETHOS & OVERVIEW */}
      {activeTab === 'overview' && (
        <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5]/60 pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2F1F13] flex items-center gap-2">
                <Sparkles size={18} className="text-[#B5532F]" />
                <span>Ethos, Approach & Highlights</span>
              </h2>
              <p className="text-xs text-[#524336] mt-0.5">
                Manage the overview text, client-centric ethos statement, bullet pills, and featured studio visual.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveOverview}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Save size={14} />
              <span>Save Overview</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Section Eyebrow Pill
                </label>
                <input
                  type="text"
                  value={overviewForm.eyebrow}
                  onChange={(e) => setOverviewForm({ ...overviewForm, eyebrow: e.target.value })}
                  placeholder="e.g. Our Approach"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Main Heading *
                </label>
                <input
                  type="text"
                  value={overviewForm.heading}
                  onChange={(e) => setOverviewForm({ ...overviewForm, heading: e.target.value })}
                  placeholder="e.g. Architectural Excellence Centered on Your Needs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Overview Paragraph / Ethos Statement
                </label>
                <textarea
                  rows={4}
                  value={overviewForm.description}
                  onChange={(e) => setOverviewForm({ ...overviewForm, description: e.target.value })}
                  placeholder="We put our full effort into creating the best architecture..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white resize-y transition-colors"
                />
              </div>

              {/* Highlights List Manager */}
              <div className="space-y-2 pt-2">
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold">
                  Key Value Highlights (Bullet Pills)
                </label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newHighlightInput}
                    onChange={(e) => setNewHighlightInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                    placeholder="Add highlight (e.g. Traditional & Modern Styles)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs focus:outline-none focus:border-[#B5532F] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E5D7C5]/60 text-[#2F1F13] border border-[#E5D7C5] font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} className="text-[#B5532F]" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {overviewForm.highlights?.map((hl, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] font-medium shadow-2xs"
                    >
                      <CheckCircle2 size={13} className="text-[#B5532F]" />
                      <span>{hl}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-[#865430]/70 hover:text-rose-600 p-0.5 rounded transition-colors ml-1 cursor-pointer"
                        title="Remove highlight"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Button Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={overviewForm.ctaText}
                    onChange={(e) => setOverviewForm({ ...overviewForm, ctaText: e.target.value })}
                    placeholder="Inquire with Our Architects"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs focus:outline-none focus:border-[#B5532F] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                    Button Target Link
                  </label>
                  <input
                    type="text"
                    value={overviewForm.ctaLink}
                    onChange={(e) => setOverviewForm({ ...overviewForm, ctaLink: e.target.value })}
                    placeholder="/contact"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:outline-none focus:border-[#B5532F] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Studio Image & Preview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-[#B5532F]" />
                  <span>Featured Studio Image</span>
                </span>
                
                <div className="flex items-center gap-2.5">
                  {overviewForm.image && (
                    <button
                      type="button"
                      onClick={() => {
                        setOverviewForm(prev => ({ ...prev, image: '' }));
                        showToast('Studio image deleted');
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-600 hover:text-rose-700 cursor-pointer transition-colors"
                      title="Delete studio image"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  )}
                  <div className="flex rounded-lg bg-[#FAF7F2] p-0.5 border border-[#E5D7C5] text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setOverviewImageInputMode('upload')}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        overviewImageInputMode === 'upload' ? 'bg-[#B5532F] text-white font-bold shadow-xs' : 'text-[#524336] hover:text-[#2F1F13]'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setOverviewImageInputMode('url')}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        overviewImageInputMode === 'url' ? 'bg-[#B5532F] text-white font-bold shadow-xs' : 'text-[#524336]'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>
              </div>

              {overviewImageInputMode === 'url' ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={overviewForm.image}
                      onChange={(e) => setOverviewForm({ ...overviewForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:outline-none focus:border-[#B5532F] focus:bg-white"
                    />
                    {overviewForm.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setOverviewForm(prev => ({ ...prev, image: '' }));
                          showToast('Studio image deleted');
                        }}
                        className="px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                        title="Delete image URL"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-[#865430]/70">
                    Paste a direct image link or use the Upload File tab.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label
                    onDragOver={(e) => { e.preventDefault(); setIsOverviewDragging(true); }}
                    onDragLeave={() => setIsOverviewDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsOverviewDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processOverviewFile(file);
                    }}
                    className={`relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer group text-center min-h-[110px] ${
                      isOverviewDragging
                        ? 'border-[#B5532F] bg-[#B5532F]/10 scale-[1.01]'
                        : 'border-[#E5D7C5] hover:border-[#B5532F] bg-[#FAF7F2] hover:bg-[#FAF7F2]/80'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleOverviewFileUpload}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-full bg-white border border-[#E5D7C5] group-hover:border-[#B5532F] flex items-center justify-center text-[#B5532F] mb-1.5 transition-colors shadow-2xs">
                      {isUploadingOverview ? (
                        <div className="w-4 h-4 border-2 border-[#B5532F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={18} />
                      )}
                    </div>
                    <span className="text-xs font-mono uppercase font-bold text-[#2F1F13] group-hover:text-[#B5532F] transition-colors">
                      {isUploadingOverview ? 'Compressing Image...' : 'Click or Drag Image File'}
                    </span>
                    <span className="text-[10px] text-[#524336]/70 mt-0.5">
                      JPG, PNG, WebP (auto-optimized)
                    </span>
                  </label>

                  {/* Active Uploaded Image with Delete & Change Controls */}
                  {overviewForm.image && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={overviewForm.image}
                          alt="Studio"
                          className="w-14 h-10 rounded-lg object-cover border border-[#E5D7C5] shrink-0"
                        />
                        <div className="overflow-hidden">
                          <span className="text-xs font-mono text-[#2F1F13] font-bold block truncate">
                            Active Studio Image
                          </span>
                          <span className="text-[10px] font-mono text-[#865430] block">
                            {overviewForm.image.startsWith('data:') ? 'Local Upload (Compressed)' : 'Web URL'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="px-3 py-1.5 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[11px] font-mono text-[#524336] hover:text-[#2F1F13] cursor-pointer transition-colors shadow-2xs">
                          <span>Change</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleOverviewFileUpload}
                            className="sr-only"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setOverviewForm(prev => ({ ...prev, image: '' }));
                            showToast('Studio image deleted');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-mono cursor-pointer transition-colors"
                          title="Delete image"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Live Preview Card with Hover Overlay Actions */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#FAF7F2] border border-[#E5D7C5] group shadow-xs">
                {overviewForm.image ? (
                  <>
                    <img
                      src={overviewForm.image}
                      alt="Studio Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#2F1F13] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer hover:bg-[#FAF7F2] transition-colors shadow-md">
                        <Upload size={13} className="text-[#B5532F]" />
                        <span>Upload New</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleOverviewFileUpload}
                          className="sr-only"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOverviewForm(prev => ({ ...prev, image: '' }));
                          showToast('Studio image deleted');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer hover:bg-rose-700 transition-colors shadow-md"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#865430]/60 space-y-1">
                    <ImageIcon size={28} className="text-[#865430]/40" />
                    <span className="text-xs font-mono font-medium">No Image Uploaded</span>
                    <span className="text-[10px] text-[#865430]/50 font-light">Use the upload box above to add a photograph</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: PROCESS STEPS */}
      {activeTab === 'process' && (
        <div className="space-y-6">
          {/* Section Header Editor */}
          <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-3">
              <span className="font-heading text-sm font-bold text-[#2F1F13] flex items-center gap-2">
                <Lightbulb size={16} className="text-[#B5532F]" />
                <span>Process Section Header Titles</span>
              </span>
              <button
                type="button"
                onClick={handleSaveProcessSectionHeader}
                className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E5D7C5]/60 text-[#2F1F13] border border-[#E5D7C5] font-mono text-xs uppercase cursor-pointer"
              >
                Update Titles
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#865430] tracking-wider font-semibold mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={processSectionForm.eyebrow}
                  onChange={(e) => setProcessSectionForm({ ...processSectionForm, eyebrow: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:bg-white focus:border-[#B5532F]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#865430] tracking-wider font-semibold mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={processSectionForm.heading}
                  onChange={(e) => setProcessSectionForm({ ...processSectionForm, heading: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:bg-white focus:border-[#B5532F]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#865430] tracking-wider font-semibold mb-1">
                  Subtext
                </label>
                <input
                  type="text"
                  value={processSectionForm.subtitle}
                  onChange={(e) => setProcessSectionForm({ ...processSectionForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:bg-white focus:border-[#B5532F]"
                />
              </div>
            </div>
          </section>

          {/* Steps Management List */}
          <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5]/60 pb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#2F1F13] flex items-center gap-2">
                  <Compass size={18} className="text-[#B5532F]" />
                  <span>Architectural Steps ({data.processSteps.length})</span>
                </h2>
                <p className="text-xs text-[#524336] mt-0.5">
                  Cards presented in step-by-step sequence. Open in dedicated page to add or edit steps.
                </p>
              </div>

              {/* Dedicated New Page Link */}
              <Link
                to="/admin/architecture/steps/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                <Plus size={15} />
                <span>Add New Step</span>
              </Link>
            </div>

            {/* Grid of Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.processSteps.map((step, idx) => {
                const IconComp = getArchitectureIcon(step.iconName);
                return (
                  <div
                    key={step.id || idx}
                    className="p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs hover:shadow-md hover:border-[#B5532F]/50 transition-all flex flex-col justify-between space-y-4 group relative"
                  >
                    <div className="space-y-3">
                      {/* Top row with Icon, Step Number, & Ordering */}
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-[#B5532F]/10 text-[#B5532F] flex items-center justify-center">
                          <IconComp size={18} />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-[#FAF7F2] hover:bg-[#E5D7C5] text-[#524336] hover:text-[#2F1F13] disabled:opacity-20 cursor-pointer border border-[#E5D7C5]"
                            title="Move step up"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveStep(idx, 'down')}
                            disabled={idx === data.processSteps.length - 1}
                            className="p-1 rounded bg-[#FAF7F2] hover:bg-[#E5D7C5] text-[#524336] hover:text-[#2F1F13] disabled:opacity-20 cursor-pointer border border-[#E5D7C5]"
                            title="Move step down"
                          >
                            <ChevronDown size={14} />
                          </button>
                          <span className="font-mono text-xs font-bold text-[#B5532F] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5] ml-1">
                            {step.step || (idx + 1).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h3 className="font-heading text-base font-bold text-[#2F1F13] group-hover:text-[#B5532F] transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs text-[#524336] font-light mt-1.5 line-clamp-3 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#E5D7C5]/60">
                      <span className="text-[10px] font-mono text-[#865430]">
                        Icon: {step.iconName || 'Lightbulb'}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/admin/architecture/steps/edit/${step.id}`}
                          className="px-2.5 py-1 rounded-lg text-[#524336] hover:text-[#2F1F13] hover:bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono transition-colors flex items-center gap-1"
                          title="Edit this step in dedicated page"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteDialog({ type: 'step', item: step })}
                          className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                          title="Delete this step"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: ALLIED DESIGN SERVICES */}
      {activeTab === 'allied' && (
        <div className="space-y-6">
          {/* Section Header Editor */}
          <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-3">
              <span className="font-heading text-sm font-bold text-[#2F1F13] flex items-center gap-2">
                <Layers size={16} className="text-[#B5532F]" />
                <span>Allied Services Section Header</span>
              </span>
              <button
                type="button"
                onClick={handleSaveAlliedSectionHeader}
                className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E5D7C5]/60 text-[#2F1F13] border border-[#E5D7C5] font-mono text-xs uppercase cursor-pointer"
              >
                Update Titles
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#865430] tracking-wider font-semibold mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={alliedSectionForm.eyebrow}
                  onChange={(e) => setAlliedSectionForm({ ...alliedSectionForm, eyebrow: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:bg-white focus:border-[#B5532F]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#865430] tracking-wider font-semibold mb-1">
                  Main Heading
                </label>
                <input
                  type="text"
                  value={alliedSectionForm.heading}
                  onChange={(e) => setAlliedSectionForm({ ...alliedSectionForm, heading: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:bg-white focus:border-[#B5532F]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#865430] tracking-wider font-semibold mb-1">
                  Subtext
                </label>
                <input
                  type="text"
                  value={alliedSectionForm.subtitle}
                  onChange={(e) => setAlliedSectionForm({ ...alliedSectionForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:bg-white focus:border-[#B5532F]"
                />
              </div>
            </div>
          </section>

          {/* Allied Services Rows Manager */}
          <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5]/60 pb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#2F1F13] flex items-center gap-2">
                  <Palette size={18} className="text-[#B5532F]" />
                  <span>Design Disciplines ({data.alliedServices.length})</span>
                </h2>
                <p className="text-xs text-[#524336] mt-0.5">
                  Showcased as alternating full-width editorial rows with parallax photo reveals and bullet specs.
                </p>
              </div>

              {/* Dedicated New Page Link */}
              <Link
                to="/admin/architecture/disciplines/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer self-start sm:self-auto"
              >
                <Plus size={15} />
                <span>Add New Discipline</span>
              </Link>
            </div>

            {/* Rows List */}
            <div className="space-y-4">
              {data.alliedServices.map((service, idx) => {
                const IconComp = getArchitectureIcon(service.iconName);
                return (
                  <div
                    key={service.id || idx}
                    className="p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs hover:border-[#B5532F]/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
                  >
                    {/* Left: Thumbnail & Main Info */}
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      <div className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E5D7C5] shrink-0">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#865430]/40 text-[10px]">
                            No Image
                          </div>
                        )}
                        <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded bg-[#B5532F] text-white flex items-center justify-center shadow">
                          <IconComp size={12} />
                        </div>
                      </div>

                      <div className="space-y-1.5 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#B5532F]">
                            #{service.numeral || (idx + 1).toString().padStart(2, '0')}
                          </span>
                          <h3 className="font-heading text-base font-bold text-[#2F1F13] group-hover:text-[#B5532F] transition-colors truncate">
                            {service.title}
                          </h3>
                        </div>
                        
                        <p className="text-xs text-[#524336] line-clamp-2 font-light">
                          {service.description}
                        </p>

                        {/* Bullet points pills */}
                        {service.bullets && service.bullets.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {service.bullets.map((b, bIdx) => (
                              <span
                                key={bIdx}
                                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13]"
                              >
                                ✓ {b}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions & Order */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <div className="flex items-center gap-1 mr-2">
                        <button
                          type="button"
                          onClick={() => handleMoveAllied(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded bg-[#FAF7F2] hover:bg-[#E5D7C5] text-[#524336] hover:text-[#2F1F13] disabled:opacity-20 cursor-pointer border border-[#E5D7C5]"
                          title="Move up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveAllied(idx, 'down')}
                          disabled={idx === data.alliedServices.length - 1}
                          className="p-1.5 rounded bg-[#FAF7F2] hover:bg-[#E5D7C5] text-[#524336] hover:text-[#2F1F13] disabled:opacity-20 cursor-pointer border border-[#E5D7C5]"
                          title="Move down"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      {/* Dedicated Page Edit Link */}
                      <Link
                        to={`/admin/architecture/disciplines/edit/${service.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E5D7C5] text-[#2F1F13] border border-[#E5D7C5] text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteDialog({ type: 'allied', item: service })}
                        className="p-2 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                        title="Delete discipline"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* TAB 5: BOTTOM CTA BANNER */}
      {activeTab === 'cta' && (
        <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5]/60 pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2F1F13] flex items-center gap-2">
                <ArrowRight size={18} className="text-[#B5532F]" />
                <span>Bottom Call-To-Action Banner</span>
              </h2>
              <p className="text-xs text-[#524336] mt-0.5">
                The dark conversion banner located at the bottom of the Architecture page.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveCTA}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Save size={14} />
              <span>Save CTA</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  CTA Heading *
                </label>
                <input
                  type="text"
                  value={ctaForm.heading}
                  onChange={(e) => setCtaForm({ ...ctaForm, heading: e.target.value })}
                  placeholder="e.g. Ready to Start Your Architectural Project?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  CTA Subtitle / Prompt
                </label>
                <textarea
                  rows={3}
                  value={ctaForm.subtitle}
                  onChange={(e) => setCtaForm({ ...ctaForm, subtitle: e.target.value })}
                  placeholder="Get in touch with our Auroville studio..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:outline-none focus:border-[#B5532F] focus:bg-white resize-y transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaForm.buttonText}
                    onChange={(e) => setCtaForm({ ...ctaForm, buttonText: e.target.value })}
                    placeholder="Contact Us Today"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs focus:outline-none focus:border-[#B5532F] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                    Target URL
                  </label>
                  <input
                    type="text"
                    value={ctaForm.buttonLink}
                    onChange={(e) => setCtaForm({ ...ctaForm, buttonLink: e.target.value })}
                    placeholder="/contact"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:outline-none focus:border-[#B5532F] focus:bg-white"
                  />
                </div>
              </div>

              {/* Optional CTA Background Image */}
              <div className="space-y-3 pt-3 border-t border-[#E5D7C5]/60">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-[#B5532F]" />
                    <span>Banner Background Image (Optional)</span>
                  </label>
                  <div className="flex rounded-lg bg-[#FAF7F2] p-0.5 border border-[#E5D7C5] text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setCtaImageInputMode('upload')}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        ctaImageInputMode === 'upload' ? 'bg-[#B5532F] text-white font-bold shadow-xs' : 'text-[#524336] hover:text-[#2F1F13]'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setCtaImageInputMode('url')}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        ctaImageInputMode === 'url' ? 'bg-[#B5532F] text-white font-bold shadow-xs' : 'text-[#524336] hover:text-[#2F1F13]'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {ctaImageInputMode === 'url' ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={ctaForm.bgImage || ''}
                      onChange={(e) => setCtaForm({ ...ctaForm, bgImage: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:outline-none focus:border-[#B5532F] focus:bg-white"
                    />
                    <p className="text-[10px] font-mono text-[#865430]/70">
                      Paste a direct image link for the bottom CTA background.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label
                      onDragOver={(e) => { e.preventDefault(); setIsCtaDragging(true); }}
                      onDragLeave={() => setIsCtaDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsCtaDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) processCtaFile(file);
                      }}
                      className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer group text-center min-h-[120px] ${
                        isCtaDragging
                          ? 'border-[#B5532F] bg-[#B5532F]/10 scale-[1.01]'
                          : 'border-[#E5D7C5] hover:border-[#B5532F] bg-[#FAF7F2] hover:bg-[#FAF7F2]/80'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleCtaFileUpload}
                        className="sr-only"
                      />
                      <div className="w-10 h-10 rounded-full bg-white border border-[#E5D7C5] group-hover:border-[#B5532F] flex items-center justify-center text-[#B5532F] mb-2 transition-colors shadow-2xs">
                        {isUploadingCta ? (
                          <div className="w-4 h-4 border-2 border-[#B5532F] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload size={20} />
                        )}
                      </div>
                      <span className="text-xs font-mono uppercase font-bold text-[#2F1F13] group-hover:text-[#B5532F] transition-colors">
                        {isUploadingCta ? 'Processing & Optimizing Image...' : 'Click or Drag Image File to Upload'}
                      </span>
                      <span className="text-[11px] text-[#524336]/70 mt-0.5 font-light">
                        Supports JPG, PNG, WebP (auto-optimized for web)
                      </span>
                    </label>

                    {/* Active Uploaded Image Indicator */}
                    {ctaForm.bgImage && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <img
                            src={ctaForm.bgImage}
                            alt="Active CTA Background"
                            className="w-14 h-10 rounded-lg object-cover border border-[#E5D7C5] shrink-0"
                          />
                          <div className="overflow-hidden">
                            <span className="text-xs font-mono text-[#2F1F13] font-bold block truncate">
                              Active Banner Photo
                            </span>
                            <span className="text-[10px] font-mono text-[#865430] block">
                              {ctaForm.bgImage.startsWith('data:') ? 'Local Upload (Compressed)' : 'Web URL'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="px-3 py-1.5 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[11px] font-mono text-[#524336] hover:text-[#2F1F13] cursor-pointer transition-colors shadow-2xs">
                            <span>Change</span>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              onChange={handleCtaFileUpload}
                              className="sr-only"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setCtaForm(prev => ({ ...prev, bgImage: '' }))}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-mono cursor-pointer transition-colors"
                            title="Remove image"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Box */}
            <div className="lg:col-span-5 space-y-2">
              <span className="block text-[11px] font-mono uppercase text-[#865430] tracking-wider font-semibold">
                Live Banner Preview
              </span>
              <div className="relative overflow-hidden p-6 rounded-2xl bg-[#2A1A12] border border-[#3D281D] space-y-4 shadow-md text-white">
                {ctaForm.bgImage && (
                  <img
                    src={ctaForm.bgImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
                  />
                )}
                <div className="relative z-10 space-y-3">
                  <h4 className="font-heading text-lg font-bold">
                    {ctaForm.heading || 'Ready to Start Your Architectural Project?'}
                  </h4>
                  <p className="text-xs text-[#E8D9CC] font-light leading-relaxed">
                    {ctaForm.subtitle || 'Get in touch with our Auroville studio...'}
                  </p>
                  <div>
                    <span className="inline-block px-5 py-2 rounded-full bg-[#B5472B] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow">
                      {ctaForm.buttonText || 'Contact Us Today'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          MODAL: DELETION CONFIRMATION DIALOG (Kept for safe deletion)
          ========================================================================= */}
      <AnimatePresence>
        {deleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-[#E5D7C5] rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                <Trash2 size={24} />
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-[#2F1F13]">
                  Delete {deleteDialog.type === 'step' ? 'Process Step' : 'Design Discipline'}?
                </h3>
                <p className="text-xs text-[#524336] mt-1 leading-relaxed">
                  Are you sure you want to remove <span className="text-[#2F1F13] font-semibold">&ldquo;{deleteDialog.item.title}&rdquo;</span>? This will immediately remove it from the public Architecture page.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteDialog(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E5D7C5] text-[#524336] text-xs font-mono border border-[#E5D7C5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold cursor-pointer shadow-md"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MODAL: RESET FACTORY DEFAULTS CONFIRMATION
          ========================================================================= */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white border border-amber-200 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <RotateCw size={24} />
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-[#2F1F13]">
                  Reset Architecture Data to Defaults?
                </h3>
                <p className="text-xs text-[#524336] mt-1 leading-relaxed">
                  This will restore all default hero titles, 6 architectural process steps, 3 allied design services, and banner copy. Any customized changes will be overwritten.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E5D7C5] text-[#524336] text-xs font-mono border border-[#E5D7C5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white text-xs font-mono font-bold cursor-pointer shadow-md"
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminArchitecture;
