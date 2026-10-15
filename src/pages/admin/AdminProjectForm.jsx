import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  Building,
  Image as ImageIcon,
  FileText,
  Eye,
  X,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Star,
  MapPin,
  Calendar,
  Layers,
  Hammer,
  CheckCircle2,
  Upload,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import {
  getProjectBySlug,
  saveProject
} from '../../services/projectStore';

// Helper to read and compress local image files to safe base64 Data URLs
const readImageFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (PNG, JPG, WebP)'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = 1600;
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
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};



const SUGGESTED_MATERIAL_TAGS = [
  'CSEB Earth Blocks',
  'Natural Lime Plaster',
  'Stabilized Rammed Earth',
  'Bamboo Trusses',
  'Reclaimed Teak Millwork',
  'Blue Oxide Flooring',
  'Mangalore Roof Tiles',
  'Kota Stone',
  'Cast Terracotta Jali',
  'Kadappa Stone Shelves'
];

export function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [activeTab, setActiveTab] = useState('general'); // 'general', 'media', 'story', 'preview'
  const [materialInput, setMaterialInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    category: '',
    location: '',
    area: '',
    timeTaken: '',
    year: '',
    architect: '',
    construction: '',
    client: '',
    heroImage: '',
    gallery: [],
    materials: [],
    about: '',
    status: 'Published',
    featured: false
  });

  // Load project if in edit mode
  useEffect(() => {
    if (id) {
      const existing = getProjectBySlug(id);
      if (existing) {
        setFormData({
          id: existing.id,
          title: existing.title || '',
          slug: existing.slug || '',
          subtitle: existing.subtitle || '',
          category: existing.category || '',
          location: existing.location || '',
          area: existing.area || '',
          timeTaken: existing.timeTaken || '',
          year: existing.year || '',
          architect: existing.architect || '',
          construction: existing.construction || '',
          client: existing.client || '',
          heroImage: existing.heroImage || '',
          gallery: Array.isArray(existing.gallery) ? existing.gallery : [],
          materials: Array.isArray(existing.materials) ? existing.materials : [],
          about: existing.about || '',
          status: existing.status || 'Published',
          featured: Boolean(existing.featured)
        });
      }
    }
  }, [id]);

  const handleTitleChange = (val) => {
    const updated = { ...formData, title: val };
    if (!isEditing) {
      updated.slug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    setFormData(updated);
  };

  const handleAddMaterial = (matToAdd) => {
    const item = (matToAdd || materialInput).trim();
    if (item && !formData.materials.includes(item)) {
      setFormData({
        ...formData,
        materials: [...formData.materials, item]
      });
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (indexToRemove) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== indexToRemove)
    });
  };

  const handleAddGalleryImage = (urlToAdd) => {
    const url = (urlToAdd || galleryUrlInput).trim();
    if (url) {
      setFormData({
        ...formData,
        gallery: [...formData.gallery, url]
      });
      setGalleryUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (idx) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== idx)
    });
  };

  const handleHeroFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingHero(true);
      const dataUrl = await readImageFileAsDataUrl(file);
      setFormData((prev) => ({ ...prev, heroImage: dataUrl }));
      e.target.value = '';
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load image');
      setTimeout(() => setErrorMessage(null), 3500);
    } finally {
      setIsUploadingHero(false);
    }
  };

  const handleGalleryFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      const dataUrls = await Promise.all(files.map(readImageFileAsDataUrl));
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...dataUrls]
      }));
      e.target.value = '';
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load gallery images');
      setTimeout(() => setErrorMessage(null), 3500);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!formData.title?.trim()) {
      setActiveTab('general');
      setErrorMessage('Please enter a project title before saving');
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }
    if (!formData.category) {
      setActiveTab('general');
      setErrorMessage('Please select an Architectural Category before saving');
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }
    
    saveProject(formData);
    setIsSaved(true);
    
    setTimeout(() => {
      navigate('/admin/projects');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2F1F13] font-body selection:bg-[#B5532F] selection:text-white pb-24">
      
      {/* 1. TOP STICKY PAGE COMMAND BAR */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5D7C5] px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="p-2 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2] hover:bg-[#F0E6D8] text-[#524336] hover:text-[#2F1F13] transition-colors cursor-pointer"
              title="Return to Projects List"
            >
              <ArrowLeft size={16} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5532F] font-bold">
                  {isEditing ? 'Editing Project' : 'New Project Registration'}
                </span>
                <span className="text-xs text-[#865430]/40">•</span>
                <span className="text-[10px] font-mono uppercase text-[#7A8B69] font-semibold">
                  {formData.status}
                </span>
              </div>
              <h2 className="font-heading font-black text-xl sm:text-2xl text-[#2F1F13] leading-tight truncate max-w-md">
                {formData.title || (isEditing ? 'Edit Architectural Entry' : 'Register Architectural Work')}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {isEditing && formData.slug && (
              <Link
                to={`/projects/${formData.slug}`}
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] text-[#524336] hover:text-[#B5532F] text-xs font-mono uppercase tracking-wider transition-colors"
                title="Preview live public page"
              >
                <span>Live View</span>
                <ExternalLink size={13} />
              </Link>
            )}

            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-4 py-2 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase tracking-wider text-[#524336] hover:bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaved}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-70"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Check size={15} />
                  <span>{isEditing ? 'Save Changes' : 'Publish Project'}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN FORM CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* TAB CONTROLS */}
        <div className="flex items-center gap-2 border-b border-[#E5D7C5] bg-white rounded-2xl p-2 shadow-xs overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'bg-[#B5532F] text-white shadow-xs'
                : 'text-[#524336] hover:bg-[#FAF7F2] hover:text-[#2F1F13]'
            }`}
          >
            <Building size={14} />
            <span>1. Identity, Specs & Materials</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'bg-[#B5532F] text-white shadow-xs'
                : 'text-[#524336] hover:bg-[#FAF7F2] hover:text-[#2F1F13]'
            }`}
          >
            <ImageIcon size={14} />
            <span>2. Photography & Media</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'media' ? 'bg-white/20' : 'bg-black/5 text-[#865430]'}`}>
              {formData.gallery.length + 1}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ml-auto ${
              activeTab === 'preview'
                ? 'bg-[#2F1F13] text-[#FAF7F2] shadow-xs'
                : 'text-[#524336] hover:bg-[#FAF7F2] hover:text-[#2F1F13]'
            }`}
          >
            <Eye size={14} />
            <span>Live Card Preview</span>
          </button>
        </div>

        {/* TAB 1: IDENTITY & SPECIFICATIONS */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C5] shadow-xs space-y-6">
            <div className="border-b border-[#F0E6D8] pb-4">
              <h3 className="font-heading font-black text-2xl text-[#2F1F13]">
                Project Identity & Architectural Specs
              </h3>
              <p className="text-xs text-[#524336] mt-0.5 font-light">
                Provide core naming, geographical coordinates, category classification, and timeline details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Title */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alain's Residence"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 focus:border-[#B5532F] transition-all"
                />
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  URL Slug (Website Path) *
                </label>
                <div className="flex rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] overflow-hidden">
                  <span className="px-3.5 py-3 bg-[#F1E8DC] text-[#865430] text-xs font-mono border-r border-[#E5D7C5]">
                    /projects/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-3 text-xs font-mono text-[#2F1F13] focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                    Architectural Category
                  </label>
                  {!formData.category && (
                    <span className="text-[10px] font-mono text-[#B5532F] font-bold uppercase tracking-wider">
                      Required
                    </span>
                  )}
                </div>
                <div className="relative">
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-[#FAF7F2] border text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 transition-all ${
                      !formData.category
                        ? 'border-[#B5532F]/60 text-[#865430]/60 ring-1 ring-[#B5532F]/20'
                        : 'border-[#E5D7C5] text-[#2F1F13]'
                    }`}
                  >
                    <option value="" disabled>
                      Select an architectural category...
                    </option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial & Structural">Commercial & Structural</option>
                    <option value="Institutional">Institutional</option>
                    <option value="Specialized Craft">Specialized Craft</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#865430] pointer-events-none" />
                </div>
              </div>

              {/* Short Description / Subtitle */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  Project Short Description / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Residential Extension & Circulation Transformation"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 focus:border-[#B5532F] transition-all"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Prarthana Community, Auroville"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  Floor Area Covered
                </label>
                <input
                  type="text"
                  placeholder="e.g. 227 m² (2,450 sq.ft)"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  Completion Year
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2024"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Construction Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  Construction Duration
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8 months"
                  value={formData.timeTaken}
                  onChange={(e) => setFormData({ ...formData, timeTaken: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Architect */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center gap-1.5">
                  <Layers size={13} className="text-[#B5532F]" />
                  Architect (Studio / Architect Name)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ar. Srinath Gowtham & Ar. Vinoth Kumar, Bhutha Earthen Architecture Studio"
                  value={formData.architect}
                  onChange={(e) => setFormData({ ...formData, architect: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Construction Partner / Builder */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center gap-1.5">
                  <Hammer size={13} className="text-[#B5532F]" />
                  Construction (Execution / Builder)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AuroYali"
                  value={formData.construction}
                  onChange={(e) => setFormData({ ...formData, construction: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>

              {/* Client / Patron */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  Client / Patron Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alain & Family"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
              </div>
            </div>

            {/* MATERIAL SPECIFICATION CHIPS (NOW IN 1ST SECTION) */}
            <div className="pt-6 border-t border-[#F0E6D8] space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center gap-2">
                    <Sparkles size={14} className="text-[#B5532F]" />
                    Material Specification Chips
                  </label>
                  <p className="text-[11px] text-[#865430] font-light mt-0.5">
                    Sustainable materials, lime plasters, earth blocks, and vernacular craft tags featured in this project.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#865430] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E5D7C5]">
                  {formData.materials.length} {formData.materials.length === 1 ? 'chip' : 'chips'}
                </span>
              </div>

              {/* Tag Input Field */}
              <div className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="Enter custom material (e.g. Mangalore Roof Tiles, Kadappa Stone, Bamboo Trusses)..."
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMaterial();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                />
                <button
                  type="button"
                  onClick={() => handleAddMaterial()}
                  className="px-5 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#B5532F] hover:text-white border border-[#E5D7C5] text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  + Add Tag
                </button>
              </div>

              {/* Active Material Tags */}
              <div className="flex flex-wrap gap-2 pt-1 min-h-[36px]">
                {formData.materials.length === 0 ? (
                  <p className="text-xs text-[#865430]/70 italic font-mono py-1">
                    No material chips added yet. Type above or click from suggestions below.
                  </p>
                ) : (
                  formData.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono text-[#2F1F13]"
                    >
                      <span>{mat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(i)}
                        className="text-[#865430] hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Suggestions */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-[#865430] uppercase tracking-wider block mb-1.5 font-semibold">
                  Common Architectural Materials (Click to add):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_MATERIAL_TAGS.filter((t) => !formData.materials.includes(t)).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddMaterial(tag)}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#E5D7C5] border border-[#E5D7C5] text-[11px] font-mono text-[#524336] transition-colors cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FULL PROJECT DESCRIPTION / ABOUT (IN 1ST SECTION) */}
            <div className="pt-6 border-t border-[#F0E6D8] space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText size={14} className="text-[#B5532F]" />
                  Project Description (Detailed Overview & Story)
                </span>
                <span className="text-[10px] text-[#865430] font-mono">{formData.about.length} characters</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe the client's brief, site context, passive cooling shafts, thermal comfort strategies, and earthen craft techniques used..."
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs sm:text-sm text-[#2F1F13] focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40 leading-relaxed resize-y"
              />
              <p className="text-[11px] text-[#865430] font-light">
                This detailed description appears on the project's dedicated reveal page and portfolio view.
              </p>
            </div>

            {/* Publishing Settings Box */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5D7C5] flex flex-wrap items-center justify-between gap-4 mt-6">
              <div className="flex items-center gap-3">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524336] font-semibold">
                  Visibility Status:
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#E5D7C5] text-xs font-mono cursor-pointer font-bold"
                >
                  <option value="Published">Published (Live On Website)</option>
                  <option value="Draft">Draft (Internal Staging Only)</option>
                </select>
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-mono text-[#2F1F13] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#B5532F] focus:ring-[#B5532F]"
                />
                <span className="font-semibold">Pin to Homepage Featured Showcase</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 2: PHOTOGRAPHY & MEDIA */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C5] shadow-xs space-y-6">
            <div className="border-b border-[#F0E6D8] pb-4">
              <h3 className="font-heading font-black text-2xl text-[#2F1F13]">
                High-Resolution Architectural Imagery
              </h3>
              <p className="text-xs text-[#524336] mt-0.5 font-light">
                Configure the primary project cover photograph and supplementary portfolio lightbox images.
              </p>
            </div>

            {/* Hero Image Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-xl text-[#2F1F13]">
                    Cover Hero Image <span className="text-[#B5532F]">*</span>
                  </h4>
                  <p className="text-xs text-[#524336] font-light mt-0.5">
                    Primary showcase photograph for portfolio cards and project page hero (16:9 ratio recommended).
                  </p>
                </div>
                {formData.heroImage && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroImage: '' })}
                    className="inline-flex items-center gap-1 text-xs font-mono text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Remove Cover</span>
                  </button>
                )}
              </div>

              {formData.heroImage ? (
                /* Cover Image Preview Card */
                <div className="relative aspect-[16/9] max-h-80 rounded-2xl overflow-hidden bg-stone-900 border border-[#E5D7C5] shadow-sm group">
                  <img
                    src={formData.heroImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#2F1F13] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer hover:bg-[#FAF7F2] transition-colors shadow-lg">
                      <Upload size={14} className="text-[#B5532F]" />
                      <span>Upload New Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroFileUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, heroImage: '' })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer hover:bg-red-700 transition-colors shadow-lg"
                    >
                      <Trash2 size={14} />
                      <span>Remove</span>
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono">
                    Active Primary Cover Preview
                  </div>
                </div>
              ) : (
                /* Empty Upload / Input Zone */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload Dropzone */}
                  <label className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E5D7C5] hover:border-[#B5532F] rounded-2xl bg-[#FAF7F2] hover:bg-[#FAF7F2]/80 transition-all cursor-pointer group text-center min-h-[170px]">
                    <div className="w-12 h-12 rounded-full bg-white border border-[#E5D7C5] group-hover:border-[#B5532F] flex items-center justify-center text-[#B5532F] mb-3 transition-colors shadow-2xs">
                      {isUploadingHero ? (
                        <div className="w-5 h-5 border-2 border-[#B5532F] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload size={22} />
                      )}
                    </div>
                    <span className="text-xs font-mono uppercase font-bold text-[#2F1F13] group-hover:text-[#B5532F] transition-colors">
                      {isUploadingHero ? 'Processing Image...' : 'Upload Image from Computer'}
                    </span>
                    <span className="text-[11px] text-[#524336]/70 mt-1">
                      Click to choose photo file (PNG, JPG, WEBP)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileUpload}
                      className="hidden"
                      disabled={isUploadingHero}
                    />
                  </label>

                  {/* Or Paste URL Option */}
                  <div className="flex flex-col justify-center p-6 border border-[#E5D7C5] rounded-2xl bg-white space-y-2.5 min-h-[170px]">
                    <span className="text-xs font-mono uppercase font-bold text-[#865430] flex items-center gap-1.5">
                      <LinkIcon size={13} className="text-[#B5532F]" />
                      Or Paste Image URL
                    </span>
                    <p className="text-[11px] text-[#524336]/70">
                      Direct link from Unsplash, Cloudinary, AWS S3, or any CDN.
                    </p>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Images Section */}
            <div className="space-y-4 pt-6 border-t border-[#E5D7C5]">
              <div>
                <h4 className="font-heading font-bold text-xl text-[#2F1F13]">
                  Project Gallery Carousel ({formData.gallery.length} Images)
                </h4>
                <p className="text-xs text-[#524336] font-light mt-0.5">
                  Add high-res photos for the fullscreen architectural lightbox and detail reveal scroll.
                </p>
              </div>

              {/* Upload or Add by URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File Upload Button */}
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#E5D7C5] hover:border-[#B5532F] text-[#2F1F13] hover:text-[#B5532F] text-xs font-mono uppercase font-bold transition-all cursor-pointer shadow-2xs text-center">
                  {isUploadingGallery ? (
                    <div className="w-4 h-4 border-2 border-[#B5532F] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload size={14} className="text-[#B5532F]" />
                  )}
                  <span>{isUploadingGallery ? 'Uploading...' : 'Upload Photos from Device'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryFilesUpload}
                    className="hidden"
                    disabled={isUploadingGallery}
                  />
                </label>

                {/* Paste URL */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste photo URL..."
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGalleryImage())}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#B5532F]/40"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddGalleryImage()}
                    className="px-4 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-wider font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    + Add URL
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              {formData.gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                  {formData.gallery.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-900 border border-[#E5D7C5] group shadow-2xs"
                    >
                      <img src={url} alt={`Gallery item ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                        title="Delete photo from gallery"
                      >
                        <X size={14} />
                      </button>
                      <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-white bg-black/60 px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#FAF7F2] border border-dashed border-[#E5D7C5] text-center text-xs text-[#524336]/60 font-mono">
                  No supplementary gallery images added yet. Upload files from your computer or paste image URLs above.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE PREVIEW */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5D7C5] shadow-xs space-y-6">
            <div className="border-b border-[#F0E6D8] pb-4">
              <h3 className="font-heading font-black text-2xl text-[#2F1F13]">
                Live Public Card Preview
              </h3>
              <p className="text-xs text-[#524336] mt-0.5 font-light">
                Here is exactly how this project will appear to visitors on the website's portfolio catalog.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {/* Standalone Project Card Preview */}
              <div className="bg-white rounded-2xl border border-[#E5D7C5] shadow-lg overflow-hidden flex flex-col group">
                {/* Hero cover image */}
                <div className="relative aspect-[16/10] bg-[#1F1610] overflow-hidden flex items-center justify-center">
                  {formData.heroImage ? (
                    <img
                      src={formData.heroImage}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6 text-[#E5D7C5]/40 font-mono text-xs">
                      <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                      <span>No cover image selected</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#2F1F13] text-[10px] font-mono uppercase tracking-wider font-bold">
                      {formData.category || 'Category Unset'}
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-[#7A8B69]/90 text-white text-[10px] font-mono uppercase font-bold tracking-wider">
                      {formData.status}
                    </span>
                  </div>

                  {/* Bottom Meta */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono text-white/80 block uppercase tracking-wider">
                      {formData.year} • {formData.area || 'Auroville'}
                    </span>
                    <h3 className="font-heading font-black text-2xl leading-tight text-white truncate">
                      {formData.title || 'Untitled Project'}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-[#524336] line-clamp-2 leading-relaxed">
                    {formData.subtitle || formData.about}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#865430]">
                    <MapPin size={12} className="text-[#B5532F]" />
                    <span>{formData.location}</span>
                  </div>

                  {/* Material tags */}
                  {formData.materials.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {formData.materials.slice(0, 3).map((mat, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E5D7C5] text-[10px] font-mono text-[#524336]"
                        >
                          {mat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Architectural & Construction Credits (Matching website footer spec) */}
                  <div className="pt-3 border-t border-[#F0E6D8] grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-[#FAF7F2] p-3 rounded-xl border border-[#E5D7C5]">
                    <div>
                      <span className="text-[10px] font-mono text-[#865430] uppercase tracking-wider flex items-center gap-1 font-semibold">
                        <Layers size={11} className="text-[#B5532F]" /> ARCHITECT:
                      </span>
                      <p className="text-[#2F1F13] font-sans text-xs font-medium leading-snug mt-0.5">
                        {formData.architect || 'AuroYali Collective'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#865430] uppercase tracking-wider flex items-center gap-1 font-semibold">
                        <Hammer size={11} className="text-[#B5532F]" /> CONSTRUCTION:
                      </span>
                      <p className="text-[#2F1F13] font-sans text-xs font-medium leading-snug mt-0.5">
                        {formData.construction || 'AuroYali'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SAVE BAR */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5D7C5] flex items-center justify-between shadow-xs">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-5 py-2.5 rounded-xl border border-[#E5D7C5] text-xs font-mono uppercase tracking-wider text-[#524336] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            ← Cancel & Return
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaved}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#9C4424] text-white text-xs font-mono uppercase tracking-widest font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-70"
          >
            <Check size={15} />
            <span>{isEditing ? 'Save Changes' : 'Publish Project'}</span>
          </button>
        </div>

        {/* Error Toast Notification */}
        {errorMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 text-white text-xs font-mono shadow-2xl animate-fadeIn">
            <X size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

      </div>

    </div>
  );
}

export default AdminProjectForm;
