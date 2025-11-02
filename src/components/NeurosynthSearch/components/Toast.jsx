/**
 * Toast Component
 * Displays toast notifications
 */
import React, { useEffect } from 'react';
import { useNeurosynthContext } from '../context/NeurosynthContext';
import '../style.css';

export function Toast() {
  const { toasts, removeToast } = useNeurosynthContext();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
