import { useMemo, useState } from "react";
import { useBillingMatrix } from "@/services/billing-service";
import type { BillingMatrixSummary } from "@/types/billing";

export function usePublicBillingMatrix() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading, isError, error, refetch } = useBillingMatrix({
    year,
    page,
    perPage,
    customerName: search,
  });

  const summary = useMemo<BillingMatrixSummary>(() => {
    const rows = data?.data ?? [];
    const totalCollected = rows.reduce((sum, row) => sum + row.totalPaid, 0);
    const totalExpected = rows.reduce((sum, row) => sum + row.totalExpected, 0);
    return {
      totalCustomers: data?.meta.total ?? 0,
      totalCollected,
      totalExpected,
      collectionRate:
        totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0,
    };
  }, [data]);

  const handleYearChange = (delta: number) => {
    setYear((v) => v + delta);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    // State
    year,
    search,
    page,
    perPage,

    // Data
    data,
    summary,
    monthNames:
      data?.monthNames ?? Array.from({ length: 12 }, (_, i) => String(i + 1)),
    rows: data?.data ?? [],

    // Loading & Error
    isLoading,
    isError,
    error,
    refetch,

    // Actions
    handleYearChange,
    handleSearchChange,
    handlePageChange,
  };
}
