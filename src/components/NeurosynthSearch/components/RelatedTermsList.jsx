/**
 * RelatedTermsList Component
 * Displays related terms with rankings
 */
import React from 'react';
import '../style.css';

export function RelatedTermsList({
  terms = [],
  coCountRanks = new Map(),
  jaccardRanks = new Map(),
}) {
  if (terms.length === 0) {
    return (
      <div style={{ padding: '12px', color: '#7f8c8d' }}>
        No related terms found
      </div>
    );
  }

  return (
    <ul className="related-list" role="listbox">
      {terms.map((item) => {
        const coCountText = `co_count: ${item.co_count}${
          coCountRanks.has(item.term)
            ? ` (#${coCountRanks.get(item.term)} for co_count)`
            : ''
        }`;

        const jaccardText = `jaccard: ${item.jaccard.toFixed(4)}${
          jaccardRanks.has(item.term)
            ? ` (#${jaccardRanks.get(item.term)} for jaccard)`
            : ''
        }`;

        return (
          <li
            key={item.term}
            className="related-item"
            role="option"
            title={`${coCountText}\n${jaccardText}`}
          >
            <div className="related-item-info">
              <div className="related-item-term">{item.term}</div>
              <div
                className="related-item-scores"
                dangerouslySetInnerHTML={{
                  __html: `${coCountText}<br>${jaccardText}`,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
