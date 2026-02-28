"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, formatDate } from "@/lib/number_helper";
import { useBillingMatrix } from "@/services/billing-service";

export function PublicBillingMatrix() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading, isError, error } = useBillingMatrix({
    year,
    page,
    perPage,
    customerName: search,
  });

  // Separate query with large perPage for accurate aggregate stats
  const { data: statsData } = useBillingMatrix({
    year,
    page: 1,
    perPage: 1000,
    customerName: search,
  });

  const summary = useMemo(() => {
    const rows = statsData?.data ?? [];
    const totalCollected = rows.reduce((sum, row) => sum + row.totalPaid, 0);
    const totalExpected = rows.reduce((sum, row) => sum + row.totalExpected, 0);
    return {
      totalCustomers: statsData?.meta.total ?? 0,
      totalCollected,
      collectionRate:
        totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0,
    };
  }, [statsData]);

  const monthNames =
    data?.monthNames ?? Array.from({ length: 12 }, (_, i) => String(i + 1));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Total Pelanggan</p>
          <p className="mt-1 text-xl font-semibold">{summary.totalCustomers}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Total Tertagih</p>
          <p className="mt-1 text-xl font-semibold">
            {formatCurrency(summary.totalCollected)}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-xs text-zinc-500">Collection Rate</p>
          <p className="mt-1 text-xl font-semibold">
            {summary.collectionRate.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() => setYear((current) => current - 1)}
          >
            -
          </Button>
          <span className="min-w-20 text-center font-medium">{year}</span>
          <Button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() => setYear((current) => current + 1)}
          >
            +
          </Button>
        </div>
        <Input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm sm:max-w-sm"
          placeholder="Cari pelanggan..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full min-w-300 border-collapse text-sm">
          <thead className="bg-zinc-100">
            <tr>
              <th className="px-3 py-2 text-left">Pelanggan</th>
              <th className="px-3 py-2 text-right">Biaya/Bulan</th>
              {monthNames.map((name) => (
                <th key={name} className="px-2 py-2 text-center">
                  {name}
                </th>
              ))}
              <th className="px-3 py-2 text-right">Total Dibayar</th>
              <th className="px-3 py-2 text-left">Progress</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`} className="border-t border-zinc-200">
                  <td className="px-3 py-2">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-3 py-2">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  {Array.from({ length: 12 }).map((_, j) => (
                    <td key={`skel-${i}-${j}`} className="px-2 py-2">
                      <Skeleton className="mx-auto h-5 w-8" />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-3 py-2">
                    <Skeleton className="h-4 w-24" />
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td className="px-3 py-4 text-rose-600" colSpan={16}>
                  <div className="flex items-center gap-2">
                    <span>
                      {error instanceof Error
                        ? error.message
                        : "Gagal memuat data."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : data?.data.length ? (
              data.data.map((row) => (
                <tr key={row.customer.id} className="border-t border-zinc-200">
                  <td className="px-3 py-2 font-medium">{row.customer.name}</td>
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(row.customer.monthlyFee)}
                  </td>
                  {row.payments.map((payment) => (
                    <td key={payment.month} className="px-2 py-2 text-center">
                      {payment.paid && payment.paymentDate ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-default rounded bg-emerald-100 px-2 py-0.5 text-emerald-700">
                                ✓
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tgl: {formatDate(payment.paymentDate)}</p>
                              {payment.amount !== null && (
                                <p>Jumlah: {formatCurrency(payment.amount)}</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="rounded bg-rose-100 px-2 py-0.5 text-rose-700">
                          ✗
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    {formatCurrency(row.totalPaid)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="h-2 w-full rounded bg-zinc-200">
                      <div
                        className="h-2 rounded bg-zinc-900"
                        style={{
                          width: `${Math.min(row.completionPercentage, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-zinc-600">
                      {row.completionPercentage.toFixed(1)}%
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-4" colSpan={16}>
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600">
          Halaman {data?.meta.page ?? page} dari {data?.meta.totalPages ?? 1}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            disabled={!data?.meta.hasPrev}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Prev
          </Button>
          <Button
            type="button"
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            disabled={!data?.meta.hasNext}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
