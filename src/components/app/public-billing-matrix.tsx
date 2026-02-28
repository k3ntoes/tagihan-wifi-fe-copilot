"use client";

import { usePublicBillingMatrix } from "@/hooks/use-public-billing-matrix";
import { BillingMatrixError } from "./billing-matrix/billing-matrix-error";
import { BillingMatrixFilters } from "./billing-matrix/billing-matrix-filters";
import { BillingMatrixLegend } from "./billing-matrix/billing-matrix-legend";
import { BillingMatrixSummaryCards } from "./billing-matrix/billing-matrix-summary-cards";
import { BillingMatrixTable } from "./billing-matrix/billing-matrix-table";

export function PublicBillingMatrix() {
  const {
    year,
    search,
    page,
    data,
    summary,
    monthNames,
    rows,
    isLoading,
    isError,
    error,
    refetch,
    handleYearChange,
    handleSearchChange,
    handlePageChange,
  } = usePublicBillingMatrix();

  return (
    <div className="space-y-6">
      <BillingMatrixFilters
        year={year}
        search={search}
        onYearChange={handleYearChange}
        onSearchChange={handleSearchChange}
      />

      <BillingMatrixSummaryCards
        summary={summary}
        year={year}
        search={search}
      />

      {isError && <BillingMatrixError error={error} onRetry={refetch} />}

      <BillingMatrixTable
        rows={rows}
        monthNames={monthNames}
        year={year}
        isLoading={isLoading}
        isError={isError}
        meta={data?.meta}
        currentPage={page}
        onPageChange={handlePageChange}
      />

      <BillingMatrixLegend />
    </div>
  );
}
