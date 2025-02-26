"use client";

import { useState, useEffect, useCallback } from "react";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    ...defaultPagination,
    total: 0,
  });
  const [sorting, setSorting] = useState(defaultSorting);
  const [filters, setFilters] = useState<TFilters>({} as TFilters);

  // Recuperar parámetros de la URL y sincronizarlos con el estado SOLO una vez al montar
  useEffect(() => {
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

    setPagination(prev => ({ ...prev, page, perPage }));
    setSorting({ by: sortBy, type: sortType });
    setFilters(initialFilters);
  }, [searchParams]); // Depende de searchParams para sincronizar al montar o cambiar

  // Extraer la función de fetch a una referencia memoizada
  const doFetch = useCallback(async (abortController?: AbortController) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchData({
        page: pagination.page,
        perPage: pagination.perPage,
        sortBy: sorting.by,
        sortType: sorting.type,
        filters,
        signal: abortController?.signal,
      });

      setData(response.data);
      setPagination(prev => ({ ...prev, total: response.total }));

      // Actualizar URL sin causar un re-render
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("perPage", String(pagination.perPage));
      params.set("sortBy", sorting.by);
      params.set("sortType", sorting.type);

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, String(value));
      });

      if (searchParams.toString() !== params.toString()) {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching list:", err);
        setError("Hubo un problema al cargar los datos.");
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.perPage, sorting.by, sorting.type, filters, pathname, router, searchParams, fetchData]);

  // Efecto principal que usa doFetch
  useEffect(() => {
    const abortController = new AbortController();
    const debounceTimer = setTimeout(() => {
      doFetch(abortController);
    }, 300);

    return () => {
      abortController.abort();
      clearTimeout(debounceTimer);
    };
  }, [doFetch]);

  // Método público para refetch manual
  const refetch = useCallback(() => {
    return doFetch();
  }, [doFetch]);

  const handleSearching = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
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