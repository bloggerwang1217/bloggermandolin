/**
 * NeurosynthContext
 * Provides state and methods to all child components
 */
import React, { createContext, useCallback, useState } from 'react';
import { TOAST_TYPES, TOAST_DURATION } from '../utils';

export const NeurosynthContext = createContext(null);

export function NeurosynthProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = TOAST_TYPES.INFO, duration = TOAST_DURATION.DEFAULT) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    toasts,
    showToast,
    removeToast,
  };

  return (
    <NeurosynthContext.Provider value={value}>
      {children}
    </NeurosynthContext.Provider>
  );
}

/**
 * Hook to use Neurosynth context
 */
export function useNeurosynthContext() {
  const context = React.useContext(NeurosynthContext);
  if (!context) {
    throw new Error(
      'useNeurosynthContext must be used within NeurosynthProvider'
    );
  }
  return context;
}
