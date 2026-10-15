/**
 * Metal Fabrication Studio Storage & State Management Service
 * Manages dynamic hero configuration, ethos/overview, capabilities (What We Fabricate),
 * 6-stage process pipeline, filterable project gallery, and bottom CTA banner.
 * Persists with localStorage and dispatches reactive window events.
 */

import {
  Shield,
  TrendingUp,
  Warehouse,
  DoorOpen,
  Armchair,
  Building2,
  Flame,
  Wrench,
  Sparkles,
  Award,
  Compass,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Layers,
  Hammer,
  CheckCircle2,
  Box,
  Palette,
  Lightbulb,
  Maximize2
} from 'lucide-react';

export const METAL_STORAGE_KEY = 'auroyali_metal_data_v1';
export const METAL_UPDATE_EVENT = 'auroyali_metal_updated';

/**
 * Supported Icons registry for Offerings, Highlights, Steps and Projects
 */
export const METAL_ICONS = {
  Shield,
  TrendingUp,
  Warehouse,
  DoorOpen,
  Armchair,
  Building2,
  Flame,
  Wrench,
  Sparkles,
  Award,
  Compass,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Layers,
  Hammer,
  CheckCircle2,
  Box,
  Palette,
  Lightbulb,
  Maximize2
};

/**
 * Returns the matching Lucide icon component, falling back to Flame/Sparkles if not found
 */
export function getMetalIcon(iconName) {
  if (!iconName) return Flame;
  return METAL_ICONS[iconName] || Flame;
}

/**
 * Default Seed Data matching the current live http://localhost:5173/services/metal-fabrication page
 */
