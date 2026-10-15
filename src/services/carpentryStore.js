/**
 * Carpentry Studio Storage & State Management Service
 * Manages custom carpentry portfolio works, categories, hero configuration,
 * and image uploads with reactive window events and localStorage persistence.
 */

const CARPENTRY_STORAGE_KEY = 'auroyali_carpentry_data_v2';
const CARPENTRY_UPDATE_EVENT = 'auroyali_carpentry_updated';

// Default categories and portfolio items seeded from public Carpentry page
export const DEFAULT_CARPENTRY_CATEGORIES = [
  {
    id: 'doors-windows',
    number: '01',
    title: 'Doors and Windows',
    description: 'Custom handcrafted solid wood main entrance portals, foldable patio doors, and weather-sealed casements engineered for tropical durability and acoustic isolation.',
    layout: 'bento', // 'bento' | 'split' | 'grid'
    items: [
      {
        id: 'dw-1',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Lakshmi Training Centre',
        tag: 'Main Door',
        src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Lakshmi Training Centre Main Door - Solid Teak Craftsmanship'
      },
      {
        id: 'dw-2',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Asaithambi Residence',
        tag: 'Main Door',
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Asaithambi Residence Main Door - Vertical Timber Pivot'
      },
      {
        id: 'dw-3',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: "Karthik's Farmhouse",
        tag: 'Main Door',
        src: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
        alt: "Karthik's Farmhouse Main Door - Reclaimed Country Wood"
      },
      {
        id: 'dw-4',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Sudha Srinivasan',
        tag: 'Foldable Door',
        src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
        alt: 'Sudha Srinivasan Residence Foldable Glazed Door'
      },
      {
        id: 'dw-5',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Solid Teak French Casement',
        tag: 'Casement Window',
        src: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=1000&q=80',
        alt: 'Solid Teak French Casement Window with Brass Fittings'
      },
      {
        id: 'dw-6',
        categoryId: 'doors-windows',
        categoryTitle: 'Doors and Windows',
        title: 'Louvered Timber Shutter',
        tag: 'Ventilation Shutter',
        src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        alt: 'Tropical Louvered Timber Window Shutter'
      }
    ]
  },
  {
    id: 'furniture',
    number: '02',
    title: 'Furniture',
    description: 'Bespoke freestanding and built-in architectural furniture handcrafted with solid hardwoods, cured bamboo, and heirloom joinery that ages gracefully.',
    layout: 'split',
    items: [
      {
        id: 'fn-1',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Bamboo Furniture',
        tag: 'Lounge Collection',
        src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        alt: 'Bamboo Furniture Lounge Series'
      },
      {
        id: 'fn-2',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Seating Table',
        tag: 'Bespoke Seating',
        src: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80',
        alt: 'Handcrafted Seating Table and Bench'
      },
      {
        id: 'fn-3',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Table Design 01',
        tag: 'Dining Table',
        src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
        alt: 'Table Design 01 - Solid Timber Dining Series'
      },
      {
        id: 'fn-4',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Table Design 02',
        tag: 'Desk & Table',
        src: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80',
        alt: 'Table Design 02 - Architectural Timber Desk'
      },
      {
        id: 'fn-5',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Handcrafted Credenza',
        tag: 'Cane & Teak Storage',
        src: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80',
        alt: 'Handcrafted Solid Teak Credenza with Cane Webbing'
      },
      {
        id: 'fn-6',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Sculptural Teak Lounge Chair',
        tag: 'Artisanal Seating',
        src: 'https://images.unsplash.com/photo-1580481077194-4d2216e2576b?auto=format&fit=crop&w=1000&q=80',
        alt: 'Sculptural Teak Lounge Chair with Natural Rattan Weave'
      },
      {
        id: 'fn-7',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Live-Edge Coffee Table',
        tag: 'Solid Timber Table',
        src: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80',
        alt: 'Live-Edge Solid Timber Coffee Table'
      },
      {
        id: 'fn-8',
        categoryId: 'furniture',
        categoryTitle: 'Furniture',
        title: 'Minimalist Bed Frame',
        tag: 'Bedroom Furniture',
        src: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
        alt: 'Minimalist Solid Wood Platform Bed Frame'
      }
    ]
  },
  {
    id: 'wooden-interiors',
    number: '03',
    title: 'Wooden Interiors',
    description: 'Architectural interior millwork, acoustic fluted timber wall paneling, modular solid storage, and custom ceiling pergolas crafted in Auroville.',
    layout: 'grid',
    items: [
      {
        id: 'wi-1',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Acoustic Fluted Timber Cladding',
        tag: 'Wall Paneling',
        src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
        alt: 'Acoustic Fluted Timber Wall Paneling'
      },
      {
        id: 'wi-2',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Exposed Ceiling Rafters & Beams',
        tag: 'Ceiling Architecture',
        src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
        alt: 'Solid Wood Ceiling Rafters and Pergola'
      },
      {
        id: 'wi-3',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Modular Walk-In Wardrobe',
        tag: 'Custom Storage',
        src: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1000&q=80',
        alt: 'Bespoke Modular Wooden Wardrobe'
      },
      {
        id: 'wi-4',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Artisanal Hardwood Kitchen',
        tag: 'Custom Cabinetry',
        src: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
        alt: 'Handcrafted Solid Hardwood Kitchen Cabinetry'
      },
      {
        id: 'wi-5',
        categoryId: 'wooden-interiors',
        categoryTitle: 'Wooden Interiors',
        title: 'Perforated Timber Screen Partition',
        tag: 'Space Divider',
        src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
        alt: 'Handcrafted Architectural Wooden Screen Partition'
      }
    ]
  }
];

