/**
 * Architecture Studio Storage & State Management Service
 * Manages dynamic hero configuration, ethos/overview, process steps,
 * allied design disciplines, and bottom CTA banner.
 * Persists with localStorage and dispatches reactive window events.
 */

import {
  Lightbulb,
  Compass,
  PenTool,
  FileText,
  Users,
  HardHat,
  Palette,
  Trees,
  Armchair,
  Ruler,
  Sparkles,
  Layers,
  Box,
  Building,
  CheckCircle2,
  Hammer,
  ShieldCheck,
  Eye,
  Briefcase
} from 'lucide-react';

export const ARCHITECTURE_STORAGE_KEY = 'auroyali_architecture_data_v1';
export const ARCHITECTURE_UPDATE_EVENT = 'auroyali_architecture_updated';

/**
 * Supported Icons registry for Process Steps & Allied Services
 */
export const ARCHITECTURE_ICONS = {
  Lightbulb,
  Compass,
  PenTool,
  FileText,
  Users,
  HardHat,
  Palette,
  Trees,
  Armchair,
  Ruler,
  Sparkles,
  Layers,
  Box,
  Building,
  CheckCircle2,
  Hammer,
  ShieldCheck,
  Eye,
  Briefcase
};

/**
 * Returns the matching Lucide icon component, falling back to Sparkles if not found
 */
export function getArchitectureIcon(iconName) {
  if (!iconName) return Sparkles;
  return ARCHITECTURE_ICONS[iconName] || Sparkles;
}

/**
 * Default Seed Data matching the established AuroYali architectural service presentation
 */
export const DEFAULT_ARCHITECTURE_DATA = {
  hero: {
    title: "Architecture",
    subtitle: "Creating both traditional and modern architecture with thorough planning and client-centric precision.",
    breadcrumb: "Architecture",
    tag: "Services",
    bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
  },
  overview: {
    eyebrow: "Our Approach",
    heading: "Architectural Excellence Centered on Your Needs",
    description: "We put our full effort into creating the best architecture for our clients. We create both traditional and modern architecture. Our main priority is client’s need. We carefully plan each and every step for the construction of our clients’ buildings. Client satisfaction is most important to us. We have a well trained team.",
    highlights: [
      "Traditional & Modern Styles",
      "Carefully Planned Step-by-Step",
      "Client Satisfaction as Priority",
      "Well Trained Professional Team"
    ],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ctaText: "Inquire with Our Architects",
    ctaLink: "/contact"
  },
  processSection: {
    eyebrow: "Step-by-Step Process",
    heading: "Architectural services we provide:",
    subtitle: "Our architects guide your project with methodical attention to detail at each stage of design and construction."
  },
  processSteps: [
    {
      id: "step-1",
      step: "01",
      title: "Concept Development",
      iconName: "Lightbulb",
      description: "They work closely with clients to understand their needs, goals, and preferences. They develop initial design concepts and sketches, exploring various options and presenting them to the client for feedback and approval."
    },
    {
      id: "step-2",
      step: "02",
      title: "Feasibility Studies",
      iconName: "Compass",
      description: "The architects assess the viability and potential of a project by conducting feasibility studies. This involves analyzing site conditions, zoning and building code requirements, environmental impact, and other factors that may affect the project's success."
    },
    {
      id: "step-3",
      step: "03",
      title: "Design Development",
      iconName: "PenTool",
      description: "Once the concept is approved, architects proceed with the design development phase. They create detailed drawings, plans, and 3D models that illustrate the proposed design, including floor plans, elevations, sections, and other technical documentation."
    },
    {
      id: "step-4",
      step: "04",
      title: "Construction Documentation",
      iconName: "FileText",
      description: "Architects prepare comprehensive construction documents that serve as a guide for builders and contractors. These documents include detailed drawings, specifications, and schedules, ensuring that the project is built according to the intended design."
    },
    {
      id: "step-5",
      step: "05",
      title: "Discussion with Construction Team",
      iconName: "Users",
      description: "Our architects then explain the design and drawings to the project manager, site engineers, masons and other construction workers and make sure they deliver the clients' needs and interests."
    },
    {
      id: "step-6",
      step: "06",
      title: "Construction Supervision",
      iconName: "HardHat",
      description: "During the construction phase, architects provide on-site supervision, monitor progress, and ensure that the construction aligns with the design intent. They review shop drawings, respond to contractor inquiries, conduct site visits, and address any design clarifications or modifications that may arise."
    }
  ],
  alliedSection: {
    eyebrow: "WHAT WE DO",
    heading: "Our Design Services",
    subtitle: "Comprehensive design disciplines crafted for architectural harmony."
  },
  alliedServices: [
    {
      id: "interior-design",
      numeral: "01",
      title: "Interior Design",
      iconName: "Palette",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
      description: "Holistic spatial planning, mineral lime finishes, custom lighting, and bespoke interior styling tailored to elevate daily rituals.",
      bullets: [
        "Space Planning & Flow",
        "Material & Lime Finishes",
        "Custom Architectural Lighting"
      ],
      ctaText: "Request Service",
      ctaLink: "/contact"
    },
    {
      id: "landscape-design",
      numeral: "02",
      title: "Landscape Design",
      iconName: "Trees",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
      description: "Climate-responsive outdoor sanctuaries, native drought-tolerant flora, rainwater bioswales, and shaded courtyards integrated with nature.",
      bullets: [
        "Microclimate Courtyards",
        "Native Botanical Planning",
        "Rainwater Swales & Paving"
      ],
      ctaText: "Request Service",
      ctaLink: "/contact"
    },
    {
      id: "furniture-design",
      numeral: "03",
      title: "Furniture Design",
      iconName: "Armchair",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
      description: "Bespoke solid timber joinery, cane details, and custom architectural furniture handcrafted for heirloom durability and ergonomic comfort.",
      bullets: [
        "Custom Millwork & Joinery",
        "Reclaimed Teak & Hardwood",
        "Ergonomic Heirloom Pieces"
      ],
      ctaText: "Request Service",
      ctaLink: "/contact"
    }
  ],
  ctaBanner: {
    heading: "Ready to Start Your Architectural Project?",
    subtitle: "Get in touch with our Auroville studio to discuss your site, design requirements, and construction timeline.",
    buttonText: "Contact Us Today",
    buttonLink: "/contact"
  }
};

