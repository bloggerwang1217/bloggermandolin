/**
 * ComplexQueryInput Component
 * Input field for complex query search (right panel)
 */
import React, { useRef } from 'react';
import '../style.css';

export function ComplexQueryInput({
  value = '',
  onChange,
  onKeyDown,
  onFocus,
  placeholder = 'Enter query (e.g., "amygdala NOT emotion")...',
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
          aria-label="Complex query search"
          aria-autocomplete="list"
          aria-controls="mainSuggestions"
        />
      </div>
    </div>
  );
}
