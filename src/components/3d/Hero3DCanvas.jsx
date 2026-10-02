import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Sun, Sunset, Moon, Layers } from 'lucide-react';

// ==========================================
// PROCEDURAL ARCHITECTURAL TEXTURES GENERATOR
// ==========================================
function useProceduralTextures() {
  return useMemo(() => {
    // 1. Rammed Earth Layered Texture
    const reCanvas = document.createElement('canvas');
    reCanvas.width = 512;
    reCanvas.height = 512;
    const reCtx = reCanvas.getContext('2d');
    if (reCtx) {
      reCtx.fillStyle = '#b86b43';
      reCtx.fillRect(0, 0, 512, 512);

      // Stratified sediment layers
      const bands = [
        { y: 0, h: 45, col: '#a35732' },
        { y: 45, h: 70, col: '#c67e54' },
        { y: 115, h: 35, col: '#8d4522' },
        { y: 150, h: 90, col: '#ba734a' },
        { y: 240, h: 50, col: '#d48d63' },
        { y: 290, h: 65, col: '#9c4f2b' },
        { y: 355, h: 80, col: '#be774e' },
        { y: 435, h: 77, col: '#8f4724' },
      ];

      bands.forEach(b => {
        reCtx.fillStyle = b.col;
        reCtx.fillRect(0, b.y, 512, b.h);
      });

      // Micro-texture grain
      const imgData = reCtx.getImageData(0, 0, 512, 512);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * 26;
        d[i] = Math.min(255, Math.max(0, d[i] + noise));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise * 0.8));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise * 0.6));
      }
      reCtx.putImageData(imgData, 0, 0);
    }
    const rammedEarthTex = new THREE.CanvasTexture(reCanvas);
    rammedEarthTex.wrapS = THREE.RepeatWrapping;
    rammedEarthTex.wrapT = THREE.RepeatWrapping;
    rammedEarthTex.repeat.set(1, 1);

    // 2. Teak Wood Grain Texture
    const woodCanvas = document.createElement('canvas');
    woodCanvas.width = 256;
    woodCanvas.height = 256;
    const wCtx = woodCanvas.getContext('2d');
    if (wCtx) {
      wCtx.fillStyle = '#7a3e1d';
      wCtx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 256; i += 4) {
        const shade = 100 + Math.sin(i * 0.1) * 35 + (Math.random() - 0.5) * 20;
        wCtx.fillStyle = `rgb(${shade + 20}, ${shade * 0.55 + 10}, ${shade * 0.28})`;
        wCtx.fillRect(0, i, 256, 4);
      }
    }
    const woodTex = new THREE.CanvasTexture(woodCanvas);
    woodTex.wrapS = THREE.RepeatWrapping;
    woodTex.wrapT = THREE.RepeatWrapping;

    // 3. Travertine Stone Tile Texture
    const stoneCanvas = document.createElement('canvas');
    stoneCanvas.width = 512;
    stoneCanvas.height = 512;
    const sCtx = stoneCanvas.getContext('2d');
    if (sCtx) {
      sCtx.fillStyle = '#ede5d8';
      sCtx.fillRect(0, 0, 512, 512);

      // Tile grid grooves
      sCtx.strokeStyle = '#c8bcab';
      sCtx.lineWidth = 3;
      for (let x = 0; x <= 512; x += 128) {
        sCtx.beginPath();
        sCtx.moveTo(x, 0);
        sCtx.lineTo(x, 512);
        sCtx.stroke();
      }
      for (let y = 0; y <= 512; y += 128) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(512, y);
        sCtx.stroke();
      }

      // Micro stone flecks
      const sData = sCtx.getImageData(0, 0, 512, 512);
      const sd = sData.data;
      for (let i = 0; i < sd.length; i += 4) {
        const noise = (Math.random() - 0.5) * 16;
        sd[i] = Math.min(255, Math.max(0, sd[i] + noise));
        sd[i + 1] = Math.min(255, Math.max(0, sd[i + 1] + noise * 0.95));
        sd[i + 2] = Math.min(255, Math.max(0, sd[i + 2] + noise * 0.9));
      }
      sCtx.putImageData(sData, 0, 0);
    }
    const stoneTex = new THREE.CanvasTexture(stoneCanvas);
    stoneTex.wrapS = THREE.RepeatWrapping;
    stoneTex.wrapT = THREE.RepeatWrapping;
    stoneTex.repeat.set(4, 4);

    return { rammedEarthTex, woodTex, stoneTex };
  }, []);
}

