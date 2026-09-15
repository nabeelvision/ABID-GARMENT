import {
  Product,
  BackgroundVideoSettings,
  IntroVideoSettings,
  StoreSettings,
  SocialLinks,
  OptimizationSettings,
} from '../types';

export interface FullStoreData {
  products: Product[];
  backgroundSettings: BackgroundVideoSettings;
  introSettings: IntroVideoSettings;
  storeSettings: StoreSettings;
  socialLinks: SocialLinks;
  optimizationSettings: OptimizationSettings;
  lastUpdated?: string;
}

// Safe LocalStorage helpers (prevents QuotaExceededError crashes)
export const safeLocalSave = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`LocalStorage write failed for ${key} (storage quota or iframe restriction):`, err);
  }
};

export const safeLocalLoad = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    // If fallback is an object, merge with fallback to ensure no missing keys
    if (typeof fallback === 'object' && fallback !== null && !Array.isArray(fallback)) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch (err) {
    console.warn(`LocalStorage read failed for ${key}:`, err);
    return fallback;
  }
};

// Fetch latest data from Server File API
export async function fetchStoreDataFromServer(): Promise<Partial<FullStoreData> | null> {
  try {
    const res = await fetch('/api/store-data', {
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && !data.default) {
      return data as FullStoreData;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch store data from server, relying on local storage:', err);
    return null;
  }
}

// Save all or partial store data to Server File API
export async function saveStoreDataToServer(
  data: Partial<FullStoreData>
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/store-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const result = await res.json();
    return {
      success: true,
      message: result.message || 'Saved to server file successfully!',
    };
  } catch (err: any) {
    console.error('Failed to save to server file:', err);
    return {
      success: false,
      message: err.message || 'Failed to save to server file',
    };
  }
}

// Helper to trigger browser download of the full store data file
export function exportStoreDataJson(data: FullStoreData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `abid-garments-store-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
