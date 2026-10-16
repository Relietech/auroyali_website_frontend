/**
 * Ethos & Homepage Philosophy Storage & Settings Service
 * Handles persistence of "The Auroville Ethos" section in localStorage
 * and dispatches reactive window events for instant site synchronization.
 */

const STORAGE_KEY = 'auroyali_ethos_data_v1';
const UPDATE_EVENT = 'auroyali_ethos_updated';

export const DEFAULT_ETHOS_DATA = {
  heading: {
    tag: 'The Auroville Ethos',
    title: 'A conscious synthesis of vernacular wisdom and contemporary engineering.',
    subtitle: 'Founded in 2012 in the international township of Auroville, AuroYali was born from an urgency to transform modern building methods into regenerative, earth-positive practices.',
  },
  showcaseImages: [
    {
      id: 'architecture',
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Auroyali Auroville Earth Architecture',
      tag: 'Our Philosophy',
      quote: '"Architecture is not an imposition on nature, but a quiet conversation with sun, wind, and soil."',
    },
    {
      id: 'craft',
      src: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      alt: 'CSEB Earth Blocks & Artisanal Craft',
      tag: 'Material Craft',
      quote: '"Every earth block and timber joint is shaped with intention, breathing vitality into each space."',
    },
  ],
  cards: [
    {
      id: 'thermal',
      badge: '01 / THERMAL',
      title: 'Bioclimatic Engineering',
      subtitle: 'Passive Thermal Regulation',
      description: 'Passive ventilation shafts, solar-aligned orientation, and thermal mass walls that eliminate reliance on air-conditioning.',
      pills: ['Passive Ventilation', 'Zero-HVAC'],
      iconType: 'sun',
    },
    {
      id: 'timber',
      badge: '02 / TIMBER',
      title: 'Regenerative Forestry',
      subtitle: 'Ethical & Non-Toxic Sourcing',
      description: 'Engineered structural bamboo treated with mineral salts, coupled with salvaged local acacia, neem, and vintage timber.',
      pills: ['Borate Bamboo', 'Reclaimed Wood'],
      iconType: 'trees',
    },
  ],
  actions: {
    primaryText: 'Read Our Full Story',
    primaryLink: '/about',
    secondaryText: 'Explore Workshops',
    secondaryLink: '/workshops',
  },
  updatedAt: new Date().toISOString(),
};

export function getStoredEthosData() {
  if (typeof window === 'undefined') return { ...DEFAULT_ETHOS_DATA };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ETHOS_DATA };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ETHOS_DATA,
      ...parsed,
      heading: { ...DEFAULT_ETHOS_DATA.heading, ...(parsed.heading || {}) },
      actions: { ...DEFAULT_ETHOS_DATA.actions, ...(parsed.actions || {}) },
    };
  } catch (err) {
    console.error('[ethosStore] Error reading ethos config:', err);
    return { ...DEFAULT_ETHOS_DATA };
  }
}

export function saveEthosData(newData) {
  try {
    const current = getStoredEthosData();
    const updated = {
      ...current,
      ...newData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.error('[ethosStore] Error saving ethos data:', err);
    return getStoredEthosData();
  }
}

export function resetEthosToDefault() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    // ignore
  }

  const fresh = { ...DEFAULT_ETHOS_DATA };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: fresh }));
  }
  return fresh;
}

export function subscribeToEthos(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e) => {
    callback(e.detail || getStoredEthosData());
  };

  window.addEventListener(UPDATE_EVENT, handler);
  return () => window.removeEventListener(UPDATE_EVENT, handler);
}

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
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export default {
  getStoredEthosData,
  saveEthosData,
  resetEthosToDefault,
  subscribeToEthos,
  readImageFileAsDataUrl,
};
