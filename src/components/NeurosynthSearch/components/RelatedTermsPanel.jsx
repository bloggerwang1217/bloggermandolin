/**
 * RelatedTermsPanel Component
 * Displays related terms with sorting and filtering options
 */
import React from 'react';
import { RelatedTermsList } from './RelatedTermsList';
import { LoadingIndicator } from './LoadingIndicator';
import { SORT_OPTIONS, TOP_K_OPTIONS, calculateRankings } from '../utils';
import '../style.css';

export function RelatedTermsPanel({
  terms = [],
  loading = false,
  sortBy = SORT_OPTIONS.RELATED.CO_COUNT,
  topK = 10,
  onSortChange,
  onTopKChange,
}) {
  // Calculate rankings for all terms
  const coCountRanks = calculateRankings(terms, SORT_OPTIONS.RELATED.CO_COUNT);
  const jaccardRanks = calculateRankings(terms, SORT_OPTIONS.RELATED.JACCARD);

  // Sort and slice
  const sorted = [...terms]
    .sort((a, b) =>
      sortBy === SORT_OPTIONS.RELATED.CO_COUNT
        ? b.co_count - a.co_count
        : b.jaccard - a.jaccard
    )
    .slice(0, topK);

  return (
    <div className="related-panel">
      <h3>Related Terms</h3>

      <LoadingIndicator visible={loading} message="Loading..." />

      {!loading && terms.length > 0 && (
        <>
          <div className="related-controls">
            <div className="sort-buttons">
              <button
                className={`sort-btn ${
                  sortBy === SORT_OPTIONS.RELATED.CO_COUNT ? 'active' : ''
                }`}
                onClick={() =>
                  onSortChange?.(SORT_OPTIONS.RELATED.CO_COUNT)
                }
              >
                Sort by co_count
              </button>
              <button
                className={`sort-btn ${
                  sortBy === SORT_OPTIONS.RELATED.JACCARD ? 'active' : ''
                }`}
                onClick={() =>
                  onSortChange?.(SORT_OPTIONS.RELATED.JACCARD)
                }
              >
                Sort by jaccard
              </button>
            </div>
            <div className="topk-buttons">
              <span>Display:</span>
              {TOP_K_OPTIONS.map((k) => (
                <button
                  key={k}
                  className={`topk-btn ${topK === k ? 'active' : ''}`}
                  onClick={() => onTopKChange?.(k)}
                >
                  Top {k}
                </button>
              ))}
            </div>
          </div>

          <div className="related-list-container">
            <RelatedTermsList
              terms={sorted}
              coCountRanks={coCountRanks}
              jaccardRanks={jaccardRanks}
            />
          </div>
        </>
      )}
    </div>
  );
}
