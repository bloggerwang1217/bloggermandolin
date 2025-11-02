/**
 * Neurosynth Search Configuration Constants
 */

export const CONFIG = {
  API_BASE: 'https://mil.psy.ntu.edu.tw:5000',
  DEBOUNCE_MS: 250,
  MIN_LENGTH: 2,
  INFINITE_SCROLL_THRESHOLD: 200,
  BATCH_SIZE: 200,
  CACHE_TTL: {
    terms: Infinity,
    related: 5 * 60 * 1000, // 5 minutes
    studies: 1 * 60 * 1000, // 1 minute
  },
};

export const OPERATORS = ['AND', 'OR', 'NOT'];

export const SORT_OPTIONS = {
  RELATED: {
    CO_COUNT: 'co_count',
    JACCARD: 'jaccard',
  },
  RESULTS: {
    YEAR: 'year',
    TITLE: 'title',
  },
};

export const TOP_K_OPTIONS = [10, 20, 50];

export const TOAST_DURATION = {
  DEFAULT: 2000,
  SUCCESS: 1500,
  ERROR: 3000,
};

export const TOAST_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
};
