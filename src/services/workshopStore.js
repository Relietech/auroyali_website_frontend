import { 
  csebImage, 
  rammedEarthImage, 
  ferrocementImage, 
  timbrelVaultImage, 
  bambooJoineryImage 
} from '../data/workshopImages';

const WORKSHOPS_STORAGE_KEY = 'auroyali_offered_workshops_v1';
const WORKSHOPS_UPDATE_EVENT = 'auroyali_workshops_updated';

/**
 * Default Seed Workshops matching the AuroYali Portfolio "We offer" section
 */
export const DEFAULT_OFFERED_WORKSHOPS = [
  {
    id: "cseb-workshop",
    num: "01",
    title: "CSEB Workshop",
    tag: "Compressed Stabilised Earth Blocks",
    desc: "Hands-on experience in soil testing, stabilizer formulation, brick press production, and constructing load-bearing earth masonry arches and vaults.",
    image: csebImage,
    alt: "Compressed Stabilised Earth Blocks (CSEB)",
    modules: [
      "Soil Test and Mixing of Stabilizer",
      "Hands on Experience of Brick Production",
      "Learning Brick Masonry with different joints",
      "Making of Arches and Vaults",
      "Making Mud Mortar"
    ]
  },
  {
    id: "rammed-earth-workshop",
    num: "02",
    title: "Rammed Earth Workshop",
    tag: "Solid Earth Wall Engineering",
    desc: "A damp mix of subsoil, sand, and stabilizer is compacted inside precision formwork to create monolithic, high-thermal-mass load-bearing walls.",
    image: rammedEarthImage,
    alt: "Compacted layered Rammed Earth wall",
    modules: [
      "Soil Test and Mixing of Stabilizer",
      "Rammed Earth Foundation",
      "Assembling the Shutter / Formwork",
      "Techniques for Ramming",
      "Creating opening in the wall"
    ]
  },
  {
    id: "ferrocement-workshop",
    num: "03",
    title: "Ferro Cement Workshop",
    tag: "Thin-Shell Wire Mesh Architecture",
    desc: "Cement mortar reinforced with layers of continuous wire mesh produces lightweight, ductile, high-strength curved roofs, channels, and sculptures.",
    image: ferrocementImage,
    alt: "Ferrocement wire mesh reinforcement",
    modules: [
      "Understanding Ferro Cement as a Building Material",
      "Making of Ferro Cement Channel and Slab",
      "Experimenting Ferro Cement Structures"
    ]
  },
  {
    id: "timbrel-vault-workshop",
    num: "04",
    title: "Timbrel Vault Workshop",
    tag: "Self-Supporting Catalan Masonry",
    desc: "Parabolic and catenary vaulting structures built from thin, lightweight terracotta tiles that support themselves in pure compression without heavy formwork.",
    image: timbrelVaultImage,
    alt: "Timbrel vault parabolic masonry arches",
    modules: [
      "Understanding the structure & catenary thrust",
      "Theory on the technique",
      "Making of Frame Work & centering guides",
      "Constructing the Vault"
    ]
  },
  {
    id: "natural-plasters-workshop",
    num: "05",
    title: "Natural Plasters & Finishes",
    tag: "Lime Oxide & Breathable Finishes",
    desc: "Artisanal wall and flooring finishes combining aged slaked lime, natural earth plasters, mineral pigments, and seamless hand-cast oxide floors.",
    image: bambooJoineryImage,
    alt: "Natural Plasters, Lime Oxide & Oxide Flooring",
    modules: [
      "Natural earth plasters & clay renders",
      "Lime oxide & breathable wall finishes",
      "Seamless hand-cast oxide flooring",
      "Concrete finishes and stone polishing"
    ]
  }
];

/**
 * Fetch all offered workshops from localStorage, fallback to default seed
 */
export function getStoredOfferedWorkshops() {
  if (typeof window === 'undefined') return DEFAULT_OFFERED_WORKSHOPS;

  try {
    const raw = localStorage.getItem(WORKSHOPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WORKSHOPS_STORAGE_KEY, JSON.stringify(DEFAULT_OFFERED_WORKSHOPS));
      return DEFAULT_OFFERED_WORKSHOPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_OFFERED_WORKSHOPS;
  } catch (err) {
    console.error('Failed to parse workshops from localStorage:', err);
    return DEFAULT_OFFERED_WORKSHOPS;
  }
}

/**
 * Find single offered workshop by ID
 */
export function getOfferedWorkshopById(id) {
  if (!id) return null;
  const all = getStoredOfferedWorkshops();
  return all.find((w) => w.id === id) || null;
}

/**
 * Persist workshops to localStorage and trigger sync events
 */
function persistWorkshops(items) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(WORKSHOPS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(WORKSHOPS_UPDATE_EVENT, { detail: items }));
  } catch (err) {
    console.error('Failed to save workshops to localStorage:', err);
  }
}

/**
 * Subscribe to workshop store changes (cross-tab and in-app)
 */
