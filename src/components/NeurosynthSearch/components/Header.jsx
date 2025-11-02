/**
 * Header Component
 */
import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import '../style.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src={useBaseUrl('img/brain_logo.jpg')}
          alt="Neurosynth Logo"
          className="header-logo"
        />
        <div className="header-text">
          <h1>Neurosynth Search</h1>
          <p className="help-text">
            Supported: AND, OR, NOT operators; "exact phrases"; boolean queries
          </p>
        </div>
      </div>
    </header>
  );
}
