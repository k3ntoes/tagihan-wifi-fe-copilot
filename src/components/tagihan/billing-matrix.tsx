"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, formatDate } from "@/lib/number_helper";
import { useBillingMatrix } from "@/services/billing-service";

export function BillingMatrix() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(1);

  const query = useBillingMatrix({ year, page, perPage: 10 });
  const monthNames =
    query.data?.monthNames ??
    Array.from({ length: 12 }, (_, i) => String(i + 1));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tagihan</h1>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() => setYear((value) => value - 1)}
          >
            -
          </Button>
          <span>{year}</span>
          <Button
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={() => setYear((value) => value + 1)}
          >
            +
          </Button>
        </div>
      </div>

      {query.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <AlertCircle className="h-4 w-4" />
          <span>
            {query.error instanceof Error
              ? query.error.message
              : "Gagal memuat data tagihan."}
          </span>
          <button
            type="button"
            className="underline"
            onClick={() => query.refetch()}
          >
            Coba lagi
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        <table className="w-full min-w-300 border-collapse text-sm">
          <thead className="bg-zinc-100">
            <tr>
              <th className="px-3 py-2 text-left">Pelanggan</th>
              {monthNames.map((name) => (
                <th key={name} className="px-2 py-2 text-center">
                  {name}
                </th>
              ))}
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {query.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`} className="border-t border-zinc-200">
                  <td className="px-3 py-2">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  {Array.from({ length: 12 }).map((_, j) => (
                    <td key={`skel-${i}-${j}`} className="px-2 py-2">
                      <Skeleton className="mx-auto h-5 w-8" />
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <Skeleton className="ml-auto h-4 w-20" />
                  </td>
                </tr>
              ))
            ) : query.data?.data.length ? (
              query.data.data.map((row) => (
                <tr key={row.customer.id} className="border-t border-zinc-200">
                  <td className="px-3 py-2">{row.customer.name}</td>
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
                </tr>
              ))
            ) : !query.isError ? (
              <tr>
                <td className="px-3 py-4" colSpan={14}>
                  Tidak ada data.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          disabled={!query.data?.meta.hasPrev}
          onClick={() => setPage((value) => Math.max(1, value - 1))}
        >
          Prev
        </Button>
        <Button
          type="button"
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
          disabled={!query.data?.meta.hasNext}
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
