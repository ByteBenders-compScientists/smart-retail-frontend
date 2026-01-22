'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);
  const initialValueRef = useRef(initialValue);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? (JSON.parse(item) as T) : initialValueRef.current);
      } catch {
        setStoredValue(initialValueRef.current);
      }
      setIsHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const toStore = value instanceof Function ? value(prev) : value;
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(toStore));
          }
        } catch {
          // ignore
        }
        return toStore;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValueRef.current);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  }, [key]);

  return [storedValue, setValue, removeValue, isHydrated] as const;
}
