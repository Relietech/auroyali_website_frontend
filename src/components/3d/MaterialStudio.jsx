// npm i three @react-three/fiber @react-three/drei
import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model3D } from './Model3D';
import './MaterialStudio.css';

export const DEFAULT_STUDIO_DATA = {
  header: {
    eyebrow: 'MATERIAL SCIENCE & CRAFT',
    title: 'Interactive 3D Material Studio',
  },
  specCard: {
    eyebrow: 'AUROVILLE SPECIFICATION SHEET',
    title: 'Compressed Stabilized Earth Block (CSEB)',
    subtitle: 'High Thermal Mass Natural Masonry · Formulated & pressed in our Kottakarai yard.',
    specs: [
      {
        id: 'DENSITY',
        label: 'DENSITY',
        value: '1,850 – 2,000 kg/m³',
        countFrom: 0,
        countTo: 2000,
        displayTemplate: (val) => `${Math.round(val * 0.925).toLocaleString()} – ${Math.round(val).toLocaleString()} kg/m³`,
      },
      {
        id: 'EMBODIED_CARBON',
        label: 'EMBODIED CARBON',
        value: '80% lower than fired brick',
        countFrom: 0,
        countTo: 80,
        displayTemplate: (val) => `${Math.round(val)}% lower than fired brick`,
      },
      {
        id: 'THERMAL_LAG',
        label: 'THERMAL LAG',
        value: '8 – 10 hours passive regulation',
        countFrom: 0,
        countTo: 10,
        displayTemplate: (val) => `${Math.max(1, Math.round(val * 0.8))} – ${Math.round(val)} hours passive regulation`,
      },
      {
        id: 'LIFESPAN',
        label: 'LIFESPAN',
        value: '100+ years durability',
        countFrom: 0,
        countTo: 100,
        displayTemplate: (val) => `${Math.round(val)}+ years durability`,
      },
      {
        id: 'COMPOSITION',
        label: 'COMPOSITION',
        value: 'Local red soil (75%), sand (18%), lime/cement stabilizer (7%)',
        countFrom: null,
      },
    ],
    footerLeft: 'Eco-Certified • Zero Toxic Glues',
    footerRight: 'AuroYali Standard',
  },
};

// Animated Number Counter Component
function AnimatedSpecValue({ spec, isVisible, reducedMotion }) {
  const [displayVal, setDisplayVal] = useState(() => (reducedMotion ? spec.countTo : (spec.countFrom ?? null)));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current || reducedMotion || spec.countFrom === null) {
      return;
    }

    hasAnimated.current = true;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = spec.countFrom + (spec.countTo - spec.countFrom) * easeOut;

      setDisplayVal(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, reducedMotion, spec.countFrom, spec.countTo]);

  if (spec.countFrom === null || reducedMotion) {
    return <span>{spec.value}</span>;
  }

  return (
    <span>
      {displayVal !== null && spec.displayTemplate
        ? spec.displayTemplate(displayVal)
        : spec.value}
    </span>
  );
}

