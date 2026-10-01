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

function BambooNodeModel() {
  const groupRef = useRef();

  return (
    <group ref={groupRef} rotation={[0.2, 0.3, 0]}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 2.2, 24]} />
        <meshStandardMaterial color="#c29b64" roughness={0.65} />
      </mesh>
      {[-0.6, 0, 0.6].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.23, 0.02, 16, 32]} />
          <meshStandardMaterial color="#8c683b" roughness={0.8} />
        </mesh>
      ))}

      <mesh castShadow position={[0.6, 0.2, 0]} rotation={[0, 0, Math.PI / 2.6]}>
        <cylinderGeometry args={[0.16, 0.16, 1.4, 24]} />
        <meshStandardMaterial color="#d4ab74" roughness={0.65} />
      </mesh>

      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.35, 24]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function CortenPanelModel() {
  const panelRef = useRef();

  return (
    <group ref={panelRef} rotation={[0.1, 0.35, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.0, 0.05]} />
        <meshStandardMaterial color="#994627" roughness={0.88} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[1.3, 1.8, 0.02]} />
        <meshStandardMaterial color="#6e2d16" roughness={0.9} />
      </mesh>
    </group>
  );
}

const MATERIALS = [
  {
    id: 'cseb',
    name: 'Compressed Stabilized Earth Block',
    subtitle: 'High Thermal Mass Masonry',
    specs: {
      density: '1,850 - 2,000 kg/m³',
      embodiedCarbon: '80% Lower than fired brick',
      thermalLag: '8 - 10 Hours',
      lifespan: '100+ Years',
      composition: 'Local red soil (75%), sand (18%), lime/cement stabilizer (7%)'
    }
  },
  {
    id: 'bamboo',
    name: 'Engineered Solid Bamboo Joinery',
    subtitle: 'Tensile Organic Steel',
    specs: {
      tensileStrength: 'Comparable to structural mild steel (160 MPa)',
      treatment: 'Borax-Boric Acid non-toxic bath',
      growthCycle: 'Harvested in 3-4 years vs 40 years for timber',
      carbonSequestration: 'Net Carbon Negative (-12kg CO2/pole)'
    }
  },
  {
    id: 'corten',
    name: 'Weathering Corten Steel',
    subtitle: 'Artisanal Biophilic Facets',
    specs: {
      protectiveOxide: 'Self-healing natural patina',
      maintenance: 'Zero painting / chemical coatings required',
      durability: 'Class A architectural corrosion resistance',
      recyclability: '100% Circular material lifecycle'
    }
  }
];

export function MaterialExplorer3D() {
  const [selectedMat, setSelectedMat] = useState(0);
  const [exploded, setExploded] = useState(false);

  const active = MATERIALS[selectedMat];

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

        <div className="flex flex-wrap gap-2">
          {MATERIALS.map((mat, i) => (
            <button
              key={mat.id}
              onClick={() => setSelectedMat(i)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ${
                selectedMat === i
                  ? 'bg-clay text-white shadow-lg'
                  : 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700'
              }`}
            >
              {mat.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 h-[360px] md:h-[420px] bg-stone-950/60 rounded-2xl relative border border-earth-700/40 overflow-hidden">
          <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} className="cursor-grab active:cursor-grabbing">
            <ambientLight intensity={1.0} />
            <directionalLight position={[4, 5, 4]} intensity={2.0} color="#fff1e6" />
            <pointLight position={[-4, -3, -2]} intensity={0.6} color="#7a8b69" />

            {selectedMat === 0 && <CSEBModel exploded={exploded} />}
            {selectedMat === 1 && <BambooNodeModel />}
            {selectedMat === 2 && <CortenPanelModel />}

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

            {selectedMat === 0 && (
              <button
                onClick={() => setExploded(!exploded)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full border border-earth-700 text-[11px] transition-all"
              >
                {exploded ? 'Stack Blocks' : 'Explode View'}
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-stone-900/80 p-6 md:p-8 rounded-2xl border border-earth-700/50 flex flex-col justify-between h-full">
          <div>
            <span className="text-xs uppercase tracking-widest text-sage font-mono">
              Auroville Specification Sheet
            </span>
            <h4 className="font-heading text-2xl md:text-3xl text-earth-100 mt-1 mb-2">
              {active.name}
            </h4>
            <p className="text-stone-300 text-sm font-light mb-6">
              {active.subtitle} &bull; Formulated & pressed in our Kottakarai yard.
            </p>

            <div className="space-y-3.5">
              {Object.entries(active.specs).map(([key, val]) => (
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
