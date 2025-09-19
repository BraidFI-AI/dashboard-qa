"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  TextField,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { debounce } from "lodash";
import { useAppDispatch } from "@/redux/store/store";

interface SearchResult {
  id: string | number;
  name: string;
  [key: string]: any; // Allow additional properties
}

interface PaginatedSearchFieldProps {
  displayName?: string;
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  onApiCall?: (
    query: string,
    pageNumber: number
  ) => Promise<{ data: SearchResult[]; totalPages: number; hasMore: boolean }>;
  onResultSelect?: (result: SearchResult) => void;
  debounceMs?: number;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  className?: string;
  maxResults?: number;
  resultDisplayKey?: string; // Which property to display as the result text
  showResults?: boolean; // Whether to show results dropdown
}

const PaginatedSearchField: React.FC<PaginatedSearchFieldProps> = ({
  displayName,
  placeholder = "Search...",
  value = "",
  onSearch,
  onApiCall,
  onResultSelect,
  debounceMs = 300,
  disabled = false,
  error = false,
  errorText,
  className = "",
  maxResults = 10,
  resultDisplayKey = "name",
  showResults = true,
}) => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState(value);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // Debounced API call function
  const debouncedApiCall = useMemo(
    () =>
      debounce(async (query: string, pageNum: number) => {
        if (onApiCall && query.trim().length > 0) {
          setLoading(true);
          try {
            const response = await onApiCall(query.trim(), pageNum);

            if (pageNum === 0) {
              // First page - replace results
              setResults(response.data);
            } else {
              // Subsequent pages - append results
              setResults((prev) => [...prev, ...response.data]);
            }

            setTotalPages(response.totalPages);
            setHasMore(response.hasMore);
            setPage(pageNum);
          } catch (error) {
            console.error("Search failed:", error);
            setResults([]);
          } finally {
            setLoading(false);
          }
        }
      }, debounceMs),
    [onApiCall, debounceMs]
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    setShowDropdown(true);

    // Reset pagination for new search
    setPage(0);
    setResults([]);

    // Call immediate search callback if provided
    if (onSearch) {
      onSearch(newValue);
    }

    // Trigger debounced API call
    if (newValue.trim().length > 0) {
      debouncedApiCall(newValue, 0);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    setInputValue(result[resultDisplayKey] || result.name);
    setShowDropdown(false);
    if (onResultSelect) {
      onResultSelect(result);
    }
  };

  // Handle scroll for pagination
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    if (
      element.scrollTop + element.clientHeight >= element.scrollHeight - 20 &&
      !loading &&
      hasMore &&
      inputValue.trim().length > 0
    ) {
      debouncedApiCall(inputValue, page + 1);
    }
  };

  // Update internal value when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <Box className={`relative ${className}`}>
      <TextField
        size="small"
        inputProps={{
          className: "font-avenir-regular text-[15px] h-[25px]",
        }}
        sx={{
          "& fieldset": {
            borderRadius: "5px",
            borderColor: "#E8E8E8",
            borderWidth: "1px",
          },
        }}
        onChange={handleInputChange}
        value={inputValue}
        placeholder={placeholder}
        fullWidth
        disabled={disabled}
        error={error}
        helperText={error ? errorText : undefined}
      />

      {/* Results Dropdown */}
      {showResults && showDropdown && (
        <Box
          className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {loading && results.length === 0 ? (
            <Box className="p-4 text-center">
              <CircularProgress size={20} />
              <Typography variant="body2" className="ml-2">
                Searching...
              </Typography>
            </Box>
          ) : results.length > 0 ? (
            <List className="p-0">
              {results.map((result, index) => (
                <React.Fragment key={result.id || index}>
                  <ListItem
                    onClick={() => handleResultSelect(result)}
                    className="hover:bg-gray-50 cursor-pointer"
                    sx={{ cursor: "pointer" }}
                  >
                    <ListItemText
                      primary={result[resultDisplayKey] || result.name}
                      secondary={result.description || result.email || ""}
                    />
                  </ListItem>
                  {index < results.length - 1 && <Divider />}
                </React.Fragment>
              ))}

              {/* Load more indicator */}
              {loading && results.length > 0 && (
                <Box className="p-2 text-center">
                  <CircularProgress size={16} />
                  <Typography variant="caption" className="ml-2">
                    Loading more...
                  </Typography>
                </Box>
              )}

              {/* No more results */}
              {!hasMore && results.length > 0 && (
                <Box className="p-2 text-center text-gray-500">
                  <Typography variant="caption">No more results</Typography>
                </Box>
              )}
            </List>
          ) : inputValue.trim().length > 0 ? (
            <Box className="p-4 text-center text-gray-500">
              <Typography variant="body2">No results found</Typography>
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default PaginatedSearchField;
