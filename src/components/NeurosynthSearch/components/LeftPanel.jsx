/**
 * LeftPanel Component
 * Left side panel for single term search and related terms
 */
import React from 'react';
import { TermInput } from './TermInput';
import { SuggestionsList } from './SuggestionsList';
import { RelatedTermsPanel } from './RelatedTermsPanel';
import { SORT_OPTIONS, TOP_K_OPTIONS } from '../utils';
import '../style.css';

export function LeftPanel({
  input = '',
  onInputChange,
  onInputKeyDown,
  onInputFocus,
  suggestions = [],
  suggestionsVisible = false,
  selectedSuggestionIndex = -1,
  onSuggestionSelect,
  onSuggestionHover,
  relatedTerms = [],
  relatedLoading = false,
  relatedSortBy = SORT_OPTIONS.RELATED.CO_COUNT,
  relatedTopK = 10,
  onRelatedSortChange,
  onRelatedTopKChange,
}) {
  return (
    <aside className="left-panel">
      <h2>Search by Term</h2>

      <TermInput
        value={input}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        onFocus={onInputFocus}
        placeholder="Enter a single term..."
      />

      <SuggestionsList
        suggestions={suggestions}
        visible={suggestionsVisible}
        selectedIndex={selectedSuggestionIndex}
        onSelect={onSuggestionSelect}
        onHover={onSuggestionHover}
        prefix={input}
      />

      {input.length > 0 && (
        <RelatedTermsPanel
          terms={relatedTerms}
          loading={relatedLoading}
          sortBy={relatedSortBy}
          topK={relatedTopK}
          onSortChange={onRelatedSortChange}
          onTopKChange={onRelatedTopKChange}
        />
      )}
    </aside>
  );
}
