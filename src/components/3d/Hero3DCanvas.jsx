import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Realistic Modern Bioclimatic Earth Villa (Manual Rotation Only)
function RealisticEcoVilla({ mode, wireframe }) {
  const groupRef = useRef();
  const poolRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (poolRef.current) {
      poolRef.current.material.opacity = 0.85 + Math.sin(t * 2.5) * 0.08;
    }
  });

  const theme = useMemo(() => {
    switch (mode) {
      case 'sunset':
        return {
          rammedEarth: '#a8502e',
          csebDark: '#783218',
          limestone: '#e2d3c1',
          wood: '#683618',
          glass: '#fb923c',
          water: '#ea580c',
          glow: '#fbbf24',
          glowIntensity: 2.2,
          deck: '#8a4b27',
          steel: '#33241d'
        };
      case 'night':
        return {
          rammedEarth: '#362822',
          csebDark: '#231814',
          limestone: '#5a514b',
          wood: '#2b1b14',
          glass: '#38bdf8',
          water: '#0284c7',
          glow: '#f59e0b',
          glowIntensity: 3.5,
          deck: '#2d1f18',
          steel: '#1e293b'
        };
      default: // day
        return {
          rammedEarth: '#c47d4e',
          csebDark: '#9e5a2e',
          limestone: '#f3ece2',
          wood: '#8c502c',
          glass: '#bae6fd',
          water: '#38bdf8',
          glow: '#fef08a',
          glowIntensity: 0.8,
          deck: '#b47348',
          steel: '#475569'
        };
    }
  }, [mode]);

  return (
    <group ref={groupRef} position={[0, -0.35, 0]} scale={0.95}>
      
      {/* 1. Natural Stone Terrace Platform & Grass Foundation */}
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[6.8, 0.24, 5.8]} />
        <meshStandardMaterial color="#6a775b" roughness={0.9} />
      </mesh>

      {/* Travertine Stone Paved Patio */}
      <mesh position={[0.2, 0.01, 0.3]} receiveShadow>
        <boxGeometry args={[6.2, 0.04, 5.2]} />
        <meshStandardMaterial color={theme.limestone} roughness={0.7} />
      </mesh>

      {/* 2. Central Infinity Reflecting Pool */}
      <group position={[1.4, 0.04, 1.4]}>
        {/* Pool Coping Edge */}
        <mesh receiveShadow>
          <boxGeometry args={[2.6, 0.08, 1.6]} />
          <meshStandardMaterial color="#332c27" roughness={0.8} />
        </mesh>
        {/* Water Surface with Rippling Caustics */}
        <mesh ref={poolRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 1.4]} />
          <meshStandardMaterial
            color={theme.water}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.88}
          />
        </mesh>
        {/* Submerged Stepping Stones */}
        {[-0.6, 0, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.045, 0]}>
            <boxGeometry args={[0.4, 0.03, 0.4]} />
            <meshStandardMaterial color={theme.limestone} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* 3. Main Ground Floor Villa Wing (Rammed Earth & Floor-to-Ceiling Glass) */}
      <group position={[-0.9, 0.75, 0]}>
        {/* Thick Rammed Earth Spine Wall */}
        <mesh position={[-1.2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 1.4, 3.8]} />
          <meshStandardMaterial color={theme.rammedEarth} roughness={0.92} />
        </mesh>

        {/* Back Solid Earth Wall */}
        <mesh position={[0.3, 0, -1.8]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 1.4, 0.3]} />
          <meshStandardMaterial color={theme.csebDark} roughness={0.9} />
        </mesh>

        {/* Ground Floor Living Space Transparent Glass Wall */}
        <mesh position={[0.4, 0, 0.6]}>
          <boxGeometry args={[2.4, 1.35, 0.04]} />
          <meshStandardMaterial
            color={theme.glass}
            transparent
            opacity={0.35}
            roughness={0.05}
            metalness={0.2}
          />
        </mesh>

        {/* Black Slimline Aluminum Window Mullions */}
        {[-0.6, 0.2, 1.0, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.61]}>
            <boxGeometry args={[0.04, 1.38, 0.06]} />
            <meshStandardMaterial color={theme.steel} metalness={0.85} roughness={0.3} />
          </mesh>
        ))}

        {/* Interior Illuminated Living Core */}
        <mesh position={[0.3, 0, -0.2]}>
          <boxGeometry args={[2.0, 1.2, 2.2]} />
          <meshStandardMaterial
            color="#221b16"
            emissive={theme.glow}
            emissiveIntensity={mode === 'night' ? 0.35 : mode === 'sunset' ? 0.2 : 0.05}
            roughness={0.8}
          />
        </mesh>

        {/* Interior Furniture: Minimalist Sofa & Coffee Table */}
        <mesh position={[0.1, -0.4, -0.3]} castShadow>
          <boxGeometry args={[1.1, 0.25, 0.6]} />
          <meshStandardMaterial color="#ded7cd" roughness={0.8} />
        </mesh>
        <mesh position={[0.1, -0.45, 0.2]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.35]} />
          <meshStandardMaterial color={theme.wood} roughness={0.7} />
        </mesh>
      </group>

      {/* 4. Cantilevered Upper Floor (Master Suite with Timber Louvers) */}
      <group position={[0.3, 1.95, -0.4]}>
        {/* Cantilevering Slab Floor */}
        <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.16, 3.2]} />
          <meshStandardMaterial color={theme.limestone} roughness={0.7} />
        </mesh>

        {/* Upper Master Bedroom Enclosure */}
        <mesh position={[-0.2, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.8, 1.2, 2.6]} />
          <meshStandardMaterial color={theme.limestone} roughness={0.8} />
        </mesh>

        {/* Upper Floor Deep Panorama Glass Window */}
        <mesh position={[-0.2, 0.6, 1.32]}>
          <boxGeometry args={[2.6, 1.0, 0.04]} />
          <meshStandardMaterial
            color={theme.glass}
            transparent
            opacity={0.35}
            roughness={0.05}
          />
        </mesh>

        {/* Vertical Teak Wood Shading Louvers (Jali screen) */}
        {[-1.3, -1.0, -0.7, 0.5, 0.8, 1.0].map((x, i) => (
          <mesh key={i} position={[x, 0.6, 1.36]} castShadow>
            <boxGeometry args={[0.06, 1.15, 0.12]} />
            <meshStandardMaterial color={theme.wood} roughness={0.75} />
          </mesh>
        ))}

        {/* Upper Overhanging Roof with Recessed LED Uplighting */}
        <mesh position={[-0.1, 1.26, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.12, 3.6]} />
          <meshStandardMaterial color="#2d221c" roughness={0.8} />
        </mesh>
      </group>

      {/* 5. Outdoor Teak Wood Pergola & Verandah Columns */}
      <group position={[-0.6, 1.3, 1.6]}>
        {/* Slender Structural Steel Support Columns */}
        {[
          [-1.2, 0.4],
          [0.8, 0.4]
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.6, z]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.4, 16]} />
            <meshStandardMaterial color={theme.steel} metalness={0.9} roughness={0.2} />
          </mesh>
        ))}

        {/* Floating Horizontal Wood Louver Slats */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((z, i) => (
          <mesh key={i} position={[-0.2, 0.1, z]} castShadow>
            <boxGeometry args={[2.4, 0.04, 0.08]} />
            <meshStandardMaterial color={theme.wood} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* 6. Sunken Firepit / Courtyard Lounge Seating */}
      <group position={[-1.6, 0.1, 1.4]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.2, 0.18, 1.2]} />
          <meshStandardMaterial color={theme.deck} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 16]} />
          <meshStandardMaterial color="#2b2622" roughness={0.9} />
        </mesh>
        {/* Firepit Warm Amber Core */}
        <mesh position={[0, 0.19, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color={theme.glow}
            emissive={theme.glow}
            emissiveIntensity={theme.glowIntensity}
          />
        </mesh>
      </group>

      {/* 7. Realistic Biophilic Landscaping (Tropical Palms & Architectural Planters) */}
      <group position={[2.4, 0, -1.8]}>
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.13, 2.2, 12]} />
          <meshStandardMaterial color="#503827" roughness={0.9} />
        </mesh>
        {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((rot, i) => (
          <mesh key={i} position={[0, 2.2, 0]} rotation={[Math.PI / 3.5, rot, 0]} castShadow>
            <boxGeometry args={[0.35, 0.02, 1.3]} />
            <meshStandardMaterial color="#446132" roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Architectural Planters with Shrubs */}
      {[
        [-2.4, 0.2, -0.6],
        [2.6, 0.15, 0.8]
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.35, 1.2]} />
            <meshStandardMaterial color={theme.csebDark} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshStandardMaterial color="#4a6b35" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Night Atmosphere Glowing Wall Sconces */}
      {mode !== 'day' && (
        <pointLight
          position={[0.3, 1.8, 1.4]}
          intensity={theme.glowIntensity * 1.5}
          distance={4}
          color="#ffb703"
        />
      )}
    </group>
  );
}