// ==========================================
// RESPONSIVE CAMERA ADAPTER
// ==========================================
function ResponsiveCameraController() {
  const { size, camera } = useThree();

  useEffect(() => {
    const isPortrait = size.width < 580 || size.width < size.height;
    if (isPortrait) {
      camera.position.set(0.3, 2.1, 9.4);
      camera.fov = 42;
    } else {
      camera.position.set(0.35, 1.8, 7.8);
      camera.fov = 36;
    }
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera]);

  return null;
}

// ==========================================
// REALISTIC HIGH-END BIOCLIMATIC VILLA
// ==========================================
function RealisticVilla({ mode, wireframe }) {
  const poolRef = useRef();
  const textures = useProceduralTextures();

  const theme = useMemo(() => {
    switch (mode) {
      case 'sunset':
        return {
          wallBase: '#b3613b',
          limestone: '#ebe1d3',
          darkWood: '#5a301a',
          lightWood: '#99562e',
          glass: '#f1dcd0',
          water: '#ba5829',
          waterOpacity: 0.85,
          warmInterior: '#ff9d42',
          interiorIntensity: 1.8,
          metal: '#281c16',
          grass: '#5c6b45',
          roof: '#281d18',
          ambientLight: 1.1,
          sunColor: '#ffa366',
          sunIntensity: 2.2,
          skyColor: '#fcd3b6'
        };
      case 'night':
        return {
          wallBase: '#38261e',
          limestone: '#685c52',
          darkWood: '#241711',
          lightWood: '#4d3021',
          glass: '#38bdf8',
          water: '#0284c7',
          waterOpacity: 0.92,
          warmInterior: '#ffb703',
          interiorIntensity: 3.5,
          metal: '#1e293b',
          grass: '#253320',
          roof: '#18120f',
          ambientLight: 0.45,
          sunColor: '#60a5fa',
          sunIntensity: 0.8,
          skyColor: '#1e1b4b'
        };
      case 'blueprint':
        return {
          wallBase: '#0284c7',
          limestone: '#0369a1',
          darkWood: '#075985',
          lightWood: '#0c4a6e',
          glass: '#38bdf8',
          water: '#0284c7',
          waterOpacity: 0.5,
          warmInterior: '#38bdf8',
          interiorIntensity: 1.5,
          metal: '#38bdf8',
          grass: '#0f172a',
          roof: '#0369a1',
          ambientLight: 1.2,
          sunColor: '#38bdf8',
          sunIntensity: 1.5,
          skyColor: '#0284c7'
        };
      default: // Day
        return {
          wallBase: '#c67347',
          limestone: '#f8f4ec',
          darkWood: '#6e3819',
          lightWood: '#b86b3b',
          glass: '#e0f2fe',
          water: '#38bdf8',
          waterOpacity: 0.82,
          warmInterior: '#fef08a',
          interiorIntensity: 0.9,
          metal: '#334155',
          grass: '#6e8552',
          roof: '#2b211b',
          ambientLight: 1.4,
          sunColor: '#fffbeb',
          sunIntensity: 2.2,
          skyColor: '#f1f5f9'
        };
    }
  }, [mode]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (poolRef.current && mode !== 'blueprint') {
      poolRef.current.material.opacity = theme.waterOpacity + Math.sin(t * 2.0) * 0.04;
      poolRef.current.position.y = 0.055 + Math.sin(t * 1.5) * 0.002;
    }
  });

  const isWire = mode === 'blueprint' || wireframe;

  return (
    <group position={[0, -0.32, 0]} scale={0.78}>
      {/* 1. GROUND FOUNDATION & LANDSCAPE PLINTH */}
      <mesh position={[0, -0.16, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.28, 6.4]} />
        <meshStandardMaterial
          color={theme.grass}
          roughness={0.95}
          wireframe={isWire}
        />
      </mesh>

      <mesh position={[0.1, 0.01, 0.2]} receiveShadow>
        <boxGeometry args={[6.6, 0.06, 5.6]} />
        <meshStandardMaterial
          color={theme.limestone}
          map={!isWire ? textures.stoneTex : null}
          roughness={0.65}
          wireframe={isWire}
        />
      </mesh>

      <mesh position={[-2.4, 0.02, 0.2]} receiveShadow>
        <boxGeometry args={[1.2, 0.04, 5.0]} />
        <meshStandardMaterial
          color="#d1c7b7"
          roughness={0.95}
          wireframe={isWire}
        />
      </mesh>

      {/* 2. INFINITY REFLECTING POOL */}
      <group position={[1.5, 0, 1.4]}>
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[2.8, 0.12, 1.9]} />
          <meshStandardMaterial color="#1c1917" roughness={0.8} wireframe={isWire} />
        </mesh>

        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[2.56, 0.02, 1.66]} />
          <meshStandardMaterial color={mode === 'sunset' ? '#783518' : '#0284c7'} roughness={0.3} wireframe={isWire} />
        </mesh>

        <mesh
          ref={poolRef}
          position={[0, 0.055, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2.56, 1.66]} />
          <meshStandardMaterial
            color={theme.water}
            roughness={0.05}
            metalness={0.85}
            transparent
            opacity={theme.waterOpacity}
            wireframe={isWire}
          />
        </mesh>

        {[-0.65, 0, 0.65].map((x, i) => (
          <mesh key={i} position={[x, 0.065, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.04, 0.42]} />
            <meshStandardMaterial
              color={theme.limestone}
              roughness={0.6}
              wireframe={isWire}
            />
          </mesh>
        ))}

        {mode === 'night' && (
          <pointLight position={[0, 0.1, 0]} color="#38bdf8" intensity={1.4} distance={3} />
        )}
      </group>

      {/* 3. GROUND FLOOR MAIN PAVILION */}
      <group position={[-0.8, 0.8, 0]}>
        <mesh position={[-1.3, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.45, 1.5, 4.2]} />
          <meshStandardMaterial
            color={theme.wallBase}
            map={!isWire ? textures.rammedEarthTex : null}
            roughness={0.88}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[0.4, 0, -1.95]} castShadow receiveShadow>
          <boxGeometry args={[2.9, 1.5, 0.3]} />
          <meshStandardMaterial
            color={theme.wallBase}
            map={!isWire ? textures.rammedEarthTex : null}
            roughness={0.9}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[0.5, 0, 0.7]}>
          <boxGeometry args={[2.7, 1.46, 0.04]} />
          <meshStandardMaterial
            color={theme.glass}
            transparent
            opacity={mode === 'blueprint' ? 0.3 : 0.35}
            roughness={0.08}
            metalness={0.15}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[1.85, 0, -0.5]}>
          <boxGeometry args={[0.04, 1.46, 2.7]} />
          <meshStandardMaterial
            color={theme.glass}
            transparent
            opacity={mode === 'blueprint' ? 0.3 : 0.35}
            roughness={0.08}
            metalness={0.15}
            wireframe={isWire}
          />
        </mesh>

        {[-0.8, -0.1, 0.6, 1.3, 1.8].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.72]} castShadow>
            <boxGeometry args={[0.04, 1.48, 0.06]} />
            <meshStandardMaterial color={theme.metal} roughness={0.3} metalness={0.9} wireframe={isWire} />
          </mesh>
        ))}

        <mesh position={[0.35, 0, -0.6]}>
          <boxGeometry args={[2.3, 1.4, 2.4]} />
          <meshStandardMaterial
            color="#231a14"
            emissive={theme.warmInterior}
            emissiveIntensity={mode === 'night' ? 0.35 : mode === 'sunset' ? 0.18 : 0.05}
            roughness={0.7}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[0.2, -0.45, -0.4]} castShadow>
          <boxGeometry args={[1.3, 0.28, 0.65]} />
          <meshStandardMaterial color="#ded7cb" roughness={0.8} wireframe={isWire} />
        </mesh>
        <mesh position={[0.2, -0.52, 0.25]} castShadow>
          <boxGeometry args={[0.8, 0.14, 0.4]} />
          <meshStandardMaterial
            color={theme.darkWood}
            map={!isWire ? textures.woodTex : null}
            roughness={0.6}
            wireframe={isWire}
          />
        </mesh>

        <group position={[0.3, 0.4, -0.4]}>
          <mesh>
            <cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#fff"
              emissive={theme.warmInterior}
              emissiveIntensity={theme.interiorIntensity}
            />
          </mesh>
          <pointLight color="#ffaa44" intensity={theme.interiorIntensity * 0.9} distance={3.2} />
        </group>
      </group>

      {/* 4. CANTILEVERED UPPER SUITE */}
      <group position={[0.4, 2.05, -0.3]}>
        <mesh position={[-0.1, -0.09, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 0.18, 3.6]} />
          <meshStandardMaterial
            color={theme.limestone}
            roughness={0.7}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[-0.3, 0.62, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 1.24, 2.9]} />
          <meshStandardMaterial
            color={theme.limestone}
            roughness={0.75}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[-0.3, 0.62, 1.38]}>
          <boxGeometry args={[2.9, 1.05, 0.04]} />
          <meshStandardMaterial
            color={theme.glass}
            transparent
            opacity={0.35}
            roughness={0.05}
            wireframe={isWire}
          />
        </mesh>

        {[-1.6, -1.3, -1.0, -0.7, 0.4, 0.7, 1.0].map((x, i) => (
          <mesh key={i} position={[x, 0.62, 1.44]} castShadow>
            <boxGeometry args={[0.06, 1.2, 0.14]} />
            <meshStandardMaterial
              color={theme.darkWood}
              map={!isWire ? textures.woodTex : null}
              roughness={0.65}
              wireframe={isWire}
            />
          </mesh>
        ))}

        <mesh position={[1.4, 0.32, 0.7]}>
          <boxGeometry args={[0.03, 0.65, 2.2]} />
          <meshStandardMaterial
            color={theme.glass}
            transparent
            opacity={0.4}
            roughness={0.1}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[-0.1, 1.32, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.14, 4.0]} />
          <meshStandardMaterial
            color={theme.roof}
            roughness={0.7}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[-0.1, 1.24, 1.5]}>
          <boxGeometry args={[3.8, 0.02, 0.04]} />
          <meshStandardMaterial
            color={theme.warmInterior}
            emissive={theme.warmInterior}
            emissiveIntensity={theme.interiorIntensity * 0.6}
          />
        </mesh>
      </group>

      {/* 5. TEAK TIMBER PERGOLA */}
      <group position={[-0.7, 1.4, 1.7]}>
        {[
          [-1.3, 0.5],
          [0.9, 0.5],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.65, z]} castShadow>
            <cylinderGeometry args={[0.032, 0.032, 1.5, 16]} />
            <meshStandardMaterial
              color={theme.metal}
              metalness={0.92}
              roughness={0.25}
              wireframe={isWire}
            />
          </mesh>
        ))}

        {[-0.7, -0.4, -0.1, 0.2, 0.5].map((z, i) => (
          <mesh key={i} position={[-0.2, 0.1, z]} castShadow>
            <boxGeometry args={[2.6, 0.045, 0.09]} />
            <meshStandardMaterial
              color={theme.darkWood}
              map={!isWire ? textures.woodTex : null}
              roughness={0.65}
              wireframe={isWire}
            />
          </mesh>
        ))}
      </group>

      {/* 6. SUNKEN COURTYARD & FIRE BOWL */}
      <group position={[-1.7, 0.12, 1.5]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.4, 0.2, 1.4]} />
          <meshStandardMaterial
            color={theme.lightWood}
            map={!isWire ? textures.woodTex : null}
            roughness={0.7}
            wireframe={isWire}
          />
        </mesh>

        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.24, 0.1, 24]} />
          <meshStandardMaterial color="#262220" roughness={0.9} wireframe={isWire} />
        </mesh>

        <mesh position={[0, 0.21, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial
            color="#e65100"
            emissive="#e65100"
            emissiveIntensity={mode === 'night' ? 2.5 : mode === 'sunset' ? 1.4 : 0.6}
          />
        </mesh>
        {mode !== 'day' && mode !== 'blueprint' && (
          <pointLight position={[0, 0.35, 0]} color="#ea580c" intensity={1.2} distance={2.2} />
        )}
      </group>

      {/* 7. SCULPTURAL LANDSCAPING */}
      <group position={[2.6, 0, -1.9]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.14, 2.0, 12]} />
          <meshStandardMaterial color="#4a3728" roughness={0.9} wireframe={isWire} />
        </mesh>
        <mesh position={[0.2, 1.8, 0.1]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.9, 10]} />
          <meshStandardMaterial color="#4a3728" roughness={0.9} wireframe={isWire} />
        </mesh>
        {[
          [-0.1, 2.2, -0.1, 0.55],
          [0.35, 2.35, 0.2, 0.48],
          [-0.3, 2.0, 0.3, 0.42],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]} castShadow>
            <sphereGeometry args={[r, 16, 16]} />
            <meshStandardMaterial
              color={theme.grass}
              roughness={0.8}
              wireframe={isWire}
            />
          </mesh>
        ))}
      </group>

      {[
        { pos: [-2.6, 0.22, -0.8], size: [0.6, 0.4, 1.4] },
        { pos: [2.8, 0.18, 0.6], size: [0.5, 0.35, 1.1] }
      ].map((p, idx) => (
        <group key={idx} position={p.pos}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={p.size} />
            <meshStandardMaterial
              color={theme.wallBase}
              roughness={0.9}
              wireframe={isWire}
            />
          </mesh>
          <mesh position={[0, p.size[1] / 2 + 0.2, 0]} castShadow>
            <sphereGeometry args={[0.28, 14, 14]} />
            <meshStandardMaterial color="#3f5e28" roughness={0.85} wireframe={isWire} />
          </mesh>
        </group>
      ))}

      {[
        [-0.8, 0.14, 2.6],
        [0.4, 0.14, 2.6],
        [1.6, 0.14, 2.6]
      ].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.28, 12]} />
            <meshStandardMaterial color={theme.metal} metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.032, 0.032, 0.06, 12]} />
            <meshStandardMaterial
              color="#fff"
              emissive={theme.warmInterior}
              emissiveIntensity={mode === 'night' ? 2.5 : 0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==========================================
// FLOATING ATMOSPHERIC LIGHT DUST PARTICLES
// ==========================================
function AtmosphericParticles({ count = 30, mode }) {
  const points = useRef();
  const color = mode === 'sunset' ? '#fed7aa' : mode === 'night' ? '#7dd3fc' : '#fef08a';

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8.5;
      pos[i * 3 + 1] = Math.random() * 4.2 - 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8.5;
    }
    return pos;
  });

  useFrame((state) => {
    if (points.current) {
      const t = state.clock.getElapsedTime() * 0.15;
      points.current.rotation.y = t * 0.2;
    }
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
        opacity={mode === 'blueprint' ? 0.2 : 0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ==========================================
// MAIN HERO 3D CANVAS COMPONENT
// ==========================================
export function Hero3DCanvas({ className = "" }) {
  const [mode, setMode] = useState('sunset');
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleStartInteraction = () => {
    if (autoRotate) setAutoRotate(false);
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <div
      className={`relative w-full max-w-full h-[440px] sm:h-[480px] md:h-[540px] lg:h-[580px] max-h-[70vh] min-h-[380px] rounded-3xl overflow-hidden bg-gradient-to-br from-earth-100/90 via-earth-50/70 to-earth-100/90 border border-earth-300/80 shadow-[0_20px_50px_rgba(46,31,20,0.14)] box-border ${className}`}
      style={{ touchAction: 'pan-y' }}
      onPointerDown={handleStartInteraction}
    >
      
      {/* 3D Canvas with dpr={[1, 1.5]} for smooth 60fps mobile GPU rendering */}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0.3, 2.0, 8.2], fov: 38 }}
        className="cursor-grab active:cursor-grabbing w-full h-full"
        style={{ touchAction: 'pan-y' }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Dynamic camera zoom and framing */}
        <ResponsiveCameraController />

        {/* Atmospheric Sky Lighting */}
        <ambientLight intensity={mode === 'night' ? 0.45 : mode === 'sunset' ? 1.0 : 1.4} />
        
        {/* Optimized Sun Light Shadow Map (512x512 on mobile) */}
        <directionalLight
          position={[8, 12, 7]}
          intensity={mode === 'sunset' ? 2.4 : mode === 'night' ? 0.8 : 2.4}
          color={mode === 'sunset' ? '#ffa366' : mode === 'night' ? '#93c5fd' : '#fffbeb'}
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-bias={-0.0001}
        />
        
        {/* Soft Secondary Bounce Fill Light */}
        <directionalLight
          position={[-6, 5, -5]}
          intensity={mode === 'night' ? 0.3 : 0.6}
          color={mode === 'sunset' ? '#b45309' : '#7a8b69'}
        />

        {/* Architectural 3D Villa */}
        <RealisticVilla
          mode={mode}
          wireframe={wireframe}
        />

        {/* Soft Ground Contact Shadow */}
        <ContactShadows
          position={[0, -0.45, 0]}
          opacity={0.65}
          scale={9}
          blur={1.8}
          far={4}
        />

        {/* Subtle Golden Dust Floating Particles */}
        <AtmosphericParticles count={30} mode={mode} />

        {/* Orbit Controls: Smooth slow auto-rotation until user touches */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.07}
          target={[0, 0.75, 0]}
          minPolarAngle={Math.PI / 5.2}
          maxPolarAngle={Math.PI / 2.18}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          onStart={handleStartInteraction}
        />
      </Canvas>

      {/* Floating Mode Switcher (Positioned at bottom on mobile for thumb reach, top on desktop) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:top-4 sm:right-4 sm:translate-x-0 flex items-center gap-1 bg-white/95 backdrop-blur-xl p-1.5 rounded-full border border-earth-200/90 shadow-lg z-20 text-xs">
        <button
          onClick={() => { setMode('day'); setWireframe(false); }}
          className={`flex items-center justify-center gap-1.5 px-3.5 h-11 min-h-[44px] rounded-full transition-all font-medium duration-200 ${
            mode === 'day' && !wireframe
              ? 'bg-earth-900 text-white shadow-sm' 
              : 'text-earth-800 hover:text-clay hover:bg-earth-100/60'
          }`}
          title="Daylight Solar Mode"
        >
          <Sun size={14} className="shrink-0" />
          <span className={mode === 'day' ? 'inline' : 'hidden sm:inline'}>Day</span>
        </button>

        <button
          onClick={() => { setMode('sunset'); setWireframe(false); }}
          className={`flex items-center justify-center gap-1.5 px-3.5 h-11 min-h-[44px] rounded-full transition-all font-medium duration-200 ${
            mode === 'sunset' && !wireframe
              ? 'bg-clay text-white shadow-sm' 
              : 'text-earth-800 hover:text-clay hover:bg-earth-100/60'
          }`}
          title="Golden Hour Sunset Mode"
        >
          <Sunset size={14} className="shrink-0" />
          <span className={mode === 'sunset' ? 'inline' : 'hidden sm:inline'}>Sunset</span>
        </button>

        <button
          onClick={() => { setMode('night'); setWireframe(false); }}
          className={`flex items-center justify-center gap-1.5 px-3.5 h-11 min-h-[44px] rounded-full transition-all font-medium duration-200 ${
            mode === 'night' && !wireframe
              ? 'bg-stone-900 text-amber-300 shadow-sm' 
              : 'text-earth-800 hover:text-clay hover:bg-earth-100/60'
          }`}
          title="Night Thermal Glow Mode"
        >
          <Moon size={14} className="shrink-0" />
          <span className={mode === 'night' ? 'inline' : 'hidden sm:inline'}>Night</span>
        </button>

        <span className="w-px h-5 bg-earth-300/60 mx-0.5 shrink-0" />

        <button
          onClick={() => {
            if (mode === 'blueprint') {
              setMode('day');
              setWireframe(false);
            } else {
              setMode('blueprint');
              setWireframe(true);
            }
          }}
          className={`flex items-center justify-center gap-1.5 px-3.5 h-11 min-h-[44px] rounded-full transition-all font-medium duration-200 ${
            mode === 'blueprint' || wireframe
              ? 'bg-sky-700 text-white shadow-sm' 
              : 'text-earth-800 hover:text-clay hover:bg-earth-100/60'
          }`}
          title="Toggle Structural Blueprint"
        >
          <Layers size={14} className="shrink-0" />
          <span className={mode === 'blueprint' || wireframe ? 'inline' : 'hidden sm:inline'}>CAD</span>
        </button>
      </div>

      {/* Floating Rotate Icon Badge (Smoothly fades out on first drag) */}
      <div
        className={`absolute top-4 left-4 sm:bottom-4 sm:top-auto flex items-center gap-2 pointer-events-none z-10 bg-stone-900/90 text-white text-xs px-3.5 py-1.5 rounded-full backdrop-blur-md border border-stone-700/80 shadow-lg transition-opacity duration-700 ${
          hasInteracted ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <svg className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" style={{ animationDuration: '6s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          <path d="M21 3v9h-9" />
        </svg>
        <span className="text-[11.5px] font-medium text-stone-100 tracking-wide select-none">360° Drag to Rotate</span>
      </div>

    </div>
  );
}

export default Hero3DCanvas;
