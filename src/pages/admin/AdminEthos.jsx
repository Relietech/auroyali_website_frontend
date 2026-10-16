import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Save,
  RotateCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Trees,
  Compass,
  Layers,
  Image as ImageIcon,
  Quote,
  LayoutGrid,
  Link as LinkIcon,
  Eye,
  Info,
  Type,
  Upload,
  Trash2,
  Plus,
  X,
  Check,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getStoredEthosData,
  saveEthosData,
  resetEthosToDefault,
  subscribeToEthos,
  readImageFileAsDataUrl,
  DEFAULT_ETHOS_DATA
} from '../../services/ethosStore';

const ICON_OPTIONS = [
  { id: 'sun', label: 'Sun (Bioclimatic / Solar)', icon: Sun },
  { id: 'trees', label: 'Trees (Regenerative Timber)', icon: Trees },
  { id: 'compass', label: 'Compass (Vernacular Design)', icon: Compass },
  { id: 'layers', label: 'Layers (Material Studio & CSEB)', icon: Layers },
  { id: 'sparkles', label: 'Sparkles (Auroville Ethos)', icon: Sparkles }
];

export function AdminEthos() {
  const [formData, setFormData] = useState(() => getStoredEthosData());
  const [activeTab, setActiveTab] = useState('narrative'); // 'narrative' | 'visuals' | 'cards' | 'actions'
  const [toast, setToast] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [previewActiveImg, setPreviewActiveImg] = useState(0);

  // Image Upload state for 2 showcase items
  const [uploadingImgIndex, setUploadingImgIndex] = useState(null);
  const [imgInputModes, setImgInputModes] = useState(['url', 'url']);
  const fileInputRefs = [useRef(null), useRef(null)];

  // Sync with store updates
  useEffect(() => {
    const unsub = subscribeToEthos((updated) => {
      setFormData(updated);
    });
    return () => unsub();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (!formData.heading?.title?.trim()) {
      showToast('Heading title cannot be empty', 'error');
      return;
    }
    saveEthosData(formData);
    showToast('Auroville Ethos synchronized and saved successfully!');
  };

  const handleReset = () => {
    const fresh = resetEthosToDefault();
    setFormData(fresh);
    setShowResetModal(false);
    showToast('Restored original Auroville Ethos defaults', 'warning');
  };

  const updateHeading = (field, value) => {
    setFormData(prev => ({
      ...prev,
      heading: {
        ...prev.heading,
        [field]: value
      }
    }));
  };

  const updateImage = (index, field, value) => {
    setFormData(prev => {
      const newImages = [...prev.showcaseImages];
      newImages[index] = {
        ...newImages[index],
        [field]: value
      };
      return { ...prev, showcaseImages: newImages };
    });
  };

  const handleImageFileUpload = async (index, file) => {
    if (!file) return;
    try {
      setUploadingImgIndex(index);
      const dataUrl = await readImageFileAsDataUrl(file, 1600, 0.85);
      updateImage(index, 'src', dataUrl);
      showToast(`Showcase visual ${index + 1} updated`);
    } catch (err) {
      showToast(err.message || 'Failed to upload image', 'error');
    } finally {
      setUploadingImgIndex(null);
    }
  };

  const handleDeleteImage = (index) => {
    updateImage(index, 'src', '');
    showToast(`Showcase visual ${index + 1} deleted`, 'warning');
  };

  const updateCard = (index, field, value) => {
    setFormData(prev => {
      const newCards = [...prev.cards];
      newCards[index] = {
        ...newCards[index],
        [field]: value
      };
      return { ...prev, cards: newCards };
    });
  };

  const handleUpdateCardPill = (cardIdx, pillIdx, value) => {
    setFormData(prev => {
      const newCards = [...prev.cards];
      const currentPills = [...(newCards[cardIdx].pills || [])];
      currentPills[pillIdx] = value;
      // Strictly maintain maximum 2 points
      newCards[cardIdx] = {
        ...newCards[cardIdx],
        pills: [currentPills[0] || '', currentPills[1] || '']
      };
      return { ...prev, cards: newCards };
    });
  };

  const updateActions = (field, value) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions,
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'narrative', label: '1. Narrative & Intro', icon: Type },
    { id: 'visuals', label: '2. Visual Showcase & Quotes', icon: ImageIcon },
    { id: 'cards', label: '3. Ethos Feature Cards', icon: LayoutGrid },
    { id: 'actions', label: '4. Call To Actions', icon: LinkIcon },
  ];

  const currentImg = formData.showcaseImages?.[previewActiveImg] || DEFAULT_ETHOS_DATA.showcaseImages[0];
  const thumbImg = formData.showcaseImages?.[previewActiveImg === 0 ? 1 : 0] || DEFAULT_ETHOS_DATA.showcaseImages[1];

  const renderIconComponent = (iconId) => {
    switch (iconId) {
      case 'trees': return <Trees size={16} />;
      case 'compass': return <Compass size={16} />;
      case 'layers': return <Layers size={16} />;
      case 'sparkles': return <Sparkles size={16} />;
      case 'sun':
      default:
        return <Sun size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 select-none font-body">
      
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

      {/* 1. PAGE HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/70">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles size={11} />
              <span>Homepage Narrative Manager</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/60">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              Philosophy & Veranda Synthesis
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            The Auroville Ethos
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light max-w-2xl leading-relaxed">
            Curate the front-page philosophy narrative, interactive photography showcase with quote overlays, bioclimatic and regenerative timber pillar cards, and button targets.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95"
            title="View current live homepage"
          >
            <Eye size={14} className="text-[#865430]" />
            <span>Live Homepage</span>
            <ExternalLink size={12} className="text-[#865430]/60" />
          </Link>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#865430] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Reset to factory defaults"
          >
            <RotateCw size={13} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Save size={14} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* 2. FULL-WIDTH HORIZONTAL TAB PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5D7C5]/60 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#2F1F13] text-white shadow-xs font-bold border-transparent'
                  : 'bg-white text-[#524336] hover:text-[#2F1F13] hover:bg-[#FAF7F2] border border-[#E5D7C5]'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#C98A4B]' : 'text-[#865430]/70'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TWO-COLUMN LAYOUT: FORM EDITOR (LEFT) & LIVE SIMULATION (RIGHT) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Editor (7 cols) */}
        <div className="xl:col-span-7 space-y-6">

          {/* TAB 1: Narrative & Intro */}
          {activeTab === 'narrative' && (
            <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#2F1F13] flex items-center gap-2">
                    <Type size={18} className="text-[#B5532F]" />
                    <span>Section Narrative & Headings</span>
                  </h2>
                  <p className="text-xs text-[#524336] mt-0.5 font-light">
                    Controls the primary section title, eyebrow tag, and foundational mission statement.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                      Eyebrow Tag
                    </label>
                    <button
                      type="button"
                      onClick={() => updateHeading('tag', 'The Auroville Ethos')}
                      className="text-[10px] font-mono text-[#B5532F] hover:underline cursor-pointer"
                    >
                      Use default
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.heading?.tag || ''}
                    onChange={(e) => updateHeading('tag', e.target.value)}
                    placeholder="e.g. The Auroville Ethos"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5D7C5] bg-white text-sm text-[#2F1F13] placeholder:text-[#865430]/40 focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F] transition-all shadow-2xs font-medium"
                  />
                  <p className="text-[11px] text-[#865430] mt-1 font-light">
                    Renders in a terracotta tag pill above the main title.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                      Main Heading Title
                    </label>
                    <span className="text-[10px] font-mono text-[#865430]">
                      {(formData.heading?.title || '').length} characters
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.heading?.title || ''}
                    onChange={(e) => updateHeading('title', e.target.value)}
                    placeholder="A conscious synthesis of vernacular wisdom and contemporary engineering."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5D7C5] bg-white text-base font-heading font-semibold text-[#2F1F13] placeholder:text-[#865430]/40 focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F] transition-all shadow-2xs"
                  />
                  <p className="text-[11px] text-[#865430] mt-1 font-light">
                    The bold visual hero statement for the ethos section.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                      Subtitle / Narrative Lead
                    </label>
                    <span className="text-[10px] font-mono text-[#865430]">
                      {(formData.heading?.subtitle || '').length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={formData.heading?.subtitle || ''}
                    onChange={(e) => updateHeading('subtitle', e.target.value)}
                    placeholder="Founded in 2012 in the international township of Auroville..."
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E5D7C5] bg-white text-sm text-[#524336] leading-relaxed placeholder:text-[#865430]/40 focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F] transition-all shadow-2xs"
                  />
                  <p className="text-[11px] text-[#865430] mt-1 font-light">
                    A comprehensive narrative explaining AuroYali's roots, earth architecture, and contemporary lineage.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: Visual Showcase & Quotes */}
          {activeTab === 'visuals' && (
            <section className="space-y-6">
              {(formData.showcaseImages || []).map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-[#B5532F]/10 text-[#B5532F] font-mono text-xs flex items-center justify-center font-bold">
                        0{idx + 1}
                      </span>
                      <div>
                        <h3 className="font-heading text-base font-bold text-[#2F1F13]">
                          {idx === 0 ? 'Showcase 01: Vernacular Architecture' : 'Showcase 02: Material Craft & CSEB'}
                        </h3>
                        <span className="text-[10px] font-mono text-[#865430]">
                          {idx === 0 ? 'Default Frame Image' : 'Interactive Floating Thumbnail'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateImage(idx, 'src', DEFAULT_ETHOS_DATA.showcaseImages[idx]?.src)}
                      className="text-[10px] font-mono text-[#B5532F] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCw size={10} />
                      <span>Default Photo</span>
                    </button>
                  </div>

                  {/* Image Preview & Input Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                    
                    {/* Visual Preview Box */}
                    <div className="sm:col-span-4 relative rounded-xl overflow-hidden bg-[#1B140E] aspect-4/3 border-2 border-[#E5D7C5] shadow-xs group flex items-center justify-center">
                      {img.src ? (
                        <>
                          <img
                            src={img.src}
                            alt={img.alt || 'Preview'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 flex flex-col justify-between p-2.5">
                            <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleDeleteImage(idx)}
                                className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white shadow-md cursor-pointer transition-all active:scale-90"
                                title="Delete this photo"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#C98A4B] truncate">
                              {img.tag || 'Preview'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#865430]/60 p-4 text-center">
                          <ImageIcon size={26} className="mb-1 text-[#865430]/40" />
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FAF7F2]/60">No Photo</span>
                          <button
                            type="button"
                            onClick={() => updateImage(idx, 'src', DEFAULT_ETHOS_DATA.showcaseImages[idx]?.src)}
                            className="mt-1.5 text-[9px] font-mono text-[#C98A4B] hover:underline cursor-pointer"
                          >
                            + Restore Default
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="sm:col-span-8 space-y-4">
                      
                      {/* Upload / URL Mode Switcher */}
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                          Image Source
                        </label>
                        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#FAF7F2] border border-[#E5D7C5]">
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...imgInputModes];
                              copy[idx] = 'url';
                              setImgInputModes(copy);
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider cursor-pointer ${
                              imgInputModes[idx] === 'url' ? 'bg-[#2F1F13] text-white font-bold' : 'text-[#865430]'
                            }`}
                          >
                            URL Link
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...imgInputModes];
                              copy[idx] = 'upload';
                              setImgInputModes(copy);
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider cursor-pointer ${
                              imgInputModes[idx] === 'upload' ? 'bg-[#2F1F13] text-white font-bold' : 'text-[#865430]'
                            }`}
                          >
                            Upload File
                          </button>
                        </div>
                      </div>

                      {imgInputModes[idx] === 'url' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            value={img.src || ''}
                            onChange={(e) => updateImage(idx, 'src', e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="flex-1 px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-white text-xs font-mono text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                          />
                          {img.src && (
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(idx)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer transition-colors shrink-0 shadow-2xs"
                              title="Delete current image URL"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRefs[idx]}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(idx, e.target.files?.[0])}
                            className="hidden"
                          />
                          <button
                            type="button"
                            disabled={uploadingImgIndex === idx}
                            onClick={() => fileInputRefs[idx].current?.click()}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[#B5532F]/50 hover:border-[#B5532F] bg-[#FAF7F2] hover:bg-[#F3EBE0] text-[#B5532F] text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer transition-colors"
                          >
                            <Upload size={14} />
                            <span>
                              {uploadingImgIndex === idx
                                ? 'Processing...'
                                : img.src
                                ? 'Replace Device Photo'
                                : 'Select Device Photo'}
                            </span>
                          </button>

                          {img.src && (
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(idx)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer transition-colors shrink-0 shadow-2xs"
                              title="Delete current uploaded photo"
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1">
                            Tag Eyebrow
                          </label>
                          <input
                            type="text"
                            value={img.tag || ''}
                            onChange={(e) => updateImage(idx, 'tag', e.target.value)}
                            placeholder="e.g. Our Philosophy"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5D7C5] bg-white text-xs font-mono text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1">
                            Alt Text
                          </label>
                          <input
                            type="text"
                            value={img.alt || ''}
                            onChange={(e) => updateImage(idx, 'alt', e.target.value)}
                            placeholder="e.g. Earth Architecture"
                            className="w-full px-3 py-1.5 rounded-lg border border-[#E5D7C5] bg-white text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Philosophy Quote */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1.5">
                      Philosophical Quote Overlay
                    </label>
                    <textarea
                      rows={2}
                      value={img.quote || ''}
                      onChange={(e) => updateImage(idx, 'quote', e.target.value)}
                      placeholder='"Architecture is not an imposition on nature, but a quiet conversation with sun, wind, and soil."'
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E5D7C5] bg-white text-sm italic font-heading text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F] shadow-2xs"
                    />
                    <p className="text-[11px] text-[#865430] mt-1 font-light">
                      Rendered in elegant editorial italic font over the lower gradient of the photo showcase.
                    </p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* TAB 3: Ethos Feature Cards */}
          {activeTab === 'cards' && (
            <section className="space-y-6">
              {(formData.cards || []).map((card, idx) => (
                <div
                  key={card.id || idx}
                  className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                        idx === 0 ? 'bg-[#B5532F]/15 text-[#B5532F]' : 'bg-[#7A8B69]/20 text-[#4D5E3B]'
                      }`}>
                        {renderIconComponent(card.iconType || (idx === 0 ? 'sun' : 'trees'))}
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-bold text-[#2F1F13]">
                          Pillar Card 0{idx + 1}: {card.title || 'Feature Card'}
                        </h3>
                        <span className="text-[10px] font-mono text-[#865430]">
                          {idx === 0 ? 'Bioclimatic Engineering Theme' : 'Regenerative Forestry Theme'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#865430] px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E5D7C5]">
                      {card.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1.5">
                        Card Badge
                      </label>
                      <input
                        type="text"
                        value={card.badge || ''}
                        onChange={(e) => updateCard(idx, 'badge', e.target.value)}
                        placeholder="e.g. 01 / THERMAL"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-white text-xs font-mono font-bold text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1.5">
                        Pillar Icon
                      </label>
                      <select
                        value={card.iconType || (idx === 0 ? 'sun' : 'trees')}
                        onChange={(e) => updateCard(idx, 'iconType', e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-white text-xs font-mono text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1.5">
                        Pillar Title
                      </label>
                      <input
                        type="text"
                        value={card.title || ''}
                        onChange={(e) => updateCard(idx, 'title', e.target.value)}
                        placeholder="e.g. Bioclimatic Engineering"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-white text-sm font-heading font-bold text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1.5">
                        Subtitle Subhead
                      </label>
                      <input
                        type="text"
                        value={card.subtitle || ''}
                        onChange={(e) => updateCard(idx, 'subtitle', e.target.value)}
                        placeholder="e.g. Passive Thermal Regulation"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-white text-xs font-mono text-[#B5532F] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={card.description || ''}
                        onChange={(e) => updateCard(idx, 'description', e.target.value)}
                        placeholder="Describe the architectural and environmental methodology..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-white text-xs text-[#524336] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                      />
                    </div>

                    {/* Capability Points - Strictly Limited to Only 2 Points */}
                    <div className="sm:col-span-2 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                          Capability Points (Only Two Points Allowed)
                        </label>
                        <span className="text-[10px] font-mono text-[#865430]">
                          {(card.pills || []).filter(Boolean).length} / 2 Points
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Point 1 */}
                        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase font-bold text-[#B5532F]">
                              Point 01
                            </span>
                            {card.pills?.[0] && (
                              <button
                                type="button"
                                onClick={() => handleUpdateCardPill(idx, 0, '')}
                                className="text-[10px] font-mono text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                                title="Clear Point 01"
                              >
                                <Trash2 size={11} />
                                <span>Clear</span>
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={card.pills?.[0] || ''}
                            onChange={(e) => handleUpdateCardPill(idx, 0, e.target.value)}
                            placeholder={idx === 0 ? 'e.g. Passive Ventilation' : 'e.g. Borate Bamboo'}
                            className="w-full px-3 py-2 rounded-lg border border-[#E5D7C5] bg-white text-xs font-mono font-medium text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                          />
                        </div>

                        {/* Point 2 */}
                        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase font-bold text-[#B5532F]">
                              Point 02
                            </span>
                            {card.pills?.[1] && (
                              <button
                                type="button"
                                onClick={() => handleUpdateCardPill(idx, 1, '')}
                                className="text-[10px] font-mono text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                                title="Clear Point 02"
                              >
                                <Trash2 size={11} />
                                <span>Clear</span>
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={card.pills?.[1] || ''}
                            onChange={(e) => handleUpdateCardPill(idx, 1, e.target.value)}
                            placeholder={idx === 0 ? 'e.g. Zero-HVAC' : 'e.g. Reclaimed Wood'}
                            className="w-full px-3 py-2 rounded-lg border border-[#E5D7C5] bg-white text-xs font-mono font-medium text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* TAB 4: Call To Actions */}
          {activeTab === 'actions' && (
            <section className="bg-white rounded-2xl border border-[#E5D7C5] p-5 sm:p-7 shadow-xs space-y-6">
              <div className="border-b border-[#E5D7C5]/60 pb-3">
                <h2 className="font-heading text-lg font-bold text-[#2F1F13] flex items-center gap-2">
                  <LinkIcon size={18} className="text-[#B5532F]" />
                  <span>Call-to-Action Buttons</span>
                </h2>
                <p className="text-xs text-[#524336] mt-0.5 font-light">
                  Direct visitor engagement by configuring the primary story link and secondary offering button.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Primary Button */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#B5532F] font-bold">
                      Primary CTA (Clay)
                    </span>
                    <span className="text-[10px] font-mono text-[#865430]">High Emphasis</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.actions?.primaryText || ''}
                      onChange={(e) => updateActions('primaryText', e.target.value)}
                      placeholder="Read Our Full Story"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-white text-xs font-semibold text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                    />
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-[#865430] uppercase block mb-1.5">
                      Button Preview
                    </span>
                    <div className="inline-block px-5 py-2.5 rounded-xl bg-[#B5532F] text-white text-xs font-mono uppercase tracking-wider font-bold shadow-xs">
                      {formData.actions?.primaryText || 'Read Our Full Story'}
                    </div>
                  </div>
                </div>

                {/* Secondary Button */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#524336] font-bold">
                      Secondary CTA (Earth Soft)
                    </span>
                    <span className="text-[10px] font-mono text-[#865430]">Subtle Action</span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.actions?.secondaryText || ''}
                      onChange={(e) => updateActions('secondaryText', e.target.value)}
                      placeholder="Explore Workshops"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-white text-xs font-semibold text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/20 focus:border-[#B5532F]"
                    />
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-[#865430] uppercase block mb-1.5">
                      Button Preview
                    </span>
                    <div className="inline-block px-5 py-2.5 rounded-xl bg-[#E5D7C5] text-[#2F1F13] border border-[#D4C3AD] text-xs font-mono uppercase tracking-wider font-bold shadow-xs">
                      {formData.actions?.secondaryText || 'Explore Workshops'}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs">
            <span className="text-xs font-mono text-[#865430]">
              All edits sync across all visitor sessions.
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="px-3.5 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase tracking-wider text-[#865430] hover:text-[#B5532F] bg-white hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white text-xs font-mono uppercase tracking-wider font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <Save size={14} />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Live Simulation (5 cols) */}
        <div className="xl:col-span-5 sticky top-24 space-y-3">
          
          {/* Simulation Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7A8B69] animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#2F1F13] font-bold">
                Live Visitor Simulation
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#865430]">
              Interactive Simulation
            </span>
          </div>

          {/* Browser / Viewport Mockup Container */}
          <div className="rounded-3xl bg-[#FAF7F2] border border-[#E5D7C5] shadow-lg overflow-hidden transition-all duration-300">
            
            {/* Viewport Top Window Bar */}
            <div className="px-4 py-2.5 bg-white border-b border-[#E5D7C5] flex items-center justify-between text-[11px] font-mono text-[#865430]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5D7C5]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5D7C5]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5D7C5]" />
              </div>
              <span className="text-[10px] text-[#524336] font-semibold truncate max-w-[200px]">
                auroyali.com / homepage
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5]">
                Live Preview
              </span>
            </div>

            {/* Simulated Homepage Section Body */}
            <div className="p-4 sm:p-5 space-y-5 bg-gradient-to-b from-[#FAF7F2] via-white/80 to-[#FAF7F2]">
              <div className="space-y-4">
                
                {/* Eyebrow & Title */}
                <div className="space-y-1">
                  <span className="inline-block text-[9.5px] font-mono uppercase tracking-widest text-[#B5532F] font-bold px-2 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20">
                    {formData.heading?.tag || 'The Auroville Ethos'}
                  </span>
                  <h3 className="font-heading text-base font-bold text-[#1B140E] leading-snug">
                    {formData.heading?.title}
                  </h3>
                  <p className="text-[11px] text-[#524336] font-light leading-relaxed line-clamp-2">
                    {formData.heading?.subtitle}
                  </p>
                </div>

                {/* Interactive Showcase Frame with Floating Switcher */}
                <div className="relative rounded-2xl overflow-hidden bg-[#1B140E] aspect-16/10 border-2 border-white shadow-md group">
                  <img
                    src={currentImg?.src || DEFAULT_ETHOS_DATA.showcaseImages[previewActiveImg]?.src}
                    alt={currentImg?.alt || ''}
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[9px] uppercase tracking-widest text-[#C98A4B] font-mono font-bold block mb-0.5">
                      {currentImg?.tag}
                    </span>
                    <p className="font-heading text-xs italic font-light line-clamp-2 leading-tight">
                      {currentImg?.quote}
                    </p>
                  </div>

                  {/* Floating Interactive Switcher Thumbnail */}
                  <div
                    onClick={() => setPreviewActiveImg(prev => (prev === 0 ? 1 : 0))}
                    className="absolute top-2.5 right-2.5 w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    title="Click to toggle showcase image"
                  >
                    <img
                      src={thumbImg?.src || DEFAULT_ETHOS_DATA.showcaseImages[previewActiveImg === 0 ? 1 : 0]?.src}
                      alt={thumbImg?.alt || ''}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Two Feature Pillar Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {(formData.cards || []).map((card, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3.5 rounded-2xl bg-white border border-[#E5D7C5] shadow-2xs space-y-2 hover:border-[#B5532F]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                          cIdx === 0 ? 'bg-[#B5532F]/15 text-[#B5532F]' : 'bg-[#7A8B69]/20 text-[#4D5E3B]'
                        }`}>
                          {renderIconComponent(card.iconType || (cIdx === 0 ? 'sun' : 'trees'))}
                        </div>
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] text-[#524336] font-semibold">
                          {card.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-heading font-bold text-[#1B140E] truncate">
                          {card.title}
                        </h4>
                        <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#865430] block truncate">
                          {card.subtitle}
                        </span>
                      </div>

                      <p className="text-[10px] text-[#524336] font-light leading-relaxed line-clamp-2">
                        {card.description}
                      </p>

                      {card.pills && card.pills.filter(Boolean).length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1 border-t border-[#FAF7F2]">
                          {card.pills.filter(Boolean).slice(0, 2).map((pill, pIdx) => (
                            <span key={pIdx} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#1B140E] border border-[#E5D7C5]">
                              {pill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="flex-1 text-center py-2 rounded-xl bg-[#B5532F] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs truncate">
                    {formData.actions?.primaryText || 'Read Our Full Story'}
                  </span>
                  <span className="flex-1 text-center py-2 rounded-xl bg-[#E5D7C5] text-[#2F1F13] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#D4C3AD] truncate">
                    {formData.actions?.secondaryText || 'Explore Workshops'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#E5D7C5] shadow-2xl space-y-4"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-[#2F1F13]">
                  Restore Factory Ethos Defaults?
                </h3>
                <p className="text-xs text-[#524336] mt-1 leading-relaxed">
                  This will discard your custom texts, image URLs, and button configurations, resetting them back to the original Auroville Ethos defaults.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase tracking-wider text-[#524336] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 cursor-pointer"
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

export default AdminEthos;
