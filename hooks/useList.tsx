"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface UseListOptions<TFilters> {
  defaultSorting?: { by: string; type: "asc" | "desc" };
  defaultPagination?: { page: number; perPage: number };
  fetchData: (params: {
    page: number;
    perPage: number;
    sortBy: string;
    sortType: "asc" | "desc";
    filters: TFilters;
    signal?: AbortSignal;
  }) => Promise<{ data: any[]; total: number }>;
}

export const useList = <TFilters extends Record<string, any>>({
  defaultSorting = { by: "name", type: "asc" },
  defaultPagination = { page: 1, perPage: 10 },
  fetchData,
}: UseListOptions<TFilters>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Memoize default values to prevent unnecessary recreations
  const defaultValues = useMemo(() => ({
    sorting: defaultSorting,
    pagination: { ...defaultPagination, total: 0 },
    filters: {} as TFilters,
  }), []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState(defaultValues.pagination);
  const [sorting, setSorting] = useState(defaultValues.sorting);
  const [filters, setFilters] = useState(defaultValues.filters);

  const didMount = useRef(false);
  const prevFetchParams = useRef<string | null>(null);
  const initialized = useRef(false);

  // Extraer valores iniciales de la URL
  useEffect(() => {
    if (initialized.current) return;

    const params = new URLSearchParams(searchParams.toString());

    const page = parseInt(params.get("page") || String(defaultPagination.page), 10);
    const perPage = parseInt(params.get("perPage") || String(defaultPagination.perPage), 10);
    const sortBy = params.get("sortBy") || defaultSorting.by;
    const sortType = (params.get("sortType") as "asc" | "desc") || defaultSorting.type;

    const initialFilters = {} as TFilters;
    params.forEach((value, key) => {
      if (!["page", "perPage", "sortBy", "sortType"].includes(key)) {
        initialFilters[key as keyof TFilters] = value as any;
      }
    });

    setPagination({ page, perPage, total: 0 });
    setSorting({ by: sortBy, type: sortType });
    setFilters(initialFilters);

    initialized.current = true;
  }, [searchParams, defaultPagination, defaultSorting]);

  // Memoriza los parámetros de consulta
  const fetchParams = useMemo(() => ({
    page: pagination.page,
    perPage: pagination.perPage,
    sortBy: sorting.by,
    sortType: sorting.type,
    filters,
  }), [pagination.page, pagination.perPage, sorting.by, sorting.type, filters]);

  // Optimized doFetch function
  const doFetch = useCallback(async (abortController?: AbortController) => {
    if (!initialized.current) return;

    const currentParams = JSON.stringify(fetchParams);
    if (prevFetchParams.current === currentParams) return;
    prevFetchParams.current = currentParams;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchData({ ...fetchParams, signal: abortController?.signal });
      
      // Batch state updates
      const newState = {
        data: response.data,
        pagination: { ...pagination, total: response.total }
      };
      
      // Create URL params outside of state updates
      const params = new URLSearchParams({
        page: String(fetchParams.page),
        perPage: String(fetchParams.perPage),
        sortBy: fetchParams.sortBy,
        sortType: fetchParams.sortType,
        ...Object.fromEntries(
          Object.entries(fetchParams.filters)
            .filter(([_, value]) => value)
            .map(([key, value]) => [key, String(value)])
        )
      });

      // Batch updates
      setData(newState.data);
      setPagination(newState.pagination);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Error fetching list:", err);
        setError("Hubo un problema al cargar los datos.");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchParams, pathname, router, fetchData, pagination]);

  // Llamar a `doFetch` solo cuando los valores están listos
  useEffect(() => {
    if (!initialized.current) return;

    const abortController = new AbortController();
    const debounceTimer = setTimeout(() => {
      doFetch(abortController);
    }, 300);

    return () => {
      abortController.abort();
      clearTimeout(debounceTimer);
    };
  }, [doFetch]);

  // Método para hacer fetch manualmente
  const refetch = useCallback(() => {
    return doFetch();
  }, [doFetch]);

  // Optimized handleSearching
  const handleSearching = useCallback((value: string) => {
    setFilters(prev => prev.search === value ? prev : { ...prev, search: value });
    setPagination(prev => prev.page === 1 ? prev : { ...prev, page: 1 });
  }, []);

  return {
    loading,
    error,
    data,
    pagination,
    setPagination,
    sorting,
    setSorting,
    filters,
    setFilters,
    handleSearching,
    refetch,
  };
};
