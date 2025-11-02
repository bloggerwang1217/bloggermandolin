/**
 * TermInput Component
 * Input field for single term search (left panel)
 */
import React, { useRef, useEffect } from 'react';
import '../style.css';

export function TermInput({
  value = '',
  onChange,
  onKeyDown,
  onFocus,
  placeholder = 'Enter a single term...',
}) {
  const inputRef = useRef(null);

  return (
    <div className="input-group">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          placeholder={placeholder}
          className="input-field"
          aria-label="Single term search"
          aria-autocomplete="list"
          aria-controls="leftSuggestions"
        />
      </div>
    </div>
  );
}
