"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    debounceMs = 300,
    onReset,
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Store options in refs to avoid recreating callbacks
  const defaultsRef = useRef(defaults);
  const dateFieldsRef = useRef(dateFields);
  const arrayFieldsRef = useRef(arrayFields);

  // Update refs when options change
  useEffect(() => {
    defaultsRef.current = defaults;
    dateFieldsRef.current = dateFields;
    arrayFieldsRef.current = arrayFields;
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
          (result as Record<string, unknown>)[uiKey as string] = value.split(",");
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

  const [filters, setFilters] = useState<T>(() => parseUrlToFilters(searchParams));

  // Track previous searchParams to detect actual changes
  const prevSearchParamsRef = useRef(searchParamsToString(searchParams));

  // Sync from URL when searchParams actually change (not on every render)
  useEffect(() => {
    const currentParamsString = searchParamsToString(searchParams);
    if (currentParamsString !== prevSearchParamsRef.current) {
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
      const queryString = filtersToUrlParams(newFilters);
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router, filtersToUrlParams]
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
    // Clear pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setFilters(defaults);
    router.replace(window.location.pathname, { scroll: false });
    onReset?.();
  }, [defaults, router, onReset]);

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

