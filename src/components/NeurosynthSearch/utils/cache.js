/**
 * Cache Management Utility
 */

class CacheManager {
  constructor() {
    this.cache = {
      terms: new Map(),
      related: new Map(),
      studies: new Map(),
    };
    this.timestamps = {
      related: new Map(),
      studies: new Map(),
    };
  }

  /**
   * Check if a cache entry is fresh based on TTL
   * @param {string} type - Cache type ('terms', 'related', 'studies')
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in ms (Infinity for no expiry)
   * @returns {boolean} - Whether cache is fresh
   */
  isFresh(type, key, ttl) {
    if (!this.cache[type].has(key)) return false;

    if (ttl === Infinity) return true;

    const timestamp = this.timestamps[type]?.get(key);
    if (!timestamp) return false;

    return Date.now() - timestamp < ttl;
  }

  /**
   * Get value from cache
   * @param {string} type - Cache type
   * @param {string} key - Cache key
   * @returns {any} - Cached value or undefined
   */
  get(type, key) {
    return this.cache[type]?.get(key);
  }

  /**
   * Set cache entry with timestamp
   * @param {string} type - Cache type
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   */
  set(type, key, value) {
    this.cache[type].set(key, value);
    if (this.timestamps[type]) {
      this.timestamps[type].set(key, Date.now());
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    Object.keys(this.cache).forEach((type) => {
      this.cache[type].clear();
    });
    Object.keys(this.timestamps).forEach((type) => {
      this.timestamps[type].clear();
    });
  }

  /**
   * Clear specific cache type
   * @param {string} type - Cache type to clear
   */
  clearType(type) {
    if (this.cache[type]) this.cache[type].clear();
    if (this.timestamps[type]) this.timestamps[type].clear();
  }
}

export const cacheManager = new CacheManager();
