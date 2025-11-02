/**
 * API Functions
 */
import { CONFIG } from './constants';
import { cacheManager } from './cache';

class AbortControllerManager {
  constructor() {
    this.controllers = {
      terms: null,
      related: null,
      studies: null,
    };
  }

  create(type) {
    this.controllers[type] = new AbortController();
    return this.controllers[type];
  }

  abort(type) {
    if (this.controllers[type]) {
      this.controllers[type].abort();
    }
  }

  abortAll() {
    Object.keys(this.controllers).forEach((type) => {
      this.abort(type);
    });
  }
}

const abortManager = new AbortControllerManager();

/**
 * Fetch all available terms
 * @returns {Promise<Array>} Array of terms
 */
export async function fetchTerms() {
  // Check cache first
  if (cacheManager.get('terms', 'all')) {
    return cacheManager.get('terms', 'all');
  }

  try {
    const controller = abortManager.create('terms');
    const response = await fetch(`${CONFIG.API_BASE}/terms`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const terms = data.terms || [];
    cacheManager.set('terms', 'all', terms);
    return terms;
  } catch (error) {
    if (error.name === 'AbortError') return [];
    console.error('Error fetching terms:', error);
    throw error;
  }
}

/**
 * Fetch related terms for a given term
 * @param {string} term - The term to search for
 * @returns {Promise<Array>} Array of related terms
 */
export async function fetchRelatedTerms(term) {
  // Check cache freshness
  const ttl = CONFIG.CACHE_TTL.related;
  if (cacheManager.isFresh('related', term, ttl)) {
    return cacheManager.get('related', term) || [];
  }

  try {
    const controller = abortManager.create('related');
    const response = await fetch(
      `${CONFIG.API_BASE}/terms/${encodeURIComponent(term)}`,
      {
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const related = data.related || [];
    cacheManager.set('related', term, related);
    return related;
  } catch (error) {
    if (error.name === 'AbortError') return [];
    console.error('Error fetching related terms:', error);
    throw error;
  }
}

/**
 * Fetch studies for a given query
 * @param {string} query - The search query
 * @returns {Promise<Object>} Object with results and count
 */
export async function fetchStudies(query) {
  // Check cache freshness
  const ttl = CONFIG.CACHE_TTL.studies;
  if (cacheManager.isFresh('studies', query, ttl)) {
    return cacheManager.get('studies', query) || {};
  }

  try {
    const controller = abortManager.create('studies');
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${CONFIG.API_BASE}/query/${encodedQuery}/studies`,
      {
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    cacheManager.set('studies', query, data);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') return null;
    console.error('Error fetching studies:', error);
    throw error;
  }
}

/**
 * Cancel a specific request
 * @param {string} type - Request type ('terms', 'related', 'studies')
 */
export function cancelRequest(type) {
  abortManager.abort(type);
}

/**
 * Cancel all pending requests
 */
export function cancelAllRequests() {
  abortManager.abortAll();
}

/**
 * Clear cache
 */
export function clearCache() {
  cacheManager.clear();
}
