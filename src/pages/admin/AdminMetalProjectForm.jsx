import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Images,
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
  Trash2,
  RotateCw,
  MapPin,
  Calendar,
  Layers,
  Shield
} from 'lucide-react';
import {
  getGalleryProjectById,
  saveGalleryProject,
  readImageFileAsDataUrl,
  getMetalIcon,
  METAL_ICONS,
  getStoredMetalData
} from '../../services/metalStore';

export function AdminMetalProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
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
  });

  const [categoriesList, setCategoriesList] = useState(['Gates', 'Railings', 'Roofs', 'Doors', 'Furniture', 'Structural']);
  const [imageInputMode, setImageInputMode] = useState('upload'); // 'upload' | 'url'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Load existing project if editing, or initialize categories
  useEffect(() => {
    const stored = getStoredMetalData();
    const existingCategories = (stored.gallerySection?.categories || [])
      .filter(c => c !== 'All');
    if (existingCategories.length > 0) {
      setCategoriesList(existingCategories);
    }

    if (isEditing) {
      const existing = getGalleryProjectById(id);
      if (existing) {
        setFormData({
          id: existing.id,
          title: existing.title || '',
          category: existing.category || 'Gates',
          location: existing.location || '',
          year: existing.year || '',
          image: existing.image || '',
          alt: existing.alt || existing.title || '',
          materials: existing.materials || '',
          desc: existing.desc || '',
          iconName: existing.iconName || 'Shield',
          featured: Boolean(existing.featured)
        });
      } else {
        setFormError('Project not found in the metal database.');
      }
    }
  }, [id, isEditing]);

  const processImageFile = async (file) => {
    if (!file) return;
    try {
      setIsUploadingImage(true);
      const dataUrl = await readImageFileAsDataUrl(file, 1600, 0.85);
      setFormData((prev) => ({
        ...prev,
        image: dataUrl,
        alt: prev.alt || prev.title || 'Architectural Metal Project'
      }));
      setFormError('');
    } catch (err) {
      setFormError(err.message || 'Failed to process image file. Please check format.');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Project title is required.');
      return;
    }
    if (!formData.category.trim()) {
      setFormError('Please select a project category.');
      return;
    }
    if (!formData.image.trim()) {
      setFormError('Project photograph is required. Please upload or provide a photo URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      saveGalleryProject({
        ...formData,
        alt: formData.alt || formData.title
      });
      navigate('/admin/metal-fabrication?tab=gallery');
    } catch (err) {
      setFormError('Failed to save project. Please check database permissions.');
      setIsSubmitting(false);
    }
  };

  const IconComp = getMetalIcon(formData.iconName);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body pb-24">
      
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]">
        <div>
          <Link
            to="/admin/metal-fabrication?tab=gallery"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#7A4E38] hover:text-[#B5532F] transition-colors mb-2 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Metal Fabrication Console</span>
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Images size={11} />
              <span>Project Gallery Editor</span>
            </span>
            <span className="text-xs font-mono text-[#8C939A]">•</span>
            <span className="text-xs font-mono text-[#7A4E38]">
              {isEditing ? `Editing "${formData.title || 'Project'}"` : 'New Portfolio Entry'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#2F1F13] tracking-tight">
            {isEditing ? `Edit ${formData.title || 'Project'}` : 'Add New Gallery Project'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E55] mt-0.5 font-light max-w-2xl">
            Fill in architectural specifications, category tags, materials used, and upload high-resolution metalcraft photos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/metal-fabrication?tab=gallery"
            className="px-4 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:bg-[#FAF7F2] text-[#6B5E55] hover:text-[#2F1F13] text-xs font-mono uppercase tracking-wider transition-all"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            <span>{isEditing ? 'Save Changes' : 'Publish Project'}</span>
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

      {/* 2. MAIN FORM GRID: 7 COLS FORM, 5 COLS STICKY PREVIEW */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Card 1: Project Metadata */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-4">
            <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2 border-b border-[#E5D7C5] pb-3">
              <Sparkles size={16} className="text-[#B5532F]" />
              <span>Project Information</span>
            </h2>

            {/* Title */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#7A4E38] tracking-wider font-semibold mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Alain Residence Architectural Compound Pivot Portal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:bg-white focus:border-[#B5532F] focus:ring-1 focus:ring-[#B5532F] transition-colors outline-none"
                required
              />
            </div>

            {/* Category, Location, Year */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7A4E38] tracking-wider font-semibold mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:bg-white focus:border-[#B5532F] transition-colors outline-none"
                  required
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7A4E38] tracking-wider font-semibold mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Auroville"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs focus:bg-white focus:border-[#B5532F] transition-colors outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7A4E38] tracking-wider font-semibold mb-1.5">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:bg-white focus:border-[#B5532F] transition-colors outline-none"
                />
              </div>
            </div>

            {/* Materials Specification */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#7A4E38] tracking-wider font-semibold mb-1.5">
                Materials Specification
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                placeholder="e.g. Heavy Mild Steel, Zinc Undercoat, Weatherproof PU"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs focus:bg-white focus:border-[#B5532F] transition-colors outline-none"
              />
              <p className="text-[10px] text-[#6B5E55] mt-1 font-mono">
                Appears as a technical materials subtitle on cards and in the modal lightbox.
              </p>
            </div>

            {/* Bento Featured Toggle */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5]">
              <input
                type="checkbox"
                id="featured-bento"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-[#B5532F] accent-[#B5532F] cursor-pointer"
              />
              <label htmlFor="featured-bento" className="text-xs text-[#2F1F13] cursor-pointer">
                <strong>Feature in Bento Grid (2x2 Span):</strong> Makes this project card span 2 columns and 2 rows on desktop for prominent portfolio emphasis.
              </label>
            </div>
          </div>

          {/* Card 2: Narrative Description */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-4">
            <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2 border-b border-[#E5D7C5] pb-3">
              <Layers size={16} className="text-[#B5532F]" />
              <span>Project Description & Specifications</span>
            </h2>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#7A4E38] tracking-wider font-semibold mb-1.5">
                Detailed Narrative
              </label>
              <textarea
                rows={4}
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Monumental 3.8m high compound pivot entrance gate with concealed bearing pivot and integrated smart access automation..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs leading-relaxed focus:bg-white focus:border-[#B5532F] focus:ring-1 focus:ring-[#B5532F] transition-colors outline-none"
              />
            </div>
          </div>

          {/* Card 3: Project Photograph with Native Upload & Delete */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
              <div>
                <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2">
                  <Upload size={16} className="text-[#B5532F]" />
                  <span>Project Photograph *</span>
                </h2>
                <p className="text-[11px] text-[#6B5E55] mt-0.5">High-resolution image rendered in masonry grid and modal lightbox.</p>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5D7C5]">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    imageInputMode === 'upload' ? 'bg-[#B5532F] text-white font-bold shadow-2xs' : 'text-[#6B5E55] hover:text-[#2F1F13]'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    imageInputMode === 'url' ? 'bg-[#B5532F] text-white font-bold shadow-2xs' : 'text-[#6B5E55] hover:text-[#2F1F13]'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {imageInputMode === 'upload' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processImageFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#B5532F] bg-[#B5532F]/5'
                    : 'border-[#E5D7C5] bg-[#FAF7F2] hover:bg-white hover:border-[#B5532F]/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-white border border-[#E5D7C5] text-[#B5532F] mx-auto flex items-center justify-center mb-2 shadow-2xs">
                  {isUploadingImage ? <RotateCw size={20} className="animate-spin" /> : <Upload size={20} />}
                </div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#2F1F13] font-bold">
                  {isUploadingImage ? 'Compressing & Optimizing Photo...' : 'Click or Drag & Drop Project Photo'}
                </p>
                <p className="text-[11px] text-[#6B5E55] mt-1 font-light">
                  Supports JPG, PNG, WebP (auto-optimized via Canvas to maintain fast loading).
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#7A4E38] tracking-wider font-semibold mb-1.5">
                  Direct Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs focus:bg-white focus:border-[#B5532F] transition-colors outline-none"
                />
              </div>
            )}

            {/* Active Image Indicator with Delete Option */}
            {formData.image && (
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-12 rounded-lg overflow-hidden border border-[#E5D7C5] shrink-0 bg-black">
                    <img src={formData.image} alt="Thumbnail" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-mono text-[#2F1F13] font-bold block truncate">Project Photograph Loaded</span>
                    <span className="text-[10px] text-[#6B5E55] font-mono block">Ready for publication</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(true)}
                    className="p-1.5 rounded-lg bg-white border border-[#E5D7C5] text-[#2F1F13] hover:text-[#B5532F] transition-colors"
                    title="Preview Image"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Icon Selector */}
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-4">
            <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2 border-b border-[#E5D7C5] pb-3">
              <Shield size={16} className="text-[#B5532F]" />
              <span>Project Craft Icon</span>
            </h2>

            <div>
              <label className="block text-[11px] font-mono uppercase text-[#7A4E38] tracking-wider font-semibold mb-1.5">
                Select Lucide Craft Icon
              </label>
              <select
                value={formData.iconName}
                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:bg-white focus:border-[#B5532F] transition-colors outline-none"
              >
                {Object.keys(METAL_ICONS).map((iconKey) => (
                  <option key={iconKey} value={iconKey}>{iconKey}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <Link
              to="/admin/metal-fabrication?tab=gallery"
              className="px-5 py-2.5 rounded-xl border border-[#E5D7C5] bg-white hover:bg-[#FAF7F2] text-xs font-mono uppercase tracking-wider text-[#6B5E55]"
            >
              Cancel & Return
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#964223] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Save size={14} />
              <span>{isEditing ? 'Save Changes' : 'Publish Project'}</span>
            </button>
          </div>

        </div>

        {/* Right Column: Sticky Live Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#7A4E38] font-bold">
              Live Card Preview
            </span>
            <span className="text-[10px] font-mono text-[#B5532F] bg-white px-2 py-0.5 rounded-full border border-[#E5D7C5]">
              Public Appearance
            </span>
          </div>

          {/* Interactive Preview Card */}
          <div className="rounded-2xl border border-[#E5D7C5] bg-white shadow-xl overflow-hidden flex flex-col group">
            {/* Card Image Area */}
            <div className="relative aspect-[16/11] bg-stone-900 overflow-hidden">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt={formData.title || 'Project Preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/50">
                  <IconComp size={36} className="text-[#E8782A] mb-2" />
                  <span className="text-xs font-mono uppercase tracking-wider">No Image Uploaded Yet</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#E8782A] text-[10px] font-mono uppercase tracking-wider font-bold border border-white/20">
                  {formData.category || 'Category'}
                </span>
                {formData.featured && (
                  <span className="px-2 py-0.5 rounded-full bg-[#B5532F] text-white text-[10px] font-mono uppercase tracking-wider font-bold shadow-xs">
                    Bento Span
                  </span>
                )}
              </div>

              <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center">
                <IconComp size={15} />
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pt-12 flex flex-col justify-end text-white">
                {(formData.location || formData.year) && (
                  <div className="flex items-center gap-2 text-[10px] font-sans text-white/80 mb-1">
                    {formData.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} className="text-[#E8782A]" />
                        <span>{formData.location}</span>
                      </span>
                    )}
                    {formData.location && formData.year && <span>•</span>}
                    {formData.year && (
                      <span className="flex items-center gap-1">
                        <Calendar size={10} className="text-[#E8782A]" />
                        <span>{formData.year}</span>
                      </span>
                    )}
                  </div>
                )}

                <h3 className="font-heading text-base font-bold text-white line-clamp-1">
                  {formData.title || 'Project Title Preview'}
                </h3>

                {formData.materials && (
                  <p className="text-[11px] text-white/70 line-clamp-1 mt-0.5 font-light">
                    {formData.materials}
                  </p>
                )}
              </div>
            </div>

            {/* Description Card Footer */}
            <div className="p-4 bg-white border-t border-[#E5D7C5]">
              <p className="text-xs text-[#6B5E55] line-clamp-2 leading-relaxed font-light">
                {formData.desc || 'Project description details will appear here and inside the lightbox dialog.'}
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#E5D7C5]/60 flex items-center justify-between text-[11px] font-mono text-[#B5532F] font-bold">
                <span>View Project</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>

        </div>

      </form>

      {/* Modal: Fullscreen Image Preview */}
      <AnimatePresence>
        {previewModalOpen && formData.image && (
          <div
            onClick={() => setPreviewModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-4xl max-h-[85vh] bg-black rounded-2xl overflow-hidden border border-white/20">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <X size={16} />
              </button>
              <img src={formData.image} alt="Fullscreen Preview" className="max-w-full max-h-[85vh] object-contain" />
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AdminMetalProjectForm;
