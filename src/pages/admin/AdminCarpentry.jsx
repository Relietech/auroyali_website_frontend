import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hammer,
  Plus,
  Upload,
  Search,
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
  Sliders,
  Layers,
  ArrowRight,
  FolderPlus,
  Link as LinkIcon,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getStoredCarpentryData,
  saveCarpentryItem,
  deleteCarpentryItem,
  updateCategoryDetails,
  updateHeroConfig,
  resetCarpentryToDefault,
  subscribeToCarpentry,
  readImageFileAsDataUrl,
  getCustomTags,
  saveCustomTag,
  deleteCustomTag,
  DEFAULT_CARPENTRY_CATEGORIES,
  DEFAULT_HERO_CONFIG
} from '../../services/carpentryStore';

const POPULAR_TAGS_BY_CATEGORY = {
  'doors-windows': [
    'Main Door',
    'Foldable Door',
    'Casement Window',
    'Ventilation Shutter',
    'Pivot Door',
    'Sliding Door',
    'French Window'
  ],
  'furniture': [
    'Dining Table',
    'Lounge Chair',
    'Bookshelf & Daybed',
    'Credenza Cabinet',
    'Study Desk',
    'Coffee Table',
    'Heirloom Bench',
    'Bed Frame'
  ],
  'wooden-interiors': [
    'Timber Wall Panelling',
    'Ceiling Architecture',
    'Custom Storage',
    'Custom Cabinetry',
    'Space Divider',
    'Staircase Railing',
    'Acoustic Panelling'
  ]
};