export const DEFAULT_METAL_DATA = {
  hero: {
    eyebrow: "PRECISION ARCHITECTURAL STEELWORK",
    title: "Metal Fabrication",
    subtitle: "Strong structures, crafted in steel.",
    breadcrumb: "Metal Fabrication",
    bgImage: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=2000&q=85",
    bgAlt: "Welding Sparks and Metal Fabrication Workshop in Auroville",
    ctaPrimaryText: "Request a Quote",
    ctaPrimaryLink: "/contact",
    ctaSecondaryText: "Explore Capabilities",
    ctaSecondaryLink: "#what-we-fabricate"
  },
  overview: {
    eyebrow: "Our Approach",
    heading: "Architectural Metal Craft Rooted in Earth Construction",
    description: "At AuroYali, our specialized in-house metal fabrication division bridges traditional craftsmanship with contemporary structural precision. We manufacture monumental gates, curved staircases, and tensile canopies designed specifically to integrate seamlessly with Compressed Stabilized Earth Blocks (CSEB) and reclaimed timber.",
    highlights: [
      {
        id: "hl-1",
        title: "Custom Made to Specification",
        desc: "Tailored strictly to architectural CAD blueprints with millimeter tolerances and bespoke hardware.",
        iconName: "Sparkles"
      },
      {
        id: "hl-2",
        title: "Weatherproof & Rust-Resistant Finishes",
        desc: "Hot-dip galvanizing, electrostatic powder coating, and marine-grade epoxy topcoats built to last decades.",
        iconName: "Award"
      }
    ],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "AuroYali Master Welder in Workshop"
  },
  fabricateSection: {
    eyebrow: "FABRICATION CAPABILITIES",
    heading: "What We Fabricate",
    subtitle: "From heavy structural roof frames to intricate laser-cut Corten privacy screens, explore our diverse steel and metal craft offerings."
  },
  fabricateOfferings: [
    {
      id: "gates-grills",
      title: "Gates & Grills",
      desc: "Motorized sliding gates, monumental compound pivots, laser-cut security grills, and ornamental wicket doors.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      iconName: "Shield"
    },
    {
      id: "railings-staircases",
      title: "Railings & Staircases",
      desc: "Helical spiral staircases, central spine floating steps, and marine-grade stainless cable wire balustrades.",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
      iconName: "TrendingUp"
    },
    {
      id: "roof-structures",
      title: "Roof Structures & Pergolas",
      desc: "Curved reciprocal trusses, courtyard tensile canopies, cantilevered carports, and outdoor garden pergolas.",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=1200&q=80",
      iconName: "Warehouse"
    },
    {
      id: "doors-windows",
      title: "Doors & Windows",
      desc: "Slim-line steel Crittall glazed partitions, thermal break casements, and heavy pivot portals.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      iconName: "DoorOpen"
    },
    {
      id: "furniture-decor",
      title: "Furniture & Decor",
      desc: "Bespoke industrial steel dining frames, cast brass hardware, blackened iron credenzas, and custom lighting.",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
      iconName: "Armchair"
    },
    {
      id: "structural-works",
      title: "Structural Works",
      desc: "Pre-engineered mezzanine floors, seismic moment frames, cantilevered balconies, and earth-building ties.",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      iconName: "Building2"
    }
  ],
  processSection: {
    eyebrow: "CONNECTED 6-STAGE PIPELINE",
    heading: "Our Fabrication Process",
    subtitle: "From concept sketches and structural calculations to precision CNC cutting and final on-site erection."
  },
  processSteps: [
    {
      id: "step-1",
      step: "01",
      title: "Consultation & Site Review",
      desc: "We inspect architectural drawings, site conditions, load requirements, and material aesthetic goals.",
      iconName: "Compass",
      phase: "Phase 1 of 6"
    },
    {
      id: "step-2",
      step: "02",
      title: "CAD & 3D Shop Drawings",
      desc: "Detailed shop drawings, connection details, and 3D mockups are engineered for client & architect approval.",
      iconName: "LayoutGrid",
      phase: "Phase 2 of 6"
    },
    {
      id: "step-3",
      step: "03",
      title: "CNC & Precision Cutting",
      desc: "Fiber laser and high-definition plasma cutting ensure exact 0.5mm tolerances on all components.",
      iconName: "Settings",
      phase: "Phase 3 of 6"
    },
    {
      id: "step-4",
      step: "04",
      title: "TIG / MIG Welding",
      desc: "Certified master welders assemble components with deep penetration welds and smooth seam grinding.",
      iconName: "Flame",
      phase: "Phase 4 of 6"
    },
    {
      id: "step-5",
      step: "05",
      title: "Surface Finishing & Coating",
      desc: "Thorough grit-blasting followed by zinc galvanizing, powder coating, or hand-rubbed patination.",
      iconName: "Award",
      phase: "Phase 5 of 6"
    },
    {
      id: "step-6",
      step: "06",
      title: "On-Site Installation",
      desc: "Our specialized erection crew installs on site, aligning with CSEB earth walls and timber structures.",
      iconName: "ShieldCheck",
      phase: "Phase 6 of 6"
    }
  ],
  gallerySection: {
    eyebrow: "PORTFOLIO SHOWCASE",
    heading: "Project Gallery",
    subtitle: "Explore bespoke architectural steel and ironcraft installations crafted in Auroville.",
    categories: ["All", "Gates", "Railings", "Roofs", "Doors", "Furniture", "Structural"]
  },
  galleryProjects: [
    {
      id: "p-1",
      title: "Alain Residence Architectural Compound Pivot Portal",
      category: "Gates",
      location: "Auroville",
      year: "2024",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      alt: "Architectural Pivot Steel Gate",
      materials: "Heavy Mild Steel, Zinc Undercoat, Weatherproof PU",
      desc: "Monumental 3.8m high compound pivot entrance gate with concealed bearing pivot and integrated smart access automation.",
      iconName: "Shield",
      featured: true
    },
    {
      id: "p-2",
      title: "Helical Spiral Steel Staircase & Balustrade",
      category: "Railings",
      location: "Kottakarai",
      year: "2024",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
      alt: "Helical Spiral Steel Staircase",
      materials: "Curved Steel Stringer, Reclaimed Teakwood Treads",
      desc: "Custom laser-cut helical stringers supporting cantilevered solid teak treads with continuous welded handrails.",
      iconName: "TrendingUp",
      featured: false
    },
    {
      id: "p-3",
      title: "Silk Road Pavilion Reciprocal Roof Structure",
      category: "Roofs",
      location: "International Zone",
      year: "2023",
      image: "https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?auto=format&fit=crop&w=1200&q=80",
      alt: "Reciprocal Steel Roof Truss Framing",
      materials: "Hot-Dip Galvanized Steel, Tensile Stainless Rods",
      desc: "Column-free courtyard canopy featuring reciprocal steel beam geometry and integrated tensile tie-rods for extreme weather resistance.",
      iconName: "Warehouse",
      featured: true
    },
    {
      id: "p-4",
      title: "Crittall Slim-Line French Doors & Glazed Partitions",
      category: "Doors",
      location: "Pondicherry",
      year: "2024",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      alt: "Steel Frame Crittall French Doors",
      materials: "Cold-Rolled Steel Profiles, Acoustic Laminated Glass",
      desc: "Ultra-narrow sightline steel interior dividers and exterior French doors with multi-point perimeter compression seals.",
      iconName: "DoorOpen",
      featured: false
    },
    {
      id: "p-5",
      title: "Bespoke Blackened Steel & Live-Edge Timber Table",
      category: "Furniture",
      location: "Auroville Studio",
      year: "2023",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80",
      alt: "Welded Steel Base Dining Table",
      materials: "10mm Hot-Rolled Plate Steel, Beeswax Patina",
      desc: "Sculptural steel dining table base with invisible mortise joinery connecting into sustainable local timber slab.",
      iconName: "Armchair",
      featured: false
    },
    {
      id: "p-6",
      title: "Earth-Block Anchored Seismic Moment Frame & Mezzanine",
      category: "Structural",
      location: "Kuiliapalayam",
      year: "2024",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      alt: "Heavy Structural Steel Framing",
      materials: "Universal Column / Beam Sections, High-Tensile Anchor Bolts",
      desc: "Engineered steel mezzanine structure distributing floor loads across CSEB compressed earth brick piers without stress fractures.",
      iconName: "Building2",
      featured: false
    },
    {
      id: "p-7",
      title: "Corten Laser-Cut Geometric Privacy Screen & Wicket Door",
      category: "Gates",
      location: "Alankuppam",
      year: "2024",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
      alt: "Laser-Cut Corten Steel Gate",
      materials: "3mm Corten Weathering Steel, Natural Rust Patina",
      desc: "Parametric geometric perforated screen panels allowing filtered ocean breeze while ensuring privacy and coastal durability.",
      iconName: "Shield",
      featured: false
    },
    {
      id: "p-8",
      title: "Marine-Grade Cable Wire Balustrade & Cantilever Balcony",
      category: "Railings",
      location: "East Coast Road",
      year: "2024",
      image: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
      alt: "Stainless Cable Wire Balustrade",
      materials: "316 Marine Stainless Steel Cable, Blackened Stanchions",
      desc: "High-tension cable balustrades engineered for coastal air resistance, minimal visual obstruction, and strict code compliance.",
      iconName: "TrendingUp",
      featured: false
    }
  ],
  ctaBanner: {
    eyebrow: "START YOUR PROJECT",
    heading: "Have a metal work idea? Let's build it.",
    description: "From precision laser-cut Corten façades to custom helical staircases and roof canopies, collaborate with AuroYali's master metal craftsmen.",
    buttonText: "Get a Free Estimate",
    buttonLink: "/contact",
    phoneText: "Call Us (+91 89400 00126)",
    phoneLink: "tel:+918940000126",
    phoneNumber: "+91 89400 00126"
  }
};

