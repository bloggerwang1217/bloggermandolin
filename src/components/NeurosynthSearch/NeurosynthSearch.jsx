import React, { useEffect, useRef } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './style.css';

export default function NeurosynthSearch() {
  const rootRef = useRef(null);

  useEffect(() => {
    // Dynamically import the client-only module to avoid accessing
    // `document` during server-side rendering. This prevents the
    // Docusaurus static build error: "document is not defined".
    let mod = null;
    let cancelled = false;

    if (typeof window !== 'undefined') {
      import('./index')
        .then((m) => {
          if (cancelled) return;
          mod = m;
          if (m && typeof m.mountNeurosynth === 'function') {
            m.mountNeurosynth();
          }
        })
        .catch((err) => {
          // Fail gracefully; show console message for debugging
          // during client runtime.
          // eslint-disable-next-line no-console
          console.error('Failed to load Neurosynth client module', err);
        });
    }

    return () => {
      cancelled = true;
      if (mod && typeof mod.unmountNeurosynth === 'function') {
        try {
          mod.unmountNeurosynth();
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  return (
    <div className="neurosynth-root">
      <div className="container" ref={rootRef}>
      <header className="header">
          <div className="header-content">
          <img src={useBaseUrl('img/brain_logo.jpg')} alt="Neurosynth Logo" className="header-logo" />
          <div className="header-text">
            <h1>Neurosynth Search</h1>
            <p className="help-text">Supported: AND, OR, NOT operators; "exact phrases"; boolean queries</p>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className="left-panel">
          <h2>Search by Term</h2>
          <div className="input-group">
            <div className="input-wrapper">
              <input id="leftInput" type="text" placeholder="Enter a single term..." className="input-field" aria-label="Single term search" aria-autocomplete="list" aria-controls="leftSuggestions" />
              <div id="leftSuggestionsContainer" className="suggestions-container" style={{display: 'none'}}>
                <ul id="leftSuggestions" className="suggestions-list" role="listbox" aria-label="Term suggestions"></ul>
              </div>
            </div>
            <button id="leftSubmitBtn" className="submit-btn">Search</button>
          </div>

          <div id="relatedPanel" className="related-panel" style={{display: 'none'}}>
            <h3>Related Terms</h3>
            <div id="relatedLoading" className="loading-indicator" style={{display: 'none'}}>Loading...</div>
            <div id="relatedControls" className="related-controls" style={{display: 'none'}}>
              <div className="sort-buttons">
                <button id="sortByCoCountBtn" className="sort-btn active">Sort by co_count</button>
                <button id="sortByJaccardBtn" className="sort-btn">Sort by jaccard</button>
              </div>
              <div className="topk-buttons">
                <span>Display:</span>
                <button id="topk10Btn" className="topk-btn active">Top 10</button>
                <button id="topk20Btn" className="topk-btn">Top 20</button>
                <button id="topk50Btn" className="topk-btn">Top 50</button>
              </div>
            </div>
            <div id="relatedListContainer" className="related-list-container" style={{display: 'none'}}>
              <ul id="relatedList" className="related-list" role="listbox"></ul>
            </div>
          </div>
        </aside>

        <main className="right-panel">
          <h2>Complex Query</h2>
          <div className="input-group">
            <div className="input-wrapper">
              <input id="mainInput" type="text" placeholder="Enter query (e.g., 'amygdala NOT emotion')..." className="input-field" aria-label="Complex query search" aria-autocomplete="list" aria-controls="mainSuggestions" />
              <div id="mainSuggestionsContainer" className="suggestions-container" style={{display: 'none'}}>
                <ul id="mainSuggestions" className="suggestions-list" role="listbox" aria-label="Query suggestions"></ul>
              </div>
              <div id="operatorChooserContainer" className="operator-chooser-container" style={{display: 'none'}}>
                <ul id="operatorChooser" className="operator-list" role="listbox"></ul>
              </div>
            </div>
            <button id="mainSubmitBtn" className="submit-btn">Search</button>
          </div>

          <div id="resultsSection" className="results-section" style={{display: 'none'}}>
            <div className="results-header">
              <h3>Results (<span id="resultCount">0</span> found)</h3>
              <div id="resultsControls" className="results-controls" style={{display: 'none'}}>
                <button id="sortByYearBtn" className="sort-btn active">Sort by year</button>
                <button id="sortByTitleBtn" className="sort-btn">Sort by title</button>
              </div>
            </div>
            <div id="resultsList" className="results-list"></div>
            <div id="resultsError" className="error-message" style={{display: 'none'}}></div>
            <div id="resultsLoading" className="loading-indicator" style={{display: 'none'}}>Loading...</div>
          </div>
        </main>
      </div>

      <div id="toastContainer" className="toast-container"></div>
      </div>
    </div>
  );
}
