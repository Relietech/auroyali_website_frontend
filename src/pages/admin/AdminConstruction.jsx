import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Upload,
  RotateCw,
  X,
  FileText,
  CheckSquare,
  BarChart3,
  Eye,
  ArrowRight,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import {
  getStoredConstructionData,
  persistConstructionData,
  subscribeToConstruction,
  resetConstructionToDefault,
  readImageFileAsDataUrl,
  DEFAULT_CONSTRUCTION_DATA
} from '../../services/constructionStore';

const TABS = [
  { id: 'hero', label: 'Hero Banner', icon: ImageIcon, badge: 'Header' },
  { id: 'methodology', label: 'Methodology & CTA', icon: FileText, badge: 'Narrative' },
  { id: 'capabilities', label: 'Technical Capabilities', icon: CheckSquare, badge: 'Features' },
  { id: 'deliverables', label: 'Client Deliverables', icon: Layers, badge: 'Deliverables' },
  { id: 'sidebar', label: 'Sidebar & Track Record', icon: BarChart3, badge: 'Metrics' }
];

export function AdminConstruction() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    TABS.some(t => t.id === currentTabParam) ? currentTabParam : 'hero'
  );

  const [data, setData] = useState(() => getStoredConstructionData());
  const [toast, setToast] = useState(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Sync tab with URL
  useEffect(() => {
    if (currentTabParam && TABS.some(t => t.id === currentTabParam)) {
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

  // Subscribe to changes in constructionStore
  useEffect(() => {
    const unsub = subscribeToConstruction((updated) => {
      setData(updated);
    });
    return () => unsub();
  }, []);

  // -------------------------------------------------------------------------
  // TAB 1: HERO STATE
  // -------------------------------------------------------------------------
  const [heroForm, setHeroForm] = useState(data.hero || DEFAULT_CONSTRUCTION_DATA.hero);
  const [heroImageMode, setHeroImageMode] = useState('upload'); // 'upload' | 'url'
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isHeroDragging, setIsHeroDragging] = useState(false);
  const heroFileInputRef = useRef(null);

  // -------------------------------------------------------------------------
  // TAB 2: METHODOLOGY STATE
  // -------------------------------------------------------------------------
  const [methodologyForm, setMethodologyForm] = useState(data.methodology || DEFAULT_CONSTRUCTION_DATA.methodology);

  // -------------------------------------------------------------------------
  // TAB 3: CAPABILITIES STATE
  // -------------------------------------------------------------------------
  const [capabilitiesList, setCapabilitiesList] = useState(data.capabilities || DEFAULT_CONSTRUCTION_DATA.capabilities);
  const [capModal, setCapModal] = useState({
    open: false,
    mode: 'add', // 'add' | 'edit'
    index: null,
    item: { id: '', title: '', desc: '' }
  });

  // -------------------------------------------------------------------------
  // TAB 4: DELIVERABLES STATE
  // -------------------------------------------------------------------------
  const [deliverablesList, setDeliverablesList] = useState(data.deliverables || DEFAULT_CONSTRUCTION_DATA.deliverables);
  const [delModal, setDelModal] = useState({
    open: false,
    mode: 'add',
    index: null,
    item: { id: '', title: '', desc: '' }
  });

  // -------------------------------------------------------------------------
  // TAB 5: SIDEBAR STATE
  // -------------------------------------------------------------------------
  const [sidebarForm, setSidebarForm] = useState(data.sidebar || DEFAULT_CONSTRUCTION_DATA.sidebar);
  const [sidebarImageMode, setSidebarImageMode] = useState('upload');
  const [isUploadingSidebar, setIsUploadingSidebar] = useState(false);
  const [isSidebarDragging, setIsSidebarDragging] = useState(false);
  const sidebarFileInputRef = useRef(null);

  const [statModal, setStatModal] = useState({
    open: false,
    mode: 'add',
    index: null,
    item: { id: '', label: '', value: '' }
  });

  // Sync state when data updates from store
  useEffect(() => {
    setHeroForm(data.hero || DEFAULT_CONSTRUCTION_DATA.hero);
    setMethodologyForm(data.methodology || DEFAULT_CONSTRUCTION_DATA.methodology);
    setCapabilitiesList(data.capabilities || DEFAULT_CONSTRUCTION_DATA.capabilities);
    setDeliverablesList(data.deliverables || DEFAULT_CONSTRUCTION_DATA.deliverables);
    setSidebarForm(data.sidebar || DEFAULT_CONSTRUCTION_DATA.sidebar);
  }, [data]);

  // -------------------------------------------------------------------------
  // IMAGE HANDLERS
  // -------------------------------------------------------------------------
  const handleHeroFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploadingHero(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1920, 0.85);
      setHeroForm(prev => ({ ...prev, bgImage: dataUrl }));
      showToast('Hero background photograph processed');
    } catch (err) {
      showToast(err.message || 'Failed to process image', 'error');
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleSidebarFileUpload = async (file) => {
    if (!file) return;
    try {
      setIsUploadingSidebar(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1600, 0.85);
      setSidebarForm(prev => ({ ...prev, image: dataUrl }));
      showToast('Sidebar showcase photograph processed');
    } catch (err) {
      showToast(err.message || 'Failed to process image', 'error');
    } finally {
      setIsUploadingSidebar(false);
    }
  };

  // -------------------------------------------------------------------------
  // SAVE HANDLERS
  // -------------------------------------------------------------------------
  const handleSaveHero = (e) => {
    e.preventDefault();
    const updated = { ...data, hero: heroForm };
    persistConstructionData(updated);
    showToast('Hero Banner saved successfully');
  };

  const handleSaveMethodology = (e) => {
    e.preventDefault();
    const updated = { ...data, methodology: methodologyForm };
    persistConstructionData(updated);
    showToast('Methodology & CTA settings saved successfully');
  };

  const handleSaveCapabilitiesList = (newList) => {
    setCapabilitiesList(newList);
    const updated = { ...data, capabilities: newList };
    persistConstructionData(updated);
  };

  const handleSaveDeliverablesList = (newList) => {
    setDeliverablesList(newList);
    const updated = { ...data, deliverables: newList };
    persistConstructionData(updated);
  };

  const handleSaveSidebar = (e) => {
    e.preventDefault();
    const updated = { ...data, sidebar: sidebarForm };
    persistConstructionData(updated);
    showToast('Sidebar & Track Record saved successfully');
  };

  // -------------------------------------------------------------------------
  // CAPABILITY ITEM MODAL ACTIONS
  // -------------------------------------------------------------------------
  const handleOpenCapModal = (mode = 'add', index = null) => {
    if (mode === 'edit' && index !== null) {
      const item = capabilitiesList[index];
      setCapModal({
        open: true,
        mode: 'edit',
        index,
        item: typeof item === 'string' ? { id: `cap-${Date.now()}`, title: item, desc: '' } : { ...item }
      });
    } else {
      setCapModal({
        open: true,
        mode: 'add',
        index: null,
        item: { id: `cap-${Date.now()}`, title: '', desc: '' }
      });
    }
  };

  const handleSaveCapItem = (e) => {
    e.preventDefault();
    if (!capModal.item.title.trim()) {
      showToast('Capability title is required', 'error');
      return;
    }
    const copy = [...capabilitiesList];
    if (capModal.mode === 'edit' && capModal.index !== null) {
      copy[capModal.index] = capModal.item;
    } else {
      copy.push(capModal.item);
    }
    handleSaveCapabilitiesList(copy);
    setCapModal({ open: false, mode: 'add', index: null, item: { id: '', title: '', desc: '' } });
    showToast(capModal.mode === 'edit' ? 'Capability updated' : 'Capability added');
  };

  const handleDeleteCapItem = (index) => {
    const copy = capabilitiesList.filter((_, i) => i !== index);
    handleSaveCapabilitiesList(copy);
    showToast('Capability deleted');
  };

  const handleMoveCapItem = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= capabilitiesList.length) return;
    const copy = [...capabilitiesList];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    handleSaveCapabilitiesList(copy);
  };

  // -------------------------------------------------------------------------
  // DELIVERABLE ITEM MODAL ACTIONS
  // -------------------------------------------------------------------------
  const handleOpenDelModal = (mode = 'add', index = null) => {
    if (mode === 'edit' && index !== null) {
      const item = deliverablesList[index];
      setDelModal({
        open: true,
        mode: 'edit',
        index,
        item: typeof item === 'string' ? { id: `del-${Date.now()}`, title: item, desc: '' } : { ...item }
      });
    } else {
      setDelModal({
        open: true,
        mode: 'add',
        index: null,
        item: { id: `del-${Date.now()}`, title: '', desc: '' }
      });
    }
  };

  const handleSaveDelItem = (e) => {
    e.preventDefault();
    if (!delModal.item.title.trim()) {
      showToast('Deliverable title is required', 'error');
      return;
    }
    const copy = [...deliverablesList];
    if (delModal.mode === 'edit' && delModal.index !== null) {
      copy[delModal.index] = delModal.item;
    } else {
      copy.push(delModal.item);
    }
    handleSaveDeliverablesList(copy);
    setDelModal({ open: false, mode: 'add', index: null, item: { id: '', title: '', desc: '' } });
    showToast(delModal.mode === 'edit' ? 'Deliverable updated' : 'Deliverable added');
  };

  const handleDeleteDelItem = (index) => {
    const copy = deliverablesList.filter((_, i) => i !== index);
    handleSaveDeliverablesList(copy);
    showToast('Deliverable deleted');
  };

  const handleMoveDelItem = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= deliverablesList.length) return;
    const copy = [...deliverablesList];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    handleSaveDeliverablesList(copy);
  };

  // -------------------------------------------------------------------------
  // SIDEBAR METRIC (STAT) MODAL ACTIONS
  // -------------------------------------------------------------------------
  const handleOpenStatModal = (mode = 'add', index = null) => {
    const stats = sidebarForm.stats || [];
    if (mode === 'edit' && index !== null) {
      setStatModal({
        open: true,
        mode: 'edit',
        index,
        item: { ...stats[index] }
      });
    } else {
      setStatModal({
        open: true,
        mode: 'add',
        index: null,
        item: { id: `stat-${Date.now()}`, label: '', value: '' }
      });
    }
  };

  const handleSaveStatItem = (e) => {
    e.preventDefault();
    if (!statModal.item.label.trim() || !statModal.item.value.trim()) {
      showToast('Label and value are both required', 'error');
      return;
    }
    const statsCopy = [...(sidebarForm.stats || [])];
    if (statModal.mode === 'edit' && statModal.index !== null) {
      statsCopy[statModal.index] = statModal.item;
    } else {
      statsCopy.push(statModal.item);
    }
    const updatedSidebar = { ...sidebarForm, stats: statsCopy };
    setSidebarForm(updatedSidebar);
    const updatedAll = { ...data, sidebar: updatedSidebar };
    persistConstructionData(updatedAll);
    setStatModal({ open: false, mode: 'add', index: null, item: { id: '', label: '', value: '' } });
    showToast(statModal.mode === 'edit' ? 'Metric updated' : 'Metric added');
  };

  const handleDeleteStatItem = (index) => {
    const statsCopy = (sidebarForm.stats || []).filter((_, i) => i !== index);
    const updatedSidebar = { ...sidebarForm, stats: statsCopy };
    setSidebarForm(updatedSidebar);
    const updatedAll = { ...data, sidebar: updatedSidebar };
    persistConstructionData(updatedAll);
    showToast('Metric deleted');
  };

  // -------------------------------------------------------------------------
  // RESET FACTORY DEFAULTS
  // -------------------------------------------------------------------------
  const handleResetToFactory = () => {
    const restored = resetConstructionToDefault();
    setData(restored);
    setHeroForm(restored.hero);
    setMethodologyForm(restored.methodology);
    setCapabilitiesList(restored.capabilities);
    setDeliverablesList(restored.deliverables);
    setSidebarForm(restored.sidebar);
    setResetConfirmOpen(false);
    showToast('All Construction content restored to Auroville defaults.');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2F1F13] pb-24 select-none font-body">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-mono uppercase tracking-wider font-bold border ${
              toast.type === 'error'
                ? 'bg-rose-900/90 text-rose-100 border-rose-700'
                : 'bg-[#2F1F13] text-[#FAF7F2] border-[#7A4E38]'
            }`}
          >
            {toast.type === 'error' ? <AlertTriangle size={15} className="text-rose-400" /> : <CheckCircle2 size={15} className="text-emerald-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="border-b border-[#E5D7C5] bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7A4E38] mb-1 font-semibold">
              <span>Admin Console</span>
              <span>/</span>
              <span className="text-[#B5532F]">Construction Studio</span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#2F1F13] flex items-center gap-2.5">
              <Layers className="text-[#B5532F]" size={26} />
              <span>Natural Building & CSEB Construction</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#6B5E55] mt-1 font-light max-w-2xl">
              Manage live content for the Earth Building & CSEB page: hero banner, methodology narrative, technical capabilities, client deliverables, and sidebar metrics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/services/construction"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-2xs"
            >
              <Eye size={14} className="text-[#B5532F]" />
              <span>View Live Page</span>
              <ExternalLink size={12} className="text-[#6B5E55]" />
            </Link>

            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-2xs cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 border-t border-[#E5D7C5]">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#B5532F] text-white shadow-xs'
                      : 'text-[#6B5E55] hover:text-[#2F1F13] hover:bg-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===================================================================
            TAB 1: HERO BANNER
            =================================================================== */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHero} className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="border-b border-[#E5D7C5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#2F1F13]">Hero Banner Settings</h2>
                  <p className="text-xs text-[#6B5E55]">Configure the top visual banner, title typography, and background photograph.</p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <Save size={14} />
                  <span>Save Hero</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Banner Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={heroForm.tag || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, tag: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Specialized Architectural Discipline"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Breadcrumb Label
                  </label>
                  <input
                    type="text"
                    value={heroForm.breadcrumb || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, breadcrumb: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Natural Building & CSEB Construction"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Main Banner Title
                  </label>
                  <input
                    type="text"
                    value={heroForm.title || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none font-bold"
                    placeholder="Natural Building & CSEB Construction"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Subtitle Tagline
                  </label>
                  <textarea
                    rows={2}
                    value={heroForm.subtitle || ''}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Earth-based masonry using on-site pressed CSEB blocks, stabilized rammed earth, and lime-pozzolana mortars."
                  />
                </div>
              </div>

              {/* Background Image Upload & URL */}
              <div className="border-t border-[#E5D7C5] pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold">
                    Hero Background Photograph
                  </label>
                  <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5D7C5]">
                    <button
                      type="button"
                      onClick={() => setHeroImageMode('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        heroImageMode === 'upload' ? 'bg-[#B5532F] text-white font-bold' : 'text-[#6B5E55]'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroImageMode('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        heroImageMode === 'url' ? 'bg-[#B5532F] text-white font-bold' : 'text-[#6B5E55]'
                      }`}
                    >
                      Direct URL
                    </button>
                  </div>
                </div>

                {heroImageMode === 'upload' ? (
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
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isHeroDragging ? 'border-[#B5532F] bg-[#B5532F]/5' : 'border-[#E5D7C5] bg-[#FAF7F2] hover:bg-white'
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
                      {isUploadingHero ? 'Processing & Optimizing Image...' : 'Click or Drag & Drop Hero Photograph'}
                    </p>
                    <p className="text-[11px] text-[#6B5E55] mt-1 font-light">
                      Supports high-res JPG, PNG, WebP (auto-resized for crisp desktop delivery).
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={heroForm.bgImage || ''}
                      onChange={(e) => setHeroForm({ ...heroForm, bgImage: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#2F1F13] outline-none"
                    />
                  </div>
                )}

                {heroForm.bgImage && (
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={heroForm.bgImage} alt="Hero Preview" className="w-20 h-12 object-cover rounded-lg border border-[#E5D7C5]" />
                      <div>
                        <span className="text-xs font-mono text-[#2F1F13] font-bold block">Hero Photograph Loaded</span>
                        <span className="text-[10px] text-[#6B5E55] font-mono">Rendered on live page banner</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHeroForm({ ...heroForm, bgImage: '' })}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Remove hero photograph"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Live Banner Preview Box */}
            <div className="bg-[#1C140E] text-stone-100 rounded-2xl p-6 sm:p-8 border border-[#382B21] space-y-3 relative overflow-hidden">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D87D4A] block">
                {heroForm.tag || 'Specialized Architectural Discipline'}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white max-w-2xl leading-tight">
                {heroForm.title || 'Natural Building & CSEB Construction'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl leading-relaxed">
                {heroForm.subtitle || 'Earth-based masonry using on-site pressed CSEB blocks, stabilized rammed earth, and lime-pozzolana mortars.'}
              </p>
            </div>
          </form>
        )}

        {/* ===================================================================
            TAB 2: METHODOLOGY NARRATIVE & CTA
            =================================================================== */}
        {activeTab === 'methodology' && (
          <form onSubmit={handleSaveMethodology} className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="border-b border-[#E5D7C5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#2F1F13]">Methodology Narrative & CTA</h2>
                  <p className="text-xs text-[#6B5E55]">Edit the core architectural philosophy paragraph and call-to-action buttons.</p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <Save size={14} />
                  <span>Save Narrative</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Section Tag / Eyebrow
                  </label>
                  <input
                    type="text"
                    value={methodologyForm.tag || ''}
                    onChange={(e) => setMethodologyForm({ ...methodologyForm, tag: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Our Methodology"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={methodologyForm.title || ''}
                    onChange={(e) => setMethodologyForm({ ...methodologyForm, title: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none font-bold"
                    placeholder="Crafting with environmental intelligence in natural building & cseb construction."
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Detailed Narrative (Body Paragraphs)
                  </label>
                  <textarea
                    rows={5}
                    value={methodologyForm.longDesc || ''}
                    onChange={(e) => setMethodologyForm({ ...methodologyForm, longDesc: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none leading-relaxed"
                    placeholder="We manufacture high-performance Compressed Stabilized Earth Blocks (CSEB) directly on or near the building site..."
                  />
                </div>

                {/* Action Buttons Configuration */}
                <div className="border-t border-[#E5D7C5] pt-5 space-y-4">
                  <h3 className="font-heading text-sm font-bold text-[#2F1F13]">Action CTA Buttons</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] space-y-3">
                      <span className="text-xs font-mono font-bold text-[#B5532F] uppercase block">Primary Button (Terracotta)</span>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6B5E55] mb-1">Button Text</label>
                        <input
                          type="text"
                          value={methodologyForm.primaryCtaText || ''}
                          onChange={(e) => setMethodologyForm({ ...methodologyForm, primaryCtaText: e.target.value })}
                          className="w-full bg-white border border-[#E5D7C5] focus:border-[#B5532F] rounded-lg px-3 py-1.5 text-xs text-[#2F1F13]"
                          placeholder="Request Consultation"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6B5E55] mb-1">Target Link</label>
                        <input
                          type="text"
                          value={methodologyForm.primaryCtaLink || ''}
                          onChange={(e) => setMethodologyForm({ ...methodologyForm, primaryCtaLink: e.target.value })}
                          className="w-full bg-white border border-[#E5D7C5] focus:border-[#B5532F] rounded-lg px-3 py-1.5 text-xs text-[#2F1F13]"
                          placeholder="/contact"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] space-y-3">
                      <span className="text-xs font-mono font-bold text-[#2F1F13] uppercase block">Secondary Button (Outlined)</span>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6B5E55] mb-1">Button Text</label>
                        <input
                          type="text"
                          value={methodologyForm.secondaryCtaText || ''}
                          onChange={(e) => setMethodologyForm({ ...methodologyForm, secondaryCtaText: e.target.value })}
                          className="w-full bg-white border border-[#E5D7C5] focus:border-[#B5532F] rounded-lg px-3 py-1.5 text-xs text-[#2F1F13]"
                          placeholder="Case Studies"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6B5E55] mb-1">Target Link</label>
                        <input
                          type="text"
                          value={methodologyForm.secondaryCtaLink || ''}
                          onChange={(e) => setMethodologyForm({ ...methodologyForm, secondaryCtaLink: e.target.value })}
                          className="w-full bg-white border border-[#E5D7C5] focus:border-[#B5532F] rounded-lg px-3 py-1.5 text-xs text-[#2F1F13]"
                          placeholder="/projects"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </form>
        )}

        {/* ===================================================================
            TAB 3: TECHNICAL CAPABILITIES
            =================================================================== */}
        {activeTab === 'capabilities' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5] pb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#2F1F13]">Key Technical Capabilities ({capabilitiesList.length})</h2>
                  <p className="text-xs text-[#6B5E55]">Feature cards highlighting technical soil science, arches, mortars, and structural mastery.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenCapModal('add')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Capability</span>
                </button>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilitiesList.map((item, idx) => {
                  const title = typeof item === 'string' ? item : item.title;
                  const desc = typeof item === 'object' ? item.desc : '';
                  return (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex flex-col justify-between gap-3 group hover:border-[#B5532F]/50 transition-all shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-[#B5532F] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-[#2F1F13]">{title}</h4>
                          {desc && <p className="text-[11px] text-[#6B5E55] leading-relaxed">{desc}</p>}
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-2 border-t border-[#E5D7C5]/70">

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenCapModal('edit', idx)}
                            className="p-1.5 rounded-lg bg-white border border-[#E5D7C5] text-[#2F1F13] hover:border-[#B5532F] text-xs cursor-pointer"
                            title="Edit capability"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCapItem(idx)}
                            className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
                            title="Delete capability"
                          >
                            <Trash2 size={13} />
                          </button>
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
            TAB 4: CLIENT DELIVERABLES
            =================================================================== */}
        {activeTab === 'deliverables' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5] pb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#2F1F13]">Client Deliverables & Documentation ({deliverablesList.length})</h2>
                  <p className="text-xs text-[#6B5E55]">Points outlining soil lab reports, block specifications, turnkey masonry, and thermal certifications.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenDelModal('add')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Plus size={14} />
                  <span>Add Deliverable</span>
                </button>
              </div>

              {/* Deliverables List */}
              <div className="space-y-3">
                {deliverablesList.map((item, idx) => {
                  const title = typeof item === 'string' ? item : item.title;
                  const desc = typeof item === 'object' ? item.desc : '';
                  return (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-[#B5532F]/50 transition-all shadow-2xs"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#B5532F] shrink-0 mt-1.5" />
                        <div>
                          <h4 className="text-xs font-bold text-[#2F1F13]">{title}</h4>
                          {desc && <p className="text-[11px] text-[#6B5E55] mt-0.5">{desc}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenDelModal('edit', idx)}
                          className="p-1.5 rounded-lg bg-white border border-[#E5D7C5] text-[#2F1F13] hover:border-[#B5532F] text-xs cursor-pointer"
                          title="Edit deliverable"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDelItem(idx)}
                          className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs cursor-pointer"
                          title="Delete deliverable"
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
            TAB 5: SIDEBAR SHOWCASE & STUDIO TRACK RECORD
            =================================================================== */}
        {activeTab === 'sidebar' && (
          <form onSubmit={handleSaveSidebar} className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="border-b border-[#E5D7C5] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#2F1F13]">Sidebar Showcase & Track Record</h2>
                  <p className="text-xs text-[#6B5E55]">Manage the sticky right-column photograph, track record metric counters, and supervision note.</p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  <Save size={14} />
                  <span>Save Sidebar</span>
                </button>
              </div>

              {/* Sidebar Photograph Upload & URL */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold">
                    Sidebar Showcase Photograph
                  </label>
                  <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5D7C5]">
                    <button
                      type="button"
                      onClick={() => setSidebarImageMode('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        sidebarImageMode === 'upload' ? 'bg-[#B5532F] text-white font-bold' : 'text-[#6B5E55]'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidebarImageMode('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        sidebarImageMode === 'url' ? 'bg-[#B5532F] text-white font-bold' : 'text-[#6B5E55]'
                      }`}
                    >
                      Direct URL
                    </button>
                  </div>
                </div>

                {sidebarImageMode === 'upload' ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsSidebarDragging(true); }}
                    onDragLeave={() => setIsSidebarDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsSidebarDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleSidebarFileUpload(file);
                    }}
                    onClick={() => sidebarFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                      isSidebarDragging ? 'border-[#B5532F] bg-[#B5532F]/5' : 'border-[#E5D7C5] bg-[#FAF7F2] hover:bg-white'
                    }`}
                  >
                    <input
                      ref={sidebarFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSidebarFileUpload(e.target.files?.[0])}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E5D7C5] text-[#B5532F] mx-auto flex items-center justify-center mb-2 shadow-2xs">
                      {isUploadingSidebar ? <RotateCw size={20} className="animate-spin" /> : <Upload size={20} />}
                    </div>
                    <p className="text-xs font-mono uppercase tracking-wider text-[#2F1F13] font-bold">
                      {isUploadingSidebar ? 'Processing...' : 'Click or Drag & Drop Showcase Photo'}
                    </p>
                    <p className="text-[11px] text-[#6B5E55] mt-1 font-light">
                      Supports JPG, PNG, WebP (auto-optimized).
                    </p>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={sidebarForm.image || ''}
                      onChange={(e) => setSidebarForm({ ...sidebarForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#2F1F13] outline-none"
                    />
                  </div>
                )}

                {sidebarForm.image && (
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={sidebarForm.image} alt="Sidebar Preview" className="w-20 h-14 object-cover rounded-lg border border-[#E5D7C5]" />
                      <div>
                        <span className="text-xs font-mono text-[#2F1F13] font-bold block">Showcase Photograph Loaded</span>
                        <span className="text-[10px] text-[#6B5E55] font-mono">Rendered on sticky right-hand column</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSidebarForm({ ...sidebarForm, image: '' })}
                      className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Track Record Tag */}
              <div className="border-t border-[#E5D7C5] pt-5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Track Record Card Tag
                </label>
                <input
                  type="text"
                  value={sidebarForm.trackRecordTag || ''}
                  onChange={(e) => setSidebarForm({ ...sidebarForm, trackRecordTag: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Studio Track Record"
                />
              </div>

              {/* Dynamic Metric Counters */}
              <div className="border-t border-[#E5D7C5] pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-sm font-bold text-[#2F1F13]">Track Record Metric Counters</h3>
                    <p className="text-xs text-[#6B5E55]">Highlighted quantitative metrics (e.g. Completed: 80+, Blocks: 1.2M+).</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenStatModal('add')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-xs font-mono uppercase tracking-wider font-bold text-[#2F1F13] cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(sidebarForm.stats || []).map((stat, idx) => (
                    <div
                      key={stat.id || idx}
                      className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex flex-col justify-between gap-2 shadow-2xs"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A4E38] block truncate">
                          {stat.label}
                        </span>
                        <span className="font-heading text-lg font-bold text-[#2F1F13] block">
                          {stat.value}
                        </span>
                      </div>
                      <div className="flex items-center justify-end gap-1 pt-1 border-t border-[#E5D7C5]/60">
                        <button
                          type="button"
                          onClick={() => handleOpenStatModal('edit', idx)}
                          className="p-1 rounded text-[#6B5E55] hover:text-[#2F1F13] cursor-pointer"
                          title="Edit metric"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStatItem(idx)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                          title="Delete metric"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supervision Note */}
              <div className="border-t border-[#E5D7C5] pt-5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                  Studio Supervision & Quality Note
                </label>
                <textarea
                  rows={2}
                  value={sidebarForm.supervisionNote || ''}
                  onChange={(e) => setSidebarForm({ ...sidebarForm, supervisionNote: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3.5 py-2 text-xs text-[#2F1F13] outline-none"
                  placeholder="Every project is supervised directly by Auroville master builders and registered architects."
                />
              </div>
            </div>
          </form>
        )}

      </div>

      {/* ===================================================================
          MODAL: ADD / EDIT CAPABILITY
          =================================================================== */}
      <AnimatePresence>
        {capModal.open && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl border border-[#E5D7C5] shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">
                  {capModal.mode === 'edit' ? 'Edit Technical Capability' : 'Add Technical Capability'}
                </h3>
                <button
                  type="button"
                  onClick={() => setCapModal({ ...capModal, open: false })}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#2F1F13]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveCapItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Capability Title *
                  </label>
                  <input
                    type="text"
                    value={capModal.item.title}
                    onChange={(e) => setCapModal({
                      ...capModal,
                      item: { ...capModal.item, title: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="e.g. Arches, vaults, and Catalan thin-tile earth domes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    rows={3}
                    value={capModal.item.desc}
                    onChange={(e) => setCapModal({
                      ...capModal,
                      item: { ...capModal.item, desc: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Compression-only geometry eliminating carbon-heavy steel rebar..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5D7C5]">
                  <button
                    type="button"
                    onClick={() => setCapModal({ ...capModal, open: false })}
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
          MODAL: ADD / EDIT DELIVERABLE
          =================================================================== */}
      <AnimatePresence>
        {delModal.open && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl border border-[#E5D7C5] shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">
                  {delModal.mode === 'edit' ? 'Edit Deliverable' : 'Add Deliverable'}
                </h3>
                <button
                  type="button"
                  onClick={() => setDelModal({ ...delModal, open: false })}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#2F1F13]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveDelItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Deliverable Name *
                  </label>
                  <input
                    type="text"
                    value={delModal.item.title}
                    onChange={(e) => setDelModal({
                      ...delModal,
                      item: { ...delModal.item, title: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="e.g. Soil Lab Analysis & Mix Formulations"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Description or Scope Notes
                  </label>
                  <textarea
                    rows={3}
                    value={delModal.item.desc}
                    onChange={(e) => setDelModal({
                      ...delModal,
                      item: { ...delModal.item, desc: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="Comprehensive laboratory testing report identifying soil grain distribution..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5D7C5]">
                  <button
                    type="button"
                    onClick={() => setDelModal({ ...delModal, open: false })}
                    className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono text-[#6B5E55] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white text-xs font-mono uppercase tracking-wider font-bold"
                  >
                    Save Deliverable
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================
          MODAL: ADD / EDIT STAT
          =================================================================== */}
      <AnimatePresence>
        {statModal.open && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white rounded-2xl border border-[#E5D7C5] shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
                <h3 className="font-heading text-base font-bold text-[#2F1F13]">
                  {statModal.mode === 'edit' ? 'Edit Metric' : 'Add Metric'}
                </h3>
                <button
                  type="button"
                  onClick={() => setStatModal({ ...statModal, open: false })}
                  className="p-1 rounded-lg hover:bg-[#FAF7F2] text-[#2F1F13]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveStatItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Metric Label *
                  </label>
                  <input
                    type="text"
                    value={statModal.item.label}
                    onChange={(e) => setStatModal({
                      ...statModal,
                      item: { ...statModal.item, label: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none"
                    placeholder="e.g. Completed Projects"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold mb-1">
                    Value *
                  </label>
                  <input
                    type="text"
                    value={statModal.item.value}
                    onChange={(e) => setStatModal({
                      ...statModal,
                      item: { ...statModal.item, value: e.target.value }
                    })}
                    className="w-full bg-[#FAF7F2] border border-[#E5D7C5] focus:border-[#B5532F] focus:bg-white rounded-xl px-3 py-2 text-xs text-[#2F1F13] outline-none font-bold"
                    placeholder="e.g. 80+ or 1.2M+"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5D7C5]">
                  <button
                    type="button"
                    onClick={() => setStatModal({ ...statModal, open: false })}
                    className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono text-[#6B5E55] hover:bg-[#FAF7F2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white text-xs font-mono uppercase tracking-wider font-bold"
                  >
                    Save Metric
                  </button>
                </div>
              </form>
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
              className="w-full max-w-md bg-white rounded-2xl border border-rose-200 shadow-2xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <AlertTriangle size={24} />
                <h3 className="font-heading text-lg font-bold">Reset Construction Studio?</h3>
              </div>
              <p className="text-xs text-[#6B5E55] leading-relaxed">
                This will reset all sections (Hero Banner, Methodology narrative, Technical Capabilities, Client Deliverables, Sidebar image & stats) back to original Auroville defaults. Custom modifications will be cleared.
              </p>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#E5D7C5]">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono text-[#6B5E55] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetToFactory}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono uppercase tracking-wider font-bold cursor-pointer"
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

export default AdminConstruction;
