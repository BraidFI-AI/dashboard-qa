"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createDate, toISOString } from "@/core/utils/date_time_util";

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

export interface UseUrlFiltersOptions<T extends object> {
  /** Default/empty filter values */
  defaults: T;
  /** Map UI field names to API/URL field names */
  fieldMappings?: Record<string, string>;
  /** Fields that should be parsed as dates */
  dateFields?: (keyof T)[];
  /** Fields that should be parsed as arrays (comma-separated in URL) */
  arrayFields?: (keyof T)[];
  /** Fields that should be parsed as booleans (true/false strings in URL) */
  booleanFields?: (keyof T)[];
  /** Debounce delay for URL updates in ms (default: 300) */
  debounceMs?: number;
  /** Callback when filters are reset */
  onReset?: () => void;
}

// Stable JSON comparison for detecting actual searchParams changes
function searchParamsToString(params: URLSearchParams): string {
  const sorted = Array.from(params.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  return JSON.stringify(sorted);
}

export interface UseUrlFiltersReturn<T extends object> {
  /** Current filter state (UI format) */
  filters: T;
  /** Filters converted to API format (with field name mappings applied) */
  apiFilters: Record<string, unknown>;
  /** Update a single filter field */
  setFilter: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Reset all filters to defaults and clear URL */
  resetFilters: () => void;
  /** Apply filters immediately (bypass debounce) */
  applyFilters: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Universal hook for URL-synced filter state.
 *
 * @example
 * const { filters, apiFilters, setFilter, resetFilters } = useUrlFilters({
 *   defaults: { name: '', status: '' },
 *   fieldMappings: { createdStart: 'beginDate' },
 *   dateFields: ['createdStart', 'createdEnd'],
 * });
 */
export function useUrlFilters<T extends object>(
  options: UseUrlFiltersOptions<T>
): UseUrlFiltersReturn<T> {
  const {
    defaults,
    fieldMappings = {},
    dateFields = [],
    arrayFields = [],
    booleanFields = [],
    debounceMs = 300,
    onReset,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isResettingRef = useRef(false);
  const resetTimestampRef = useRef<number>(0);

  // Store options in refs to avoid recreating callbacks
  const defaultsRef = useRef(defaults);
  const dateFieldsRef = useRef(dateFields);
  const arrayFieldsRef = useRef(arrayFields);
  const booleanFieldsRef = useRef(booleanFields);

  // Update refs when options change
  useEffect(() => {
    defaultsRef.current = defaults;
    dateFieldsRef.current = dateFields;
    arrayFieldsRef.current = arrayFields;
    booleanFieldsRef.current = booleanFields;
  });

  // Reverse mapping: API field name → UI field name
  const reverseFieldMappings = useMemo(() => {
    const reverse: Record<string, string> = {};
    for (const [uiKey, apiKey] of Object.entries(fieldMappings)) {
      reverse[apiKey] = uiKey;
    }
    return reverse;
  }, [fieldMappings]);

  // Store reverse mapping in ref too
  const reverseFieldMappingsRef = useRef(reverseFieldMappings);
  useEffect(() => {
    reverseFieldMappingsRef.current = reverseFieldMappings;
  }, [reverseFieldMappings]);

  // ─────────────────────────────────────────────────────────────────────────
  // Parse URL to filter state (uses refs for stability)
  // ─────────────────────────────────────────────────────────────────────────

  const parseUrlToFilters = useCallback(
    (params: URLSearchParams): T => {
      const currentDefaults = defaultsRef.current;
      const currentReverse = reverseFieldMappingsRef.current;
      const currentDateFields = dateFieldsRef.current;
      const currentArrayFields = arrayFieldsRef.current;
      const currentBooleanFields = booleanFieldsRef.current;

      const result = { ...currentDefaults };

      params.forEach((value, urlKey) => {
        // Map API/URL key back to UI key if needed
        const uiKey = (currentReverse[urlKey] || urlKey) as keyof T;

        // Skip if not a known filter field
        if (!(uiKey in currentDefaults)) return;

        // Parse based on field type
        if (currentDateFields.includes(uiKey)) {
          const date = createDate(value);
          if (date) {
            (result as Record<string, unknown>)[uiKey as string] = date;
          }
        } else if (currentArrayFields.includes(uiKey)) {
          (result as Record<string, unknown>)[uiKey as string] =
            value.split(",");
        } else if (currentBooleanFields.includes(uiKey)) {
          // Parse "true"/"false" strings as booleans
          (result as Record<string, unknown>)[uiKey as string] =
            value === "true";
        } else {
          (result as Record<string, unknown>)[uiKey as string] = value;
        }
      });

      return result;
    },
    [] // No dependencies - uses refs
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Convert filters to URL params
  // ─────────────────────────────────────────────────────────────────────────

  const filtersToUrlParams = useCallback(
    (filters: T): string => {
      const params = new URLSearchParams();

      for (const [uiKey, value] of Object.entries(filters)) {
        // Skip empty/default values
        if (value === undefined || value === null || value === "") continue;
        if (Array.isArray(value) && value.length === 0) continue;

        // Map UI key to API/URL key
        const urlKey = fieldMappings[uiKey] || uiKey;

        // Convert value based on type
        if (value instanceof Date) {
          const iso = toISOString(value);
          if (iso) params.set(urlKey, iso);
        } else if (Array.isArray(value)) {
          params.set(urlKey, value.join(","));
        } else if (typeof value === "boolean") {
          if (value) params.set(urlKey, "true");
        } else {
          params.set(urlKey, String(value));
        }
      }

      return params.toString();
    },
    [fieldMappings]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Convert filters to API format (with field mappings)
  // ─────────────────────────────────────────────────────────────────────────

  const filtersToApiFormat = useCallback(
    (filters: T): Record<string, unknown> => {
      const result: Record<string, unknown> = {};

      for (const [uiKey, value] of Object.entries(filters)) {
        // Skip empty values
        if (value === undefined || value === null || value === "") continue;
        if (Array.isArray(value) && value.length === 0) continue;
        // Skip false booleans (only include true booleans)
        if (value === false) continue;

        // Map UI key to API key
        const apiKey = fieldMappings[uiKey] || uiKey;

        // Convert dates to ISO strings for API
        if (value instanceof Date) {
          const iso = toISOString(value);
          if (iso) result[apiKey] = iso;
        } else {
          result[apiKey] = value;
        }
      }

      return result;
    },
    [fieldMappings]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────────────────

  const [filters, setFilters] = useState<T>(() =>
    parseUrlToFilters(searchParams)
  );

  // Track previous searchParams to detect actual changes
  const prevSearchParamsRef = useRef(searchParamsToString(searchParams));

  // Sync from URL when searchParams actually change (not on every render)
  useEffect(() => {
    const currentParamsString = searchParamsToString(searchParams);

    // If we're resetting, check if the URL matches what we expect
    if (isResettingRef.current) {
      // If the URL matches what we set in prevSearchParamsRef, the reset is complete
      if (currentParamsString === prevSearchParamsRef.current) {
        isResettingRef.current = false;
        // State is already set to defaults, so no need to update filters
        return;
      }

      // If URL doesn't match yet, check if searchParams still has old filter values
      // This happens when router.replace hasn't updated useSearchParams yet
      const hasFilterParams = Array.from(searchParams.keys()).some((key) => {
        const currentDefaults = defaultsRef.current;
        return key in currentDefaults;
      });

      if (hasFilterParams) {
        // searchParams still has old filter values but browser URL was updated
        // This means router.replace updated the browser URL but useSearchParams hasn't updated yet
        // Skip syncing - wait for searchParams to actually update
        return;
      }

      // URL doesn't match and no filter params - might be updating, wait for it
      // Skip sync while resetting
      return;
    }

    // Normal sync: URL changed, update filters
    if (currentParamsString !== prevSearchParamsRef.current) {
      // Check if this is restoring filters from URL after a reset
      const hasFilterParams = Array.from(searchParams.keys()).some((key) => {
        const currentDefaults = defaultsRef.current;
        return key in currentDefaults;
      });

      // If URL has filter params that weren't there before, something restored them
      // Don't restore filters from URL if we just reset - this prevents the restoration loop
      // Also check if we're still within the reset window (500ms)
      const resetTimestamp = resetTimestampRef.current;
      const timeSinceReset =
        resetTimestamp > 0 ? Date.now() - resetTimestamp : Infinity;
      const withinResetWindow = timeSinceReset < 500;

      if (
        hasFilterParams &&
        (prevSearchParamsRef.current === "[]" || withinResetWindow)
      ) {
        // URL was restored with filter params after a reset
        // Don't sync filters from URL - keep them at defaults
        console.warn(
          "[useUrlFilters] URL restored with filter params after reset - skipping sync"
        );
        // Update ref to match current state to prevent repeated warnings
        prevSearchParamsRef.current = currentParamsString;
        return;
      }

      prevSearchParamsRef.current = currentParamsString;
      setFilters(parseUrlToFilters(searchParams));
    }
  }, [searchParams, parseUrlToFilters]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // URL Update
  // ─────────────────────────────────────────────────────────────────────────

  const updateUrl = useCallback(
    (newFilters: T) => {
      // Prevent updateUrl from running during or shortly after a reset
      // This prevents debounced setFilter calls from restoring the URL after reset
      // Check isResettingRef FIRST (most reliable indicator)
      // Then check timeSinceReset (catches calls shortly after reset completes)
      const resetTimestamp = resetTimestampRef.current;
      const timeSinceReset =
        resetTimestamp > 0 ? Date.now() - resetTimestamp : Infinity; // If resetTimestampRef is 0, treat as never reset
      const shouldBlock = isResettingRef.current || timeSinceReset < 500;

      // Additional check: if we're within the reset window and the new filters
      // don't match the defaults, block the update (this prevents restoring old filters)
      const currentDefaults = defaultsRef.current;
      const filtersMatchDefaults =
        JSON.stringify(newFilters) === JSON.stringify(currentDefaults);

      // Check if current URL has filter params
      // Use window.location to avoid dependency on searchParams hook
      const currentUrlHasFilters =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).toString().length > 0
          : false;
      const newUrlHasFilters = filtersToUrlParams(newFilters).length > 0;

      // Block non-default filters if we're within the reset window and:
      // 1. Filters don't match defaults, OR
      // 2. Current URL is clean (no filters) but new filters would add filters
      //    (this prevents debounced calls from restoring filters after a reset)
      const withinResetWindow = timeSinceReset < 500 || isResettingRef.current;
      const shouldBlockNonDefault =
        withinResetWindow &&
        !filtersMatchDefaults &&
        (!currentUrlHasFilters || newUrlHasFilters);

      if (shouldBlock || shouldBlockNonDefault) {
        return; // Skip URL update
      }

      const queryString = filtersToUrlParams(newFilters);
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [router, pathname, filtersToUrlParams]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────────────────

  const setFilter = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [field]: value };

        // Debounce URL update
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          updateUrl(newFilters);
        }, debounceMs);

        return newFilters;
      });
    },
    [updateUrl, debounceMs]
  );

  const resetFilters = useCallback(() => {
    // Set flag and timestamp FIRST, before clearing debounce
    // This ensures any pending debounced updateUrl calls will see the reset state
    isResettingRef.current = true;
    const resetTimestamp = Date.now();
    resetTimestampRef.current = resetTimestamp; // Track when reset started

    // Clear pending debounce AFTER setting the reset state
    // This ensures any pending debounced updateUrl calls will be blocked by the guard
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null; // Clear the ref
    }
    // Update state to defaults immediately
    setFilters(defaults);

    // Remove only filter-related params from URL, preserving ALL other params
    const params = new URLSearchParams(searchParams.toString());

    // Build a whitelist of filter keys that we manage (both UI and mapped API/URL names)
    // Use defaultsRef to ensure we have the latest defaults
    const currentDefaults = defaultsRef.current;
    const filterKeysToDelete = new Set<string>();

    // Add all filter keys from defaults (these are the keys we manage)
    // Object.keys() returns all enumerable own properties, even if values are undefined
    const defaultKeys = Object.keys(currentDefaults);
    for (const uiKey of defaultKeys) {
      // Add UI key (this is what appears in URL if no mapping)
      filterKeysToDelete.add(uiKey);

      // Add mapped API/URL key if it exists (this is what actually appears in URL)
      const apiKey = fieldMappings[uiKey];
      if (apiKey && apiKey !== uiKey) {
        filterKeysToDelete.add(apiKey);
      }
    }

    // Also check reverse mappings to catch any API keys that might be in URL
    // but not directly mapped (edge case)
    const reverseMappings = reverseFieldMappingsRef.current;
    for (const [apiKey, uiKey] of Object.entries(reverseMappings)) {
      if (defaultKeys.includes(uiKey)) {
        filterKeysToDelete.add(apiKey);
      }
    }

    // ONLY delete keys that are in our filter whitelist
    // This ensures we don't touch pagination or any other params
    filterKeysToDelete.forEach((key) => {
      if (params.has(key)) {
        params.delete(key);
      }
    });

    // Build new URL with remaining params
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Update the ref to the expected new state BEFORE updating URL
    // This ensures the useEffect knows what to expect
    const expectedParamsString = searchParamsToString(params);
    prevSearchParamsRef.current = expectedParamsString;

    // Force URL update - use absolute URL for window.history.replaceState
    if (typeof window !== "undefined") {
      // Method 1: Update browser history directly (immediate)
      // Use absolute URL to ensure it works correctly
      const absoluteUrl = window.location.origin + newUrl;
      window.history.replaceState({}, "", absoluteUrl);

      // Method 2: Update via Next.js router (updates useSearchParams)
      // Use the relative path for Next.js router
      router.replace(newUrl, { scroll: false });

      // Method 3: Verify and force update if needed (fallback)
      // Check after a brief delay if URL was actually updated
      setTimeout(() => {
        const currentHref = window.location.href;
        const expectedHref = window.location.origin + newUrl;
        if (currentHref !== expectedHref) {
          // URL wasn't updated - force it with a full navigation
          window.location.href = newUrl;
        }
      }, 100);
    } else {
      router.replace(newUrl, { scroll: false });
    }

    onReset?.();
  }, [defaults, router, pathname, searchParams, fieldMappings, onReset]);

  const applyFilters = useCallback(() => {
    // Clear pending debounce and apply immediately
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    updateUrl(filters);
  }, [filters, updateUrl]);

  // ─────────────────────────────────────────────────────────────────────────
  // Memoized API filters
  // ─────────────────────────────────────────────────────────────────────────

  const apiFilters = useMemo(
    () => filtersToApiFormat(filters),
    [filters, filtersToApiFormat]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Return
  // ─────────────────────────────────────────────────────────────────────────

  return useMemo(
    () => ({
      filters,
      apiFilters,
      setFilter,
      resetFilters,
      applyFilters,
    }),
    [filters, apiFilters, setFilter, resetFilters, applyFilters]
  );
}
