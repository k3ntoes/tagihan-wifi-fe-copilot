"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

export function usePagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE);
  const perPage = Number(searchParams.get("per_page") ?? DEFAULT_PER_PAGE);
  const search = searchParams.get("search") ?? "";

  const setQuery = useCallback(
    (nextValues: { page?: number; perPage?: number; search?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      if (nextValues.page !== undefined) {
        params.set("page", String(nextValues.page));
      }

      if (nextValues.perPage !== undefined) {
        params.set("per_page", String(nextValues.perPage));
      }

      if (nextValues.search !== undefined) {
        if (nextValues.search) {
          params.set("search", nextValues.search);
        } else {
          params.delete("search");
        }
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return useMemo(
    () => ({
      page: Number.isFinite(page) && page > 0 ? page : DEFAULT_PAGE,
      perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : DEFAULT_PER_PAGE,
      search,
      setPage: (nextPage: number) => setQuery({ page: nextPage }),
      setPerPage: (nextPerPage: number) => setQuery({ perPage: nextPerPage, page: 1 }),
      setSearch: (nextSearch: string) => setQuery({ search: nextSearch, page: 1 }),
    }),
    [page, perPage, search, setQuery],
  );
}