// Atmospheric Spatially Floating Sunlight / Golden Dust
function GoldenDustParticles({ count = 35, mode }) {
  const points = useRef();
  const color = mode === 'sunset' ? '#ffedd5' : mode === 'night' ? '#93c5fd' : '#fef08a';

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = Math.random() * 4 - 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

export function Hero3DCanvas({ className = "" }) {
  const [mode, setMode] = useState('day');
  const [wireframe, setWireframe] = useState(false);

  return (
    <div className={`relative w-full h-[480px] md:h-[540px] lg:h-[580px] rounded-3xl overflow-hidden bg-gradient-to-br from-earth-100/90 via-earth-50/60 to-earth-100/80 border border-earth-200/90 shadow-2xl ${className}`}>
      
      {/* 3D Canvas with Manual Drag Controls Only (No Auto-Rotation) */}
      <Canvas
        shadows
        camera={{ position: [5.2, 3.4, 5.2], fov: 38 }}
        className="cursor-grab active:cursor-grabbing w-full h-full"
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={mode === 'night' ? 0.35 : mode === 'sunset' ? 0.85 : 1.3} />
        
        {/* Sun Key Light */}
        <directionalLight
          position={[7, 10, 6]}
          intensity={mode === 'sunset' ? 3.0 : 2.0}
          color={mode === 'sunset' ? '#ff9a52' : mode === 'night' ? '#7dd3fc' : '#fffbeb'}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        
        <directionalLight
          position={[-5, 4, -4]}
          intensity={0.6}
          color="#7a8b69"
        />

        <RealisticEcoVilla mode={mode} wireframe={wireframe} />

        <GoldenDustParticles count={35} mode={mode} />

        {/* Orbit Controls: 100% Manual User Control */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.08}
          target={[0, 0.6, 0]}
          minPolarAngle={Math.PI / 4.8}
          maxPolarAngle={Math.PI / 2.18}
          autoRotate={false}
        />
      </Canvas>

      {/* Floating Mode Switcher */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full border border-earth-200 shadow-md z-10 text-xs">
        <button
          onClick={() => setMode('day')}
          className={`px-3 py-1 rounded-full transition-all font-medium ${mode === 'day' ? 'bg-earth-900 text-white shadow-sm' : 'text-earth-900 hover:text-clay'}`}
          title="Daylight Solar View"
        >
          Day
        </button>
        <button
          onClick={() => setMode('sunset')}
          className={`px-3 py-1 rounded-full transition-all font-medium ${mode === 'sunset' ? 'bg-clay text-white shadow-sm' : 'text-earth-900 hover:text-clay'}`}
          title="Golden Hour Bioclimatic Sun"
        >
          Sunset
        </button>
        <button
          onClick={() => setMode('night')}
          className={`px-3 py-1 rounded-full transition-all font-medium ${mode === 'night' ? 'bg-stone-800 text-white shadow-sm' : 'text-earth-900 hover:text-clay'}`}
          title="Night Thermal Glow"
        >
          Night
        </button>
        <span className="w-px h-3.5 bg-earth-200 mx-0.5" />
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-3 py-1 rounded-full transition-all font-medium ${wireframe ? 'bg-sage text-white' : 'text-earth-900 hover:text-clay'}`}
          title="Toggle Structural Wireframe"
        >
          {wireframe ? 'Wireframe: ON' : 'Blueprint'}
        </button>
      </div>

      {/* Drag Hint Pill */}
      <div className="absolute bottom-4 left-5 flex items-center gap-2 pointer-events-none bg-earth-900/85 text-earth-50 text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full backdrop-blur-md font-mono border border-earth-700/60 shadow-md">
        <span className="w-2 h-2 rounded-full bg-clay animate-ping" />
        <span>3D Bioclimatic Villa &bull; Drag to Rotate 360°</span>
      </div>
    </div>
  );
}
export default Hero3DCanvas;
