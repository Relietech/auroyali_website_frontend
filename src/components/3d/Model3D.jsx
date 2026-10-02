// npm i three @react-three/fiber @react-three/drei
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export function Model3D({ activeSpec = 'DENSITY', stacked = true, reducedMotion = false }) {
  const groupRef = useRef();
  const topBlockRef = useRef();
  const midBlockRef = useRef();
  const btmBlockRef = useRef();

  const { size } = useThree();
  const responsiveScale = useMemo(() => {
    if (size.width <= 340) return 0.58;
    if (size.width <= 440) return 0.68;
    if (size.width <= 640) return 0.76;
    return 0.88;
  }, [size.width]);

  // Sub-layers for COMPOSITION split
  const soilLayerRef = useRef();
  const sandLayerRef = useRef();
  const limeLayerRef = useRef();

  // Materials
  const topMatRef = useRef();
  const midMatRef = useRef();
  const btmMatRef = useRef();

  // State lerp values
  const stateValues = useRef({
    topY: 0.58,
    btmY: -0.58,
    densityFactor: 0,
    carbonOpacity: 0,
    thermalOpacity: 0,
    lifespanOpacity: 0,
    compSplit: 0,
  });

  // Procedural CSEB Earth Texture & Bump Map with rich warm terracotta sediment
  const { earthTexture, earthTexture2, earthTexture3, bumpTexture } = useMemo(() => {
    // Helper to generate canvas texture with strata
    const createEarthCanvas = (baseColor, seed = 1) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Warm terracotta earthy gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#c77848');
      grad.addColorStop(0.3, '#d88b5b');
      grad.addColorStop(0.6, '#b86a3d');
      grad.addColorStop(1, '#a7582e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Stratified sediment micro-layers
      const layers = [
        { y: 0, h: 28, col: 'rgba(155, 78, 38, 0.45)' },
        { y: 32, h: 22, col: 'rgba(230, 160, 115, 0.35)' },
        { y: 65, h: 35, col: 'rgba(135, 62, 28, 0.4)' },
        { y: 110, h: 40, col: 'rgba(215, 140, 95, 0.35)' },
        { y: 160, h: 30, col: 'rgba(165, 82, 42, 0.4)' },
        { y: 200, h: 56, col: 'rgba(125, 55, 24, 0.45)' },
      ];

      layers.forEach((l) => {
        ctx.fillStyle = l.col;
        ctx.fillRect(0, (l.y * seed) % 256, 512, l.h);
      });

      // Fine sand & mineral grain noise
      const imgData = ctx.getImageData(0, 0, 512, 256);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const noise = (Math.random() - 0.5) * 36;
        d[i] = Math.min(255, Math.max(0, d[i] + noise));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + noise * 0.82));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + noise * 0.6));
      }
      ctx.putImageData(imgData, 0, 0);

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.needsUpdate = true;
      return tex;
    };

    const earthTexture = createEarthCanvas('#c77848', 1);
    const earthTexture2 = createEarthCanvas('#b86a3d', 1.3);
    const earthTexture3 = createEarthCanvas('#a7582e', 0.8);

    // Bump Map
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 256;
    bCanvas.height = 128;
    const bCtx = bCanvas.getContext('2d');
    if (bCtx) {
      bCtx.fillStyle = '#808080';
      bCtx.fillRect(0, 0, 256, 128);
      const bData = bCtx.getImageData(0, 0, 256, 128);
      for (let i = 0; i < bData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 55;
        bData.data[i] = 128 + noise;
        bData.data[i + 1] = 128 + noise;
        bData.data[i + 2] = 128 + noise;
      }
      bCtx.putImageData(bData, 0, 0);
    }
    const bumpTexture = new THREE.CanvasTexture(bCanvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.needsUpdate = true;

    return { earthTexture, earthTexture2, earthTexture3, bumpTexture };
  }, []);

  useFrame((state, delta) => {
    const s = stateValues.current;
    const lerpSpeed = reducedMotion ? 1 : Math.min(1, delta * 7);

    // Frame-synced responsive scale from actual WebGL viewport width
    const w = state.size.width;
    let targetScale = 0.88;
    if (w <= 340) targetScale = 0.58;
    else if (w <= 440) targetScale = 0.68;
    else if (w <= 640) targetScale = 0.76;

    if (groupRef.current) {
      groupRef.current.scale.set(targetScale, targetScale, targetScale);
    }

    // 1. Natural block separation with visible mortar gaps (0.08 units in stack mode)
    let targetTopY = 0.58;
    let targetBtmY = -0.58;

    if (!stacked) {
      // Explode View mode: spacious separation showing individual blocks
      targetTopY = 0.92;
      targetBtmY = -0.92;
    } else {
      // Stacked mode with distinct elegant gap
      switch (activeSpec) {
        case 'DENSITY':
          targetTopY = 0.56;
          targetBtmY = -0.56;
          break;
        case 'EMBODIED_CARBON':
          targetTopY = 0.66;
          targetBtmY = -0.66;
          break;
        case 'THERMAL_LAG':
          targetTopY = 0.60;
          targetBtmY = -0.60;
          break;
        case 'LIFESPAN':
          targetTopY = 0.62;
          targetBtmY = -0.62;
          break;
        case 'COMPOSITION':
          targetTopY = 0.78;
          targetBtmY = -0.62;
          break;
        default:
          targetTopY = 0.58;
          targetBtmY = -0.58;
      }
    }

    if (activeSpec === 'DENSITY') {
      s.densityFactor += (1 - s.densityFactor) * lerpSpeed;
    } else {
      s.densityFactor += (0 - s.densityFactor) * lerpSpeed;
    }

    s.topY += (targetTopY - s.topY) * lerpSpeed;
    s.btmY += (targetBtmY - s.btmY) * lerpSpeed;

    if (topBlockRef.current) topBlockRef.current.position.y = s.topY;
    if (btmBlockRef.current) btmBlockRef.current.position.y = s.btmY;

    // 2. Thermal Lag wave simulation
    const isThermal = activeSpec === 'THERMAL_LAG';
    s.thermalOpacity += ((isThermal ? 1 : 0) - s.thermalOpacity) * lerpSpeed;

    if (isThermal && !reducedMotion && topMatRef.current) {
      const elapsed = state.clock.getElapsedTime();
      const wave = (Math.sin(elapsed * 2.2) + 1) * 0.5;
      topMatRef.current.emissive = new THREE.Color('#d4572a');
      topMatRef.current.emissiveIntensity = wave * 0.45 * s.thermalOpacity;
    } else if (topMatRef.current) {
      topMatRef.current.emissiveIntensity = 0;
    }

    // 3. Composition Layer Split
    const isComp = activeSpec === 'COMPOSITION';
    s.compSplit += ((isComp ? 1 : 0) - s.compSplit) * lerpSpeed;

    if (soilLayerRef.current && sandLayerRef.current && limeLayerRef.current) {
      soilLayerRef.current.position.y = 0.08 * s.compSplit + 0.055;
      sandLayerRef.current.position.y = -0.02 * s.compSplit - 0.155;
      limeLayerRef.current.position.y = -0.10 * s.compSplit - 0.215;
    }
  });

  const isCompositionActive = activeSpec === 'COMPOSITION';

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={responsiveScale}>
      {/* ================= TOP BLOCK / COMPOSITION LAYERS ================= */}
      <group ref={topBlockRef} position={[0, 0.58, 0]}>
        <RoundedBox
          args={[2.2, 0.48, 1.1]}
          radius={0.035}
          smoothness={5}
          castShadow
          receiveShadow
          visible={!isCompositionActive}
        >
          <meshStandardMaterial
            ref={topMatRef}
            color="#f6e8df"
            map={earthTexture || undefined}
            bumpMap={bumpTexture || undefined}
            bumpScale={0.035}
            roughness={0.78}
            metalness={0.04}
          />
        </RoundedBox>

        {/* Composition Breakdown: 3 Distinct Strata */}
        <group visible={isCompositionActive}>
          {/* 1. Red Soil Layer (75% height) */}
          <group ref={soilLayerRef} position={[0, 0.065, 0]}>
            <RoundedBox args={[2.2, 0.36, 1.1]} radius={0.03} smoothness={4} castShadow>
              <meshStandardMaterial color="#f0d5c4" roughness={0.85} map={earthTexture || undefined} bumpMap={bumpTexture || undefined} bumpScale={0.035} />
            </RoundedBox>
          </group>

          {/* 2. Sand Layer (18% height) */}
          <group ref={sandLayerRef} position={[0, -0.177, 0]}>
            <RoundedBox args={[2.2, 0.095, 1.1]} radius={0.02} smoothness={4} castShadow>
              <meshStandardMaterial color="#dfc296" roughness={0.94} bumpMap={bumpTexture || undefined} bumpScale={0.045} />
            </RoundedBox>
          </group>

          {/* 3. Lime / Cement Stabilizer (7% height) */}
          <group ref={limeLayerRef} position={[0, -0.242, 0]}>
            <RoundedBox args={[2.2, 0.035, 1.1]} radius={0.015} smoothness={4} castShadow>
              <meshStandardMaterial color="#f4ede2" roughness={0.82} />
            </RoundedBox>
          </group>
        </group>
      </group>

      {/* ================= MIDDLE BLOCK ================= */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <RoundedBox args={[2.2, 0.48, 1.1]} radius={0.035} smoothness={5}>
          <meshStandardMaterial
            ref={midMatRef}
            color="#f2e2d8"
            map={earthTexture2 || earthTexture || undefined}
            bumpMap={bumpTexture || undefined}
            bumpScale={0.035}
            roughness={0.80}
            metalness={0.04}
          />
        </RoundedBox>
      </mesh>

      {/* ================= BOTTOM BLOCK ================= */}
      <group ref={btmBlockRef} position={[0, -0.58, 0]}>
        <RoundedBox args={[2.2, 0.48, 1.1]} radius={0.035} smoothness={5} castShadow receiveShadow>
          <meshStandardMaterial
            ref={btmMatRef}
            color="#ecdbcf"
            map={earthTexture3 || earthTexture || undefined}
            bumpMap={bumpTexture || undefined}
            bumpScale={0.035}
            roughness={0.82}
            metalness={0.04}
          />
        </RoundedBox>
      </group>

      {/* ================= CONTACT SHADOWS ================= */}
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.65}
        scale={6.5}
        blur={1.8}
        far={2.8}
        color="#150802"
      />
    </group>
  );
}
