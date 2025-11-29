import { STORAGE_PREFIX, STORAGE_SCHEMA_VERSION, getSafeLocalStorage } from './storage';

const MIGRATION_KEY = `${STORAGE_PREFIX}schema-version`;

/**
 * Run all necessary storage migrations.
 *
 * Call this once during app bootstrap.
 */
export function runStorageMigrations(): void {
  const storage = getSafeLocalStorage();
  if (!storage) return;

  const raw = storage.getItem(MIGRATION_KEY);
  const current = raw ? Number(raw) || 0 : 0;

  // Already at or above current schema; nothing to do.
  if (current >= STORAGE_SCHEMA_VERSION) {
    return;
  }

  // Example pattern; add real migrations as you bump versions:
  //
  // let v = current;
  //
  // if (v < 1) {
  //   migrateFrom0To1();
  //   v = 1;
  // }
  //
  // if (v < 2) {
  //   migrateFrom1To2();
  //   v = 2;
  // }

  // After running migrations, persist the new schema version.
  storage.setItem(MIGRATION_KEY, String(STORAGE_SCHEMA_VERSION));
}
