import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Sparkles,
  Upload,
  Link as LinkIcon,
  X,
  CheckCircle2,
  Trash2,
  Eye,
  Camera,
  Maximize2,
  Layers,
  LayoutGrid
} from 'lucide-react';
import {
  getGalleryItemById,
  saveGalleryItem,
  GALLERY_CATEGORIES
} from '../../services/workshopStore';

// Compress local photo files to safe base64 Data URLs (max 1200px, 85% JPEG)
const readImageFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select an image file (PNG, JPG, WebP)'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read photo file'));
    reader.readAsDataURL(file);
  });
};

const CATEGORY_OPTIONS = [
  { id: 'earth', label: 'Earth & CSEB', defaultTag: 'Earth Masonry' },
  { id: 'vaults', label: 'Vaults & Shells', defaultTag: 'Vaults & Shells' },
  { id: 'bamboo', label: 'Bamboo Craft', defaultTag: 'Bamboo Craft' },
  { id: 'finishes', label: 'Natural Plasters', defaultTag: 'Natural Plasters' }
];

export function AdminWorkshopGalleryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: 'earth',
    categoryLabel: 'Earth Masonry',
    img: '',
    tall: false,
    caption: ''
  });

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load existing gallery item if editing
  useEffect(() => {
    if (id) {
      const existing = getGalleryItemById(id);
      if (existing) {
        setFormData({
          id: existing.id,
          title: existing.title || '',
          category: existing.category || 'earth',
          categoryLabel: existing.categoryLabel || 'Earth Masonry',
          img: existing.img || '',
          tall: Boolean(existing.tall),
          caption: existing.caption || ''
        });
      } else {
        setErrorMessage(`Gallery item with ID "${id}" could not be found.`);
      }
    }
  }, [id]);

  // Handle Photo File Upload
  const handlePhotoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      setErrorMessage(null);
      const dataUrl = await readImageFileAsDataUrl(file);
      setFormData((prev) => ({ ...prev, img: dataUrl }));
      e.target.value = '';
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Change Category and auto-fill label
  const handleCategoryChange = (newCat) => {
    const opt = CATEGORY_OPTIONS.find(c => c.id === newCat);
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      categoryLabel: opt ? opt.defaultTag : prev.categoryLabel
    }));
  };

  // Save Gallery Item
  const handleSave = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage('Please provide a technique title for this gallery photo');
      return;
    }

    if (!formData.img) {
      setErrorMessage('Please upload a photo or provide an image URL');
      return;
    }

    try {
      saveGalleryItem({
        ...formData,
        title: formData.title.trim(),
        categoryLabel: formData.categoryLabel.trim() || 'Natural Architecture',
        caption: formData.caption.trim()
      });

      setIsSaved(true);
      setTimeout(() => {
        navigate('/admin/workshops?tab=gallery');
      }, 700);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save gallery photo');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body">
      
      {/* 1. TOP HEADER & BACK NAVIGATION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/60">
        <div>
          <Link
            to="/admin/workshops?tab=gallery"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#865430] hover:text-[#B5532F] transition-colors mb-2 group cursor-pointer"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Workshops & Gallery</span>
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Camera size={11} />
              <span>Created Gallery Showcase</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              {isEditing ? `Editing "${formData.title || id}"` : 'New Photo Entry'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            {isEditing ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light">
            Showcase authentic craftsmanship, masonry assemblies, and vault testing in the "Gallery of Techniques & Work" section.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/workshops?tab=gallery"
            className="px-4 py-2.5 rounded-xl border border-[#E5D7C5] bg-white hover:bg-[#FAF7F2] text-[#524336] text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaved}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer ${
              isSaved
                ? 'bg-[#7A8B69]'
                : 'bg-[#B5532F] hover:bg-[#9C4424]'
            }`}
          >
            {isSaved ? (
              <>
                <Check size={14} />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Sparkles size={14} />
                <span>{isEditing ? 'Save Changes' : 'Publish to Gallery'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-800 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. TWO-COLUMN SPLIT: FORM (LEFT) + LIVE BENTO PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ======================================================== */}
        {/* LEFT: FORM FIELDS (7 COLS) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: Photo Details */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5D7C5] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-[#B5532F]" />
                <h3 className="font-heading font-black text-lg text-[#2F1F13]">
                  Technique & Identification
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#865430] uppercase">
                Required Fields *
              </span>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Photo Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Technique / Work Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSEB Pressing, Rammed Earth Monolith, Timbrel Vault..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Discipline Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#B5532F]/10 border-[#B5532F] text-[#B5532F] font-bold shadow-2xs'
                            : 'bg-[#FAF7F2] border-[#E5D7C5] text-[#524336] hover:bg-[#F1E8DC]'
                        }`}
                      >
                        <span className="text-[11px] font-mono block leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Category Tag/Subtitle */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Display Category Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Earth Masonry, Vaults & Shells, Bamboo Craft..."
                  value={formData.categoryLabel}
                  onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Card Bento Height Toggle */}
              <div className="space-y-2 pt-2 border-t border-[#F0E6D8]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                    Bento Grid Card Format
                  </label>
                  <span className="text-[10px] text-[#865430]/80">
                    Controls card height in the public mosaic
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tall: false })}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      !formData.tall
                        ? 'bg-[#B5532F]/10 border-[#B5532F] text-[#B5532F] font-bold shadow-2xs'
                        : 'bg-[#FAF7F2] border-[#E5D7C5] text-[#524336] hover:bg-[#F1E8DC]'
                    }`}
                  >
                    <LayoutGrid size={16} className={!formData.tall ? 'text-[#B5532F]' : 'text-[#865430]'} />
                    <div>
                      <span className="text-xs font-mono font-bold block">Standard Card</span>
                      <span className="text-[10px] text-[#524336]/70 block font-normal">1x height tile</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, tall: true })}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.tall
                        ? 'bg-[#B5532F]/10 border-[#B5532F] text-[#B5532F] font-bold shadow-2xs'
                        : 'bg-[#FAF7F2] border-[#E5D7C5] text-[#524336] hover:bg-[#F1E8DC]'
                    }`}
                  >
                    <Layers size={16} className={formData.tall ? 'text-[#B5532F]' : 'text-[#865430]'} />
                    <div>
                      <span className="text-xs font-mono font-bold block">Tall Featured Card</span>
                      <span className="text-[10px] text-[#524336]/70 block font-normal">2x vertical span tile</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1.5 pt-2 border-t border-[#F0E6D8]">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Technique Description / Caption
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Manual Auram press compaction of compressed stabilized earth blocks..."
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
                <p className="text-[10px] text-[#865430]/70 font-light">
                  Appears inside the card on hover and when opened in full-screen lightbox.
                </p>
              </div>
            </div>
          </div>

          {/* Card: Photography Upload */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5D7C5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-[#B5532F]" />
                <h3 className="font-heading font-black text-lg text-[#2F1F13]">
                  High-Resolution Photography *
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#7A8B69] font-bold">
                Auto-compressed to 1200px
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* File Upload Button */}
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#B5532F] bg-[#B5532F]/5 hover:bg-[#B5532F]/10 text-[#B5532F] font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors">
                  <Upload size={15} />
                  <span>{isUploadingPhoto ? 'Processing photo...' : 'Upload From Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileUpload}
                    className="hidden"
                    disabled={isUploadingPhoto}
                  />
                </label>

                {/* Or URL input */}
                <div className="flex-1 relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#865430]" />
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={formData.img.startsWith('data:') ? '' : formData.img}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                  />
                </div>
              </div>

              {formData.img && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[11px]">
                  <span className="text-[#524336] truncate max-w-[280px]">
                    Photo source loaded ({formData.img.startsWith('data:') ? 'Local file uploaded' : 'Remote URL'})
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, img: '' })}
                    className="text-red-600 hover:text-red-800 font-bold uppercase cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT: LIVE BENTO CARD PREVIEW (5 COLS STICKY) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#865430] font-bold">
              <Eye size={13} className="text-[#B5532F]" />
              <span>Live Public Card Mockup</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] text-[#524336]">
              {formData.tall ? 'Tall Bento Card (2x)' : 'Standard Bento Card (1x)'}
            </span>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-[#FAF7F2] p-4 rounded-3xl border border-[#E5D7C5] shadow-xs">
            <div
              className={`group relative rounded-[20px] overflow-hidden bg-[#F1E8DC] border border-[#E5D7C5] shadow-md transition-all duration-300 ${
                formData.tall ? 'h-[360px]' : 'h-[220px]'
              }`}
            >
              {/* Background Image - Only shown if uploaded */}
              {formData.img ? (
                <>
                  <img
                    src={formData.img}
                    alt={formData.title || 'Preview'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md text-white/90 flex items-center justify-center opacity-80 shadow-sm pointer-events-none">
                    <Maximize2 size={13} />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 p-6 text-center bg-white border-2 border-dashed border-[#E5D7C5]">
                  <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center text-[#B5532F]">
                    <Camera size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-[#2F1F13] block">No Photo Uploaded</span>
                    <span className="text-[10px] text-[#524336]/70 block mt-0.5">Upload a photo on the left to see the card mockup</span>
                  </div>
                </div>
              )}

              {/* Bottom Details & Caption */}
              <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1 pointer-events-none">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E5D7C5] text-[10px] font-mono font-bold text-[#2F1F13] tracking-wider uppercase shadow-xs">
                  {formData.title || 'Untitled Technique'}
                </span>
                
                {formData.caption && (
                  <p className="text-[11px] text-white/90 font-light line-clamp-2 leading-relaxed">
                    {formData.caption}
                  </p>
                )}
                
                <div className="pt-0.5 flex items-center gap-1.5 text-[9px] font-mono text-white/70 uppercase">
                  <span>Category: {formData.categoryLabel || formData.category}</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] font-mono text-center text-[#865430]/70 mt-3">
              ✦ Exact visual representation as rendered on the public Workshops page.
            </p>
          </div>

          {/* Quick Tips */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5D7C5] text-xs font-mono text-[#524336] space-y-1.5">
            <span className="font-bold text-[#2F1F13] uppercase tracking-wider text-[11px] block">
              Curator's Notes:
            </span>
            <p className="text-[11px] leading-relaxed text-[#524336]/80">
              • High-contrast construction photography highlighting natural textures, masonry bondings, and curved shells works best.
            </p>
            <p className="text-[11px] leading-relaxed text-[#524336]/80">
              • Setting a card to "Tall" makes it stand out as an architectural anchor piece in the mosaic grid.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminWorkshopGalleryForm;
