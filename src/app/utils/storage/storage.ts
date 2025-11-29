/**
 * Global storage prefix for all WWM-related keys.
 * Every key we own should start with this.
 */
export const STORAGE_PREFIX = 'wwm-';

/**
 * Global schema version for versioned payloads.
 * Increment this when you introduce breaking changes
 * that require a coordinated migration.
 */
export const STORAGE_SCHEMA_VERSION = 1;

export interface Versioned<T> {
  version: number;
  data: T;
}

/**
 * Safe wrapper around window.localStorage.
 *
 * Returns null when:
 * - running in a non-browser environment (no window),
 * - localStorage is not available or throws (e.g. privacy settings).
 */
export function getSafeLocalStorage(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Load a JSON value from localStorage.
 *
 * - Returns null if storage is unavailable, the key is missing,
 *   or the JSON is malformed.
 */
export function loadJsonFromStorage<T>(key: string): T | null {
  const storage = getSafeLocalStorage();
  if (!storage) return null;

  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Save a JSON value to localStorage.
 *
 * - Silently no-ops if storage is unavailable or throws.
 */
export function saveJsonToStorage(key: string, value: unknown): void {
  const storage = getSafeLocalStorage();
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / security errors
  }
}

/**
 * Load a versioned payload from localStorage.
 *
 * Returns:
 * - Versioned<T> if present and parseable.
 * - null otherwise.
 */
export function loadVersioned<T>(key: string): Versioned<T> | null {
  return loadJsonFromStorage<Versioned<T>>(key);
}

/**
 * Save a versioned payload to localStorage.
 *
 * Wraps your data with { version, data }.
 */
export function saveVersioned<T>(key: string, data: T): void {
  const payload: Versioned<T> = {
    version: STORAGE_SCHEMA_VERSION,
    data,
  };
  saveJsonToStorage(key, payload);
}
