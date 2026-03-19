'use client';

import React, { createContext, useContext, useRef, useState, useCallback, ReactNode } from 'react';

type AdminSaveContextType = {
  registerSaveAction: (id: string, saveFn: () => Promise<void> | void) => void;
  unregisterSaveAction: (id: string) => void;
  saveAll: () => Promise<void>;
  isSavingAll: boolean;
};

const AdminSaveContext = createContext<AdminSaveContextType | null>(null);

export function AdminSaveProvider({ children }: { children: ReactNode }) {
  const saveActionsRef = useRef<Record<string, () => Promise<void> | void>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  // We expose these using useCallback to prevent unnecessary re-renders in consumers
  const registerSaveAction = useCallback((id: string, saveFn: () => Promise<void> | void) => {
    saveActionsRef.current[id] = saveFn;
  }, []);

  const unregisterSaveAction = useCallback((id: string) => {
    delete saveActionsRef.current[id];
  }, []);

  const saveAll = useCallback(async () => {
    setIsSavingAll(true);
    try {
      const actions = Object.values(saveActionsRef.current);
      // Wait for all registered section saves to complete concurrently
      await Promise.allSettled(actions.map(fn => fn()));
    } finally {
      setIsSavingAll(false);
    }
  }, []);

  return (
    <AdminSaveContext.Provider value={{ registerSaveAction, unregisterSaveAction, saveAll, isSavingAll }}>
      {children}
    </AdminSaveContext.Provider>
  );
}

export function useAdminSave() {
  const context = useContext(AdminSaveContext);
  if (!context) {
    throw new Error('useAdminSave must be used within an AdminSaveProvider');
  }
  return context;
}
