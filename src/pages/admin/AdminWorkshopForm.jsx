import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  GraduationCap,
  Sparkles,
  Upload,
  Link as LinkIcon,
  X,
  CheckCircle2,
  Trash2,
  Eye,
  FileText,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  getOfferedWorkshopById,
  saveOfferedWorkshop,
  getStoredOfferedWorkshops
} from '../../services/workshopStore';

// Helper to read and compress local photo files to safe base64 Data URLs
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
        // Resize to maximum 1200x800 preserving aspect ratio
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

export function AdminWorkshopForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    id: '',
    num: '',
    title: '',
    tag: '',
    desc: '',
    image: '',
    alt: '',
    modules: []
  });

  const [newModuleInput, setNewModuleInput] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load existing workshop data if editing
  useEffect(() => {
    if (id) {
      const existing = getOfferedWorkshopById(id);
      if (existing) {
        setFormData({
          id: existing.id,
          num: existing.num || '',
          title: existing.title || '',
          tag: existing.tag || '',
          desc: existing.desc || '',
          image: existing.image || '',
          alt: existing.alt || existing.title || '',
          modules: Array.isArray(existing.modules) ? [...existing.modules] : []
        });
      } else {
        navigate('/admin/workshops');
      }
    } else {
      // Calculate next sequential number
      const all = getStoredOfferedWorkshops();
      const nextNum = all.length + 1;
      setFormData((prev) => ({
        ...prev,
        num: nextNum < 10 ? `0${nextNum}` : `${nextNum}`
      }));
    }
  }, [id, navigate]);

  // Handle Photo File Upload
  const handlePhotoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const dataUrl = await readImageFileAsDataUrl(file);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
      e.target.value = '';
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Add learning module bullet
  const handleAddModule = (e) => {
    e?.preventDefault();
    const trimmed = newModuleInput.trim();
    if (!trimmed) return;
    if (formData.modules.includes(trimmed)) {
      setErrorMessage('Module already exists in checklist');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, trimmed]
    }));
    setNewModuleInput('');
    setErrorMessage(null);
  };

  const handleRemoveModule = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Workshop title is required');
      return;
    }

    const saved = saveOfferedWorkshop(formData);
    if (saved) {
      setIsSaved(true);
      setTimeout(() => {
        navigate('/admin/workshops');
      }, 700);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/60">
        <div>
          <Link
            to="/admin/workshops"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#865430] hover:text-[#B5532F] transition-colors mb-2 cursor-pointer font-bold"
          >
            <ArrowLeft size={13} />
            <span>Back to Workshops Catalog</span>
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <GraduationCap size={11} />
              <span>What We Offer Program Form</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              {isEditing ? `Editing #${formData.num}` : 'New Program Registration'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            {isEditing ? `Edit "${formData.title}"` : 'Add New Workshop Program'}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/workshops"
            className="px-4 py-2.5 rounded-xl border border-[#E5D7C5] hover:border-[#865430] bg-white text-xs font-mono uppercase tracking-wider text-[#524336] hover:text-[#2F1F13] font-semibold transition-all cursor-pointer shadow-2xs"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer ${
              isSaved ? 'bg-[#7A8B69]' : 'bg-[#B5532F] hover:bg-[#9C4424]'
            }`}
          >
            {isSaved ? (
              <>
                <Check size={15} />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={15} />
                <span>{isEditing ? 'Save Changes' : 'Create Workshop'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:text-red-900 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. MAIN 2-COLUMN FORM & LIVE PREVIEW */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Form Fields (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section 1: Program Essentials */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5D7C5] shadow-xs space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-[#F0E6D8] pb-3 text-[#B5532F]">
                <FileText size={16} />
                <h3 className="font-heading font-black text-lg text-[#2F1F13] tracking-tight">
                  1. Program Essentials
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Program Number */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                    Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="01"
                    value={formData.num}
                    onChange={(e) => setFormData({ ...formData, num: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-bold text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                  />
                  <span className="text-[10px] text-[#865430]/70 block">e.g. 01, 02</span>
                </div>

                {/* Workshop Title */}
                <div className="space-y-1.5 sm:col-span-3">
                  <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                    Workshop Program Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSEB Workshop, Rammed Earth Workshop..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-semibold text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                  />
                </div>
              </div>

              {/* Tag / Subtitle */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Discipline / Subtitle Tag *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compressed Stabilised Earth Blocks, Catalan Masonry..."
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
                <span className="text-[10px] text-[#865430]/70 block">
                  Displays above the workshop heading on the public page
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#524336] uppercase tracking-wider block">
                  Program Overview & Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the practical hands-on experience, soil interaction, and structural outcome..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-normal text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 leading-relaxed font-sans"
                />
              </div>
            </div>

            {/* Section 2: Workshop Photography */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5D7C5] shadow-xs space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 border-b border-[#F0E6D8] pb-3 text-[#B5532F]">
                <Layers size={16} />
                <h3 className="font-heading font-black text-lg text-[#2F1F13] tracking-tight">
                  2. Workshop Showcase Photography
                </h3>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="relative w-full h-56 rounded-xl overflow-hidden bg-stone-900 border border-[#E5D7C5] shadow-xs group">
                  <img
                    src={formData.image}
                    alt="Workshop cover preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/60 text-white backdrop-blur-xs">
                      #{formData.num || '01'} Preview
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Upload Controls */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#B5532F] bg-[#B5532F]/5 hover:bg-[#B5532F]/10 text-[#B5532F] font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors text-center">
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

                  <div className="flex-1 relative">
                    <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#865430]" />
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={formData.image.startsWith('data:') ? '' : formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-[#865430]/70 block">
                  PNG, JPG, or WebP. Images are optimized automatically to retain high quality.
                </span>
              </div>
            </div>

            {/* Section 3: Key Learning Modules */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5D7C5] shadow-xs space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#F0E6D8] pb-3 text-[#B5532F]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <h3 className="font-heading font-black text-lg text-[#2F1F13] tracking-tight">
                    3. Key Learning Modules Checklist ({formData.modules.length})
                  </h3>
                </div>
                <span className="text-[10px] text-[#865430]/70">
                  Displayed as bulleted curriculum items
                </span>
              </div>

              {/* Add Module Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Soil Test and Mixing of Stabilizer, Making Mud Mortar..."
                  value={newModuleInput}
                  onChange={(e) => setNewModuleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddModule();
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F1E8DC] border border-[#E5D7C5] hover:border-[#B5532F] text-[#B5532F] font-bold text-xs uppercase cursor-pointer transition-colors"
                >
                  Add Module
                </button>
              </div>

              {/* Module List */}
              <div className="space-y-2 pt-1">
                {formData.modules.map((mod, modIdx) => (
                  <div
                    key={modIdx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs transition-all hover:border-[#B5532F]/50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-[#7A8B69]/15 text-[#5C6E4B] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {modIdx + 1}
                      </span>
                      <span className="text-[#2F1F13] truncate font-sans text-xs">{mod}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(modIdx)}
                      className="p-1 rounded text-[#865430] hover:text-red-600 hover:bg-white cursor-pointer transition-colors"
                      title="Remove module"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {formData.modules.length === 0 && (
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-dashed border-[#E5D7C5] text-center text-[11px] text-[#865430]/70 italic">
                    No curriculum modules added yet. Type a topic above and press "Add Module".
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to="/admin/workshops"
                className="px-5 py-2.5 rounded-xl border border-[#E5D7C5] bg-white text-xs font-mono uppercase tracking-wider text-[#524336] hover:bg-[#FAF7F2] font-semibold transition-all cursor-pointer"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer ${
                  isSaved ? 'bg-[#7A8B69]' : 'bg-[#B5532F] hover:bg-[#9C4424]'
                }`}
              >
                {isSaved ? 'Saved Successfully!' : isEditing ? 'Save Changes' : 'Create Workshop Program'}
              </button>
            </div>

          </div>

          {/* Right Column: Sticky Public Website Live Preview (5 Columns) */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#865430]">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={13} className="text-[#B5532F]" />
                <span>Live Public Section Preview</span>
              </span>
              <span className="text-[10px] text-[#7A8B69] font-bold">● Synchronized</span>
            </div>

            {/* Public Card Mockup */}
            <div className="bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-[#E5D7C5] shadow-md space-y-4 font-body">
              {/* Image Preview Box - Only shown if image is uploaded */}
              {formData.image ? (
                <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-stone-900 border border-[#E5D7C5] shadow-xs">
                  <img
                    src={formData.image}
                    alt={formData.title || 'Workshop Preview'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="h-48 sm:h-56 w-full rounded-2xl border-2 border-dashed border-[#E5D7C5] bg-white flex flex-col items-center justify-center gap-2.5 p-6 text-center">
                  <div className="w-11 h-11 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-center text-[#B5532F]">
                    <Upload size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2F1F13] block">
                      No Image Uploaded
                    </span>
                    <span className="text-[11px] text-[#524336]/70 font-sans block mt-0.5">
                      Upload workshop photography on the left to display it here
                    </span>
                  </div>
                </div>
              )}

              {/* Number and Tag */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-heading font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-[#C98A4B] to-[#B5532F] leading-none select-none">
                    {formData.num || '01'}
                  </span>
                  <span className="inline-block text-[11px] uppercase font-mono tracking-[0.2em] text-[#B5532F] font-bold">
                    {formData.tag || 'Discipline Tag'}
                  </span>
                </div>

                <h3 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tight text-[#2F1F13] leading-snug">
                  {formData.title || 'Untitled Workshop Program'}
                </h3>

                <p className="text-xs sm:text-sm font-light text-[#524336] leading-relaxed pt-1">
                  {formData.desc || 'Workshop description will appear here as you type...'}
                </p>
              </div>

              {/* Modules Checklist Preview */}
              {formData.modules && formData.modules.length > 0 && (
                <div className="pt-2 border-t border-[#E5D7C5]/60 space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#B5532F] font-bold block">
                    Key Learning Modules:
                  </span>
                  <ul className="space-y-1 text-xs font-mono text-[#4D3E33]">
                    {formData.modules.slice(0, 5).map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 size={12} className="text-[#7A8B69] shrink-0 mt-0.5" />
                        <span className="truncate">{m}</span>
                      </li>
                    ))}
                    {formData.modules.length > 5 && (
                      <li className="text-[10px] text-[#865430] pl-4">
                        +{formData.modules.length - 5} more modules
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Public Enquire Button Mockup */}
              <div className="pt-2">
                <div className="w-full inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-[#B5532F] text-[#B5532F] font-mono text-xs uppercase tracking-widest font-bold bg-white/70 shadow-2xs">
                  <span>Enquire</span>
                  <ArrowUpRight size={13} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>

    </div>
  );
}

export default AdminWorkshopForm;
