/**
 * useNeurosynthState Hook
 * Manages global state for the Neurosynth search component
 */
import { useState, useCallback } from 'react';
import { SORT_OPTIONS, TOP_K_OPTIONS, OPERATORS } from '../utils';

const INITIAL_STATE = {
  // Main (complex query) input
  mainInput: '',
  mainSuggestionIndex: -1,
  mainSuggestionsVisible: false,

  // Left (single term) input
  leftInput: '',
  leftSuggestionIndex: -1,
  leftSuggestionsVisible: false,

  // Operator chooser
  operatorChooserActive: false,
  operatorIndex: 0,

  // Related terms panel
  relatedSortBy: SORT_OPTIONS.RELATED.CO_COUNT,
  relatedTopK: 10,

  // Results panel
  resultsSortBy: SORT_OPTIONS.RESULTS.YEAR,
  currentQuery: '',
};

export function useNeurosynthState() {
  const [state, setState] = useState(INITIAL_STATE);

  // Main input handlers
  const setMainInput = useCallback((value) => {
    setState((prev) => ({
      ...prev,
      mainInput: value,
      mainSuggestionIndex: -1, // Reset suggestion index on input change
    }));
  }, []);

  const setMainSuggestionIndex = useCallback((index) => {
    setState((prev) => ({
      ...prev,
      mainSuggestionIndex: index,
    }));
  }, []);

  const setMainSuggestionsVisible = useCallback((visible) => {
    setState((prev) => ({
      ...prev,
      mainSuggestionsVisible: visible,
      mainSuggestionIndex: visible ? 0 : -1,
    }));
  }, []);

  // Left input handlers
  const setLeftInput = useCallback((value) => {
    setState((prev) => ({
      ...prev,
      leftInput: value,
      leftSuggestionIndex: -1,
    }));
  }, []);

  const setLeftSuggestionIndex = useCallback((index) => {
    setState((prev) => ({
      ...prev,
      leftSuggestionIndex: index,
    }));
  }, []);

  const setLeftSuggestionsVisible = useCallback((visible) => {
    setState((prev) => ({
      ...prev,
      leftSuggestionsVisible: visible,
      leftSuggestionIndex: visible ? 0 : -1,
    }));
  }, []);

  // Operator chooser handlers
  const setOperatorChooserActive = useCallback((active) => {
    setState((prev) => ({
      ...prev,
      operatorChooserActive: active,
      operatorIndex: active ? 0 : 0,
    }));
  }, []);

  const setOperatorIndex = useCallback((index) => {
    setState((prev) => ({
      ...prev,
      operatorIndex: Math.max(0, Math.min(index, OPERATORS.length - 1)),
    }));
  }, []);

  // Related terms handlers
  const setRelatedSortBy = useCallback((sortBy) => {
    setState((prev) => ({
      ...prev,
      relatedSortBy: sortBy,
    }));
  }, []);

  const setRelatedTopK = useCallback((topK) => {
    setState((prev) => ({
      ...prev,
      relatedTopK: TOP_K_OPTIONS.includes(topK) ? topK : 10,
    }));
  }, []);

  // Results handlers
  const setResultsSortBy = useCallback((sortBy) => {
    setState((prev) => ({
      ...prev,
      resultsSortBy: sortBy,
    }));
  }, []);

  const setCurrentQuery = useCallback((query) => {
    setState((prev) => ({
      ...prev,
      currentQuery: query,
    }));
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    // State
    ...state,

    // Main input
    setMainInput,
    setMainSuggestionIndex,
    setMainSuggestionsVisible,

    // Left input
    setLeftInput,
    setLeftSuggestionIndex,
    setLeftSuggestionsVisible,

    // Operator chooser
    setOperatorChooserActive,
    setOperatorIndex,

    // Related terms
    setRelatedSortBy,
    setRelatedTopK,

    // Results
    setResultsSortBy,
    setCurrentQuery,

    // Utilities
    reset,
  };
}