export const DEFAULT_HERO_CONFIG = {
  eyebrow: 'OUR CRAFT',
  title: 'Carpentry',
  subtitle: 'Bespoke architectural woodworking, heirloom solid timber joinery, and sustainable woodcraft rooted in Auroville.',
  heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=85'
};

/**
 * Returns deep-cloned default data structure
 */
export function getDefaultCarpentryData() {
  return {
    hero: { ...DEFAULT_HERO_CONFIG },
    categories: DEFAULT_CARPENTRY_CATEGORIES.map(cat => ({
      ...cat,
      items: cat.items.map(item => ({ ...item }))
    }))
  };
}

/**
 * Retrieve current carpentry configuration from storage or fallback to defaults
 */
export function getStoredCarpentryData() {
  if (typeof window === 'undefined') return getDefaultCarpentryData();

  try {
    const raw = localStorage.getItem(CARPENTRY_STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultCarpentryData();
      localStorage.setItem(CARPENTRY_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.categories)) {
      return getDefaultCarpentryData();
    }
    return {
      hero: parsed.hero || DEFAULT_HERO_CONFIG,
      categories: parsed.categories
    };
  } catch (err) {
    console.error('[carpentryStore] Failed to read from localStorage:', err);
    return getDefaultCarpentryData();
  }
}

/**
 * Persist carpentry data and trigger window update event
 */
function persistCarpentryData(data) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CARPENTRY_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(CARPENTRY_UPDATE_EVENT, { detail: data }));
  } catch (err) {
    console.error('[carpentryStore] Failed to persist data:', err);
  }
}

/**
 * Save (create or update) a carpentry work item
 */
