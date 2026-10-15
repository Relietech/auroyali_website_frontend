/**
 * Construction Studio Storage & State Management Service
 * Manages dynamic hero banner, methodology narrative, technical capabilities,
 * client deliverables, and sidebar metrics & track record.
 * Persists with localStorage and dispatches reactive window events.
 */

export const CONSTRUCTION_STORAGE_KEY = 'auroyali_construction_data_v1';
export const CONSTRUCTION_UPDATE_EVENT = 'auroyali_construction_updated';

export const DEFAULT_CONSTRUCTION_DATA = {
  // 1. Hero / Page Banner
  hero: {
    tag: "Specialized Architectural Discipline",
    title: "Natural Building & CSEB Construction",
    subtitle: "Earth-based masonry using on-site pressed CSEB blocks, stabilized rammed earth, and lime-pozzolana mortars.",
    breadcrumb: "Natural Building & CSEB Construction",
    bgImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    bgAlt: "CSEB Earth Block Architecture by AuroYali"
  },

  // 2. Methodology & Narrative
  methodology: {
    tag: "Our Methodology",
    title: "Crafting with environmental intelligence in natural building & cseb construction.",
    longDesc: "We manufacture high-performance Compressed Stabilized Earth Blocks (CSEB) directly on or near the building site. CSEB delivers extraordinary thermal inertia, near-zero embodied carbon, and organic tactile beauty that matures gracefully with age.",
    primaryCtaText: "Request Consultation",
    primaryCtaLink: "/contact",
    secondaryCtaText: "Case Studies",
    secondaryCtaLink: "/projects"
  },

  // 3. Key Technical Capabilities
  capabilities: [
    {
      id: "cap-1",
      title: "On-site hydraulic block pressing and soil composition testing",
      desc: "Granulometric analysis, jar tests, and hydraulic pressing calibrated directly to local red soil."
    },
    {
      id: "cap-2",
      title: "Arches, vaults, and Catalan thin-tile earth domes",
      desc: "Compression-only geometry eliminating carbon-heavy steel rebar in roofs and spans."
    },
    {
      id: "cap-3",
      title: "Hydraulic lime mortars with natural mineral pigments",
      desc: "Breathable, self-healing lime-pozzolana binders preventing efflorescence and dampness."
    },
    {
      id: "cap-4",
      title: "Turnkey civil construction with zero-waste material cycles",
      desc: "Integrated on-site batching, recycled aggregate integration, and minimal landfill footprint."
    }
  ],

  // 4. Client Deliverables & Documentation
  deliverables: [
    {
      id: "del-1",
      title: "Soil Lab Analysis & Mix Formulations",
      desc: "Comprehensive laboratory testing report identifying soil grain distribution and binder ratios."
    },
    {
      id: "del-2",
      title: "Custom CSEB Block Geometries & Hollow Conduits",
      desc: "Interlocking, conduit, and beam blocks engineered specifically for conduit routing."
    },
    {
      id: "del-3",
      title: "Turnkey Structural Masonry Execution",
      desc: "Site supervision and execution by certified Auroville masons and master earth builders."
    },
    {
      id: "del-4",
      title: "Thermal Performance Quality Certification",
      desc: "Thermal mass documentation and embodied carbon calculations for green building rating."
    }
  ],

  // 5. Sidebar Showcase & Studio Track Record
  sidebar: {
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Natural CSEB Construction by AuroYali",
    trackRecordTag: "Studio Track Record",
    stats: [
      { id: "stat-1", label: "Completed Projects", value: "80+" },
      { id: "stat-2", label: "Blocks Pressed", value: "1.2M+" },
      { id: "stat-3", label: "Embodied Energy Reduction", value: "-75%" }
    ],
    supervisionNote: "Every project is supervised directly by Auroville master builders and registered architects."
  }
};

/**
 * Retrieve current Construction data from localStorage, falling back to defaults
 */
