import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileCheck,
  RotateCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Link as LinkIcon,
  Eye,
  Trash2,
  ArrowRight,
  Package,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getMaterialStudioConfig,
  updateMaterialStudioSettings,
  saveUploadedMaterialModel,
  getActiveMaterialBlobUrl,
  resetMaterialStudioToDefault,
  subscribeToMaterialStudio
} from '../../services/materialStudioStore';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Model3D } from '../../components/3d/Model3D';
import { UploadedModelViewer } from '../../components/3d/UploadedModelViewer';
import { WebGLErrorBoundary, isWebGLAvailable } from '../../components/3d/WebGLErrorBoundary';

export function AdminMaterialStudio() {
  const [config, setConfig] = useState(() => getMaterialStudioConfig());
  const [customModelUrl, setCustomModelUrl] = useState(null);
  const [activeTab, setActiveTab] = useState(config.activeSource === 'url' ? 'url' : 'upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [urlInput, setUrlInput] = useState(config.modelUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const [webglAvailable] = useState(() => isWebGLAvailable());
  const fileInputRef = useRef(null);

  // Sync state with store updates & load model Blob URL
  useEffect(() => {
    let isMounted = true;

    async function loadActiveModel() {
      try {
        const url = await getActiveMaterialBlobUrl();
        if (isMounted) {
          setCustomModelUrl(url);
        }
      } catch (err) {
        console.warn('Could not load material model URL:', err);
      }
    }

    loadActiveModel();

    const unsub = subscribeToMaterialStudio((newConfig) => {
      setConfig(newConfig);
      if (newConfig.modelUrl) {
        setUrlInput(newConfig.modelUrl);
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

    if (file.size > 60 * 1024 * 1024) {
      setUploadError('File exceeds 60MB. Please optimize the model in Blender.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await saveUploadedMaterialModel(file);
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
    const updated = updateMaterialStudioSettings({
      activeSource: 'url',
      modelUrl: urlInput.trim(),
      modelName: urlInput.split('/').pop()?.split('?')[0] || 'Remote Material Model',
      modelSize: 'Remote URL',
    });
    setConfig(updated);
    setCustomModelUrl(urlInput.trim());
    showSuccessFeedback();
  };

  // Reset to default procedural CSEB blocks
  const handleResetDefault = async () => {
    if (window.confirm('Reset homepage material studio back to the default AuroYali CSEB Earth Blocks?')) {
      const updated = await resetMaterialStudioToDefault();
      setConfig(updated);
      setCustomModelUrl(null);
      setUrlInput('');
      setUploadError(null);
      showSuccessFeedback();
    }
  };

  const handleFieldChange = (key, value) => {
    const updated = updateMaterialStudioSettings({ [key]: value });
    setConfig(updated);
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
              <Layers size={11} />
              <span>3D Material Studio</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/60">•</span>
            <span className="text-xs font-mono text-[#524336]/80">Material Science & Craft</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#2F1F13] tracking-tight [font-variant-numeric:lining-nums]">
            3D Material Studio Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light max-w-2xl">
            Upload custom 3D material specimens, brick formats, or joinery prototypes (<code className="px-1 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5] font-mono text-[11px] text-[#B5532F]">.glb</code> / <code className="px-1 py-0.5 rounded bg-[#FAF7F2] border border-[#E5D7C5] font-mono text-[11px] text-[#B5532F]">.gltf</code>) to showcase live in the homepage Material Studio.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {isCustomActive && (
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:border-red-300 text-red-700 hover:bg-red-50 text-xs font-mono uppercase tracking-wider transition-all shadow-2xs active:scale-95 cursor-pointer"
              title="Reset material studio to default CSEB blocks"
            >
              <Trash2 size={13} />
              <span>Reset to CSEB</span>
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
                <span className="font-bold block">Material Studio 3D Updated!</span>
                <span className="text-emerald-700">The homepage Material Studio is now rendering your updated specimen.</span>
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
            <Package size={22} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live in Material Studio
              </span>
              <span className="text-[10px] font-mono text-[#865430]/70 uppercase">
                Source: {config.activeSource.toUpperCase()}
              </span>
            </div>

            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2F1F13] mt-0.5">
              {isCustomActive ? config.modelName : 'Compressed Stabilized Earth Block (CSEB Standard)'}
            </h3>

            <p className="text-xs text-[#524336] font-mono mt-0.5">
              {isCustomActive
                ? `Size: ${config.modelSize || 'Binary Active'} • GLTF Binary • Auto-Centered`
                : 'Procedural 3-Block Masonry • Kottakarai Yard Formulation'}
            </p>
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
        
        {/* LEFT COLUMN: UPLOAD & LABELS (6 COLS) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* CARD A: 3D MODEL SOURCE SELECTION */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5D7C5] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5D7C5]/60 pb-3">
              <div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-[#2F1F13]">
                  3D Material Source
                </h3>
                <p className="text-xs text-[#524336] font-light">
                  Upload a 3D material specimen or link a remote .glb asset
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
                          ? 'Caching Material Model in IndexedDB...'
                          : 'Drag & Drop your material .glb / .gltf here'}
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
                    Direct .GLB Material Model URL
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#865430]/60" />
                      <input
                        type="url"
                        placeholder="https://your-domain.com/models/bamboo-joint.glb"
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

          {/* CARD B: MATERIAL TITLE & SPECIFICATION DETAILS */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E5D7C5] shadow-xs space-y-4">
            <div className="border-b border-[#E5D7C5]/60 pb-3">
              <h3 className="font-heading text-base sm:text-lg font-bold text-[#2F1F13]">
                Material Information & Specs Header
              </h3>
              <p className="text-xs text-[#524336] font-light">
                The title and descriptive subtitle displayed alongside the 3D specimen
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] mb-1 font-semibold">
                  Material Title
                </label>
                <input
                  type="text"
                  value={config.materialTitle || ''}
                  onChange={(e) => handleFieldChange('materialTitle', e.target.value)}
                  placeholder="e.g. Compressed Stabilized Earth Block (CSEB)"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2] text-xs font-heading font-bold text-[#2F1F13] focus:outline-none focus:border-[#B5532F]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#524336] mb-1 font-semibold">
                  Material Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={config.materialSubtitle || ''}
                  onChange={(e) => handleFieldChange('materialSubtitle', e.target.value)}
                  placeholder="e.g. High Thermal Mass Natural Masonry · Formulated & pressed in our Kottakarai yard."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E5D7C5] bg-[#FAF7F2] text-xs text-[#2F1F13] focus:outline-none focus:border-[#B5532F]"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE 3D PREVIEW (6 COLS, STICKY) */}
        <div className="lg:col-span-6 lg:sticky lg:top-20 space-y-4">
          <div className="flex flex-col bg-[#FAF7F2] rounded-3xl border border-[#E5D7C5] overflow-hidden shadow-sm">
            
            {/* Top Preview Bar */}
            <div className="px-4 py-3 bg-white border-b border-[#E5D7C5] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-[#2F1F13] uppercase tracking-wider text-[11px]">
                  Material 3D Viewport
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#524336]/80">
                <Eye size={12} className="text-[#B5532F]" />
                <span>360° Drag to Rotate</span>
              </div>
            </div>

            {/* 3D Canvas Stage */}
            <div className="relative w-full h-[380px] sm:h-[420px] bg-gradient-to-b from-[#F5ECE0] via-[#FBF8F3] to-[#F2E8DC] cursor-grab active:cursor-grabbing">
              <WebGLErrorBoundary
                fallback={() => (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#524336]">
                    <Layers size={36} className="text-[#B5532F] mb-2" />
                    <p className="font-heading text-lg font-bold text-[#2F1F13]">WebGL Context Suspended</p>
                  </div>
                )}
              >
                {webglAvailable ? (
                  <Canvas
                    shadows
                    dpr={[1, 1.5]}
                    camera={{ position: [2.0, 1.4, 3.2], fov: 36 }}
                    className="w-full h-full"
                    gl={{ antialias: true, powerPreference: 'default' }}
                  >
                    <ambientLight intensity={1.3} color="#fff6ed" />
                    <directionalLight
                      position={[4.5, 5.5, 3.5]}
                      intensity={2.6}
                      color="#ffffff"
                      castShadow
                      shadow-mapSize-width={1024}
                      shadow-mapSize-height={1024}
                      shadow-bias={-0.0001}
                    />
                    <directionalLight position={[-3.5, 2.5, -2.5]} intensity={0.9} color="#e8af84" />
                    <pointLight position={[0, -1.8, 2.5]} intensity={0.5} color="#b5532d" />

                    {isCustomActive && customModelUrl ? (
                      <UploadedModelViewer
                        modelUrl={customModelUrl}
                        scale={0.88}
                        posY={-0.12}
                        mode="day"
                      />
                    ) : (
                      <Model3D
                        activeSpec="DENSITY"
                        stacked={true}
                        reducedMotion={false}
                      />
                    )}

                    <ContactShadows
                      position={[0, -0.65, 0]}
                      opacity={0.6}
                      scale={4.5}
                      blur={1.4}
                      far={2.5}
                    />

                    <OrbitControls
                      enableZoom={true}
                      minDistance={1.8}
                      maxDistance={8}
                      enablePan={false}
                      enableDamping={true}
                      dampingFactor={0.07}
                      autoRotate={true}
                      autoRotateSpeed={0.7}
                      minPolarAngle={Math.PI / 6}
                      maxPolarAngle={Math.PI / 2 + 0.08}
                    />
                  </Canvas>
                ) : null}
              </WebGLErrorBoundary>

              <div className="absolute top-3 left-3 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E5D7C5] text-[10px] font-mono text-[#524336] shadow-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCustomActive ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span>{isCustomActive ? 'Custom Specimen Active' : 'Procedural CSEB Blocks'}</span>
                </span>
              </div>
            </div>

            {/* Bottom Inspect Strip */}
            <div className="p-3 bg-white border-t border-[#E5D7C5] flex items-center justify-between text-xs font-mono">
              <span className="text-[#865430] text-[11px]">
                {config.materialTitle || 'CSEB Block'}
              </span>
              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2F1F13] hover:bg-[#B5532F] text-white text-xs uppercase tracking-wider font-semibold transition-colors shadow-2xs"
              >
                <span>Inspect on Homepage</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminMaterialStudio;
