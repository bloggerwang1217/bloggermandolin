/**
 * RightPanel Component
 * Right side panel for complex query search and results
 */
import React from 'react';
import { ComplexQueryInput } from './ComplexQueryInput';
import { SuggestionsList } from './SuggestionsList';
import { OperatorChooser } from './OperatorChooser';
import { ResultsList } from './ResultsList';
import { LoadingIndicator } from './LoadingIndicator';
import { SORT_OPTIONS, OPERATORS } from '../utils';
import '../style.css';

export function RightPanel({
  input = '',
  onInputChange,
  onInputKeyDown,
  onInputFocus,
  suggestions = [],
  suggestionsVisible = false,
  selectedSuggestionIndex = -1,
  onSuggestionSelect,
  onSuggestionHover,
  operatorChooserVisible = false,
  operatorIndex = 0,
  onOperatorSelect,
  onOperatorHover,
  results = [],
  resultsLoading = false,
  resultsError = null,
  resultsSortBy = SORT_OPTIONS.RESULTS.YEAR,
  currentQuery = '',
  onResultsSortChange,
  onRetry,
}) {
  const displayedResults = results.slice(0, 200);

  return (
    <main className="right-panel">
      <h2>Complex Query</h2>

      <ComplexQueryInput
        value={input}
        onChange={onInputChange}
        onKeyDown={onInputKeyDown}
        onFocus={onInputFocus}
        placeholder="Enter query (e.g., 'amygdala NOT emotion')..."
      />

      <SuggestionsList
        suggestions={suggestions}
        visible={suggestionsVisible}
        selectedIndex={selectedSuggestionIndex}
        onSelect={onSuggestionSelect}
        onHover={onSuggestionHover}
        prefix={input.split(/\s+/).pop() || ''}
      />

      <OperatorChooser
        visible={operatorChooserVisible}
        selectedIndex={operatorIndex}
        operators={OPERATORS}
        onSelect={onOperatorSelect}
        onHover={onOperatorHover}
      />

      {currentQuery && (
        <div className="results-section">
          <div className="results-header">
            <h3>
              Results for "<span id="currentQuery">{currentQuery}</span>" (
              <span id="resultCount">{results.length}</span> found)
            </h3>
            {results.length > 0 && (
              <div className="results-controls">
                <button
                  className={`sort-btn ${
                    resultsSortBy === SORT_OPTIONS.RESULTS.YEAR ? 'active' : ''
                  }`}
                  onClick={() =>
                    onResultsSortChange?.(SORT_OPTIONS.RESULTS.YEAR)
                  }
                >
                  Sort by year
                </button>
                <button
                  className={`sort-btn ${
                    resultsSortBy === SORT_OPTIONS.RESULTS.TITLE ? 'active' : ''
                  }`}
                  onClick={() =>
                    onResultsSortChange?.(SORT_OPTIONS.RESULTS.TITLE)
                  }
                >
                  Sort by title
                </button>
              </div>
            )}
          </div>

          <LoadingIndicator visible={resultsLoading} message="Loading..." />

          {resultsError && (
            <div className="error-message">
              Failed to fetch results.
              <button className="retry-btn" onClick={onRetry}>
                Retry
              </button>
            </div>
          )}

          {!resultsLoading && !resultsError && (
            <ResultsList results={displayedResults} />
          )}
        </div>
      )}
    </main>
  );
}
