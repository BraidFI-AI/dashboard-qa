"use client";

import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import MyControlledAutocomplete from "./MyControlledAutocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import MyText from "../Text/Text";

interface MyControlledAsyncAutocompleteProps {
  name: string;
  displayName?: string;
  control: any;
  errors: any;
  rules: any;
  fetchOptions: any;
}

const MyControlledAsyncAutocomplete: React.FC<
  MyControlledAsyncAutocompleteProps
> = ({ fetchOptions, displayName, name, control, errors, rules }) => {
  const [inputValue, setInputValue] = useState("");

  const [page, setPage] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [paginatedOptions, setPaginatedOptions] = useState<any[]>([]);

  const loadOptions = useCallback(
    async (searchQuery: any, pageNum: any) => {
      if (!fetchOptions) return;

      setLoading(true);
      const data: string | { data: any; totalPages: number } =
        await fetchOptions(searchQuery, pageNum);

      if (typeof data == "string") {
      } else {
        setPaginatedOptions((prevOptions: any) =>
          pageNum === 0 ? data.data : [...prevOptions, ...data.data]
        );

        setPage((prevPage) => prevPage + 1);
        setHasMore(pageNum < data.totalPages - 1);
      }
      setLoading(false);
    },
    [fetchOptions]
  );

  const debouncedLoadOptions = useCallback(
    debounce((query: any, pageNum: any) => loadOptions(query, pageNum), 300),
    [loadOptions]
  );

  const handleInputChange = (event: any, newInputValue: any) => {
    setInputValue(newInputValue);
    setPage(1);
    if (fetchOptions) {
      debouncedLoadOptions(newInputValue, 1);
    }
  };

  const handleScroll = (event: any) => {
    if (!fetchOptions) return;

    const list = event.currentTarget;

    if (
      list.scrollTop + list.clientHeight >= list.scrollHeight - 20 &&
      !loading &&
      hasMore
    ) {
      loadOptions(inputValue, page);
    }
  };

  useEffect(() => {
    if (page == -1) {
      loadOptions("", 0);
    }
  }, []);

  return page == -1 ? (
    <CircularProgress size={"20px"} />
  ) : paginatedOptions.length == 0 ? (
    <MyText size="sm">No options available</MyText>
  ) : (
    <MyControlledAutocomplete
      loading={loading}
      loadingText="Loading more options..."
      onScroll={handleScroll}
      name={name}
      displayName={displayName}
      control={control}
      errors={errors}
      rules={rules}
      value={inputValue}
      options={paginatedOptions}
    />
  );
};

export default MyControlledAsyncAutocomplete;