/**
 * Retrieve metal fabrication data from localStorage or fallback to defaults
 */
export function getStoredMetalData() {
  if (typeof window === 'undefined') return DEFAULT_METAL_DATA;
  try {
    const raw = localStorage.getItem(METAL_STORAGE_KEY);
    if (!raw) return DEFAULT_METAL_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_METAL_DATA,
      ...parsed,
      hero: { ...DEFAULT_METAL_DATA.hero, ...(parsed.hero || {}) },
      overview: { ...DEFAULT_METAL_DATA.overview, ...(parsed.overview || {}) },
      fabricateSection: { ...DEFAULT_METAL_DATA.fabricateSection, ...(parsed.fabricateSection || {}) },
      fabricateOfferings: Array.isArray(parsed.fabricateOfferings) ? parsed.fabricateOfferings : DEFAULT_METAL_DATA.fabricateOfferings,
      processSection: { ...DEFAULT_METAL_DATA.processSection, ...(parsed.processSection || {}) },
      processSteps: Array.isArray(parsed.processSteps) ? parsed.processSteps : DEFAULT_METAL_DATA.processSteps,
      gallerySection: { ...DEFAULT_METAL_DATA.gallerySection, ...(parsed.gallerySection || {}) },
      galleryProjects: Array.isArray(parsed.galleryProjects) ? parsed.galleryProjects : DEFAULT_METAL_DATA.galleryProjects,
      ctaBanner: { ...DEFAULT_METAL_DATA.ctaBanner, ...(parsed.ctaBanner || {}) }
    };
  } catch (err) {
    console.error('Failed to parse metal fabrication data:', err);
    return DEFAULT_METAL_DATA;
  }
}

/**
 * Persist metal fabrication data and notify subscribers
 */
export function persistMetalData(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(METAL_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(METAL_UPDATE_EVENT, { detail: data }));
  } catch (err) {
    console.error('Failed to persist metal fabrication data:', err);
  }
}

/**
 * Subscribe to metal data changes
 */
export function subscribeToMetal(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = (event) => {
    callback(event.detail || getStoredMetalData());
  };
  window.addEventListener(METAL_UPDATE_EVENT, handler);
  return () => window.removeEventListener(METAL_UPDATE_EVENT, handler);
}

/**
 * Update Hero configuration
 */
export function updateMetalHero(heroData) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    hero: { ...current.hero, ...heroData }
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Update Overview & Ethos configuration
 */