/**
 * Retrieve current architecture data from localStorage, falling back to defaults
 */
export function getStoredArchitectureData() {
  if (typeof window === 'undefined') return DEFAULT_ARCHITECTURE_DATA;
  try {
    const raw = localStorage.getItem(ARCHITECTURE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ARCHITECTURE_STORAGE_KEY, JSON.stringify(DEFAULT_ARCHITECTURE_DATA));
      return DEFAULT_ARCHITECTURE_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      hero: { ...DEFAULT_ARCHITECTURE_DATA.hero, ...(parsed.hero || {}) },
      overview: { ...DEFAULT_ARCHITECTURE_DATA.overview, ...(parsed.overview || {}) },
      processSection: { ...DEFAULT_ARCHITECTURE_DATA.processSection, ...(parsed.processSection || {}) },
      processSteps: Array.isArray(parsed.processSteps) && parsed.processSteps.length > 0
        ? parsed.processSteps
        : DEFAULT_ARCHITECTURE_DATA.processSteps,
      alliedSection: { ...DEFAULT_ARCHITECTURE_DATA.alliedSection, ...(parsed.alliedSection || {}) },
      alliedServices: Array.isArray(parsed.alliedServices) && parsed.alliedServices.length > 0
        ? parsed.alliedServices.map(service => {
            const defaultMatch = DEFAULT_ARCHITECTURE_DATA.alliedServices.find(s => s.id === service.id);
            return {
              ...service,
              bullets: Array.isArray(service.bullets) && service.bullets.length > 0
                ? service.bullets.slice(0, 3)
                : (defaultMatch?.bullets ? [...defaultMatch.bullets].slice(0, 3) : [])
            };
          })
        : DEFAULT_ARCHITECTURE_DATA.alliedServices,
      ctaBanner: { ...DEFAULT_ARCHITECTURE_DATA.ctaBanner, ...(parsed.ctaBanner || {}) }
    };
  } catch (err) {
    console.error('Error reading architecture data from localStorage:', err);
    return DEFAULT_ARCHITECTURE_DATA;
  }
}

/**
 * Persist architecture data to localStorage and notify all subscribers
 */
export function persistArchitectureData(data) {
  try {
    localStorage.setItem(ARCHITECTURE_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error writing architecture data to localStorage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(ARCHITECTURE_UPDATE_EVENT, { detail: data })
    );
  }
}

/**
 * Subscribe to reactive architecture updates across tabs and components
 */
export function subscribeToArchitecture(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (event) => {
    callback(event.detail || getStoredArchitectureData());
  };

  const storageHandler = (e) => {
    if (e.key === ARCHITECTURE_STORAGE_KEY) {
      callback(getStoredArchitectureData());
    }
  };

  window.addEventListener(ARCHITECTURE_UPDATE_EVENT, handler);
  window.addEventListener('storage', storageHandler);

  return () => {
    window.removeEventListener(ARCHITECTURE_UPDATE_EVENT, handler);
    window.removeEventListener('storage', storageHandler);
  };
}

