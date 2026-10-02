import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function CSEBModel({ exploded }) {
  const mesh1 = useRef();
  const mesh2 = useRef();
  const mesh3 = useRef();

  useFrame(() => {
    if (mesh2.current) mesh2.current.position.y = exploded ? 0.65 : 0.28;
    if (mesh3.current) mesh3.current.position.y = exploded ? -0.65 : -0.28;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={mesh1} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 0.9]} />
        <meshStandardMaterial color="#c48a58" roughness={0.95} bumpScale={0.05} />
      </mesh>

      <mesh ref={mesh2} position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 0.9]} />
        <meshStandardMaterial color="#b57a46" roughness={0.92} />
      </mesh>

      <mesh ref={mesh3} position={[0, -0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.5, 0.9]} />
        <meshStandardMaterial color="#9e6634" roughness={0.96} />
      </mesh>
    </group>
  );
}

const MATERIAL = {
  id: 'cseb',
  name: 'Compressed Stabilized Earth Block (CSEB)',
  subtitle: 'High Thermal Mass Natural Masonry',
  specs: {
    density: '1,850 - 2,000 kg/m³',
    embodiedCarbon: '80% Lower than fired brick',
    thermalLag: '8 - 10 Hours passive regulation',
    lifespan: '100+ Years durability',
    composition: 'Local red soil (75%), sand (18%), lime/cement stabilizer (7%)'
  }
};

export function MaterialExplorer3D() {
  const [exploded, setExploded] = useState(false);

  return (
    <div className="w-full bg-earth-900 text-stone-100 rounded-3xl p-6 md:p-10 border border-earth-700 shadow-2xl overflow-hidden relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-earth-700/60 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-clay font-medium block mb-2">
            Material Science & Craft
          </span>
          <h3 className="font-heading text-3xl md:text-5xl text-earth-50">
            Interactive 3D Material Studio
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setExploded(!exploded)}
            className="px-4 py-2 bg-clay hover:bg-clay/90 text-white rounded-full text-xs uppercase tracking-wider transition-all shadow-md font-medium"
          >
            {exploded ? 'Stack Blocks' : 'Explode View'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 h-[360px] md:h-[420px] bg-stone-950/60 rounded-2xl relative border border-earth-700/40 overflow-hidden">
          <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} className="cursor-grab active:cursor-grabbing">
            <ambientLight intensity={1.0} />
            <directionalLight position={[4, 5, 4]} intensity={2.0} color="#fff1e6" />
            <pointLight position={[-4, -3, -2]} intensity={0.6} color="#7a8b69" />

            <CSEBModel exploded={exploded} />

            <OrbitControls
              enableZoom={false}
              enableDamping={true}
              dampingFactor={0.08}
              autoRotate={false}
            />
          </Canvas>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
              <span>Rotate 360° to Inspect Tactile Layers</span>
            </span>

            <button
              onClick={() => setExploded(!exploded)}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full border border-earth-700 text-[11px] transition-all"
            >
              {exploded ? 'Stack Blocks' : 'Explode View'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-stone-900/80 p-6 md:p-8 rounded-2xl border border-earth-700/50 flex flex-col justify-between h-full">
          <div>
            <span className="text-xs uppercase tracking-widest text-sage font-mono">
              Auroville Specification Sheet
            </span>
            <h4 className="font-heading text-2xl md:text-3xl text-earth-100 mt-1 mb-2">
              {MATERIAL.name}
            </h4>
            <p className="text-stone-300 text-sm font-light mb-6">
              {MATERIAL.subtitle} &bull; Formulated & pressed in our Kottakarai yard.
            </p>

            <div className="space-y-3.5">
              {Object.entries(MATERIAL.specs).map(([key, val]) => (
                <div key={key} className="flex flex-col border-b border-earth-800 pb-2.5">
                  <span className="text-[11px] uppercase tracking-wider text-earth-300 font-mono">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-stone-100 font-normal text-sm">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 flex items-center justify-between text-xs text-stone-400">
            <span>Eco-Certified &bull; Zero Toxic Glues</span>
            <span className="text-clay font-medium">AuroYali Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MaterialExplorer3D;
