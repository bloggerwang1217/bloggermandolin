/**
 * LoadingIndicator Component
 * Shows loading state
 */
import React from 'react';
import '../style.css';

export function LoadingIndicator({ visible = false, message = 'Loading...' }) {
  if (!visible) return null;

  return (
    <div className="loading-indicator">
      {message}
    </div>
  );
}
