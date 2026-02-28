"use client";

import { DataTable } from "@/components/data-table/data-table";
import { usePembayaranList } from "@/hooks/use-pembayaran-list";
import { ParseLogForm } from "./parse-log-form";
import { PembayaranForm } from "./pembayaran-form";

export function PembayaranList() {
  const {
    filterCustomerId,
    filterYear,
    filterMonth,
    paymentsQuery,
    customersQuery,
    createPayment,
    parseLog,
    handleCreatePayment,
    handleParseLog,
    handleCustomerFilterChange,
    handleYearFilterChange,
    handleMonthFilterChange,
    handleResetFilters,
    handlePreviousPage,
    handleNextPage,
    yearOptions,
    months,
    columns,
  } = usePembayaranList();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Pembayaran</h1>

      <PembayaranForm
        customers={customersQuery.data?.data ?? []}
        loading={createPayment.isPending}
        onSubmit={handleCreatePayment}
      />

      <ParseLogForm loading={parseLog.isPending} onSubmit={handleParseLog} />

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          value={filterCustomerId}
          onChange={(e) => handleCustomerFilterChange(e.target.value)}
        >
          <option value="">Semua Pelanggan</option>
          {(customersQuery.data?.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          value={filterYear}
          onChange={(e) => handleYearFilterChange(e.target.value)}
        >
          <option value="">Semua Tahun</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          value={filterMonth}
          onChange={(e) => handleMonthFilterChange(e.target.value)}
        >
          <option value="">Semua Bulan</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {(filterCustomerId || filterYear || filterMonth) && (
          <button
            type="button"
            className="text-sm text-zinc-500 underline"
            onClick={handleResetFilters}
          >
            Reset Filter
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={paymentsQuery.data?.data ?? []}
        meta={paymentsQuery.data?.meta}
        isLoading={paymentsQuery.isLoading}
        isError={paymentsQuery.isError}
        refetch={() => paymentsQuery.refetch()}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </section>
  );
}
