import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileCheck,
  RotateCw,
  Sun,
  Sunset,
  Moon,
  Layers,
  Sparkles,
  RefreshCcw,
  Sliders,
  Type,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  Box,
  Link as LinkIcon,
  Eye,
  Trash2,
  ArrowRight,
  Compass,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getHero3DConfig,
  updateHero3DSettings,
  saveUploaded3DModel,
  getActiveModelBlobUrl,
  resetHeroToDefault,
  subscribeToHero3D
} from '../../services/hero3DStore';
import { Admin3DPreview } from '../../components/admin/Admin3DPreview';

export function AdminHero3D() {
  const [config, setConfig] = useState(() => getHero3DConfig());
  const [customModelUrl, setCustomModelUrl] = useState(null);
  const [activeTab, setActiveTab] = useState(config.activeSource === 'url' ? 'url' : 'upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [urlInput, setUrlInput] = useState(config.modelUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const [previewMode, setPreviewMode] = useState(config.defaultLightingMode || 'sunset');
  const [previewWireframe, setPreviewWireframe] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state with store updates & load model Blob URL
  useEffect(() => {
    let isMounted = true;

    async function loadActiveModel() {
      try {
        const url = await getActiveModelBlobUrl();
        if (isMounted) {
          setCustomModelUrl(url);
        }
      } catch (err) {
        console.warn('Could not load active model URL:', err);
      }
    }

    loadActiveModel();

    const unsub = subscribeToHero3D((newConfig) => {
      setConfig(newConfig);
      if (newConfig.modelUrl) {
        setUrlInput(newConfig.modelUrl);
      }
      if (newConfig.defaultLightingMode) {
        setPreviewMode(newConfig.defaultLightingMode);
      }
      loadActiveModel();
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // Handle local file upload (.glb / .gltf)
  const handleFileUpload = async (file) => {
    if (!file) return;

    const name = file.name.toLowerCase();
    if (!name.endsWith('.glb') && !name.endsWith('.gltf')) {
      setUploadError('Please select a valid .glb or .gltf 3D file.');
      return;
    }

    // Check size limit (Max 60MB)
    if (file.size > 60 * 1024 * 1024) {
      setUploadError('File exceeds 60MB. For optimal web speed, please compress textures or geometries in Blender.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await saveUploaded3DModel(file);
      setCustomModelUrl(res.blobUrl);
      setIsUploading(false);
      showSuccessFeedback();
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Failed to process 3D file.');
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle remote URL submission
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setUploadError('Please enter a valid 3D model URL.');
      return;
    }

    setUploadError(null);
    const updated = updateHero3DSettings({
      activeSource: 'url',
      modelUrl: urlInput.trim(),
      modelName: urlInput.split('/').pop()?.split('?')[0] || 'Remote 3D Model',
      modelSize: 'Remote URL',
    });
    setConfig(updated);
    setCustomModelUrl(urlInput.trim());
    showSuccessFeedback();
  };

  // Handle setting updates
  const handleSettingChange = (key, value) => {
    const updated = updateHero3DSettings({ [key]: value });
    setConfig(updated);
    if (key === 'defaultLightingMode') {
      setPreviewMode(value);
      setPreviewWireframe(value === 'blueprint');
    }
  };

  // Reset to default procedural villa
  const handleResetDefault = async () => {
    if (window.confirm('Reset homepage hero back to the default AuroYali Bioclimatic Earth Villa?')) {
      const updated = await resetHeroToDefault();
      setConfig(updated);
      setCustomModelUrl(null);
      setUrlInput('');
      setUploadError(null);
      showSuccessFeedback();
    }
  };

  const showSuccessFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const isCustomActive = config.activeSource !== 'default';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 font-body select-none">
      
      {/* 1. TOP HEADER & PRIMARY ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Box size={11} />
              <span>Hero 3D Studio</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/60">•</span>
            <span className="text-xs font-mono text-[#524336]/80">Interactive WebGL & GLTF</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#2F1F13] tracking-tight [font-variant-numeric:lining-nums]">
            Hero 3D Studio & Model Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light max-w-2xl">
            Upload custom 3D models (<code className="px-1 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5] font-mono text-[11px] text-[#B5532F]">.glb</code> / <code className="px-1 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5] font-mono text-[11px] text-[#B5532F]">.gltf</code>) to display live in the homepage hero section. Inspect real-time changes with the unclipped 3D preview.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isCustomActive && (
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
              title="Reset hero to default procedural villa"
            >
              <Trash2 size={13} />
              <span>Reset to Villa</span>
            </button>
          )}

          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2F1F13] hover:bg-[#B5532F] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-95 group"
          >
            <span>View Live Site</span>
            <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2. SUCCESS FEEDBACK TOAST */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">Hero 3D Model Published Live!</span>
                <span className="text-emerald-700">The homepage hero section is now rendering your updated 3D model.</span>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full font-bold">
              Synced
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CURRENT ACTIVE STATUS STRIP */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isCustomActive ? 'bg-[#B5532F] text-white' : 'bg-[#2F1F13] text-amber-200'
          }`}>
            <Box size={22} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live on Homepage
              </span>
              <span className="text-[10px] font-mono text-[#865430]/70 uppercase">
                Source: {config.activeSource.toUpperCase()}
              </span>
            </div>

            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2F1F13] mt-0.5">
              {isCustomActive ? config.modelName : 'Auroville Bioclimatic Earth Villa (Procedural Standard)'}
            </h3>

            {isCustomActive && (
              <p className="text-xs text-[#524336] font-mono mt-0.5">
                Size: {config.modelSize || 'Direct Binary'} &bull; Format: GLTF Binary (.glb) &bull; IndexedDB Cached
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Auto-Centered & Scaled</span>
          </div>
        </div>
      </div>

      {/* 4. MAIN SPLIT GRID: CONTROLS (LEFT) + LIVE PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: UPLOAD & CONFIGURATION (6 COLS) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* CARD A: 3D MODEL SOURCE SELECTION */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5D7C5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-3">
              <div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-[#2F1F13]">
                  3D Model Source
                </h3>
                <p className="text-xs text-[#524336] font-light">
                  Upload a 3D architecture file or link a remote .glb asset
                </p>
              </div>

              {/* Segmented Source Switcher */}
              <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E5D7C5] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-[#B5532F] text-white font-bold shadow-xs'
                      : 'text-[#524336] hover:text-[#2F1F13]'
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-[#B5532F] text-white font-bold shadow-xs'
                      : 'text-[#524336] hover:text-[#2F1F13]'
                  }`}
                >
                  Remote URL
                </button>
              </div>
            </div>

            {/* TAB 1: FILE UPLOAD */}
            {activeTab === 'upload' && (
              <div className="space-y-3">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-[#B5532F] bg-[#B5532F]/5 scale-[0.99]'
                      : 'border-[#E5D7C5] hover:border-[#B5532F]/60 bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".glb,.gltf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="space-y-2.5">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-[#B5532F]/10 text-[#B5532F] flex items-center justify-center transition-transform shadow-2xs">
                      {isUploading ? (
                        <RotateCw size={22} className="animate-spin" />
                      ) : (
                        <Upload size={22} />
                      )}
                    </div>

                    <div>
                      <p className="font-heading text-sm sm:text-base font-bold text-[#2F1F13]">
                        {isUploading
                          ? 'Optimizing & Caching 3D Model in IndexedDB...'
                          : 'Drag & Drop your .glb / .gltf file here'}
                      </p>
                      <p className="text-xs text-[#865430] mt-0.5 font-light">
                        or <span className="text-[#B5532F] font-semibold underline underline-offset-2">browse computer files</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#524336]/70">
                      <span>Standard GLTF Binary (.glb)</span>
                      <span>&bull;</span>
                      <span>Max 60MB</span>
                    </div>
                  </div>
                </div>

                {/* Show uploaded model card if active */}
                {isCustomActive && config.activeSource === 'upload' && (
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <FileCheck size={18} className="text-[#B5532F] shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-[#2F1F13] block truncate">{config.modelName}</span>
                        <span className="text-[11px] font-mono text-[#865430]">{config.modelSize || 'Binary Active'}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E5D7C5] text-[11px] font-mono text-[#524336] hover:text-[#B5532F] cursor-pointer shrink-0"
                    >
                      Replace
                    </button>
                  </div>
                )}

                {uploadError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: REMOTE URL */}
            {activeTab === 'url' && (
              <form onSubmit={handleUrlSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] mb-1 font-semibold">
                    Direct .GLB Model URL
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#865430]/60" />
                      <input
                        type="url"
                        placeholder="https://your-domain.com/models/villa.glb"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2] text-xs font-mono text-[#2F1F13] focus:outline-none focus:border-[#B5532F]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#964324] text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Load
                    </button>
                  </div>
                  <p className="text-[11px] text-[#524336]/80 mt-1 font-light">
                    Public HTTPS URL with CORS enabled (e.g., Supabase, Cloudinary, GitHub raw).
                  </p>
                </div>

                {uploadError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </form>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: UNCLIPPED LIVE 3D VIEWPORT (6 COLS, STICKY) */}
        <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-4">
          
          <Admin3DPreview
            config={config}
            customModelUrl={customModelUrl}
            mode={previewMode}
            onModeChange={(m) => setPreviewMode(m)}
            wireframe={previewWireframe}
            onWireframeToggle={(w) => setPreviewWireframe(w)}
          />

          {/* Quick Info & Inspect Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-mono text-[11px] text-[#865430] uppercase block font-semibold">
                Homepage Hero Preview
              </span>
              <p className="text-[#524336] text-xs font-light">
                Model changes reflect instantaneously on the public website.
              </p>
            </div>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2F1F13] hover:bg-[#B5532F] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors shrink-0 shadow-2xs"
            >
              <span>Inspect</span>
              <ArrowRight size={13} />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminHero3D;