export function AdminCarpentry() {
  const [data, setData] = useState(() => getStoredCarpentryData());
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Work Item Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState({
    id: '',
    categoryId: 'doors-windows',
    title: '',
    tag: '',
    src: '',
    alt: ''
  });
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);

  // Custom tags & extra fields state
  const [customTags, setCustomTags] = useState(() => getCustomTags());
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [showExtraFields, setShowExtraFields] = useState(false);

  // Lightbox preview for admin
  const [previewImage, setPreviewImage] = useState(null);

  // Deletion Confirmation Dialog
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);

  // Reset to Defaults Dialog
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Settings Tab State (Hero & Category Settings)
  const [heroForm, setHeroForm] = useState(data.hero || DEFAULT_HERO_CONFIG);
  const [heroImageInputMode, setHeroImageInputMode] = useState('url');
  const heroFileInputRef = useRef(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3600);
  };

  // Sync state with carpentryStore events
  useEffect(() => {
    const unsub = subscribeToCarpentry((updated) => {
      setData(updated);
      setHeroForm(updated.hero || DEFAULT_HERO_CONFIG);
    });
    return () => unsub();
  }, []);

  const categories = data?.categories || DEFAULT_CARPENTRY_CATEGORIES;
  const hero = data?.hero || DEFAULT_HERO_CONFIG;

  // Flatten all works across categories for 'all' tab or search
  const allWorks = categories.flatMap(cat => 
    cat.items.map(item => ({
      ...item,
      categoryNumber: cat.number,
      categoryTitle: cat.title,
      categoryId: cat.id
    }))
  );

  // Metrics
  const totalWorksCount = allWorks.length;
  const doorsWindowsCount = categories.find(c => c.id === 'doors-windows')?.items?.length || 0;
  const furnitureCount = categories.find(c => c.id === 'furniture')?.items?.length || 0;
  const woodenInteriorsCount = categories.find(c => c.id === 'wooden-interiors')?.items?.length || 0;

  // Filtered works by active tab & search query
  const displayedWorks = allWorks.filter(item => {
    const matchesTab = activeTab === 'all' || item.categoryId === activeTab;
    if (!matchesTab) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.title?.toLowerCase().includes(q) ||
      item.tag?.toLowerCase().includes(q) ||
      item.categoryTitle?.toLowerCase().includes(q) ||
      item.alt?.toLowerCase().includes(q)
    );
  });

  // Open Add Work Modal
  const handleOpenAddModal = (defaultCategory = 'doors-windows') => {
    setModalMode('create');
    setFormData({
      id: '',
      categoryId: activeTab !== 'all' && activeTab !== 'settings' ? activeTab : defaultCategory,
      title: '',
      tag: '',
      src: '',
      alt: '',
      woodType: '',
      dimensions: ''
    });
    setImageInputMode('upload');
    setIsAddingTag(false);
    setNewTagInput('');
    setShowExtraFields(false);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Work Modal
  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setFormData({
      id: item.id,
      categoryId: item.categoryId || 'doors-windows',
      title: item.title || '',
      tag: item.tag || '',
      src: item.src || '',
      alt: item.alt || '',
      woodType: item.woodType || '',
      dimensions: item.dimensions || ''
    });
    setImageInputMode(item.src?.startsWith('data:') ? 'upload' : 'url');
    setIsAddingTag(false);
    setNewTagInput('');
    setShowExtraFields(Boolean(item.woodType || item.dimensions));
    setFormError('');
    setIsModalOpen(true);
  };

  // Add a new custom tag/field to active category
  const handleAddNewTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    const updated = saveCustomTag(formData.categoryId, trimmed);
    setCustomTags(updated);
    setFormData(prev => ({ ...prev, tag: trimmed }));
    setIsAddingTag(false);
    setNewTagInput('');
    showToast(`Added and selected field "${trimmed}"!`);
  };

  // Delete a user-added custom tag
  const handleDeleteCustomTag = (tagToDelete) => {
    const updated = deleteCustomTag(formData.categoryId, tagToDelete);
    setCustomTags(updated);
    if (formData.tag === tagToDelete) {
      setFormData(prev => ({ ...prev, tag: '' }));
    }
    showToast(`Removed field "${tagToDelete}"`);
  };

  // Process File Upload via Local Compressor
  const handleProcessFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('Please choose a valid image file (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessingImage(true);
      setFormError('');
      const compressedDataUrl = await readImageFileAsDataUrl(file, 1400, 0.85);
      setFormData(prev => ({
        ...prev,
        src: compressedDataUrl,
        alt: prev.alt || `${prev.title || file.name.replace(/\.[^/.]+$/, '')} - AuroYali Handcrafted Woodcraft`
      }));
      setIsProcessingImage(false);
    } catch (err) {
      console.error('File compression error:', err);
      setFormError('Could not process this photo. Try another file or use a direct URL.');
      setIsProcessingImage(false);
    }
  };

  // Submit Work Modal Form
  const handleSubmitWork = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Please enter a descriptive title for this carpentry work.');
      return;
    }
    if (!formData.src.trim()) {
      setFormError('Please upload an image or enter a valid photo URL.');
      return;
    }

    try {
      const saved = saveCarpentryItem(formData);
      setIsModalOpen(false);
      showToast(
        modalMode === 'create'
          ? `Added "${saved.title}" to ${saved.categoryTitle}!`
          : `Updated "${saved.title}" successfully!`
      );
    } catch (err) {
      console.error('Save failed:', err);
      setFormError('Failed to save carpentry item. Storage may be full.');
    }
  };

  // Confirm and Execute Deletion
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    deleteCarpentryItem(deleteConfirmItem.id);
    showToast(`Removed "${deleteConfirmItem.title}" from studio.`);
    setDeleteConfirmItem(null);
  };

  // Reset to Defaults
  const handleConfirmReset = () => {
    resetCarpentryToDefault();
    setResetConfirmOpen(false);
    showToast('All carpentry categories and works restored to Auroville defaults.');
  };

  // Save Category Details in Settings Tab
  const handleSaveCategory = (categoryId, updates) => {
    updateCategoryDetails(categoryId, updates);
    showToast('Category details and layout updated.');
  };

  // Save Hero Banner Settings
  const handleSaveHero = (e) => {
    e.preventDefault();
    updateHeroConfig(heroForm);
    showToast('Carpentry hero banner settings saved!');
  };

  // Process Hero Image Upload
  const handleProcessHeroFile = async (file) => {
    if (!file) return;
    try {
      setIsProcessingImage(true);
      const compressed = await readImageFileAsDataUrl(file, 1920, 0.85);
      setHeroForm(prev => ({ ...prev, heroImage: compressed }));
      setIsProcessingImage(false);
      showToast('Hero photo updated! Remember to click Save Hero Settings.');
    } catch (err) {
      console.error('Hero image failed:', err);
      showToast('Failed to process hero photo.', 'error');
      setIsProcessingImage(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-red-50 text-red-900 border-red-200'
                : 'bg-[#2F1F13] text-white border-[#B5472B]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle size={18} className="text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-[#B5472B] shrink-0" />
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
              <Hammer size={11} />
              <span>Woodcraft Studio Console</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              {totalWorksCount} handcrafted works
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            Carpentry Studio & Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light max-w-2xl">
            Handcrafted solid wood portals, heirloom timber furniture, and bespoke architectural woodwork rooted in Auroville. Upload project photographs, manage craft metadata, and calibrate layouts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/services/carpentry"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95"
          >
            <ExternalLink size={13} className="text-[#B5532F]" />
            <span className="hidden sm:inline">Live Service Page</span>
          </Link>

          <button
            type="button"
            onClick={() => setResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Restore original seed photos"
          >
            <RotateCw size={13} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAddModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#9E3B22] text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Upload Work</span>
          </button>
        </div>
      </div>

      {/* 2. STAT METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#865430] tracking-wider block">
            Total Works
          </span>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-[#2F1F13] mt-1 block">
            {totalWorksCount}
          </div>
          <span className="text-[11px] text-[#B5532F] font-mono mt-0.5 block">
            Across 3 Categories
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#865430] tracking-wider block">
            01. Doors & Windows
          </span>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-[#2F1F13] mt-1 block">
            {doorsWindowsCount}
          </div>
          <span className="text-[11px] text-[#7A8B69] font-mono mt-0.5 block">
            Portals & Casements
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#865430] tracking-wider block">
            02. Furniture
          </span>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-[#2F1F13] mt-1 block">
            {furnitureCount}
          </div>
          <span className="text-[11px] text-[#7A8B69] font-mono mt-0.5 block">
            Tables & Seating
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
          <span className="text-[10px] font-mono uppercase text-[#865430] tracking-wider block">
            03. Wooden Interiors
          </span>
          <div className="font-heading text-2xl sm:text-3xl font-bold text-[#2F1F13] mt-1 block">
            {woodenInteriorsCount}
          </div>
          <span className="text-[11px] text-[#7A8B69] font-mono mt-0.5 block">
            Millwork & Storage
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div>

        {/* Tab Navigation + Search Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8D9CC]">
          
          {/* Tab Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#2A1A12] text-white shadow-xs'
                  : 'bg-white text-[#6B5B52] hover:text-[#2A1A12] border border-[#E8D9CC]'
              }`}
            >
              All Works ({totalWorksCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('doors-windows')}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'doors-windows'
                  ? 'bg-[#2A1A12] text-white shadow-xs'
                  : 'bg-white text-[#6B5B52] hover:text-[#2A1A12] border border-[#E8D9CC]'
              }`}
            >
              Doors & Windows ({doorsWindowsCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('furniture')}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'furniture'
                  ? 'bg-[#2A1A12] text-white shadow-xs'
                  : 'bg-white text-[#6B5B52] hover:text-[#2A1A12] border border-[#E8D9CC]'
              }`}
            >
              Furniture ({furnitureCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('wooden-interiors')}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'wooden-interiors'
                  ? 'bg-[#2A1A12] text-white shadow-xs'
                  : 'bg-white text-[#6B5B52] hover:text-[#2A1A12] border border-[#E8D9CC]'
              }`}
            >
              Wooden Interiors ({woodenInteriorsCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-[#B5472B] text-white shadow-xs'
                  : 'bg-white text-[#6B5B52] hover:text-[#2A1A12] border border-[#E8D9CC]'
              }`}
            >
              <Sliders size={13} />
              <span>Hero & Category Settings</span>
            </button>
          </div>

          {/* Search Box */}
          {activeTab !== 'settings' && (
            <div className="relative min-w-[240px] sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7970]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, tag, or room..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#E8D9CC] text-sm text-[#2A1A12] placeholder-[#8A7970] focus:outline-none focus:ring-2 focus:ring-[#B5472B] shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

        </div>

        {/* TAB 1, 2, 3, 4: CARPENTRY WORKS GALLERY GRID */}
        {activeTab !== 'settings' && (
          <div className="pt-6">
            {displayedWorks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8D9CC] p-12 text-center max-w-lg mx-auto shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FAF6F1] text-[#B5472B] flex items-center justify-center mx-auto mb-4 border border-[#E8D9CC]">
                  <Hammer size={24} />
                </div>
                <h3 className="font-heading text-xl font-semibold text-[#2A1A12] mb-1">
                  No Carpentry Works Found
                </h3>
                <p className="text-sm text-[#6B5B52] mb-6 font-body">
                  {searchQuery
                    ? `No works matched "${searchQuery}". Try clearing your search term.`
                    : 'There are no items uploaded to this category yet.'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 rounded-xl bg-[#FAF6F1] hover:bg-[#E8D9CC] text-xs font-mono uppercase tracking-wider font-semibold text-[#2A1A12] transition-colors cursor-pointer"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(activeTab !== 'all' ? activeTab : 'doors-windows')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5472B] hover:bg-[#9E3B22] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-sm"
                    >
                      <Plus size={15} />
                      <span>Upload First Work</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedWorks.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E8D9CC] overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col"
                  >
                    {/* Image Preview Container */}
                    <div className="relative aspect-[4/3] bg-[#2A1A12] overflow-hidden">
                      <img
                        src={item.src}
                        alt={item.alt || item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />

                      {/* Top Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-[#2A1A12]/85 backdrop-blur-xs text-[#FAF6F1] text-[10px] font-mono uppercase tracking-wider font-semibold border border-white/10">
                          {item.categoryTitle}
                        </span>
                      </div>

                      {/* Quick Expand Button */}
                      <button
                        type="button"
                        onClick={() => setPreviewImage(item)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#2A1A12]/80 hover:bg-[#B5472B] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm"
                        title="View Full Image"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Craft Tag Badge */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF6F1]/95 text-[#B5472B] text-[10px] font-mono uppercase tracking-widest font-semibold shadow-xs">
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* Card Content & Action Bar */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-[#2A1A12] leading-snug mb-1 line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#6B5B52] line-clamp-2 font-body">
                          {item.alt || 'Bespoke solid woodcraft handcrafted in Auroville.'}
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-[#E8D9CC] flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-[#8A7970] uppercase tracking-wider truncate">
                          ID: {item.id}
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 rounded-lg bg-[#FAF6F1] hover:bg-[#E8D9CC] text-[#2A1A12] transition-colors cursor-pointer"
                            title="Edit Work"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem(item)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="Delete Work"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: HERO & CATEGORY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="pt-6 space-y-10 max-w-4xl">
            
            {/* 1. Hero Banner Configuration */}
            <div className="bg-white rounded-2xl border border-[#E8D9CC] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles size={18} className="text-[#B5472B]" />
                <h2 className="font-heading text-2xl font-semibold text-[#2A1A12]">
                  Hero Banner Configuration
                </h2>
              </div>
              <p className="text-sm text-[#6B5B52] mb-6 font-body">
                Adjust the headline, narrative eyebrow, and backdrop photograph displayed at the top of the Carpentry service page.
              </p>

              <form onSubmit={handleSaveHero} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1.5">
                      Eyebrow Text
                    </label>
                    <input
                      type="text"
                      value={heroForm.eyebrow || ''}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, eyebrow: e.target.value }))}
                      placeholder="OUR CRAFT"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1.5">
                      Main Page Heading
                    </label>
                    <input
                      type="text"
                      value={heroForm.title || ''}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Carpentry"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1.5">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={heroForm.subtitle || ''}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Bespoke architectural woodworking, heirloom solid timber joinery..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
                  />
                </div>

                {/* Hero Photo Source */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold">
                      Hero Backdrop Photograph
                    </label>
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setHeroImageInputMode('upload')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          heroImageInputMode === 'upload' ? 'bg-[#2A1A12] text-white' : 'text-[#6B5B52] hover:text-[#2A1A12]'
                        }`}
                      >
                        Upload Local File
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroImageInputMode('url')}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          heroImageInputMode === 'url' ? 'bg-[#2A1A12] text-white' : 'text-[#6B5B52] hover:text-[#2A1A12]'
                        }`}
                      >
                        Photo URL
                      </button>
                    </div>
                  </div>

                  {heroImageInputMode === 'url' ? (
                    <input
                      type="url"
                      value={heroForm.heroImage || ''}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, heroImage: e.target.value }))}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F1] border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
                    />
                  ) : (
                    <div>
                      <input
                        ref={heroFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProcessHeroFile(e.target.files?.[0])}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        className="w-full py-4 px-4 rounded-xl border-2 border-dashed border-[#E8D9CC] hover:border-[#B5472B] bg-[#FAF6F1] flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6B5B52] hover:text-[#2A1A12] transition-colors cursor-pointer"
                      >
                        <Upload size={16} />
                        <span>Select High-Resolution Hero Image</span>
                      </button>
                    </div>
                  )}

                  {heroForm.heroImage && (
                    <div className="mt-3 relative h-36 rounded-xl overflow-hidden border border-[#E8D9CC] bg-[#2A1A12]">
                      <img
                        src={heroForm.heroImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3">
                        <span className="text-[10px] font-mono text-white/90">
                          Active Hero Preview
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#B5472B] hover:bg-[#9E3B22] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    Save Hero Settings
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Category Descriptions & Layouts */}
            <div className="bg-white rounded-2xl border border-[#E8D9CC] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <Layers size={18} className="text-[#B5472B]" />
                  <h2 className="font-heading text-2xl font-semibold text-[#2A1A12]">
                    Category Settings & Layout Curation
                  </h2>
                </div>
                <p className="text-sm text-[#6B5B52] font-body">
                  Configure titles, craft statements, and layout grid arrangements for each category section on the public page.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                {categories.map((category) => (
                  <CategorySettingCard
                    key={category.id}
                    category={category}
                    onSave={(updates) => handleSaveCategory(category.id, updates)}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT CARPENTRY WORK */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FAF6F1] rounded-2xl max-w-2xl w-full border border-[#E8D9CC] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-white border-b border-[#E8D9CC] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6F1] text-[#B5472B] flex items-center justify-center border border-[#E8D9CC]">
                    <Hammer size={18} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-[#2A1A12]">
                      {modalMode === 'create' ? 'Upload Carpentry Work' : 'Edit Carpentry Work'}
                    </h3>
                    <p className="text-xs text-[#6B5B52] font-mono">
                      Add to public woodworking portfolio
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#FAF6F1] hover:bg-[#E8D9CC] text-[#2A1A12] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSubmitWork} className="p-5 sm:p-6 overflow-y-auto space-y-5">
                
                {formError && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0 text-red-500" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, categoryId: cat.id }))}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.categoryId === cat.id
                            ? 'bg-[#2A1A12] text-white border-[#2A1A12] shadow-xs'
                            : 'bg-white text-[#6B5B52] hover:text-[#2A1A12] border-[#E8D9CC]'
                        }`}
                      >
                        <span className="text-[10px] font-mono block opacity-70">
                          Category {cat.number}
                        </span>
                        <span className="font-heading text-sm font-semibold block leading-tight">
                          {cat.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title & Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1.5">
                      Work Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Lakshmi Training Centre Portal"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1.5">
                      Craft Tag <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tag}
                      onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="e.g. Main Door / Teak Dining Table"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
                    />
                  </div>
                </div>

                {/* Suggested Tag Chips for active category with + Add New Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A7970] block">
                      Suggested Tags for {categories.find(c => c.id === formData.categoryId)?.title}:
                    </span>
                    <span className="text-[10px] font-mono text-[#8A7970]">
                      Click to select or create new
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Default predefined tags for this category */}
                    {(POPULAR_TAGS_BY_CATEGORY[formData.categoryId] || []).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, tag: suggestion }))}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors cursor-pointer ${
                          formData.tag === suggestion
                            ? 'bg-[#B5472B] text-white font-semibold shadow-xs'
                            : 'bg-white text-[#6B5B52] hover:bg-[#E8D9CC] border border-[#E8D9CC]'
                        }`}
                      >
                        + {suggestion}
                      </button>
                    ))}

                    {/* Custom user-added tags for this category */}
                    {(customTags[formData.categoryId] || []).map((customTag) => (
                      <div
                        key={customTag}
                        className={`inline-flex items-center rounded-full text-[11px] font-mono transition-colors ${
                          formData.tag === customTag
                            ? 'bg-[#B5472B] text-white font-semibold shadow-xs'
                            : 'bg-[#FAF6F1] text-[#2A1A12] border border-[#B5472B]/40'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tag: customTag }))}
                          className="px-2.5 py-1 cursor-pointer flex items-center gap-1"
                        >
                          <span className="text-[9px] text-[#B5472B]">★</span>
                          <span>{customTag}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomTag(customTag);
                          }}
                          className={`pr-2 pl-0.5 hover:text-red-500 cursor-pointer ${
                            formData.tag === customTag ? 'text-white/80' : 'text-[#8A7970]'
                          }`}
                          title="Delete this custom field"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}

                    {/* + Add New Field inline button and input */}
                    {!isAddingTag ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTag(true);
                          setNewTagInput('');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#2A1A12] text-white hover:bg-[#B5472B] transition-all cursor-pointer shadow-xs"
                        title="Add a custom tag or field to this category"
                      >
                        <Plus size={12} />
                        <span>Add New Field</span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-white p-0.5 pl-2.5 rounded-full border border-[#B5472B] shadow-xs">
                        <input
                          type="text"
                          autoFocus
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddNewTag();
                            } else if (e.key === 'Escape') {
                              setIsAddingTag(false);
                              setNewTagInput('');
                            }
                          }}
                          placeholder="Type new field..."
                          className="text-[11px] font-mono text-[#2A1A12] outline-none w-32 bg-transparent"
                        />
                        <button
                          type="button"
                          onClick={handleAddNewTag}
                          disabled={!newTagInput.trim()}
                          className="px-2.5 py-1 rounded-full bg-[#B5472B] text-white text-[10px] font-mono uppercase font-bold hover:bg-[#9E3B22] disabled:opacity-40 cursor-pointer transition-colors"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTag(false);
                            setNewTagInput('');
                          }}
                          className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photograph Input (Drag-and-Drop Local File OR Image URL) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold">
                      Photograph Source <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-1.5 bg-white p-0.5 rounded-lg border border-[#E8D9CC] text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          imageInputMode === 'upload'
                            ? 'bg-[#2A1A12] text-white font-semibold'
                            : 'text-[#6B5B52] hover:text-[#2A1A12]'
                        }`}
                      >
                        Upload Local File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                          imageInputMode === 'url'
                            ? 'bg-[#2A1A12] text-white font-semibold'
                            : 'text-[#6B5B52] hover:text-[#2A1A12]'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {imageInputMode === 'upload' ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleProcessFile(e.target.files?.[0])}
                        className="hidden"
                      />
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files?.[0]) {
                            handleProcessFile(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                          isDragging
                            ? 'border-[#B5472B] bg-[#B5472B]/5'
                            : 'border-[#E8D9CC] hover:border-[#B5472B] bg-white'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#FAF6F1] text-[#B5472B] flex items-center justify-center mx-auto mb-3 border border-[#E8D9CC]">
                          {isProcessingImage ? (
                            <RotateCw size={20} className="animate-spin" />
                          ) : (
                            <Upload size={20} />
                          )}
                        </div>
                        <p className="font-heading text-sm font-semibold text-[#2A1A12] mb-1">
                          {isProcessingImage ? 'Optimizing Photo...' : 'Click to Browse or Drag Image Here'}
                        </p>
                        <p className="text-xs text-[#8A7970] font-mono">
                          Auto-compressed for web performance (JPG, PNG, WebP)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7970]" />
                        <input
                          type="url"
                          value={formData.src}
                          onChange={(e) => setFormData(prev => ({ ...prev, src: e.target.value }))}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
                        />
                      </div>
                      <p className="text-[11px] text-[#8A7970] font-mono mt-1">
                        Paste a direct image link from Unsplash or your asset host
                      </p>
                    </div>
                  )}

                  {/* Image Preview Thumbnail */}
                  {formData.src && (
                    <div className="mt-3 relative rounded-xl overflow-hidden border border-[#E8D9CC] bg-[#2A1A12] aspect-[16/9] max-h-48 group">
                      <img
                        src={formData.src}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewImage({ src: formData.src, title: formData.title || 'Preview' })}
                          className="px-3 py-1.5 rounded-full bg-white text-[#2A1A12] text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer shadow-md"
                        >
                          View Full Size
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, src: '' }))}
                          className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer shadow-md"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Alt Text (Accessibility / SEO) */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1.5">
                    Alt Text (SEO & Accessibility)
                  </label>
                  <input
                    type="text"
                    value={formData.alt}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
                    placeholder="e.g. Solid Teak French Casement Window with Handcrafted Joinery"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
                  />
                </div>

                {/* Optional Custom Specification Fields */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowExtraFields(!showExtraFields)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#B5472B] hover:text-[#9E3B22] font-semibold cursor-pointer"
                  >
                    <Plus size={13} className={`transition-transform duration-200 ${showExtraFields ? 'rotate-45' : ''}`} />
                    <span>{showExtraFields ? 'Hide Custom Specification Fields' : '+ Add Custom Specification Fields (Wood Species, Dimensions)'}</span>
                  </button>

                  {showExtraFields && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-4 rounded-xl bg-white border border-[#E8D9CC]">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1">
                          Wood / Timber Species
                        </label>
                        <input
                          type="text"
                          value={formData.woodType || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, woodType: e.target.value }))}
                          placeholder="e.g. Reclaimed Teak / Padauk"
                          className="w-full px-3 py-2 rounded-lg bg-[#FAF6F1] border border-[#E8D9CC] text-xs text-[#2A1A12] focus:outline-none focus:ring-1 focus:ring-[#B5472B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1">
                          Dimensions / Finish
                        </label>
                        <input
                          type="text"
                          value={formData.dimensions || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                          placeholder="e.g. 8ft x 4ft / Hand-rubbed Oil"
                          className="w-full px-3 py-2 rounded-lg bg-[#FAF6F1] border border-[#E8D9CC] text-xs text-[#2A1A12] focus:outline-none focus:ring-1 focus:ring-[#B5472B]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-[#E8D9CC] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#E8D9CC] text-[#2A1A12] text-xs font-mono uppercase tracking-wider font-semibold border border-[#E8D9CC] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#B5472B] hover:bg-[#9E3B22] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    {modalMode === 'create' ? 'Save & Publish Work' : 'Update Work'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIALOG: CONFIRM DELETE WORK */}
      <AnimatePresence>
        {deleteConfirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8D9CC] shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <Trash2 size={22} />
              </div>

              <h3 className="font-heading text-xl font-semibold text-[#2A1A12] mb-2">
                Delete Carpentry Work?
              </h3>
              <p className="text-sm text-[#6B5B52] mb-6 font-body leading-relaxed">
                Are you sure you want to delete <strong className="text-[#2A1A12]">"{deleteConfirmItem.title}"</strong>? This will remove it from the public carpentry portfolio immediately.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmItem(null)}
                  className="px-4 py-2 rounded-xl bg-[#FAF6F1] hover:bg-[#E8D9CC] text-[#2A1A12] text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Yes, Delete Work
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIALOG: RESET DEFAULTS */}
      <AnimatePresence>
        {resetConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8D9CC] shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF6F1] text-[#B5472B] flex items-center justify-center mb-4 border border-[#E8D9CC]">
                <RotateCw size={22} />
              </div>

              <h3 className="font-heading text-xl font-semibold text-[#2A1A12] mb-2">
                Reset to Auroville Defaults?
              </h3>
              <p className="text-sm text-[#6B5B52] mb-6 font-body leading-relaxed">
                This will restore all default seed works for Doors & Windows, Furniture, and Wooden Interiors, and reset the hero banner. Any newly created custom works will be replaced.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF6F1] hover:bg-[#E8D9CC] text-[#2A1A12] text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-5 py-2 rounded-xl bg-[#2A1A12] hover:bg-[#B5472B] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Restore Defaults
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX PREVIEW MODAL */}
      <AnimatePresence>
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            >
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 hover:bg-[#B5472B] text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              <img
                src={previewImage.src}
                alt={previewImage.title || 'Carpentry High-Resolution Preview'}
                className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
              <div className="mt-3 text-center">
                <h4 className="font-heading text-lg font-semibold text-white">
                  {previewImage.title}
                </h4>
                {previewImage.tag && (
                  <span className="text-xs font-mono text-[#E8D9CC]/80 uppercase tracking-widest">
                    {previewImage.tag}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

/**
 * Subcomponent to edit single category details (Title, Description, Layout)
 */
function CategorySettingCard({ category, onSave }) {
  const [title, setTitle] = useState(category.title);
  const [description, setDescription] = useState(category.description);
  const [layout, setLayout] = useState(category.layout || 'grid');
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    onSave({ title, description, layout });
    setIsDirty(false);
  };

  return (
    <div className="p-5 rounded-xl bg-[#FAF6F1] border border-[#E8D9CC] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#2A1A12] text-white font-mono text-[11px] font-semibold">
            {category.number}
          </span>
          <span className="font-heading text-lg font-semibold text-[#2A1A12]">
            Category Settings: {category.title}
          </span>
        </div>

        <span className="text-xs font-mono text-[#6B5B52]">
          {category.items?.length || 0} Works Attached
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1">
            Category Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsDirty(true);
            }}
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1">
            Layout Grid Style
          </label>
          <select
            value={layout}
            onChange={(e) => {
              setLayout(e.target.value);
              setIsDirty(true);
            }}
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
          >
            <option value="bento">Bento Layout (1 Large Feature Tile + 3 Smaller)</option>
            <option value="split">Split Layout (1 Large Tall Tile + 2x2 Grid)</option>
            <option value="grid">Grid Layout (4 Equal Columns)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-[#6B5B52] font-semibold mb-1">
          Category Craft Statement / Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setIsDirty(true);
          }}
          className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8D9CC] text-sm text-[#2A1A12] focus:outline-none focus:ring-2 focus:ring-[#B5472B]"
        />
      </div>

      {isDirty && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#2A1A12] hover:bg-[#B5472B] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Save Category Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminCarpentry;
