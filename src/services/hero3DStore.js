/**
 * Hero 3D Model & Settings Storage Service
 * Supports binary GLB/GLTF storage via browser IndexedDB (handles 50MB+ without 5MB localStorage cap)
 * and metadata/settings via localStorage with real-time window event dispatching.
 */

const STORAGE_KEY = 'auroyali_hero3d_config_v1';
const UPDATE_EVENT = 'auroyali_hero3d_updated';
const DB_NAME = 'Auroyali3D_DB';
const DB_VERSION = 1;
const STORE_NAME = 'models';
const MODEL_KEY = 'hero_custom_model';

export const DEFAULT_HERO_CONFIG = {
  activeSource: 'default', // 'default' | 'upload' | 'url'
  modelName: '',
  modelSize: '',
  modelUrl: '',
  scale: 1.0,
  rotationY: 0,
  posY: 0,
  autoRotate: true,
  autoRotateSpeed: 0.8,
  defaultLightingMode: 'sunset', // 'sunset' | 'day' | 'night' | 'blueprint'
  overrideHeroText: false,
  heroBadge: 'Auroville Ecological Construction • Est. 2012',
  heroHeadlinePrefix: 'Design.',
  heroHeadlineHighlight: 'Build.',
  heroHeadlineSuffix: 'Handover.',
  heroSubtitle: 'Living earth sanctuaries crafted from the ground beneath your feet.',
  heroBody: 'From soil testing and on-site CSEB manufacturing to master bioclimatic architecture and turnkey artisanal handover — we build carbon-negative homes in harmony with climate and nature.',
  updatedAt: new Date().toISOString(),
};

// Cached active blob URL so we don't recreate it on every render
let cachedBlobUrl = null;

// ====================================================
// INDEXEDDB HELPER (Zero external dependencies)
// ====================================================
function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Save binary ArrayBuffer to IndexedDB
 */
async function setModelInDB(arrayBuffer, metadata) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const item = {
      buffer: arrayBuffer,
      name: metadata.name,
      size: metadata.size,
      type: metadata.type || 'model/gltf-binary',
      updatedAt: new Date().toISOString(),
    };
    const req = store.put(item, MODEL_KEY);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieve binary ArrayBuffer from IndexedDB
 */
async function getModelFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(MODEL_KEY);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[hero3DStore] Could not read from IndexedDB:', err);
    return null;
  }
}

/**
 * Remove binary file from IndexedDB
 */
async function removeModelFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(MODEL_KEY);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[hero3DStore] Could not delete from IndexedDB:', err);
  }
}

// ====================================================
// PUBLIC STORE METHODS
// ====================================================

/**
 * Get current settings from localStorage with default fallbacks
 */
export function getHero3DConfig() {
  if (typeof window === 'undefined') return { ...DEFAULT_HERO_CONFIG };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_HERO_CONFIG };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_HERO_CONFIG, ...parsed };
  } catch (err) {
    console.error('Error reading Hero 3D config:', err);
    return { ...DEFAULT_HERO_CONFIG };
  }
}

/**
 * Update and persist Hero 3D configuration
 */
export function updateHero3DSettings(newSettings) {
  try {
    const current = getHero3DConfig();
    const updated = {
      ...current,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Notify listeners across app
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.error('Error saving Hero 3D config:', err);
    return getHero3DConfig();
  }
}

/**
 * Save an uploaded 3D file (.glb / .gltf) into IndexedDB
 * @param {File} file - The file uploaded by admin
 */
export async function saveUploaded3DModel(file) {
  if (!file) throw new Error('No file provided');

  // Verify file extension
  const fileName = file.name || 'model.glb';
  const isGLTF = fileName.toLowerCase().endsWith('.glb') || fileName.toLowerCase().endsWith('.gltf');
  if (!isGLTF) {
    throw new Error('Only .glb and .gltf 3D files are supported.');
  }

  // Format file size
  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  const formattedSize = `${sizeMb} MB`;

  // Read as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Save to IndexedDB
  await setModelInDB(arrayBuffer, {
    name: fileName,
    size: formattedSize,
    type: file.type || 'model/gltf-binary',
  });

  // Revoke previous blob URL if any
  if (cachedBlobUrl) {
    try {
      URL.revokeObjectURL(cachedBlobUrl);
    } catch {
      // ignore
    }
  }

  // Create fresh blob URL
  const blob = new Blob([arrayBuffer], { type: 'model/gltf-binary' });
  cachedBlobUrl = URL.createObjectURL(blob);

  // Update store config
  const updated = updateHero3DSettings({
    activeSource: 'upload',
    modelName: fileName,
    modelSize: formattedSize,
    modelUrl: '', // cleared because we're using uploaded file
  });

  return { config: updated, blobUrl: cachedBlobUrl };
}

/**
 * Load the active 3D model URL (either Blob URL from IndexedDB or remote URL)
 */
export async function getActiveModelBlobUrl() {
  const config = getHero3DConfig();

  // If using remote URL
  if (config.activeSource === 'url' && config.modelUrl) {
    return config.modelUrl;
  }

  // If using uploaded file
  if (config.activeSource === 'upload') {
    if (cachedBlobUrl) return cachedBlobUrl;

    const data = await getModelFromDB();
    if (data && data.buffer) {
      const blob = new Blob([data.buffer], { type: data.type || 'model/gltf-binary' });
      cachedBlobUrl = URL.createObjectURL(blob);
      return cachedBlobUrl;
    }
  }

  return null;
}

/**
 * Reset back to default procedural Bioclimatic Villa
 */
export async function resetHeroToDefault() {
  await removeModelFromDB();

  if (cachedBlobUrl) {
    try {
      URL.revokeObjectURL(cachedBlobUrl);
    } catch {
      // ignore
    }
    cachedBlobUrl = null;
  }

  return updateHero3DSettings({
    activeSource: 'default',
    modelName: '',
    modelSize: '',
    modelUrl: '',
    scale: 1.0,
    rotationY: 0,
    posY: 0,
    overrideHeroText: false,
  });
}

/**
 * Subscribe to Hero 3D updates
 */
export function subscribeToHero3D(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e) => {
    callback(e.detail || getHero3DConfig());
  };

  window.addEventListener(UPDATE_EVENT, handler);
  return () => window.removeEventListener(UPDATE_EVENT, handler);
}
