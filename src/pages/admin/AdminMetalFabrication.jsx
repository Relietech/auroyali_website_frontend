import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Wrench,
  Layers,
  Images,
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
  ArrowRight,
  Link as LinkIcon,
  HelpCircle,
  Maximize2,
  Check,
  ChevronUp,
  ChevronDown,
  Save,
  Phone,
  Shield,
  TrendingUp,
  Warehouse,
  DoorOpen,
  Armchair,
  Building2,
  Award,
  Compass,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Hammer
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  getStoredMetalData,
  updateMetalHero,
  updateMetalOverview,
  updateMetalFabricateSection,
  saveFabricateOffering,
  deleteFabricateOffering,
  reorderFabricateOfferings,
  updateMetalProcessSection,
  saveProcessStep,
  deleteProcessStep,
  reorderProcessSteps,
  updateMetalGallerySection,
  saveGalleryProject,
  deleteGalleryProject,
  reorderGalleryProjects,
  updateMetalCTA,
  resetMetalToDefault,
  subscribeToMetal,
  readImageFileAsDataUrl,
  getMetalIcon,
  METAL_ICONS,
  DEFAULT_METAL_DATA
} from '../../services/metalStore';

export function AdminMetalFabrication() {
  const [data, setData] = useState(() => getStoredMetalData());
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState(currentTabParam || 'hero'); // 'hero' | 'overview' | 'fabricate' | 'process' | 'gallery' | 'cta'
  const [toast, setToast] = useState(null);

  // Sync tab with URL
  useEffect(() => {
    if (currentTabParam && ['hero', 'overview', 'fabricate', 'process', 'gallery', 'cta'].includes(currentTabParam)) {
      setActiveTab(currentTabParam);
    }
  }, [currentTabParam]);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Subscribe to changes in metalStore
  useEffect(() => {
    const unsub = subscribeToMetal((updated) => {
      setData(updated);
      setHeroForm(updated.hero || DEFAULT_METAL_DATA.hero);
      setOverviewForm(updated.overview || DEFAULT_METAL_DATA.overview);
      setFabricateSectionForm(updated.fabricateSection || DEFAULT_METAL_DATA.fabricateSection);
      setProcessSectionForm(updated.processSection || DEFAULT_METAL_DATA.processSection);
      setGallerySectionForm(updated.gallerySection || DEFAULT_METAL_DATA.gallerySection);
      setCtaForm(updated.ctaBanner || DEFAULT_METAL_DATA.ctaBanner);
    });
    return () => unsub();
  }, []);

  // =========================================================================
  // TAB 1: HERO STATE
  // =========================================================================
  const [heroForm, setHeroForm] = useState(data.hero || DEFAULT_METAL_DATA.hero);
  const [heroImageInputMode, setHeroImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isHeroDragging, setIsHeroDragging] = useState(false);
  const heroFileInputRef = useRef(null);

  // =========================================================================
  // TAB 2: OVERVIEW STATE
  // =========================================================================
  const [overviewForm, setOverviewForm] = useState(data.overview || DEFAULT_METAL_DATA.overview);
  const [overviewImageInputMode, setOverviewImageInputMode] = useState('upload');
  const [isUploadingOverview, setIsUploadingOverview] = useState(false);
  const [isOverviewDragging, setIsOverviewDragging] = useState(false);
  const overviewFileInputRef = useRef(null);

  // Highlight points state (Max 3 points)
  const [highlightModal, setHighlightModal] = useState({
    open: false,
    mode: 'add', // 'add' | 'edit'
    index: null,
    item: { title: '', desc: '', iconName: 'Sparkles' }
  });

  // =========================================================================
  // TAB 3: WHAT WE FABRICATE STATE
  // =========================================================================
  const [fabricateSectionForm, setFabricateSectionForm] = useState(data.fabricateSection || DEFAULT_METAL_DATA.fabricateSection);
  const [offeringModal, setOfferingModal] = useState({
    open: false,
    mode: 'add', // 'add' | 'edit'
    item: { id: '', title: '', desc: '', image: '', iconName: 'Shield' }
  });
  const [offeringImageMode, setOfferingImageMode] = useState('upload');
  const [isUploadingOfferingImg, setIsUploadingOfferingImg] = useState(false);
  const [isOfferingDragging, setIsOfferingDragging] = useState(false);
  const offeringFileInputRef = useRef(null);

  // =========================================================================
  // TAB 4: FABRICATION PROCESS STATE
  // =========================================================================
  const [processSectionForm, setProcessSectionForm] = useState(data.processSection || DEFAULT_METAL_DATA.processSection);
  const [stepModal, setStepModal] = useState({
    open: false,
    mode: 'add',
    item: { id: '', step: '', title: '', desc: '', iconName: 'Settings', phase: '' }
  });

  // =========================================================================
  // TAB 5: PROJECT GALLERY STATE
  // =========================================================================
  const [gallerySectionForm, setGallerySectionForm] = useState(data.gallerySection || DEFAULT_METAL_DATA.gallerySection);
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [projectModal, setProjectModal] = useState({
    open: false,
    mode: 'add',
    item: {
      id: '',
      title: '',
      category: 'Gates',
      location: '',
      year: '',
      image: '',
      alt: '',
      materials: '',
      desc: '',
      iconName: 'Shield',
      featured: false
    }
  });
  const [projectImageMode, setProjectImageMode] = useState('upload');
  const [isUploadingProjectImg, setIsUploadingProjectImg] = useState(false);
  const [isProjectDragging, setIsProjectDragging] = useState(false);
  const projectFileInputRef = useRef(null);

  // New Category Input
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // =========================================================================
  // TAB 6: BOTTOM CTA STATE
  // =========================================================================
  const [ctaForm, setCtaForm] = useState(data.ctaBanner || DEFAULT_METAL_DATA.ctaBanner);

  // =========================================================================
  // GLOBAL MODALS / DIALOGS
  // =========================================================================
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type, id, title }
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // -------------------------------------------------------------------------
  // HANDLERS: HERO BANNER
  // -------------------------------------------------------------------------
  const handleHeroFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploadingHero(true);
      const dataUrl = await readImageFileAsDataUrl(file, 2000, 0.85);
      setHeroForm((prev) => ({ ...prev, bgImage: dataUrl }));
      showToast('Hero background photo loaded successfully');
    } catch (err) {
      showToast(err.message || 'Failed to process image file', 'error');
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleSaveHero = (e) => {
    e.preventDefault();
    if (!heroForm.title?.trim()) {
      showToast('Hero title cannot be empty', 'error');
      return;
    }
    updateMetalHero(heroForm);
    showToast('Hero banner settings saved');
  };

  // -------------------------------------------------------------------------
  // HANDLERS: OVERVIEW & ETHOS
  // -------------------------------------------------------------------------
  const handleOverviewFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploadingOverview(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1600, 0.85);
      setOverviewForm((prev) => ({ ...prev, image: dataUrl }));
      showToast('Workshop photo loaded successfully');
    } catch (err) {
      showToast(err.message || 'Failed to process image file', 'error');
    } finally {
      setIsUploadingOverview(false);
    }
  };

  const handleSaveOverview = (e) => {
    e.preventDefault();
    if (!overviewForm.heading?.trim()) {
      showToast('Overview heading cannot be empty', 'error');
      return;
    }
    updateMetalOverview(overviewForm);
    showToast('Overview & Ethos saved');
  };

  const handleSaveHighlight = (e) => {
    e.preventDefault();
    if (!highlightModal.item.title?.trim()) {
      showToast('Highlight title is required', 'error');
      return;
    }
    const currentHighlights = overviewForm.highlights || [];
    let updated;

    if (highlightModal.mode === 'edit' && highlightModal.index !== null) {
      updated = currentHighlights.map((hl, idx) => 
        idx === highlightModal.index ? { ...hl, ...highlightModal.item } : hl
      );
    } else {
      if (currentHighlights.length >= 3) {
        showToast('Up to 3 highlight points can only be added', 'error');
        return;
      }
      updated = [...currentHighlights, { ...highlightModal.item, id: `hl-${Date.now()}` }].slice(0, 3);
    }

    const newOverview = { ...overviewForm, highlights: updated };
    setOverviewForm(newOverview);
    updateMetalOverview(newOverview);
    setHighlightModal({ open: false, mode: 'add', index: null, item: { title: '', desc: '', iconName: 'Sparkles' } });
    showToast('Highlight saved');
  };

  const handleDeleteHighlight = (index) => {
    const updated = (overviewForm.highlights || []).filter((_, idx) => idx !== index);
    const newOverview = { ...overviewForm, highlights: updated };
    setOverviewForm(newOverview);
    updateMetalOverview(newOverview);
    showToast('Highlight removed');
  };

  // -------------------------------------------------------------------------
  // HANDLERS: WHAT WE FABRICATE
  // -------------------------------------------------------------------------
  const handleSaveFabricateSection = (e) => {
    e.preventDefault();
    updateMetalFabricateSection(fabricateSectionForm);
    showToast('Fabrication section header saved');
  };

  const handleOfferingFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploadingOfferingImg(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1400, 0.85);
      setOfferingModal((prev) => ({
        ...prev,
        item: { ...prev.item, image: dataUrl }
      }));
      showToast('Card image loaded successfully');
    } catch (err) {
      showToast(err.message || 'Failed to process card image', 'error');
    } finally {
      setIsUploadingOfferingImg(false);
    }
  };

  const handleSaveOffering = (e) => {
    e.preventDefault();
    if (!offeringModal.item.title?.trim()) {
      showToast('Capability title is required', 'error');
      return;
    }
    if (!offeringModal.item.desc?.trim()) {
      showToast('Description is required', 'error');
      return;
    }
    saveFabricateOffering(offeringModal.item);
    setOfferingModal({
      open: false,
      mode: 'add',
      item: { id: '', title: '', desc: '', image: '', iconName: 'Shield' }
    });
    showToast('Capability card saved');
  };

  // -------------------------------------------------------------------------
  // HANDLERS: FABRICATION PROCESS
  // -------------------------------------------------------------------------
  const handleSaveProcessSection = (e) => {
    e.preventDefault();
    updateMetalProcessSection(processSectionForm);
    showToast('Process section header saved');
  };

  const handleSaveStep = (e) => {
    e.preventDefault();
    if (!stepModal.item.title?.trim()) {
      showToast('Step title is required', 'error');
      return;
    }
    saveProcessStep(stepModal.item);
    setStepModal({
      open: false,
      mode: 'add',
      item: { id: '', step: '', title: '', desc: '', iconName: 'Settings', phase: '' }
    });
    showToast('Process step saved');
  };

  // -------------------------------------------------------------------------
  // HANDLERS: PROJECT GALLERY
  // -------------------------------------------------------------------------
  const handleSaveGallerySection = (e) => {
    e.preventDefault();
    updateMetalGallerySection(gallerySectionForm);
    showToast('Gallery section settings saved');
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    const current = gallerySectionForm.categories || [];
    if (current.includes(trimmed)) {
      showToast('Category already exists', 'error');
      return;
    }
    const updatedCategories = [...current, trimmed];
    const updated = { ...gallerySectionForm, categories: updatedCategories };
    setGallerySectionForm(updated);
    updateMetalGallerySection(updated);
    setNewCategoryInput('');
    showToast(`Category "${trimmed}" added`);
  };

  const handleRemoveCategory = (catToRemove) => {
    if (catToRemove === 'All') return;
    const updatedCategories = (gallerySectionForm.categories || []).filter(c => c !== catToRemove);
    const updated = { ...gallerySectionForm, categories: updatedCategories };
    setGallerySectionForm(updated);
    updateMetalGallerySection(updated);
    showToast(`Category "${catToRemove}" removed`);
  };

  const handleProjectFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploadingProjectImg(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1600, 0.85);
      setProjectModal((prev) => ({
        ...prev,
        item: { ...prev.item, image: dataUrl }
      }));
      showToast('Project photo loaded successfully');
    } catch (err) {
      showToast(err.message || 'Failed to process project photo', 'error');
    } finally {
      setIsUploadingProjectImg(false);
    }
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectModal.item.title?.trim()) {
      showToast('Project title is required', 'error');
      return;
    }
    if (!projectModal.item.image?.trim()) {
      showToast('Project image is required', 'error');
      return;
    }
    saveGalleryProject(projectModal.item);
    setProjectModal({
      open: false,
      mode: 'add',
      item: {
        id: '',
        title: '',
        category: 'Gates',
        location: '',
        year: '',
        image: '',
        alt: '',
        materials: '',
        desc: '',
        iconName: 'Shield',
        featured: false
      }
    });
    showToast('Gallery project saved');
  };

  // -------------------------------------------------------------------------
  // HANDLERS: BOTTOM CTA
  // -------------------------------------------------------------------------
  const handleSaveCTA = (e) => {
    e.preventDefault();
    updateMetalCTA(ctaForm);
    showToast('Bottom CTA banner saved');
  };

  // -------------------------------------------------------------------------
  // HANDLERS: CONFIRM DELETE
  // -------------------------------------------------------------------------
  const executeDelete = () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;

    if (type === 'offering') {
      deleteFabricateOffering(id);
      showToast('Fabrication capability removed');
    } else if (type === 'step') {
      deleteProcessStep(id);
      showToast('Process step removed');
    } else if (type === 'project') {
      deleteGalleryProject(id);
      showToast('Gallery project removed');
    }

    setDeleteConfirm(null);
  };

  // -------------------------------------------------------------------------
  // RESET FACTORY DEFAULTS
  // -------------------------------------------------------------------------
  const handleResetDefaults = () => {
    resetMetalToDefault();
    showToast('Reset all Metal Fabrication content to factory defaults');
    setResetConfirmOpen(false);
  };

  // Metrics
  const offeringsCount = (data.fabricateOfferings || []).length;
  const stepsCount = (data.processSteps || []).length;
  const projectsCount = (data.galleryProjects || []).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body">

      {/* ===================================================================
          1. PAGE HEADER & QUICK ACTIONS
          =================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Flame size={12} className="text-[#E8782A]" />
              <span>Studio Master Console</span>
            </span>
            <span className="text-xs font-mono text-[#8C939A]">/</span>
            <span className="text-xs font-mono text-[#7A4E38]">Metal Fabrication</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#2F1F13] tracking-tight">
            Metal Fabrication Studio
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#6B5E55] mt-0.5">
            Manage public architectural steelwork content, capability offerings, 6-stage timeline, and portfolio gallery.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Public Preview Link */}
          <Link
            to="/services/metal-fabrication"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#B5532F]/50 text-[#2F1F13] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs hover:shadow-sm"
          >
            <ExternalLink size={13} className="text-[#B5532F]" />
            <span>View Live Page</span>
          </Link>

          {/* Reset to Factory Defaults */}
          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-200 hover:border-rose-400 text-rose-700 hover:bg-rose-50 text-xs font-mono uppercase tracking-wider transition-all"
            title="Reset to default seed data"
          >
            <RotateCw size={13} />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* ===================================================================
          2. METRIC SUMMARY TILES
          =================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E5D7C5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A4E38] block">Capabilities</span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#2F1F13]">{offeringsCount} Disciplines</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center text-[#B5532F]">
            <Layers size={18} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5D7C5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A4E38] block">Process Pipeline</span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#2F1F13]">{stepsCount} Stages</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center text-[#E8782A]">
            <Wrench size={18} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5D7C5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A4E38] block">Project Gallery</span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-[#2F1F13]">{projectsCount} Projects</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center text-[#B5532F]">
            <Images size={18} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5D7C5] shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A4E38] block">Live Status</span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-emerald-700">Published</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* ===================================================================
          3. NAVIGATION TABS
          =================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border-b border-[#E5D7C5] pb-2">
        {[
          { key: 'hero', label: '1. Hero Banner', icon: Flame },
          { key: 'overview', label: '2. Overview & Ethos', icon: Sparkles },
          { key: 'fabricate', label: '3. What We Fabricate', icon: Layers },
          { key: 'process', label: '4. 6-Stage Process', icon: Wrench },
          { key: 'gallery', label: '5. Project Gallery', icon: Images },
          { key: 'cta', label: '6. Bottom CTA Band', icon: Phone }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#B5532F] text-white shadow-sm'
                  : 'bg-white text-[#6B5E55] hover:text-[#2F1F13] border border-[#E5D7C5] hover:border-[#B5532F]/40'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ===================================================================
          TAB 1: HERO BANNER
          =================================================================== */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2F1F13]">Hero Banner Configuration</h2>
              <p className="text-xs text-[#6B5E55] mt-0.5">Edit title, eyebrow badge, taglines, CTA links, and parallax workshop background.</p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
            >
              <Save size={13} />
              <span>Save Hero</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Main H1 Heading *
              </label>
              <input
                type="text"
                value={heroForm.title || ''}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white focus:ring-1 focus:ring-[#B5532F] rounded-xl px-3.5 py-2.5 text-sm text-[#2F1F13] transition-all outline-none"
                placeholder="Metal Fabrication"
                required
              />
            </div>

            {/* Eyebrow */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={heroForm.eyebrow || ''}
                onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white focus:ring-1 focus:ring-[#B5532F] rounded-xl px-3.5 py-2.5 text-sm text-[#2F1F13] transition-all outline-none"
                placeholder="PRECISION ARCHITECTURAL STEELWORK"
              />
            </div>

            {/* Subtitle */}
            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={heroForm.subtitle || ''}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white focus:ring-1 focus:ring-[#B5532F] rounded-xl px-3.5 py-2.5 text-sm text-[#2F1F13] transition-all outline-none"
                placeholder="Strong structures, crafted in steel."
              />
            </div>

            {/* Primary CTA */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Primary Button Text & Link
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={heroForm.ctaPrimaryText || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryText: e.target.value })}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Request a Quote"
                />
                <input
                  type="text"
                  value={heroForm.ctaPrimaryLink || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryLink: e.target.value })}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="/contact"
                />
              </div>
            </div>

            {/* Secondary CTA */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Secondary Button Text & Link
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={heroForm.ctaSecondaryText || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value })}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Explore Capabilities"
                />
                <input
                  type="text"
                  value={heroForm.ctaSecondaryLink || ''}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryLink: e.target.value })}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="#what-we-fabricate"
                />
              </div>
            </div>
          </div>

          {/* Hero Background Image with Upload & Delete Option */}
          <div className="border-t border-[#E5D7C5] pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold">
                  Hero Background Image
                </label>
                <p className="text-[11px] text-[#6B5E55]">Upload an image from your device or specify a high-res image URL.</p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5D7C5]">
                <button
                  type="button"
                  onClick={() => setHeroImageInputMode('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    heroImageInputMode === 'upload' ? 'bg-[#B5532F] text-white font-bold shadow-2xs' : 'text-[#6B5E55] hover:text-[#2F1F13]'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setHeroImageInputMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    heroImageInputMode === 'url' ? 'bg-[#B5532F] text-white font-bold shadow-2xs' : 'text-[#6B5E55] hover:text-[#2F1F13]'
                  }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {heroImageInputMode === 'upload' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsHeroDragging(true); }}
                onDragLeave={() => setIsHeroDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsHeroDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleHeroFileUpload(file);
                }}
                onClick={() => heroFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isHeroDragging
                    ? 'border-[#B5532F] bg-[#B5532F]/5'
                    : 'border-[#E5D7C5] bg-[#FAF7F2] hover:bg-white hover:border-[#B5532F]/50'
                }`}
              >
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleHeroFileUpload(e.target.files?.[0])}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white border border-[#E5D7C5] text-[#B5532F] mx-auto flex items-center justify-center mb-2 shadow-2xs">
                  {isUploadingHero ? <RotateCw size={20} className="animate-spin" /> : <Upload size={20} />}
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#2F1F13] font-bold">
                  {isUploadingHero ? 'Compressing & Processing Photo...' : 'Click or Drag & Drop Workshop Photo'}
                </p>
                <p className="text-[11px] text-[#6B5E55] mt-1 font-light">
                  Supports JPG, PNG, WebP (auto-optimized via Canvas to maintain fast loading).
                </p>
              </div>
            ) : (
              <input
                type="url"
                value={heroForm.bgImage || ''}
                onChange={(e) => setHeroForm({ ...heroForm, bgImage: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#2F1F13] outline-none"
                placeholder="https://images.unsplash.com/photo-..."
              />
            )}

            {/* Active Image Preview Card with Delete Option */}
            {heroForm.bgImage && (
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-12 rounded-xl overflow-hidden border border-[#E5D7C5] shrink-0 bg-black">
                    <img src={heroForm.bgImage} alt="Hero Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-mono text-[#2F1F13] font-bold block truncate">Hero Background Image Active</span>
                    <span className="text-[10px] text-[#6B5E55] font-mono block">Image is ready for display</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(heroForm.bgImage)}
                    className="p-1.5 rounded-lg bg-white border border-[#E5D7C5] text-[#2F1F13] hover:text-[#B5532F] transition-colors"
                    title="Preview Image"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroForm({ ...heroForm, bgImage: '' })}
                    className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-[#E5D7C5]">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
            >
              <Save size={14} />
              <span>Save Hero Banner</span>
            </button>
          </div>
        </form>
      )}

      {/* ===================================================================
          TAB 2: OVERVIEW & ETHOS
          =================================================================== */}
      {activeTab === 'overview' && (
        <form onSubmit={handleSaveOverview} className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2F1F13]">Overview & Ethos Configuration</h2>
              <p className="text-xs text-[#6B5E55] mt-0.5">Editorial narrative, studio workshop photograph, and up to 3 core highlight points.</p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
            >
              <Save size={13} />
              <span>Save Overview</span>
            </button>
          </div>

          {/* Heading */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
              Section Heading *
            </label>
            <input
              type="text"
              value={overviewForm.heading || ''}
              onChange={(e) => setOverviewForm({ ...overviewForm, heading: e.target.value })}
              className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white focus:ring-1 focus:ring-[#B5532F] rounded-xl px-3.5 py-2.5 text-sm text-[#2F1F13] transition-all outline-none"
              placeholder="Architectural Metal Craft Rooted in Earth Construction"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
              Narrative Description *
            </label>
            <textarea
              rows={4}
              value={overviewForm.description || ''}
              onChange={(e) => setOverviewForm({ ...overviewForm, description: e.target.value })}
              className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white focus:ring-1 focus:ring-[#B5532F] rounded-xl px-3.5 py-2.5 text-sm text-[#2F1F13] transition-all outline-none leading-relaxed"
              placeholder="At AuroYali, our specialized in-house metal fabrication division bridges traditional craftsmanship..."
              required
            />
          </div>

          {/* Workshop Photograph Upload & Delete Option */}
          <div className="border-t border-[#E5D7C5] pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold">
                  Workshop Studio Photograph
                </label>
                <p className="text-[11px] text-[#6B5E55]">Right column showcase image demonstrating metal craftsmen in action.</p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5D7C5]">
                <button
                  type="button"
                  onClick={() => setOverviewImageInputMode('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    overviewImageInputMode === 'upload' ? 'bg-[#B5532F] text-white font-bold shadow-2xs' : 'text-[#6B5E55] hover:text-[#2F1F13]'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setOverviewImageInputMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    overviewImageInputMode === 'url' ? 'bg-[#B5532F] text-white font-bold shadow-2xs' : 'text-[#6B5E55] hover:text-[#2F1F13]'
                  }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {overviewImageInputMode === 'upload' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsOverviewDragging(true); }}
                onDragLeave={() => setIsOverviewDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsOverviewDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleOverviewFileUpload(file);
                }}
                onClick={() => overviewFileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isOverviewDragging
                    ? 'border-[#B5532F] bg-[#B5532F]/5'
                    : 'border-[#E5D7C5] bg-[#FAF7F2] hover:bg-white hover:border-[#B5532F]/50'
                }`}
              >
                <input
                  ref={overviewFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleOverviewFileUpload(e.target.files?.[0])}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white border border-[#E5D7C5] text-[#B5532F] mx-auto flex items-center justify-center mb-2 shadow-2xs">
                  {isUploadingOverview ? <RotateCw size={20} className="animate-spin" /> : <Upload size={20} />}
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#2F1F13] font-bold">
                  {isUploadingOverview ? 'Compressing & Processing Photo...' : 'Click or Drag & Drop Workshop Image'}
                </p>
                <p className="text-[11px] text-[#6B5E55] mt-1 font-light">
                  Max 1600px width, saved cleanly in browser database.
                </p>
              </div>
            ) : (
              <input
                type="url"
                value={overviewForm.image || ''}
                onChange={(e) => setOverviewForm({ ...overviewForm, image: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#2F1F13] outline-none"
                placeholder="https://images.unsplash.com/photo-..."
              />
            )}

            {/* Active Image Preview Card with Delete Option */}
            {overviewForm.image && (
              <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-12 rounded-xl overflow-hidden border border-[#E5D7C5] shrink-0 bg-black">
                    <img src={overviewForm.image} alt="Overview Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-mono text-[#2F1F13] font-bold block truncate">Workshop Photo Active</span>
                    <span className="text-[10px] text-[#6B5E55] font-mono block">Image is ready for display</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewImage(overviewForm.image)}
                    className="p-1.5 rounded-lg bg-white border border-[#E5D7C5] text-[#2F1F13] hover:text-[#B5532F] transition-colors"
                    title="Preview Image"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverviewForm({ ...overviewForm, image: '' })}
                    className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Feature Highlights (Up to 3 Points Only) */}
          <div className="border-t border-[#E5D7C5] pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold">
                    Feature Highlights
                  </label>
                  <span className="text-[10px] font-mono text-[#B5532F] font-bold bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E5D7C5]">
                    {(overviewForm.highlights || []).length} / 3 Max
                  </span>
                </div>
                <p className="text-[11px] text-[#6B5E55]">Up to 3 points can only be added to maintain clean editorial layout balance.</p>
              </div>

              {(overviewForm.highlights || []).length < 3 && (
                <button
                  type="button"
                  onClick={() => setHighlightModal({
                    open: true,
                    mode: 'add',
                    index: null,
                    item: { title: '', desc: '', iconName: 'Sparkles' }
                  })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#B5532F] text-[#B5532F] hover:bg-[#B5532F] hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Highlight</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(overviewForm.highlights || []).map((hl, idx) => {
                const IconComp = getMetalIcon(hl.iconName);
                return (
                  <div key={hl.id || idx} className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-start justify-between gap-3 group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#E5D7C5] text-[#B5532F] flex items-center justify-center shrink-0 mt-0.5">
                        <IconComp size={16} />
                      </div>
                      <div>
                        <h4 className="font-heading text-sm font-bold text-[#2F1F13]">{hl.title}</h4>
                        <p className="text-xs text-[#6B5E55] mt-0.5 leading-relaxed font-light">{hl.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setHighlightModal({
                          open: true,
                          mode: 'edit',
                          index: idx,
                          item: { ...hl }
                        })}
                        className="p-1 rounded-lg hover:bg-white text-[#2F1F13] hover:text-[#B5532F] transition-colors"
                        title="Edit highlight"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteHighlight(idx)}
                        className="p-1 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                        title="Remove highlight"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#E5D7C5]">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
            >
              <Save size={14} />
              <span>Save Overview & Ethos</span>
            </button>
          </div>
        </form>
      )}

      {/* ===================================================================
          TAB 3: WHAT WE FABRICATE
          =================================================================== */}
      {activeTab === 'fabricate' && (
        <div className="space-y-6">
          {/* Section Header Editor */}
          <form onSubmit={handleSaveFabricateSection} className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">Fabrication Capabilities Header</h3>
                <p className="text-xs text-[#6B5E55]">Configure eyebrow tag, section title, and intro paragraph.</p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save size={12} />
                <span>Save Header</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={fabricateSectionForm.eyebrow || ''}
                  onChange={(e) => setFabricateSectionForm({ ...fabricateSectionForm, eyebrow: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="FABRICATION CAPABILITIES"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={fabricateSectionForm.heading || ''}
                  onChange={(e) => setFabricateSectionForm({ ...fabricateSectionForm, heading: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="What We Fabricate"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={fabricateSectionForm.subtitle || ''}
                  onChange={(e) => setFabricateSectionForm({ ...fabricateSectionForm, subtitle: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="From heavy structural roof frames to intricate laser-cut Corten privacy screens..."
                />
              </div>
            </div>
          </form>

          {/* Capabilities Cards Grid */}
          <div className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#2F1F13]">Capability Offerings ({offeringsCount})</h3>
                <p className="text-xs text-[#6B5E55]">Displayed in 3x2 responsive grid on desktop and swipeable carousel on mobile.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setOfferingModal({
                    open: true,
                    mode: 'add',
                    item: { id: '', title: '', desc: '', image: '', iconName: 'Shield' }
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Capability</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(data.fabricateOfferings || []).map((item, index) => {
                const IconComponent = getMetalIcon(item.iconName);

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] overflow-hidden flex flex-col group hover:shadow-md hover:border-[#B5532F]/50 transition-all duration-300"
                  >
                    {/* Image Header with Badge */}
                    <div className="relative aspect-[16/10] bg-black overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm text-[#B5532F] flex items-center justify-center shadow-xs">
                        <IconComponent size={16} />
                      </div>
                      <span className="absolute top-3 right-3 text-[10px] font-mono text-white bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                      <div>
                        <h4 className="font-heading text-base font-bold text-[#2F1F13]">{item.title}</h4>
                        <div className="w-8 h-0.5 bg-[#B5532F] my-1.5 rounded-full" />
                        <p className="text-xs text-[#6B5E55] leading-relaxed line-clamp-2 font-light">{item.desc}</p>
                      </div>

                      {/* Card Actions */}
                      <div className="pt-2 border-t border-[#E5D7C5]/60 flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A4E38]">
                          Icon: {item.iconName || 'Shield'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setOfferingModal({
                                open: true,
                                mode: 'edit',
                                item: { ...item }
                              });
                            }}
                            className="p-1.5 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] transition-all cursor-pointer"
                            title="Edit capability"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm({ type: 'offering', id: item.id, title: item.title })}
                            className="p-1.5 rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete capability"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 4: FABRICATION PROCESS (6-Stage Pipeline)
          =================================================================== */}
      {activeTab === 'process' && (
        <div className="space-y-6">
          {/* Section Header Editor */}
          <form onSubmit={handleSaveProcessSection} className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">Process Pipeline Header</h3>
                <p className="text-xs text-[#6B5E55]">Configure eyebrow tag, section title, and description for the connected timeline.</p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save size={12} />
                <span>Save Header</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={processSectionForm.eyebrow || ''}
                  onChange={(e) => setProcessSectionForm({ ...processSectionForm, eyebrow: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="CONNECTED 6-STAGE PIPELINE"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={processSectionForm.heading || ''}
                  onChange={(e) => setProcessSectionForm({ ...processSectionForm, heading: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Our Fabrication Process"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={processSectionForm.subtitle || ''}
                  onChange={(e) => setProcessSectionForm({ ...processSectionForm, subtitle: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="From concept sketches and structural calculations to precision CNC cutting..."
                />
              </div>
            </div>
          </form>

          {/* Process Stages List */}
          <div className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#2F1F13]">Pipeline Stages ({stepsCount})</h3>
                <p className="text-xs text-[#6B5E55]">Ordered consecutively from Step 01 through on-site erection.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextNum = (stepsCount + 1).toString().padStart(2, '0');
                  setStepModal({
                    open: true,
                    mode: 'add',
                    item: {
                      id: '',
                      step: nextNum,
                      title: '',
                      desc: '',
                      iconName: 'Settings',
                      phase: `Phase ${stepsCount + 1} of 6`
                    }
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Process Stage</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(data.processSteps || []).map((step, index) => {
                const IconComp = getMetalIcon(step.iconName);

                return (
                  <div
                    key={step.id || step.step}
                    className="p-5 rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] flex flex-col justify-between group hover:shadow-md hover:border-[#E8782A] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-2xl font-black text-[#E8782A]">{step.step}</span>
                          <span className="text-[10px] font-mono text-[#B5532F] font-semibold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-[#E5D7C5]">
                            {step.phase}
                          </span>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-white border border-[#E5D7C5] text-[#B5532F] flex items-center justify-center">
                          <IconComp size={15} />
                        </div>
                      </div>

                      <h4 className="font-heading text-base font-bold text-[#2F1F13] mb-1">{step.title}</h4>
                      <p className="text-xs text-[#6B5E55] leading-relaxed font-light">{step.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E5D7C5] flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setStepModal({
                            open: true,
                            mode: 'edit',
                            item: { ...step }
                          });
                        }}
                        className="p-1.5 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] transition-all cursor-pointer"
                        title="Edit step"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm({ type: 'step', id: step.id, title: step.title })}
                        className="p-1.5 rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Delete step"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 5: PROJECT GALLERY
          =================================================================== */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Gallery Section Header & Categories Editor */}
          <form onSubmit={handleSaveGallerySection} className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
              <div>
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">Gallery Header & Filter Categories</h3>
                <p className="text-xs text-[#6B5E55]">Manage portfolio header texts and the category filter pills.</p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
              >
                <Save size={12} />
                <span>Save Settings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={gallerySectionForm.eyebrow || ''}
                  onChange={(e) => setGallerySectionForm({ ...gallerySectionForm, eyebrow: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="PORTFOLIO SHOWCASE"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={gallerySectionForm.heading || ''}
                  onChange={(e) => setGallerySectionForm({ ...gallerySectionForm, heading: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Project Gallery"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={gallerySectionForm.subtitle || ''}
                  onChange={(e) => setGallerySectionForm({ ...gallerySectionForm, subtitle: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Explore bespoke architectural steel and ironcraft installations crafted in Auroville."
                />
              </div>
            </div>

            {/* Category Pills Editor */}
            <div className="border-t border-[#E5D7C5] pt-4 space-y-3">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold">
                Filter Category Pills
              </label>

              <div className="flex flex-wrap items-center gap-2">
                {(gallerySectionForm.categories || []).map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono text-[#2F1F13]"
                  >
                    <span>{cat}</span>
                    {cat !== 'All' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove category"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Add Category Input */}
              <div className="flex items-center gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                  placeholder="New category (e.g. Balconies)..."
                  className="flex-1 bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-1.5 text-xs text-[#2F1F13] outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-xs font-mono uppercase tracking-wider font-bold text-[#2F1F13] cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </form>

          {/* Projects Portfolio Grid */}
          <div className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5] pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-[#2F1F13]">Showcase Projects ({projectsCount})</h3>
                <p className="text-xs text-[#6B5E55]">All projects are visible in the filterable public bento grid and lightbox modal.</p>
              </div>

              <div className="flex items-center gap-2">
                {/* Category Filter */}
                <select
                  value={galleryFilter}
                  onChange={(e) => setGalleryFilter(e.target.value)}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] rounded-xl px-3 py-2 text-xs font-mono text-[#2F1F13] outline-none"
                >
                  <option value="All">All Categories ({projectsCount})</option>
                  {(gallerySectionForm.categories || []).filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <Link
                  to="/admin/metal-fabrication/projects/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Project</span>
                </Link>
              </div>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(data.galleryProjects || [])
                .filter(p => galleryFilter === 'All' || p.category === galleryFilter)
                .map((project) => (
                  <div
                    key={project.id}
                    className="rounded-2xl border border-[#E5D7C5] bg-[#FAF7F2] overflow-hidden flex flex-col group hover:shadow-md hover:border-[#B5532F]/50 transition-all duration-300"
                  >
                    {/* Project Image */}
                    <div className="relative aspect-[16/10] bg-black overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#E8782A] text-[10px] font-mono uppercase tracking-wider font-bold border border-white/20">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="px-2 py-0.5 rounded-full bg-[#B5532F] text-white text-[10px] font-mono uppercase tracking-wider font-bold shadow-xs">
                            Bento Span
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
                        {project.location} • {project.year}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                      <div>
                        <h4 className="font-heading text-sm sm:text-base font-bold text-[#2F1F13] line-clamp-1">
                          {project.title}
                        </h4>
                        {project.materials && (
                          <p className="text-[11px] text-[#7A4E38] font-mono truncate mt-0.5">
                            {project.materials}
                          </p>
                        )}
                        <p className="text-xs text-[#6B5E55] line-clamp-2 mt-1 leading-relaxed font-light">
                          {project.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E5D7C5]/60 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setPreviewImage(project.image)}
                          className="text-[11px] font-mono text-[#B5532F] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>Preview Image</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <Link
                            to={`/admin/metal-fabrication/projects/edit/${project.id}`}
                            className="p-1.5 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Edit project"
                          >
                            <Edit2 size={13} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm({ type: 'project', id: project.id, title: project.title })}
                            className="p-1.5 rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 6: BOTTOM CTA BANNER
          =================================================================== */}
      {activeTab === 'cta' && (
        <form onSubmit={handleSaveCTA} className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2F1F13]">Bottom Conversion CTA Band</h2>
              <p className="text-xs text-[#6B5E55]">Configure the full-width terracotta/spark banner and mobile quick call links.</p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
            >
              <Save size={13} />
              <span>Save CTA</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Eyebrow Badge
              </label>
              <input
                type="text"
                value={ctaForm.eyebrow || ''}
                onChange={(e) => setCtaForm({ ...ctaForm, eyebrow: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#2F1F13] outline-none"
                placeholder="START YOUR PROJECT"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Main Banner Heading *
              </label>
              <input
                type="text"
                value={ctaForm.heading || ''}
                onChange={(e) => setCtaForm({ ...ctaForm, heading: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#2F1F13] outline-none"
                placeholder="Have a metal work idea? Let's build it."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Description Text
              </label>
              <textarea
                rows={3}
                value={ctaForm.description || ''}
                onChange={(e) => setCtaForm({ ...ctaForm, description: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#2F1F13] outline-none"
                placeholder="From precision laser-cut Corten façades to custom helical staircases..."
              />
            </div>

            {/* Primary Button */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Primary Button Text & Link
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={ctaForm.buttonText || ''}
                  onChange={(e) => setCtaForm({ ...ctaForm, buttonText: e.target.value })}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Get a Free Estimate"
                />
                <input
                  type="text"
                  value={ctaForm.buttonLink || ''}
                  onChange={(e) => setCtaForm({ ...ctaForm, buttonLink: e.target.value })}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="/contact"
                />
              </div>
            </div>

            {/* Call Button */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1.5">
                Phone Call Button Text & Link
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={ctaForm.phoneText || ''}
                  onChange={(e) => setCtaForm({ ...ctaForm, phoneText: e.target.value })}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Call Us (+91 89400 00126)"
                />
                <input
                  type="text"
                  value={ctaForm.phoneLink || ''}
                  onChange={(e) => setCtaForm({ ...ctaForm, phoneLink: e.target.value })}
                  className="bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="tel:+918940000126"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#E5D7C5]">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer"
            >
              <Save size={14} />
              <span>Save CTA Banner</span>
            </button>
          </div>
        </form>
      )}

      {/* ===================================================================
          MODAL: HIGHLIGHT POINT (Max 3 points enforcement)
          =================================================================== */}
      <AnimatePresence>
        {highlightModal.open && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl border border-[#E5D7C5] shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">
                  {highlightModal.mode === 'edit' ? 'Edit Highlight Point' : 'Add Highlight Point'}
                </h3>
                <button
                  type="button"
                  onClick={() => setHighlightModal({ ...highlightModal, open: false })}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#2F1F13]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveHighlight} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Highlight Title *
                  </label>
                  <input
                    type="text"
                    value={highlightModal.item.title}
                    onChange={(e) => setHighlightModal({
                      ...highlightModal,
                      item: { ...highlightModal.item, title: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Custom Made to Specification"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={2}
                    value={highlightModal.item.desc}
                    onChange={(e) => setHighlightModal({
                      ...highlightModal,
                      item: { ...highlightModal.item, desc: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Tailored strictly to architectural CAD blueprints..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Icon Selector
                  </label>
                  <select
                    value={highlightModal.item.iconName || 'Sparkles'}
                    onChange={(e) => setHighlightModal({
                      ...highlightModal,
                      item: { ...highlightModal.item, iconName: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  >
                    {Object.keys(METAL_ICONS).map((iconKey) => (
                      <option key={iconKey} value={iconKey}>{iconKey}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5D7C5]">
                  <button
                    type="button"
                    onClick={() => setHighlightModal({ ...highlightModal, open: false })}
                    className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono text-[#6B5E55] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white text-xs font-mono uppercase tracking-wider font-bold"
                  >
                    Save Highlight
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          MODAL: CAPABILITY (What We Fabricate Card)
          =================================================================== */}
      <AnimatePresence>
        {offeringModal.open && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl border border-[#E5D7C5] shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">
                  {offeringModal.mode === 'edit' ? 'Edit Fabrication Capability' : 'Add Fabrication Capability'}
                </h3>
                <button
                  type="button"
                  onClick={() => setOfferingModal({ ...offeringModal, open: false })}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#2F1F13]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveOffering} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Discipline / Capability Title *
                  </label>
                  <input
                    type="text"
                    value={offeringModal.item.title}
                    onChange={(e) => setOfferingModal({
                      ...offeringModal,
                      item: { ...offeringModal.item, title: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Gates & Grills"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={offeringModal.item.desc}
                    onChange={(e) => setOfferingModal({
                      ...offeringModal,
                      item: { ...offeringModal.item, desc: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Motorized sliding gates, monumental compound pivots..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Card Icon
                  </label>
                  <select
                    value={offeringModal.item.iconName || 'Shield'}
                    onChange={(e) => setOfferingModal({
                      ...offeringModal,
                      item: { ...offeringModal.item, iconName: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  >
                    {Object.keys(METAL_ICONS).map((iconKey) => (
                      <option key={iconKey} value={iconKey}>{iconKey}</option>
                    ))}
                  </select>
                </div>

                {/* Image Upload + Delete */}
                <div className="space-y-2 pt-1 border-t border-[#E5D7C5]">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold">
                      Showcase Card Photograph *
                    </label>
                    <div className="flex items-center gap-1 bg-[#FAF7F2] p-0.5 rounded-lg border border-[#E5D7C5]">
                      <button
                        type="button"
                        onClick={() => setOfferingImageMode('upload')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          offeringImageMode === 'upload' ? 'bg-[#B5532F] text-white font-bold' : 'text-[#6B5E55]'
                        }`}
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setOfferingImageMode('url')}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          offeringImageMode === 'url' ? 'bg-[#B5532F] text-white font-bold' : 'text-[#6B5E55]'
                        }`}
                      >
                        URL
                      </button>
                    </div>
                  </div>

                  {offeringImageMode === 'upload' ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsOfferingDragging(true); }}
                      onDragLeave={() => setIsOfferingDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsOfferingDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleOfferingFileUpload(file);
                      }}
                      onClick={() => offeringFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        isOfferingDragging ? 'border-[#B5532F] bg-[#B5532F]/5' : 'border-[#E5D7C5] bg-[#FAF7F2] hover:bg-white'
                      }`}
                    >
                      <input
                        ref={offeringFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleOfferingFileUpload(e.target.files?.[0])}
                        className="hidden"
                      />
                      <div className="w-10 h-10 rounded-full bg-white border border-[#E5D7C5] text-[#B5532F] mx-auto flex items-center justify-center mb-1">
                        {isUploadingOfferingImg ? <RotateCw size={16} className="animate-spin" /> : <Upload size={16} />}
                      </div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-[#2F1F13] font-bold">
                        {isUploadingOfferingImg ? 'Processing...' : 'Click or Drag & Drop Card Image'}
                      </p>
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={offeringModal.item.image || ''}
                      onChange={(e) => setOfferingModal({
                        ...offeringModal,
                        item: { ...offeringModal.item, image: e.target.value }
                      })}
                      className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  )}

                  {offeringModal.item.image && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img src={offeringModal.item.image} alt="Preview" className="w-12 h-9 object-cover rounded-lg border border-[#E5D7C5]" />
                        <span className="text-[11px] font-mono text-[#2F1F13]">Image loaded</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOfferingModal({
                          ...offeringModal,
                          item: { ...offeringModal.item, image: '' }
                        })}
                        className="p-1 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                        title="Delete image"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5D7C5]">
                  <button
                    type="button"
                    onClick={() => setOfferingModal({ ...offeringModal, open: false })}
                    className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono text-[#6B5E55] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white text-xs font-mono uppercase tracking-wider font-bold"
                  >
                    Save Capability
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          MODAL: PROCESS STEP
          =================================================================== */}
      <AnimatePresence>
        {stepModal.open && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl border border-[#E5D7C5] shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">
                  {stepModal.mode === 'edit' ? 'Edit Process Step' : 'Add Process Step'}
                </h3>
                <button
                  type="button"
                  onClick={() => setStepModal({ ...stepModal, open: false })}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#2F1F13]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveStep} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                      Step Number *
                    </label>
                    <input
                      type="text"
                      value={stepModal.item.step}
                      onChange={(e) => setStepModal({
                        ...stepModal,
                        item: { ...stepModal.item, step: e.target.value }
                      })}
                      className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none font-mono"
                      placeholder="01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                      Phase Tag
                    </label>
                    <input
                      type="text"
                      value={stepModal.item.phase}
                      onChange={(e) => setStepModal({
                        ...stepModal,
                        item: { ...stepModal.item, phase: e.target.value }
                      })}
                      className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none font-mono"
                      placeholder="Phase 1 of 6"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Step Title *
                  </label>
                  <input
                    type="text"
                    value={stepModal.item.title}
                    onChange={(e) => setStepModal({
                      ...stepModal,
                      item: { ...stepModal.item, title: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Consultation & Site Review"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    value={stepModal.item.desc}
                    onChange={(e) => setStepModal({
                      ...stepModal,
                      item: { ...stepModal.item, desc: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none leading-relaxed"
                    placeholder="We inspect architectural drawings, site conditions, load requirements..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Icon Selector
                  </label>
                  <select
                    value={stepModal.item.iconName || 'Settings'}
                    onChange={(e) => setStepModal({
                      ...stepModal,
                      item: { ...stepModal.item, iconName: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                  >
                    {Object.keys(METAL_ICONS).map((iconKey) => (
                      <option key={iconKey} value={iconKey}>{iconKey}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5D7C5]">
                  <button
                    type="button"
                    onClick={() => setStepModal({ ...stepModal, open: false })}
                    className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono text-[#6B5E55] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white text-xs font-mono uppercase tracking-wider font-bold"
                  >
                    Save Step
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          MODAL: LIGHTBOX IMAGE PREVIEW
          =================================================================== */}
      <AnimatePresence>
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-4xl max-h-[85vh] bg-black rounded-2xl overflow-hidden border border-white/20">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
              <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain" />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          MODAL: DELETION CONFIRMATION
          =================================================================== */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl border border-[#E5D7C5] shadow-2xl p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">Confirm Removal</h3>
                <p className="text-xs text-[#6B5E55] mt-1">
                  Are you sure you want to remove <strong>"{deleteConfirm.title}"</strong>? This change will be saved immediately.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono text-[#6B5E55] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono uppercase tracking-wider font-bold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          MODAL: RESET CONFIRMATION
          =================================================================== */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl border border-[#E5D7C5] shadow-2xl p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center">
                <RotateCw size={22} />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">Reset to Factory Defaults?</h3>
                <p className="text-xs text-[#6B5E55] mt-1">
                  This will restore the original metal fabrication texts, 6 capabilities, 6 process stages, and 8 portfolio projects.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono text-[#6B5E55] hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono uppercase tracking-wider font-bold"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          TOAST FEEDBACK
          =================================================================== */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 text-xs font-mono ${
              toast.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-[#2F1F13] text-white border-[#B5532F]'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={15} /> : <Check size={15} className="text-[#E8782A]" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AdminMetalFabrication;