export function subscribeToWorkshops(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e) => {
    callback(e.detail);
  };

  const handleStorage = (e) => {
    if (e.key === WORKSHOPS_STORAGE_KEY) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed);
      } catch (err) {
        console.error('Error handling storage event for workshops:', err);
      }
    }
  };

  window.addEventListener(WORKSHOPS_UPDATE_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(WORKSHOPS_UPDATE_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Add or update an offered workshop program
 */
export function saveOfferedWorkshop(workshopData) {
  const current = getStoredOfferedWorkshops();
  const existingIdx = current.findIndex(w => w.id === workshopData.id);

  const cleanModules = Array.isArray(workshopData.modules)
    ? workshopData.modules.filter(m => typeof m === 'string' && m.trim().length > 0)
    : [];

  const formattedWorkshop = {
    ...workshopData,
    id: workshopData.id || `workshop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: workshopData.title?.trim() || 'Workshop Program',
    tag: workshopData.tag?.trim() || 'Natural Construction',
    desc: workshopData.desc?.trim() || '',
    image: workshopData.image || '',
    alt: workshopData.alt?.trim() || workshopData.title || 'AuroYali Workshop Program',
    modules: cleanModules,
  };

  let updatedList;
  if (existingIdx !== -1) {
    updatedList = [...current];
    updatedList[existingIdx] = {
      ...updatedList[existingIdx],
      ...formattedWorkshop
    };
  } else {
    // Determine sequential number if missing
    if (!formattedWorkshop.num) {
      const nextNum = current.length + 1;
      formattedWorkshop.num = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    }
    updatedList = [...current, formattedWorkshop];
  }

  // Renumber sequentially if needed
  updatedList = updatedList.map((w, idx) => ({
    ...w,
    num: w.num || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`)
  }));

  persistWorkshops(updatedList);
  return formattedWorkshop;
}

/**
 * Delete an offered workshop program by ID
 */
export function deleteOfferedWorkshop(id) {
  const current = getStoredOfferedWorkshops();
  const updatedList = current
    .filter(w => w.id !== id)
    .map((w, idx) => ({
      ...w,
      num: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`
    }));

  persistWorkshops(updatedList);
  return updatedList;
}

/**
 * Reorder offered workshops (move up / down)
 */
export function reorderOfferedWorkshops(newItems) {
  const renumbered = newItems.map((w, idx) => ({
    ...w,
    num: idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`
  }));
  persistWorkshops(renumbered);
  return renumbered;
}

/**
 * Reset all offered workshops back to default AuroYali portfolio seed
 */
export function resetOfferedWorkshopsToDefault() {
  persistWorkshops(DEFAULT_OFFERED_WORKSHOPS);
  return DEFAULT_OFFERED_WORKSHOPS;
}

/**
 * Export workshops to JSON file
 */
