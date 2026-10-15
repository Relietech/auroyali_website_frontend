import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import {
  Sun,
  Sunset,
  Moon,
  Layers,
  RotateCw,
  Maximize2,
  RefreshCcw,
  Box,
  Eye
} from 'lucide-react';
import { WebGLErrorBoundary, isWebGLAvailable } from '../3d/WebGLErrorBoundary';
import { RealisticVilla } from '../3d/Hero3DCanvas';
import { UploadedModelViewer } from '../3d/UploadedModelViewer';

/**
 * Admin3DPreview
 * A dedicated, perfectly framed 3D viewport tailored for the Admin Studio.
 * Prevents camera clipping, provides zoom/orbit controls, and clean external toolbar.
 */
export function Admin3DPreview({
  config,
  customModelUrl,
  mode,
  onModeChange,
  wireframe,
  onWireframeToggle,
  onResetCamera,
}) {
  const controlsRef = useRef();
  const [isRotating, setIsRotating] = useState(config?.autoRotate ?? true);
  const [modelError, setModelError] = useState(false);
  const [webglAvailable] = useState(() => isWebGLAvailable());

  useEffect(() => {
    setIsRotating(config?.autoRotate ?? true);
  }, [config?.autoRotate]);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    if (onResetCamera) onResetCamera();
  };

  const isCustomActive =
    config?.activeSource !== 'default' && Boolean(customModelUrl) && !modelError;

  return (
    <div className="flex flex-col bg-[#FAF7F2] rounded-3xl border border-[#E5D7C5] overflow-hidden shadow-sm">
      
      {/* 1. VIEWPORT TOP STATUS BAR */}
      <div className="px-4 py-3 bg-white border-b border-[#E5D7C5] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#2F1F13] uppercase tracking-wider text-[11px]">
            Live 3D Viewport
          </span>
          <span className="text-[#865430]/40">•</span>
          <span className="text-[#865430] text-[11px] font-medium hidden sm:inline">
            {isCustomActive ? (config?.modelName || 'Uploaded Model') : 'Auroville Bioclimatic Villa'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#524336]/80">
          <Eye size={12} className="text-[#B5532F]" />
          <span>360° Drag & Zoom</span>
        </div>
      </div>

      {/* 2. MAIN 3D CANVAS STAGE */}
      <div className="relative w-full h-[380px] sm:h-[440px] bg-gradient-to-b from-[#F5ECE0] via-[#FBF8F3] to-[#F2E8DC] cursor-grab active:cursor-grabbing">
        <WebGLErrorBoundary
          fallback={() => (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#524336]">
              <Box size={36} className="text-[#B5532F] mb-2" />
              <p className="font-heading text-lg font-bold text-[#2F1F13]">WebGL Context Suspended</p>
              <p className="text-xs font-mono mt-1">Please reload or check hardware acceleration.</p>
            </div>
          )}
        >
          {webglAvailable ? (
            <Canvas
              shadows
              dpr={[1, 1.5]}
              camera={{ position: [3.4, 2.4, 7.2], fov: 38 }}
              className="w-full h-full"
              gl={{ antialias: true, powerPreference: 'default' }}
            >
              {/* Atmospheric Sky Lighting */}
              <ambientLight intensity={mode === 'night' ? 0.85 : mode === 'sunset' ? 1.0 : 1.4} />

              <directionalLight
                position={[8, 12, 7]}
                intensity={mode === 'sunset' ? 2.4 : mode === 'night' ? 1.4 : 2.4}
                color={mode === 'sunset' ? '#ffa366' : mode === 'night' ? '#bfdbfe' : '#fffbeb'}
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0003}
                shadow-normalBias={0.04}
              />

              <directionalLight
                position={[-6, 5, -5]}
                intensity={mode === 'night' ? 0.6 : 0.6}
                color={mode === 'sunset' ? '#b45309' : mode === 'night' ? '#38bdf8' : '#7a8b69'}
              />

              {/* Model Render */}
              {isCustomActive ? (
                <UploadedModelViewer
                  modelUrl={customModelUrl}
                  scale={config?.scale || 1.0}
                  rotationY={config?.rotationY || 0}
                  posY={config?.posY || 0}
                  mode={mode}
                  wireframe={wireframe}
                  onError={() => setModelError(true)}
                />
              ) : (
                <RealisticVilla
                  mode={mode}
                  wireframe={wireframe}
                />
              )}

              {/* Ground Contact Shadow */}
              <ContactShadows
                position={[0, -0.32, 0]}
                opacity={0.65}
                scale={9.5}
                blur={1.6}
                far={3.8}
              />

              {/* Orbit Controls with Zoom enabled for Admin Inspection */}
              <OrbitControls
                ref={controlsRef}
                enableZoom={true}
                minDistance={3.5}
                maxDistance={14}
                enablePan={false}
                enableDamping={true}
                dampingFactor={0.08}
                target={[0, 0.45, 0]}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.15}
                autoRotate={isRotating}
                autoRotateSpeed={config?.autoRotateSpeed ?? 0.8}
              />
            </Canvas>
          ) : null}
        </WebGLErrorBoundary>

        {/* Small floating tag indicator */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E5D7C5] text-[10px] font-mono text-[#524336] shadow-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${isCustomActive ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span>{isCustomActive ? 'Custom Upload Active' : 'Procedural Villa'}</span>
          </span>
        </div>
      </div>

      {/* 3. VIEWPORT BOTTOM CONTROL TOOLBAR */}
      <div className="p-3 bg-white border-t border-[#E5D7C5] flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Lighting Atmosphere Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5D7C5]">
          <button
            type="button"
            onClick={() => { onModeChange('day'); if (wireframe) onWireframeToggle(false); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'day' && !wireframe
                ? 'bg-[#2F1F13] text-white font-bold shadow-xs'
                : 'text-[#524336] hover:text-[#B5532F]'
            }`}
            title="Daylight mode"
          >
            <Sun size={13} />
            <span>Day</span>
          </button>

          <button
            type="button"
            onClick={() => { onModeChange('sunset'); if (wireframe) onWireframeToggle(false); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'sunset' && !wireframe
                ? 'bg-[#B5532F] text-white font-bold shadow-xs'
                : 'text-[#524336] hover:text-[#B5532F]'
            }`}
            title="Sunset Golden Hour"
          >
            <Sunset size={13} />
            <span>Sunset</span>
          </button>

          <button
            type="button"
            onClick={() => { onModeChange('night'); if (wireframe) onWireframeToggle(false); }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'night' && !wireframe
                ? 'bg-[#1E293B] text-amber-300 font-bold shadow-xs'
                : 'text-[#524336] hover:text-[#B5532F]'
            }`}
            title="Night Thermal Glow"
          >
            <Moon size={13} />
            <span>Night</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (mode === 'blueprint' || wireframe) {
                onModeChange('sunset');
                onWireframeToggle(false);
              } else {
                onModeChange('blueprint');
                onWireframeToggle(true);
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'blueprint' || wireframe
                ? 'bg-[#0284C7] text-white font-bold shadow-xs'
                : 'text-[#524336] hover:text-[#B5532F]'
            }`}
            title="Toggle CAD Blueprint Wireframe"
          >
            <Layers size={13} />
            <span>CAD</span>
          </button>
        </div>

        {/* Viewport Actions (Turntable toggle, Camera Reset) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              isRotating
                ? 'bg-[#B5532F]/10 border-[#B5532F]/30 text-[#B5532F] font-bold'
                : 'bg-[#FAF7F2] border-[#E5D7C5] text-[#524336] hover:text-[#2F1F13]'
            }`}
            title={isRotating ? 'Pause Turntable Rotation' : 'Start Turntable Rotation'}
          >
            <RotateCw size={12} className={isRotating ? 'animate-spin' : ''} style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">{isRotating ? 'Rotating' : 'Paused'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EBE0] border border-[#E5D7C5] text-[#524336] hover:text-[#B5532F] text-xs font-mono transition-colors cursor-pointer"
            title="Reset Camera Framing"
          >
            <RefreshCcw size={12} />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        </div>

      </div>

    </div>
  );
}

export default Admin3DPreview;