export function saveCarpentryItem(itemData) {
  const current = getStoredCarpentryData();
  const categoryId = itemData.categoryId || 'doors-windows';
  
  // Ensure category exists
  let category = current.categories.find(c => c.id === categoryId);
  if (!category) {
    category = {
      id: categoryId,
      number: String(current.categories.length + 1).padStart(2, '0'),
      title: itemData.categoryTitle || categoryId,
      description: 'Custom architectural carpentry handcrafted in Auroville.',
      layout: 'grid',
      items: []
    };
    current.categories.push(category);
  }

  const existingIndex = category.items.findIndex(i => i.id === itemData.id);
  const nowId = itemData.id || `cp-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;

  const cleanItem = {
    id: nowId,
    categoryId: category.id,
    categoryTitle: category.title,
    title: itemData.title?.trim() || 'Untitled Woodcraft',
    tag: itemData.tag?.trim() || 'Custom Joinery',
    src: itemData.src || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    alt: itemData.alt?.trim() || `${itemData.title || 'Handcrafted Timber'} - ${itemData.tag || 'AuroYali Carpentry'}`
  };

  if (existingIndex >= 0) {
    // If category changed, remove from old category first
    category.items[existingIndex] = cleanItem;
  } else {
    // Check if it was in another category previously
    for (const otherCat of current.categories) {
      if (otherCat.id !== categoryId) {
        otherCat.items = otherCat.items.filter(i => i.id !== cleanItem.id);
      }
    }
    // Add to target category (at beginning so newly uploaded works show first)
    category.items.unshift(cleanItem);
  }

  persistCarpentryData(current);
  return cleanItem;
}

/**
 * Delete a carpentry work item by ID across all categories
 */
export function deleteCarpentryItem(itemId) {
  const current = getStoredCarpentryData();
  let found = false;

  current.categories = current.categories.map(cat => {
    const prevCount = cat.items.length;
    const filtered = cat.items.filter(i => i.id !== itemId);
    if (filtered.length !== prevCount) found = true;
    return {
      ...cat,
      items: filtered
    };
  });

  if (found) {
    persistCarpentryData(current);
  }
  return found;
}

/**
 * Update category metadata (title, description, layout)
 */
export function updateCategoryDetails(categoryId, updates) {
  const current = getStoredCarpentryData();
  const category = current.categories.find(c => c.id === categoryId);
  if (!category) return null;

  if (updates.title) {
    category.title = updates.title.trim();
    // Also update categoryTitle in child items
    category.items = category.items.map(item => ({
      ...item,
      categoryTitle: category.title
    }));
  }
  if (updates.description !== undefined) category.description = updates.description.trim();
  if (updates.layout && ['bento', 'split', 'grid'].includes(updates.layout)) {
    category.layout = updates.layout;
  }

  persistCarpentryData(current);
  return category;
}

/**
 * Update hero banner settings
 */
export function updateHeroConfig(updates) {
  const current = getStoredCarpentryData();
  current.hero = {
    ...current.hero,
    ...updates
  };
  persistCarpentryData(current);
  return current.hero;
}

/**
 * Reset all carpentry data to default Auroville seed portfolio
 */
export function resetCarpentryToDefault() {
  const defaults = getDefaultCarpentryData();
  persistCarpentryData(defaults);
  return defaults;
}

/**
 * Subscribe to reactive updates from admin or other tabs
 */
export function subscribeToCarpentry(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e) => {
    callback(e.detail || getStoredCarpentryData());
  };

  window.addEventListener(CARPENTRY_UPDATE_EVENT, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === CARPENTRY_STORAGE_KEY) {
      callback(getStoredCarpentryData());
    }
  });

  return () => {
    window.removeEventListener(CARPENTRY_UPDATE_EVENT, handler);
  };
}

/**
 * Helper to compress and convert uploaded image files to lightweight base64 URLs
 */
export function readImageFileAsDataUrl(file, maxDimension = 1400, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select a valid image file (PNG, JPG, WebP)'));
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

const CARPENTRY_CUSTOM_TAGS_KEY = 'auroyali_carpentry_custom_tags_v1';

/**
 * Retrieve user-created custom tags by category
 */
export function getCustomTags() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CARPENTRY_CUSTOM_TAGS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Save a new custom tag under a specific category
 */
export function saveCustomTag(categoryId, tag) {
  if (typeof window === 'undefined' || !categoryId || !tag) return getCustomTags();
  const trimmed = tag.trim();
  if (!trimmed) return getCustomTags();
  try {
    const current = getCustomTags();
    const existing = current[categoryId] || [];
    if (!existing.includes(trimmed)) {
      current[categoryId] = [...existing, trimmed];
      localStorage.setItem(CARPENTRY_CUSTOM_TAGS_KEY, JSON.stringify(current));
    }
    return current;
  } catch (e) {
    console.error('Failed to save custom tag:', e);
    return getCustomTags();
  }
}

/**
 * Delete a custom tag under a specific category
 */
export function deleteCustomTag(categoryId, tag) {
  if (typeof window === 'undefined' || !categoryId || !tag) return getCustomTags();
  try {
    const current = getCustomTags();
    if (current[categoryId]) {
      current[categoryId] = current[categoryId].filter(t => t !== tag);
      localStorage.setItem(CARPENTRY_CUSTOM_TAGS_KEY, JSON.stringify(current));
    }
    return current;
  } catch (e) {
    console.error('Failed to delete custom tag:', e);
    return getCustomTags();
  }
}
