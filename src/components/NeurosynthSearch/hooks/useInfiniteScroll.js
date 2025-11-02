/**
 * useInfiniteScroll Hook
 * Handles infinite scroll functionality
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { CONFIG } from '../utils';

export function useInfiniteScroll(items = [], batchSize = CONFIG.BATCH_SIZE) {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Initialize with first batch
  useEffect(() => {
    if (items.length > 0) {
      setDisplayedItems(items.slice(0, batchSize));
      setHasMore(items.length > batchSize);
    }
  }, [items, batchSize]);

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore) {
            // Load next batch
            setDisplayedItems((prev) => {
              const nextBatch = items.slice(
                prev.length,
                prev.length + batchSize
              );
              setHasMore(prev.length + nextBatch.length < items.length);
              return [...prev, ...nextBatch];
            });
          }
        });
      },
      {
        root: null,
        rootMargin: `${CONFIG.INFINITE_SCROLL_THRESHOLD}px`,
        threshold: 0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [items, hasMore, batchSize]);

  return {
    displayedItems,
    hasMore,
    sentinelRef,
  };
}
