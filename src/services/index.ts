import { LocalStorageProvider } from './localStorageProvider';
import { SupabaseProvider } from './supabaseProvider';
import type { StorageProvider } from './storage';

const storageMode = import.meta.env.VITE_STORAGE_MODE || 'local';

export const storage: StorageProvider = storageMode === 'supabase'
    ? new SupabaseProvider()
    : new LocalStorageProvider();
