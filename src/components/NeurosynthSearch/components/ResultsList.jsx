/**
 * ResultsList Component
 * Displays search results
 */
import React, { useState } from 'react';
import '../style.css';

export function ResultsList({ results = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpanded = (studyId) => {
    setExpandedId(expandedId === studyId ? null : studyId);
  };

  if (results.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d' }}>
        No results found. Try a different search.
      </div>
    );
  }

  return (
    <div className="results-list">
      {results.map((result) => {
        const isExpanded = expandedId === result.study_id;

        return (
          <div
            key={result.study_id}
            className={`result-item ${isExpanded ? 'expanded' : ''}`}
            onClick={() => toggleExpanded(result.study_id)}
          >
            <div className="result-title">{result.title}</div>
            <div className="result-meta">
              <div className="result-meta-item">
                <strong>Authors:</strong> {result.authors}
              </div>
              <div className="result-meta-item">
                <strong>Journal:</strong> {result.journal}
              </div>
              <div className="result-meta-item">
                <strong>Year:</strong> {result.year}
              </div>
            </div>
            {isExpanded && (
              <div className="result-details">
                <div className="result-meta-item">
                  <strong>Study ID:</strong> {result.study_id}
                </div>
                <div className="result-meta-item">
                  <strong>Contrast ID:</strong> {result.contrast_id}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