export default function MaterialStudio({ data = DEFAULT_STUDIO_DATA }) {
  const studioData = { ...DEFAULT_STUDIO_DATA, ...data };
  const [activeSpec, setActiveSpec] = useState('DENSITY');
  const [stacked, setStacked] = useState(true);
  const [revealedRows, setRevealedRows] = useState({
    DENSITY: true,
    EMBODIED_CARBON: true,
    THERMAL_LAG: true,
    LIFESPAN: true,
    COMPOSITION: true,
  });
  const [reducedMotion, setReducedMotion] = useState(false);

  const rowRefs = useRef([]);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e) => setReducedMotion(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      mq.addListener(handler);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        mq.removeListener(handler);
      }
    };
  }, []);

  // IntersectionObserver to set active row and trigger line draws
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.15,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const specId = entry.target.getAttribute('data-spec-id');
        if (entry.isIntersecting && specId) {
          setActiveSpec(specId);
          setRevealedRows((prev) => ({ ...prev, [specId]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    rowRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [studioData.specCard.specs]);

  return (
    <section className="ms-page" aria-label="Interactive 3D Material Studio">
      <div className="ms-container">
        {/* Header Row */}
        <div className="ms-header">
          <div className="ms-header-info">
            <span className="ms-eyebrow">{studioData.header.eyebrow}</span>
            <h2 className="ms-title">{studioData.header.title}</h2>
          </div>
          {/* Note: NO button in the header, as instructed */}
        </div>

        <div className="ms-divider" aria-hidden="true" />

        {/* Two-Column Grid */}
        <div className="ms-grid">
          {/* Left Column: 3D Viewer Panel (Sticky) */}
          <div className="ms-viewer-wrapper">
            <div className="ms-viewer-panel">
              <Canvas
                className="ms-canvas"
                camera={{ position: [2.0, 1.3, 3.2], fov: 36 }}
                dpr={[1, 1.5]}
                shadows
                resize={{ debounce: 0, scroll: false }}
                gl={{ powerPreference: 'high-performance', antialias: true }}
                aria-label="Interactive 3D model of a compressed stabilized earth block"
                style={{ touchAction: 'pan-y' }}
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

                <Model3D
                  activeSpec={activeSpec}
                  stacked={stacked}
                  reducedMotion={reducedMotion}
                />

                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  enableDamping={true}
                  dampingFactor={0.06}
                  autoRotate={!reducedMotion}
                  autoRotateSpeed={0.7}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 2 + 0.08}
                />
              </Canvas>

              {/* Viewer Footer Strip */}
              <div className="ms-viewer-footer">
                <div className="ms-viewer-hint">
                  <span className="ms-dot" aria-hidden="true" />
                  <span className="ms-hint-text-desktop">Rotate 360° to inspect tactile layers</span>
                  <span className="ms-hint-text-mobile">360° Rotate</span>
                </div>

                <button
                  type="button"
                  className="ms-stack-btn"
                  onClick={() => setStacked((prev) => !prev)}
                  aria-pressed={stacked}
                  aria-label="Toggle stacking blocks"
                >
                  {stacked ? 'Explode View' : 'Stack Blocks'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Specification Card */}
          <div className="ms-spec-card">
            <div className="ms-spec-header">
              <span className="ms-spec-eyebrow">
                {studioData.specCard.eyebrow}
              </span>
              <h3 className="ms-spec-title">{studioData.specCard.title}</h3>
              <p className="ms-spec-subtitle">{studioData.specCard.subtitle}</p>
            </div>

            {/* Spec List */}
            <dl className="ms-spec-list">
              {studioData.specCard.specs.map((spec, index) => {
                const isActive = activeSpec === spec.id;
                const isRevealed = revealedRows[spec.id] || reducedMotion;

                return (
                  <div
                    key={spec.id}
                    ref={(el) => (rowRefs.current[index] = el)}
                    data-spec-id={spec.id}
                    className={`ms-spec-row ${isActive ? 'is-active' : 'is-dimmed'}`}
                    onClick={() => setActiveSpec(spec.id)}
                  >
                    <dt className="ms-spec-label">{spec.label}</dt>
                    <dd className="ms-spec-value">
                      <AnimatedSpecValue
                        spec={spec}
                        isVisible={isRevealed}
                        reducedMotion={reducedMotion}
                      />
                    </dd>

                    {/* Left active indicator pill */}
                    <span className="ms-active-indicator" aria-hidden="true" />

                    {/* Animated divider line */}
                    <div
                      className={`ms-row-line ${isRevealed ? 'is-drawn' : ''}`}
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </dl>

            {/* Spec Card Footer */}
            <div className="ms-spec-footer">
              <span className="ms-footer-left">{studioData.specCard.footerLeft}</span>
              <span className="ms-footer-right">{studioData.specCard.footerRight}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