export function getStoredConstructionData() {
  if (typeof window === 'undefined') return DEFAULT_CONSTRUCTION_DATA;
  try {
    const raw = localStorage.getItem(CONSTRUCTION_STORAGE_KEY);
    if (!raw) return DEFAULT_CONSTRUCTION_DATA;
    const parsed = JSON.parse(raw);
    return {
      hero: { ...DEFAULT_CONSTRUCTION_DATA.hero, ...(parsed.hero || {}) },
      methodology: { ...DEFAULT_CONSTRUCTION_DATA.methodology, ...(parsed.methodology || {}) },
      capabilities: Array.isArray(parsed.capabilities) ? parsed.capabilities : DEFAULT_CONSTRUCTION_DATA.capabilities,
      deliverables: Array.isArray(parsed.deliverables) ? parsed.deliverables : DEFAULT_CONSTRUCTION_DATA.deliverables,
      sidebar: {
        ...DEFAULT_CONSTRUCTION_DATA.sidebar,
        ...(parsed.sidebar || {}),
        stats: Array.isArray(parsed.sidebar?.stats) ? parsed.sidebar.stats : DEFAULT_CONSTRUCTION_DATA.sidebar.stats
      }
    };
  } catch (err) {
    console.error('Failed to parse construction data from localStorage:', err);
    return DEFAULT_CONSTRUCTION_DATA;
  }
}

/**
 * Persist full construction data to localStorage and dispatch update event
 */
export function persistConstructionData(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSTRUCTION_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CONSTRUCTION_UPDATE_EVENT, { detail: data }));
  } catch (err) {
    console.error('Failed to persist construction data:', err);
  }
}

/**
 * Subscribe to Construction data updates across tabs / components
 */
export function subscribeToConstruction(callback) {
  if (typeof window === 'undefined') return () => {};
  const handleCustomEvent = (e) => {
    callback(e.detail || getStoredConstructionData());
  };
  const handleStorageEvent = (e) => {
    if (e.key === CONSTRUCTION_STORAGE_KEY) {
      callback(getStoredConstructionData());
    }
  };

  window.addEventListener(CONSTRUCTION_UPDATE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  return () => {
    window.removeEventListener(CONSTRUCTION_UPDATE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}

/**
 * Partial update: Hero Banner
 */
export function updateConstructionHero(heroData) {
  const current = getStoredConstructionData();
  const updated = {
    ...current,
    hero: { ...current.hero, ...heroData }
  };
  persistConstructionData(updated);
  return updated;
}

/**
 * Partial update: Methodology Narrative & CTA
 */
export function updateConstructionMethodology(methodologyData) {
  const current = getStoredConstructionData();
  const updated = {
    ...current,
    methodology: { ...current.methodology, ...methodologyData }
  };
  persistConstructionData(updated);
  return updated;
}

/**
 * Partial update: Technical Capabilities
 */
export function updateConstructionCapabilities(capabilitiesList) {
  const current = getStoredConstructionData();
  const updated = {
    ...current,
    capabilities: capabilitiesList
  };
  persistConstructionData(updated);
  return updated;
}

/**
 * Partial update: Client Deliverables
 */
export function updateConstructionDeliverables(deliverablesList) {
  const current = getStoredConstructionData();
  const updated = {
    ...current,
    deliverables: deliverablesList
  };
  persistConstructionData(updated);
  return updated;
}

/**
 * Partial update: Sidebar & Track Record
 */
export function updateConstructionSidebar(sidebarData) {
  const current = getStoredConstructionData();
  const updated = {
    ...current,
    sidebar: { ...current.sidebar, ...sidebarData }
  };
  persistConstructionData(updated);
  return updated;
}

/**
 * Reset all Construction data to defaults
 */
export function resetConstructionToDefault() {
  persistConstructionData(DEFAULT_CONSTRUCTION_DATA);
  return DEFAULT_CONSTRUCTION_DATA;
}

/**
 * Utility: Read and compress an uploaded image File as Data URL (base64)
 */
export function readImageFileAsDataUrl(file, maxDimension = 1920, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (JPG, PNG, WebP)'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
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

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read photo file'));
    reader.readAsDataURL(file);
  });
}
