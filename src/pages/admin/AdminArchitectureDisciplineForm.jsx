import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Palette,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  ArrowRight,
  ExternalLink,
  Check,
  Eye,
  Trash2
} from 'lucide-react';
import {
  getAlliedServiceById,
  saveAlliedService,
  readImageFileAsDataUrl,
  getArchitectureIcon,
  ARCHITECTURE_ICONS,
  getStoredArchitectureData
} from '../../services/architectureStore';

export function AdminArchitectureDisciplineForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    id: '',
    numeral: '',
    title: '',
    iconName: 'Palette',
    image: '',
    description: '',
    bullets: [],
    ctaText: 'Request Service',
    ctaLink: '/contact'
  });

  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newBulletInput, setNewBulletInput] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Load existing discipline if editing, or compute next numeral if creating
  useEffect(() => {
    if (isEditing) {
      const existing = getAlliedServiceById(id);
      if (existing) {
        const defaultMatch = DEFAULT_ARCHITECTURE_DATA.alliedServices.find(s => s.id === existing.id);
        const resolvedBullets = (Array.isArray(existing.bullets) && existing.bullets.length > 0)
          ? existing.bullets.slice(0, 3)
          : (defaultMatch?.bullets ? [...defaultMatch.bullets].slice(0, 3) : []);

        setFormData({
          id: existing.id,
          numeral: existing.numeral || '',
          title: existing.title || '',
          iconName: existing.iconName || 'Palette',
          image: existing.image || '',
          description: existing.description || '',
          bullets: resolvedBullets,
          ctaText: existing.ctaText || 'Request Service',
          ctaLink: existing.ctaLink || '/contact'
        });
      } else {
        setFormError('Discipline not found in database.');
      }
    } else {
      const current = getStoredArchitectureData();
      const count = current.alliedServices?.length || 0;
      setFormData((prev) => ({
        ...prev,
        numeral: (count + 1).toString().padStart(2, '0')
      }));
    }
  }, [id, isEditing]);

  const processImageFile = async (file) => {
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1600, 0.85);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
      setFormError('');
    } catch (err) {
      setFormError(err.message || 'Failed to process image file. Please check file format.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  const handleAddBullet = () => {
    const text = newBulletInput.trim();
    if (!text) return;
    if ((formData.bullets || []).length >= 3) {
      setFormError('Up to 3 feature bullet points can only be added.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      bullets: [...(prev.bullets || []), text].slice(0, 3)
    }));
    setNewBulletInput('');
    setFormError('');
  };

  const handleRemoveBullet = (index) => {
    setFormData((prev) => ({
      ...prev,
      bullets: prev.bullets.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Discipline title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Editorial description is required.');
      return;
    }
    if (!formData.image.trim()) {
      setFormError('Showcase image URL or uploaded photo is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      saveAlliedService({
        ...formData,
        bullets: (formData.bullets || []).slice(0, 3)
      });
      navigate('/admin/architecture?tab=allied');
    } catch (err) {
      setFormError('Failed to save discipline.');
      setIsSubmitting(false);
    }
  };

  const IconComp = getArchitectureIcon(formData.iconName);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body pb-24">
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/60">
        <div>
          <Link
            to="/admin/architecture?tab=allied"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#865430] hover:text-[#B5532F] transition-colors mb-2 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Architecture Console</span>
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Palette size={11} />
              <span>Design Discipline Editor</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              {isEditing ? `Editing #${formData.numeral || '01'}` : 'New Discipline Entry'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            {isEditing ? `Edit ${formData.title || 'Discipline'}` : 'Add New Design Discipline'}
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light max-w-2xl">
            Configure the full-width editorial showcase card, parallax photography, bullet highlights, and service inquiry link for the public Architecture page.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/architecture?tab=allied"
            className="px-4 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:bg-[#FAF7F2] text-[#524336] hover:text-[#2F1F13] text-xs font-mono uppercase tracking-wider transition-all"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            <span>{isEditing ? 'Save Changes' : 'Create Discipline'}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertTriangle size={16} className="text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* 2. FORM GRID (7 Cols Form, 5 Cols Sticky Preview) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Basic Metadata */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-4">
            <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2 border-b border-[#E5D7C5]/60 pb-3">
              <Sparkles size={16} className="text-[#B5532F]" />
              <span>Discipline Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Numeral Index
                </label>
                <input
                  type="text"
                  value={formData.numeral}
                  onChange={(e) => setFormData({ ...formData, numeral: e.target.value })}
                  placeholder="01"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:bg-white focus:border-[#B5532F] transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Discipline Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Interior Design, Landscape Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:bg-white focus:border-[#B5532F] transition-colors"
                />
              </div>
            </div>

            {/* Icon Picker Grid */}
            <div className="pt-2">
              <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-2">
                Select Discipline Icon: <span className="text-[#B5532F] font-bold">{formData.iconName}</span>
              </label>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] scrollbar-thin">
                {Object.keys(ARCHITECTURE_ICONS).map((iconKey) => {
                  const ItemComp = ARCHITECTURE_ICONS[iconKey];
                  const isSelected = formData.iconName === iconKey;
                  return (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: iconKey })}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#B5532F] text-white shadow-xs font-bold ring-2 ring-[#B5532F]/50'
                          : 'text-[#524336] hover:text-[#2F1F13] hover:bg-white border border-transparent hover:border-[#E5D7C5]'
                      }`}
                      title={iconKey}
                    >
                      <ItemComp size={16} />
                      <span className="text-[9px] truncate max-w-full font-mono">
                        {iconKey}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editorial Description */}
            <div className="pt-2">
              <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                Editorial Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Holistic spatial planning, mineral lime finishes, custom lighting, and bespoke interior styling tailored to elevate daily rituals..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:bg-white focus:border-[#B5532F] resize-y transition-colors leading-relaxed"
              />
              <span className="text-[10px] font-mono text-[#865430]/70 mt-1 block">
                Shown below the title on the public page with high editorial typography.
              </span>
            </div>
          </div>

          {/* Card 2: Showcase Photography */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-3">
              <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2">
                <Palette size={16} className="text-[#B5532F]" />
                <span>Showcase Photography *</span>
              </h2>

              <div className="flex rounded-lg bg-[#FAF7F2] p-0.5 border border-[#E5D7C5] text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    imageInputMode === 'upload' ? 'bg-[#B5532F] text-white font-bold shadow-xs' : 'text-[#524336] hover:text-[#2F1F13]'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    imageInputMode === 'url' ? 'bg-[#B5532F] text-white font-bold shadow-xs' : 'text-[#524336] hover:text-[#2F1F13]'
                  }`}
                >
                  Direct URL
                </button>
              </div>
            </div>

            {imageInputMode === 'url' ? (
              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1">
                  High-Resolution Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:bg-white focus:border-[#B5532F]"
                />
                <p className="text-[10px] font-mono text-[#865430]/70">
                  Paste a direct CDN or Unsplash photo link.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <label
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) processImageFile(file);
                  }}
                  className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer group text-center min-h-[140px] ${
                    isDragging
                      ? 'border-[#B5532F] bg-[#B5532F]/10 scale-[1.01]'
                      : 'border-[#E5D7C5] hover:border-[#B5532F] bg-[#FAF7F2] hover:bg-[#FAF7F2]/80'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E5D7C5] group-hover:border-[#B5532F] flex items-center justify-center text-[#B5532F] mb-2.5 transition-colors shadow-2xs">
                    {isUploadingImage ? (
                      <div className="w-5 h-5 border-2 border-[#B5532F] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={22} />
                    )}
                  </div>
                  <span className="text-xs font-mono uppercase font-bold text-[#2F1F13] group-hover:text-[#B5532F] transition-colors">
                    {isUploadingImage ? 'Compressing & Optimizing Image...' : 'Click or Drag Image File from Computer'}
                  </span>
                  <span className="text-[11px] text-[#865430]/70 mt-1 font-light">
                    Supports JPG, PNG, WebP (auto-optimized for web)
                  </span>
                </label>

                {/* Active Uploaded Image Indicator Card */}
                {formData.image && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Discipline Showcase"
                        className="w-14 h-10 rounded-lg object-cover border border-[#E5D7C5] shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="text-xs font-mono text-[#2F1F13] font-bold block truncate">
                          Active Showcase Photograph
                        </span>
                        <span className="text-[10px] font-mono text-[#865430] block">
                          {formData.image.startsWith('data:') ? 'Local Upload (Compressed)' : 'Web URL'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <label className="px-3 py-1.5 rounded-lg bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[11px] font-mono text-[#524336] hover:text-[#2F1F13] cursor-pointer transition-colors shadow-2xs">
                        <span>Change</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[11px] font-mono cursor-pointer transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 3: Feature Bullet Points (Max 3) */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-3">
              <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#B5532F]" />
                <span>Feature Bullet Points ({formData.bullets?.length || 0}/3)</span>
              </h2>

              <span
                className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  (formData.bullets?.length || 0) >= 3
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-[#FAF7F2] text-[#865430] border-[#E5D7C5]'
                }`}
              >
                {(formData.bullets?.length || 0) >= 3
                  ? 'Limit Reached (3 of 3)'
                  : `${3 - (formData.bullets?.length || 0)} Remaining`}
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBulletInput}
                onChange={(e) => setNewBulletInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBullet())}
                disabled={(formData.bullets?.length || 0) >= 3}
                placeholder={
                  (formData.bullets?.length || 0) >= 3
                    ? 'Maximum 3 points reached (delete a point below to change)'
                    : 'e.g. Space Planning & Flow, Custom Lighting...'
                }
                className={`flex-1 px-3.5 py-2.5 rounded-xl border text-[#2F1F13] text-xs transition-colors ${
                  (formData.bullets?.length || 0) >= 3
                    ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500 placeholder-gray-400'
                    : 'bg-[#FAF7F2] border-[#E5D7C5] focus:bg-white focus:border-[#B5532F]'
                }`}
              />
              <button
                type="button"
                onClick={handleAddBullet}
                disabled={(formData.bullets?.length || 0) >= 3 || !newBulletInput.trim()}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all ${
                  (formData.bullets?.length || 0) >= 3 || !newBulletInput.trim()
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed opacity-60'
                    : 'bg-[#FAF7F2] hover:bg-[#E5D7C5] text-[#2F1F13] border border-[#E5D7C5] cursor-pointer active:scale-95'
                }`}
              >
                <Plus size={14} className={(formData.bullets?.length || 0) >= 3 ? 'text-gray-400' : 'text-[#B5532F]'} />
                <span>Add Bullet</span>
              </button>
            </div>

            {/* Helper Notice */}
            <p className="text-[11px] font-mono text-[#865430]/80">
              {(formData.bullets?.length || 0) >= 3
                ? '✓ Up to 3 points limit reached. Delete any point below to add or edit.'
                : 'Note: Up to 3 points can only be added for this discipline showcase.'}
            </p>

            {/* Bullets List */}
            <div className="flex flex-col gap-2 pt-1">
              {formData.bullets && formData.bullets.length > 0 ? (
                formData.bullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#B5532F]/10 text-[#B5532F] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="font-medium">{bullet}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBullet(idx)}
                      className="p-1 rounded-lg text-[#865430]/70 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove bullet"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-[#865430]/60 italic font-light">
                  No bullet points added yet. Type above and click &ldquo;Add Bullet&rdquo; (maximum 3 points).
                </span>
              )}
            </div>
          </div>

          {/* Card 4: Action Button & Destination Link */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-4">
            <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2 border-b border-[#E5D7C5]/60 pb-3">
              <ArrowRight size={16} className="text-[#B5532F]" />
              <span>Inquiry Action Button</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Button Text Label
                </label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  placeholder="Request Service"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs focus:bg-white focus:border-[#B5532F]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Target Route / URL
                </label>
                <input
                  type="text"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                  placeholder="/contact"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:bg-white focus:border-[#B5532F]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save & Cancel */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/admin/architecture?tab=allied"
              className="px-5 py-2.5 rounded-xl bg-white border border-[#E5D7C5] hover:bg-[#FAF7F2] text-[#524336] hover:text-[#2F1F13] text-xs font-mono uppercase tracking-wider"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              <span>{isEditing ? 'Save Changes' : 'Create Discipline'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Live Sticky Card Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="sticky top-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-[#865430] tracking-wider font-semibold flex items-center gap-1.5">
                <Eye size={13} className="text-[#B5532F]" />
                <span>Live Editorial Preview</span>
              </span>
              <span className="text-[10px] font-mono text-[#524336]/60">
                Front-end Replica
              </span>
            </div>

            {/* Simulated Architecture Page Service Card */}
            <div className="p-6 rounded-2xl bg-[#FAF6F1] border border-[#E8D9CC] shadow-md space-y-5">
              
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#E8D9CC] shadow-sm">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#6B5B52]">
                    <div className="w-12 h-12 rounded-full bg-white/80 shadow flex items-center justify-center text-[#B5472B] mb-2">
                      <IconComp size={20} />
                    </div>
                    <span className="font-heading text-sm font-semibold text-[#2A1A12]">
                      {formData.title || 'Discipline Showcase'}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[#B5472B] mt-0.5">
                      Photo Preview
                    </span>
                  </div>
                )}

                {/* Floating Icon Badge */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-white/95 text-[#B5472B] flex items-center justify-center shadow">
                  <IconComp size={15} />
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-3">
                <div className="font-heading font-bold text-4xl leading-none text-transparent select-none"
                  style={{
                    WebkitTextStroke: '1px rgba(181, 71, 43, 0.45)',
                    fontVariantNumeric: 'lining-nums'
                  }}
                >
                  {formData.numeral || '01'}
                </div>

                <h3 className="font-heading text-xl font-bold text-[#2A1A12]">
                  {formData.title || 'Untitled Discipline'}
                </h3>

                <p className="font-body text-xs text-[#6B5B52] leading-relaxed line-clamp-3 font-light">
                  {formData.description || 'Editorial description will appear here...'}
                </p>

                {formData.bullets && formData.bullets.length > 0 && (
                  <ul className="space-y-1.5 pt-1 text-xs text-[#2A1A12]">
                    {formData.bullets.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#B5472B]/10 text-[#B5472B] flex items-center justify-center shrink-0">
                          <Check size={9} className="stroke-[3]" />
                        </span>
                        <span className="font-light">{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="pt-2 border-t border-[#E8D9CC]">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B5472B] text-[#B5472B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                    <span>{formData.ctaText || 'Request Service'}</span>
                    <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-[#E5D7C5] text-[11px] text-[#524336] leading-relaxed">
              💡 <strong>Tip:</strong> Bullet points help prospective clients quickly scan the scope of this discipline (e.g., Space Planning, Custom Joinery).
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

export default AdminArchitectureDisciplineForm;
