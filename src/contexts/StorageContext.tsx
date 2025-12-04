import { createContext, useContext, useState, type ReactNode } from 'react';

export type StorageMode = 'local' | 'supabase';

interface StorageContextType {
  storageMode: StorageMode;
  setStorageMode: (mode: StorageMode) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

const STORAGE_MODE_KEY = 'cashflow_storage_mode';

export function StorageProvider({ children }: { children: ReactNode }) {
  const [storageMode, setStorageModeState] = useState<StorageMode>(() => {
    const stored = localStorage.getItem(STORAGE_MODE_KEY);
    return (stored === 'supabase' ? 'supabase' : 'local') as StorageMode;
  });

  const setStorageMode = (mode: StorageMode) => {
    localStorage.setItem(STORAGE_MODE_KEY, mode);
    setStorageModeState(mode);
  };

  return (
    <StorageContext.Provider value={{ storageMode, setStorageMode }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return context;
}
