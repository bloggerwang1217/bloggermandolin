/**
 * SuggestionsList Component
 * Displays search suggestions
 */
import React, { useEffect } from 'react';
import { highlightPrefix } from '../utils';
import '../style.css';

export function SuggestionsList({
  suggestions = [],
  visible = false,
  selectedIndex = -1,
  onSelect,
  onHover,
  prefix = '',
}) {
  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="suggestions-container">
      <ul className="suggestions-list" role="listbox" aria-label="Suggestions">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className={`suggestion-item ${index === selectedIndex ? 'focused' : ''}`}
            role="option"
            onClick={() => onSelect?.(suggestion)}
            onMouseEnter={() => onHover?.(index)}
          >
            <span
              className="suggestion-text"
              dangerouslySetInnerHTML={{
                __html: highlightPrefix(suggestion, prefix),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