/**
 * Update Hero Banner configuration
 */
export function updateArchitectureHero(heroData) {
  const current = getStoredArchitectureData();
  const updated = {
    ...current,
    hero: { ...current.hero, ...heroData }
  };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Update Ethos & Overview configuration
 */
export function updateArchitectureOverview(overviewData) {
  const current = getStoredArchitectureData();
  const updated = {
    ...current,
    overview: { ...current.overview, ...overviewData }
  };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Update Process Section header configuration
 */
export function updateProcessSection(sectionData) {
  const current = getStoredArchitectureData();
  const updated = {
    ...current,
    processSection: { ...current.processSection, ...sectionData }
  };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Save (create or update) a Process Step
 */
export function saveProcessStep(stepData) {
  const current = getStoredArchitectureData();
  let steps = [...current.processSteps];

  if (stepData.id) {
    // Update existing
    const idx = steps.findIndex(s => s.id === stepData.id);
    if (idx !== -1) {
      steps[idx] = { ...steps[idx], ...stepData };
    } else {
      steps.push(stepData);
    }
  } else {
    // Create new
    const nextNum = (steps.length + 1).toString().padStart(2, '0');
    const newStep = {
      ...stepData,
      id: `step-${Date.now()}`,
      step: stepData.step || nextNum
    };
    steps.push(newStep);
  }

  const updated = { ...current, processSteps: steps };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Delete a Process Step by ID
 */
export function deleteProcessStep(stepId) {
  const current = getStoredArchitectureData();
  const filtered = current.processSteps.filter(s => s.id !== stepId);
  const updated = { ...current, processSteps: filtered };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Reorder Process Steps
 */
export function reorderProcessSteps(newSteps) {
  const current = getStoredArchitectureData();
  const updated = { ...current, processSteps: newSteps };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Update Allied Section header configuration
 */
export function updateAlliedSection(sectionData) {
  const current = getStoredArchitectureData();
  const updated = {
    ...current,
    alliedSection: { ...current.alliedSection, ...sectionData }
  };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Save (create or update) an Allied Service discipline
 */
export function saveAlliedService(serviceData) {
  const current = getStoredArchitectureData();
  let services = [...current.alliedServices];

  const sanitizedService = {
    ...serviceData,
    bullets: Array.isArray(serviceData.bullets) ? serviceData.bullets.slice(0, 3) : []
  };

  if (sanitizedService.id) {
    const idx = services.findIndex(s => s.id === sanitizedService.id);
    if (idx !== -1) {
      services[idx] = { ...services[idx], ...sanitizedService };
    } else {
      services.push(sanitizedService);
    }
  } else {
    const nextNumeral = (services.length + 1).toString().padStart(2, '0');
    const newService = {
      ...sanitizedService,
      id: `allied-${Date.now()}`,
      numeral: sanitizedService.numeral || nextNumeral
    };
    services.push(newService);
  }

  const updated = { ...current, alliedServices: services };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Delete an Allied Service by ID
 */
export function deleteAlliedService(serviceId) {
  const current = getStoredArchitectureData();
  const filtered = current.alliedServices.filter(s => s.id !== serviceId);
  const updated = { ...current, alliedServices: filtered };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Reorder Allied Services
 */
export function reorderAlliedServices(newServices) {
  const current = getStoredArchitectureData();
  const updated = { ...current, alliedServices: newServices };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Get a single Process Step by ID
 */
export function getProcessStepById(id) {
  const current = getStoredArchitectureData();
  return current.processSteps.find(s => s.id === id) || null;
}

/**
 * Get a single Allied Service by ID
 */
export function getAlliedServiceById(id) {
  const current = getStoredArchitectureData();
  return current.alliedServices.find(s => s.id === id) || null;
}

/**
 * Update Bottom CTA Banner configuration
 */
export function updateArchitectureCTA(ctaData) {
  const current = getStoredArchitectureData();
  const updated = {
    ...current,
    ctaBanner: { ...current.ctaBanner, ...ctaData }
  };
  persistArchitectureData(updated);
  return updated;
}

/**
 * Reset all Architecture data back to factory defaults
 */
export function resetArchitectureToDefault() {
  persistArchitectureData(DEFAULT_ARCHITECTURE_DATA);
  return DEFAULT_ARCHITECTURE_DATA;
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
