"use client";

import React, { useState, useMemo, useEffect } from "react";
import { TextField } from "@mui/material";
import { debounce } from "lodash";
import { useAppDispatch } from "@/redux/store/store";

interface SearchTextFieldProps {
  displayName?: string;
  placeholder?: string;
  value?: string;
  onSearch?: (query: string) => void;
  onApiCall?: (query: string) => void;
  debounceMs?: number;
  disabled?: boolean;
  error?: boolean;
  errorText?: string;
  className?: string;
}

const SearchTextField: React.FC<SearchTextFieldProps> = ({
  displayName,
  placeholder = "Search...",
  value = "",
  onSearch,
  onApiCall,
  debounceMs = 300,
  disabled = false,
  error = false,
  errorText,
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState(value);

  // Debounced API call function
  const debouncedApiCall = useMemo(
    () =>
      debounce((query: string, callback?: (query: string) => void) => {
        if (callback && query.trim().length > 0) {
          callback(query.trim());
        }
      }, debounceMs),
    [debounceMs]
  );

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Call immediate search callback if provided
    if (onSearch) {
      onSearch(newValue);
    }

    // Trigger debounced API call
    debouncedApiCall(newValue, onApiCall);
  };

  // Update internal value when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
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
      className={className}
    />
  );
};

export default SearchTextField;
