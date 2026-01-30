"use client";

import {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  startTransition,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  createDate,
  toISOString,
  toBankTimezoneString,
} from "@/core/utils/date_time_util";

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
  /**
   * For date fields: use bank timezone (moment + start/end of day) instead of UTC.
   * Keys are date field names; value 'start' = start of day, 'end' = end of day.
   */
  dateFieldRole?: Partial<Record<keyof T, "start" | "end">>;
  /** Fields that should be parsed as arrays (comma-separated in URL) */
  arrayFields?: (keyof T)[];
  /** Fields that should be parsed as booleans (true/false strings in URL) */
  booleanFields?: (keyof T)[];
  /** Debounce delay for URL updates in ms (default: 300) */
  debounceMs?: number;
  /** Callback when filters are reset */
  onReset?: () => void;
}

export interface UseUrlFiltersReturn<T extends object> {
  /** Current filter state (UI format) - derived from URL */
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
 * URL is the source of truth - all filter state comes from URL params.
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
    dateFieldRole = {} as Partial<Record<keyof T, "start" | "end">>,
    arrayFields = [],
    booleanFields = [],
    debounceMs = 300,
    onReset,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const pendingFiltersRef = useRef<T | null>(null);

  // Reverse mapping: API field name → UI field name
  const reverseFieldMappings = useMemo(() => {
    const reverse: Record<string, string> = {};
    for (const [uiKey, apiKey] of Object.entries(fieldMappings)) {
      reverse[apiKey] = uiKey;
    }
    return reverse;
  }, [fieldMappings]);

  // ─────────────────────────────────────────────────────────────────────────
  // Parse URL to filter state
  // ─────────────────────────────────────────────────────────────────────────

  const parseUrlToFilters = useCallback(
    (params: URLSearchParams): T => {
      const result = { ...defaults };

      params.forEach((value, urlKey) => {
        // Map API/URL key back to UI key if needed
        const uiKey = (reverseFieldMappings[urlKey] || urlKey) as keyof T;

        // Skip if not a known filter field
        if (!(uiKey in defaults)) return;

        // Parse based on field type
        if (dateFields.includes(uiKey)) {
          const date = createDate(value);
          if (date) {
            (result as Record<string, unknown>)[uiKey as string] = date;
          }
        } else if (arrayFields.includes(uiKey)) {
          (result as Record<string, unknown>)[uiKey as string] =
            value.split(",");
        } else if (booleanFields.includes(uiKey)) {
          // Parse "true"/"false" strings as booleans
          (result as Record<string, unknown>)[uiKey as string] =
            value === "true";
        } else {
          (result as Record<string, unknown>)[uiKey as string] = value;
        }
      });

      return result;
    },
    [defaults, reverseFieldMappings, dateFields, arrayFields, booleanFields]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Filters derived from URL (source of truth)
  // ─────────────────────────────────────────────────────────────────────────

  const filters = useMemo(
    () => parseUrlToFilters(searchParams),
    [searchParams, parseUrlToFilters]
  );

  // Working filters ref - tracks current working state including pending changes
  const workingFiltersRef = useRef<T>(filters);

  // Sync working filters when URL-derived filters change
  useEffect(() => {
    workingFiltersRef.current = filters;
  }, [filters]);

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
          const startOfDay = dateFieldRole[uiKey as keyof T] === "start";
          const endOfDay = dateFieldRole[uiKey as keyof T] === "end";
          const str =
            startOfDay || endOfDay
              ? toBankTimezoneString(value, startOfDay)
              : toISOString(value);
          if (str) params.set(urlKey, str);
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
    [fieldMappings, dateFieldRole]
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

        // Convert dates: bank timezone (start/end of day) when dateFieldRole set, else ISO
        if (value instanceof Date) {
          const startOfDay = dateFieldRole[uiKey as keyof T] === "start";
          const endOfDay = dateFieldRole[uiKey as keyof T] === "end";
          const str =
            startOfDay || endOfDay
              ? toBankTimezoneString(value, startOfDay)
              : toISOString(value);
          if (str) result[apiKey] = str;
        } else {
          result[apiKey] = value;
        }
      }