export function exportWorkshopsToJSON() {
  const data = getStoredOfferedWorkshops();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `auroyali-workshops-offerings-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =========================================================================
   2. GALLERY OF TECHNIQUES & WORK ("Created") STORE
   ========================================================================= */

const GALLERY_STORAGE_KEY = 'auroyali_workshop_gallery_v1';
const GALLERY_UPDATE_EVENT = 'auroyali_workshop_gallery_updated';

export const GALLERY_CATEGORIES = [
  { id: 'all', label: 'All Works' },
  { id: 'earth', label: 'Earth & CSEB' },
  { id: 'vaults', label: 'Vaults & Shells' },
  { id: 'bamboo', label: 'Bamboo Craft' },
  { id: 'finishes', label: 'Natural Plasters' }
];

export const DEFAULT_GALLERY_ITEMS = [
  { 
    id: "gallery-1",
    title: "CSEB Pressing", 
    category: "earth",
    categoryLabel: "Earth Masonry",
    img: csebImage, 
    tall: false,
    caption: "Manual Auram press compaction of compressed stabilized earth blocks."
  },
  { 
    id: "gallery-2",
    title: "Rammed Earth", 
    category: "earth",
    categoryLabel: "Earth Masonry",
    img: rammedEarthImage, 
    tall: true,
    caption: "Layered monolithic earth wall compacted inside precision formwork."
  },
  { 
    id: "gallery-3",
    title: "Ferro Cement", 
    category: "vaults",
    categoryLabel: "Vaults & Shells",
    img: ferrocementImage, 
    tall: true,
    caption: "Curved ductile wire mesh armature coated with high-strength mortar."
  },
  { 
    id: "gallery-4",
    title: "Timbrel Vault", 
    category: "vaults",
    categoryLabel: "Vaults & Shells",
    img: timbrelVaultImage, 
    tall: false,
    caption: "Self-supporting parabolic Catalan masonry built without heavy formwork."
  },
  { 
    id: "gallery-5",
    title: "Natural Finishes", 
    category: "finishes",
    categoryLabel: "Natural Plasters",
    img: bambooJoineryImage, 
    tall: false,
    caption: "Aged slaked lime plaster and seamless hand-cast oxide flooring."
  },
  { 
    id: "gallery-6",
    title: "Bamboo Pavilion", 
    category: "bamboo",
    categoryLabel: "Bamboo Craft",
    img: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80", 
    tall: false,
    caption: "Treated structural bamboo culms assembled in tensile parabolic form."
  },
  { 
    id: "gallery-7",
    title: "Lime Plaster Rendering", 
    category: "finishes",
    categoryLabel: "Natural Plasters",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", 
    tall: true,
    caption: "Multi-layered breathable lime and mineral clay render application."
  },
  { 
    id: "gallery-8",
    title: "Arch Masonry Bonding", 
    category: "earth",
    categoryLabel: "Earth Masonry",
    img: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80", 
    tall: false,
    caption: "Constructing catenary arches with optimized mud mortar interlocking joints."
  },
  { 
    id: "gallery-9",
    title: "Bamboo Node Joinery", 
    category: "bamboo",
    categoryLabel: "Bamboo Craft",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", 
    tall: false,
    caption: "Precision fish-mouth joinery with wooden dowels and bolted connections."
  },
  { 
    id: "gallery-10",
    title: "Catenary Vault Testing", 
    category: "vaults",
    categoryLabel: "Vaults & Shells",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", 
    tall: true,
    caption: "Live structural load verification and line-of-thrust analysis."
  }
];

/**
 * Fetch all gallery items from localStorage, fallback to default seed
 */
export function getStoredGalleryItems() {
  if (typeof window === 'undefined') return DEFAULT_GALLERY_ITEMS;

  try {
    const raw = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(DEFAULT_GALLERY_ITEMS));
      return DEFAULT_GALLERY_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_GALLERY_ITEMS;
  } catch (err) {
    console.error('Failed to parse gallery items from localStorage:', err);
    return DEFAULT_GALLERY_ITEMS;
  }
}

/**
 * Find single gallery item by ID
 */
export function getGalleryItemById(id) {
  if (!id) return null;
  const all = getStoredGalleryItems();
  return all.find((item) => String(item.id) === String(id)) || null;
}

/**
 * Persist gallery items to localStorage and trigger sync events
 */
function persistGalleryItems(items) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(GALLERY_UPDATE_EVENT, { detail: items }));
  } catch (err) {
    console.error('Failed to save gallery items to localStorage:', err);
  }
}

/**
 * Subscribe to gallery store changes (cross-tab and in-app)
 */
export function subscribeToGallery(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustom = (e) => {
    callback(e.detail);
  };

  const handleStorage = (e) => {
    if (e.key === GALLERY_STORAGE_KEY) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback(parsed);
      } catch (err) {
        console.error('Error handling storage event for gallery:', err);
      }
    }
  };

  window.addEventListener(GALLERY_UPDATE_EVENT, handleCustom);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(GALLERY_UPDATE_EVENT, handleCustom);
    window.removeEventListener('storage', handleStorage);
  };
}

/**
 * Add or update a gallery item
 */
export function saveGalleryItem(itemData) {
  const current = getStoredGalleryItems();
  const existingIdx = current.findIndex(item => String(item.id) === String(itemData.id));

  const categoryLabels = {
    earth: 'Earth & CSEB',
    vaults: 'Vaults & Shells',
    bamboo: 'Bamboo Craft',
    finishes: 'Natural Plasters'
  };

  const formattedItem = {
    ...itemData,
    id: itemData.id || `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: itemData.title?.trim() || 'Technique Study',
    category: itemData.category || 'earth',
    categoryLabel: itemData.categoryLabel?.trim() || categoryLabels[itemData.category] || 'Natural Architecture',
    img: itemData.img || '',
    tall: Boolean(itemData.tall),
    caption: itemData.caption?.trim() || ''
  };

  let updatedList;
  if (existingIdx !== -1) {
    updatedList = [...current];
    updatedList[existingIdx] = {
      ...updatedList[existingIdx],
      ...formattedItem
    };
  } else {
    updatedList = [...current, formattedItem];
  }

  persistGalleryItems(updatedList);
  return formattedItem;
}

/**
 * Delete a gallery item by ID
 */
export function deleteGalleryItem(id) {
  const current = getStoredGalleryItems();
  const updatedList = current.filter(item => String(item.id) !== String(id));
  persistGalleryItems(updatedList);
  return updatedList;
}

/**
 * Reorder gallery items
 */
export function reorderGalleryItems(newItems) {
  persistGalleryItems(newItems);
  return newItems;
}

/**
 * Reset all gallery items back to default AuroYali seed
 */
export function resetGalleryItemsToDefault() {
  persistGalleryItems(DEFAULT_GALLERY_ITEMS);
  return DEFAULT_GALLERY_ITEMS;
}

/**
 * Export gallery items to JSON file
 */
export function exportGalleryToJSON() {
  const data = getStoredGalleryItems();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `auroyali-workshops-gallery-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

