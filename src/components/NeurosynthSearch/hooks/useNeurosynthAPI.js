/**
 * useNeurosynthAPI Hook
 * Manages all API calls and related state
 */
import { useState, useCallback } from 'react';
import { fetchTerms, fetchRelatedTerms, fetchStudies, cancelAllRequests } from '../utils';

const INITIAL_STATE = {
  terms: [],
  relatedTerms: [],
  studies: null,
  loading: {
    terms: false,
    relatedTerms: false,
    studies: false,
  },
  error: {
    terms: null,
    relatedTerms: null,
    studies: null,
  },
};

export function useNeurosynthAPI() {
  const [state, setState] = useState(INITIAL_STATE);

  const handleTermsLoading = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, terms: true },
      error: { ...prev.error, terms: null },
    }));

    try {
      const terms = await fetchTerms();
      setState((prev) => ({
        ...prev,
        terms,
        loading: { ...prev.loading, terms: false },
      }));
      return terms;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, terms: false },
        error: { ...prev.error, terms: error.message },
      }));
      throw error;
    }
  }, []);

  const handleRelatedTermsLoading = useCallback(async (term) => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, relatedTerms: true },
      error: { ...prev.error, relatedTerms: null },
    }));

    try {
      const relatedTerms = await fetchRelatedTerms(term);
      setState((prev) => ({
        ...prev,
        relatedTerms,
        loading: { ...prev.loading, relatedTerms: false },
      }));
      return relatedTerms;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, relatedTerms: false },
        error: { ...prev.error, relatedTerms: error.message },
      }));
      throw error;
    }
  }, []);

  const handleStudiesLoading = useCallback(async (query) => {
    setState((prev) => ({
      ...prev,
      loading: { ...prev.loading, studies: true },
      error: { ...prev.error, studies: null },
    }));

    try {
      const studies = await fetchStudies(query);
      setState((prev) => ({
        ...prev,
        studies,
        loading: { ...prev.loading, studies: false },
      }));
      return studies;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: { ...prev.loading, studies: false },
        error: { ...prev.error, studies: error.message },
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    fetchTerms: handleTermsLoading,
    fetchRelatedTerms: handleRelatedTermsLoading,
    fetchStudies: handleStudiesLoading,
    cancelAll: cancelAllRequests,
  };
}