      return result;
    },
    [fieldMappings, dateFieldRole]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // URL Update (debounced)
  // ─────────────────────────────────────────────────────────────────────────

  const updateURL = useCallback(
    (newFilters: T) => {
      // Build URL params from filters, preserving non-filter params
      const params = new URLSearchParams(searchParams.toString());

      // Remove all filter-related params first
      const filterKeys = new Set<string>();
      for (const uiKey of Object.keys(defaults)) {
        filterKeys.add(uiKey);
        const apiKey = fieldMappings[uiKey];
        if (apiKey && apiKey !== uiKey) {
          filterKeys.add(apiKey);
        }
      }
      // Also add reverse mapped keys
      for (const apiKey of Object.keys(reverseFieldMappings)) {
        filterKeys.add(apiKey);
      }

      // Delete all filter keys
      filterKeys.forEach((key) => {
        params.delete(key);
      });

      // Add new filter params
      const filterParamsString = filtersToUrlParams(newFilters);
      const filterParams = new URLSearchParams(filterParamsString);

      // Merge filter params into main params
      filterParams.forEach((value, key) => {
        params.set(key, value);
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [
      router,
      pathname,
      searchParams,
      defaults,
      fieldMappings,
      reverseFieldMappings,
      filtersToUrlParams,
    ]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────────────────

  const setFilter = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      // Create new filters object with updated field from working filters
      const newFilters = { ...workingFiltersRef.current, [field]: value };

      // Update working filters immediately (includes all pending changes)
      workingFiltersRef.current = newFilters;

      // Store in pending for debounced update
      pendingFiltersRef.current = newFilters;

      // Debounce URL update
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        updateURL(newFilters);
        pendingFiltersRef.current = null; // Clear after URL update
      }, debounceMs);
    },
    [updateURL, debounceMs]
  );

  const resetFilters = useCallback(() => {
    // Clear any pending URL updates
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    // Remove only filter-related params from URL, preserving other params (e.g., pagination)
    const params = new URLSearchParams(searchParams.toString());

    // Build a set of filter keys to delete - ONLY keys we manage
    const filterKeysToDelete = new Set<string>();

    // Add all UI keys from defaults (these are the filter keys we manage)
    for (const uiKey of Object.keys(defaults)) {
      filterKeysToDelete.add(uiKey);

      // Add mapped API/URL key if it exists and is different
      const apiKey = fieldMappings[uiKey];
      if (apiKey && apiKey !== uiKey) {
        filterKeysToDelete.add(apiKey);
      }
    }

    // Also add reverse mapped keys that correspond to our defaults
    for (const [apiKey, uiKey] of Object.entries(reverseFieldMappings)) {
      // Only add if the UI key is in our defaults (we manage this filter)
      if (uiKey in defaults) {
        filterKeysToDelete.add(apiKey);
      }
    }

    // Delete only filter keys (double-check they're in our set)
    filterKeysToDelete.forEach((key) => {
      if (params.has(key)) {
        params.delete(key);
      }
    });

    // Build new URL with remaining params (pagination, etc. preserved)
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Clear URL immediately (no debounce for reset)
    router.replace(newUrl, { scroll: false });

    // Note: We don't call onReset here because reset filters should only clear filter params,
    // not trigger other resets (like pagination). If pagination needs to be reset, it should
    // be done explicitly in the component (e.g., in applyFilters).
  }, [
    defaults,
    router,
    pathname,
    searchParams,
    fieldMappings,
    reverseFieldMappings,
  ]);

  const applyFilters = useCallback(() => {
    // Clear pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    // Build URL params from filters, preserving non-filter params
    // Also reset pagination to page 0 when applying filters (in a single URL update)
    const params = new URLSearchParams(searchParams.toString());

    // Remove all filter-related params first
    const filterKeys = new Set<string>();
    for (const uiKey of Object.keys(defaults)) {
      filterKeys.add(uiKey);
      const apiKey = fieldMappings[uiKey];
      if (apiKey && apiKey !== uiKey) {
        filterKeys.add(apiKey);
      }
    }
    // Also add reverse mapped keys
    for (const apiKey of Object.keys(reverseFieldMappings)) {
      if (reverseFieldMappings[apiKey] in defaults) {
        filterKeys.add(apiKey);
      }
    }

    // Delete all filter keys
    filterKeys.forEach((key) => {
      params.delete(key);
    });

    // Reset pagination to page 0 when applying filters
    // This prevents multiple API calls (one for page 0, one for the current page)
    params.delete("page");

    // Add new filter params
    const filterParamsString = filtersToUrlParams(workingFiltersRef.current);
    const filterParams = new URLSearchParams(filterParamsString);

    // Merge filter params into main params
    filterParams.forEach((value, key) => {
      params.set(key, value);
    });

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    // Use startTransition to batch URL update
    // This ensures both usePagination and useUrlFilters sync in the same render cycle
    // preventing multiple API calls
    startTransition(() => {
      router.replace(newUrl, { scroll: false });
    });

    pendingFiltersRef.current = null; // Clear after applying
  }, [
    searchParams,
    defaults,
    fieldMappings,
    reverseFieldMappings,
    filtersToUrlParams,
    router,
    pathname,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // Memoized API filters
  // ─────────────────────────────────────────────────────────────────────────

  const apiFilters = useMemo(
    () => filtersToApiFormat(filters),
    [filters, filtersToApiFormat]
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

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
