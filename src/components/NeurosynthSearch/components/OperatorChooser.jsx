/**
 * OperatorChooser Component
 * Displays operator selection UI
 */
import React from 'react';
import { OPERATORS } from '../utils';
import '../style.css';

export function OperatorChooser({
  visible = false,
  selectedIndex = 0,
  operators = OPERATORS,
  onSelect,
  onHover,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div className="operator-chooser-container">
      <ul className="operator-list" role="listbox" aria-label="Operators">
        {operators.map((operator, index) => (
          <li
            key={operator}
            className={`operator-item ${index === selectedIndex ? 'focused' : ''}`}
            role="option"
            onClick={() => onSelect?.(operator, index)}
            onMouseEnter={() => onHover?.(index)}
          >
            {operator}
          </li>
        ))}
      </ul>
    </div>
  );
}
