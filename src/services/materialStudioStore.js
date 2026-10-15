/**
 * Material Studio 3D Storage & Settings Service
 * Handles custom 3D model (.glb/.gltf) storage in browser IndexedDB
 * and material specs/metadata in localStorage with reactive window events.
 */

const STORAGE_KEY = 'auroyali_material_studio_config_v1';
const UPDATE_EVENT = 'auroyali_material_studio_updated';
const DB_NAME = 'Auroyali3D_DB';
const DB_VERSION = 1;
const STORE_NAME = 'models';
const MATERIAL_MODEL_KEY = 'material_custom_model';

export const DEFAULT_MATERIAL_CONFIG = {
  activeSource: 'default', // 'default' | 'upload' | 'url'
  modelName: '',
  modelSize: '',
  modelUrl: '',
  materialTitle: 'Compressed Stabilized Earth Block (CSEB)',
  materialSubtitle: 'High Thermal Mass Natural Masonry · Formulated & pressed in our Kottakarai yard.',
  eyebrow: 'AUROVILLE SPECIFICATION SHEET',
  footerLeft: 'Eco-Certified • Zero Toxic Glues',
  footerRight: 'AuroYali Standard',
  updatedAt: new Date().toISOString(),
};

let cachedMaterialBlobUrl = null;

// ====================================================
// INDEXEDDB HELPER
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
    const req = store.put(item, MATERIAL_MODEL_KEY);

    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function getModelFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(MATERIAL_MODEL_KEY);

      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[materialStudioStore] Could not read from IndexedDB:', err);
    return null;
  }
}

async function removeModelFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(MATERIAL_MODEL_KEY);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[materialStudioStore] Could not delete from IndexedDB:', err);
  }
}

// ====================================================
// PUBLIC STORE METHODS
// ====================================================

export function getMaterialStudioConfig() {
  if (typeof window === 'undefined') return { ...DEFAULT_MATERIAL_CONFIG };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_MATERIAL_CONFIG };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_MATERIAL_CONFIG, ...parsed };
  } catch (err) {
    console.error('Error reading Material Studio config:', err);
    return { ...DEFAULT_MATERIAL_CONFIG };
  }
}

export function updateMaterialStudioSettings(newSettings) {
  try {
    const current = getMaterialStudioConfig();
    const updated = {
      ...current,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.error('Error saving Material Studio config:', err);
    return getMaterialStudioConfig();
  }
}

export async function saveUploadedMaterialModel(file) {
  if (!file) throw new Error('No file provided');

  const fileName = file.name || 'material-sample.glb';
  const isGLTF = fileName.toLowerCase().endsWith('.glb') || fileName.toLowerCase().endsWith('.gltf');
  if (!isGLTF) {
    throw new Error('Only .glb and .gltf 3D files are supported.');
  }

  const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
  const formattedSize = `${sizeMb} MB`;

  const arrayBuffer = await file.arrayBuffer();

  await setModelInDB(arrayBuffer, {
    name: fileName,
    size: formattedSize,
    type: file.type || 'model/gltf-binary',
  });

  if (cachedMaterialBlobUrl) {
    try {
      URL.revokeObjectURL(cachedMaterialBlobUrl);
    } catch {
      // ignore
    }
  }

  const blob = new Blob([arrayBuffer], { type: 'model/gltf-binary' });
  cachedMaterialBlobUrl = URL.createObjectURL(blob);

  const updated = updateMaterialStudioSettings({
    activeSource: 'upload',
    modelName: fileName,
    modelSize: formattedSize,
    modelUrl: '',
  });

  return { config: updated, blobUrl: cachedMaterialBlobUrl };
}

export async function getActiveMaterialBlobUrl() {
  const config = getMaterialStudioConfig();

  if (config.activeSource === 'url' && config.modelUrl) {
    return config.modelUrl;
  }

  if (config.activeSource === 'upload') {
    if (cachedMaterialBlobUrl) return cachedMaterialBlobUrl;

    const data = await getModelFromDB();
    if (data && data.buffer) {
      const blob = new Blob([data.buffer], { type: data.type || 'model/gltf-binary' });
      cachedMaterialBlobUrl = URL.createObjectURL(blob);
      return cachedMaterialBlobUrl;
    }
  }

  return null;
}

export async function resetMaterialStudioToDefault() {
  await removeModelFromDB();

  if (cachedMaterialBlobUrl) {
    try {
      URL.revokeObjectURL(cachedMaterialBlobUrl);
    } catch {
      // ignore
    }
    cachedMaterialBlobUrl = null;
  }

  return updateMaterialStudioSettings({
    activeSource: 'default',
    modelName: '',
    modelSize: '',
    modelUrl: '',
  });
}

export function subscribeToMaterialStudio(callback) {
  if (typeof window === 'undefined') return () => {};

  const handler = (e) => {
    callback(e.detail || getMaterialStudioConfig());
  };

  window.addEventListener(UPDATE_EVENT, handler);
  return () => window.removeEventListener(UPDATE_EVENT, handler);
}