export function updateMetalOverview(overviewData) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    overview: { ...current.overview, ...overviewData }
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Update What We Fabricate Section Header
 */
export function updateMetalFabricateSection(sectionData) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    fabricateSection: { ...current.fabricateSection, ...sectionData }
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Add or Edit a Fabricate Offering
 */
export function saveFabricateOffering(offeringData) {
  const current = getStoredMetalData();
  let list = [...current.fabricateOfferings];

  const cleanOffering = {
    id: offeringData.id || `offering-${Date.now()}`,
    title: offeringData.title || '',
    desc: offeringData.desc || '',
    image: offeringData.image || '',
    iconName: offeringData.iconName || 'Shield'
  };

  const existingIdx = list.findIndex(o => o.id === cleanOffering.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...cleanOffering };
  } else {
    list.push(cleanOffering);
  }

  const updated = {
    ...current,
    fabricateOfferings: list
  };
  persistMetalData(updated);
  return cleanOffering;
}

/**
 * Delete a Fabricate Offering
 */
export function deleteFabricateOffering(offeringId) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    fabricateOfferings: current.fabricateOfferings.filter(o => o.id !== offeringId)
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Reorder Fabricate Offerings
 */
export function reorderFabricateOfferings(newOrder) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    fabricateOfferings: newOrder
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Update Process Section Header
 */
export function updateMetalProcessSection(sectionData) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    processSection: { ...current.processSection, ...sectionData }
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Add or Edit a Process Step
 */
export function saveProcessStep(stepData) {
  const current = getStoredMetalData();
  let list = [...current.processSteps];

  const cleanStep = {
    id: stepData.id || `step-${Date.now()}`,
    step: stepData.step || (list.length + 1).toString().padStart(2, '0'),
    title: stepData.title || '',
    desc: stepData.desc || '',
    iconName: stepData.iconName || 'Settings',
    phase: stepData.phase || `Phase ${list.length + 1} of 6`
  };

  const existingIdx = list.findIndex(s => s.id === cleanStep.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...cleanStep };
  } else {
    list.push(cleanStep);
  }

  const updated = {
    ...current,
    processSteps: list
  };
  persistMetalData(updated);
  return cleanStep;
}

/**
 * Delete a Process Step
 */
export function deleteProcessStep(stepId) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    processSteps: current.processSteps.filter(s => s.id !== stepId)
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Reorder Process Steps
 */
export function reorderProcessSteps(newOrder) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    processSteps: newOrder
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Update Gallery Section Header & Categories
 */
export function updateMetalGallerySection(sectionData) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    gallerySection: { ...current.gallerySection, ...sectionData }
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Add or Edit a Project Gallery Item
 */
export function saveGalleryProject(projectData) {
  const current = getStoredMetalData();
  let list = [...current.galleryProjects];

  const cleanProject = {
    id: projectData.id || `proj-${Date.now()}`,
    title: projectData.title || '',
    category: projectData.category || 'Gates',
    location: projectData.location || '',
    year: projectData.year || '',
    image: projectData.image || '',
    alt: projectData.alt || projectData.title || 'Architectural Metal Project',
    materials: projectData.materials || '',
    desc: projectData.desc || '',
    iconName: projectData.iconName || 'Shield',
    featured: Boolean(projectData.featured)
  };

  const existingIdx = list.findIndex(p => p.id === cleanProject.id);
  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...cleanProject };
  } else {
    list.unshift(cleanProject);
  }

  const updated = {
    ...current,
    galleryProjects: list
  };
  persistMetalData(updated);
  return cleanProject;
}

/**
 * Delete a Project Gallery Item
 */
export function deleteGalleryProject(projectId) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    galleryProjects: current.galleryProjects.filter(p => p.id !== projectId)
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Reorder Gallery Projects
 */
export function reorderGalleryProjects(newOrder) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    galleryProjects: newOrder
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Get project by ID
 */
export function getGalleryProjectById(id) {
  const current = getStoredMetalData();
  return current.galleryProjects.find(p => p.id === id) || null;
}

/**
 * Get fabricate offering by ID
 */
export function getFabricateOfferingById(id) {
  const current = getStoredMetalData();
  return current.fabricateOfferings.find(o => o.id === id) || null;
}

/**
 * Update Bottom CTA Banner configuration
 */
export function updateMetalCTA(ctaData) {
  const current = getStoredMetalData();
  const updated = {
    ...current,
    ctaBanner: { ...current.ctaBanner, ...ctaData }
  };
  persistMetalData(updated);
  return updated;
}

/**
 * Reset all Metal Fabrication data back to factory defaults
 */
export function resetMetalToDefault() {
  persistMetalData(DEFAULT_METAL_DATA);
  return DEFAULT_METAL_DATA;
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
