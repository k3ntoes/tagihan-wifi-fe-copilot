"use client";

import {
  AlertCircle,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  PercentCircle,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export function BillingMatrix() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const query = useBillingMatrix({
    year,
    page,
    perPage: 10,
    customerName: search || undefined,
  });

  const monthNames =
    query.data?.monthNames ??
    Array.from({ length: 12 }, (_, i) => String(i + 1));

  const rows = query.data?.data ?? [];
  const totalCustomers = rows.length;
  const totalPaid = rows.reduce((sum, r) => sum + r.totalPaid, 0);
  const totalExpected = rows.reduce((sum, r) => sum + r.totalExpected, 0);
  const avgCompletion =
    totalCustomers > 0
      ? rows.reduce((sum, r) => sum + r.completionPercentage, 0) /
        totalCustomers
      : 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tagihan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau status pembayaran pelanggan per bulan
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => {
              setYear((v) => v - 1);
              setPage(1);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            {year}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => {
              setYear((v) => v + 1);
              setPage(1);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              pelanggan di halaman ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terbayar</CardTitle>
            <Banknote className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              dari {formatCurrency(totalExpected)} ekspektasi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Belum Terbayar</CardTitle>
            <CreditCard className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {formatCurrency(totalExpected - totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              sisa tagihan tahun {year}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Lunas</CardTitle>
            <PercentCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {avgCompletion.toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">
              tingkat pelunasan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
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

      {/* Billing Matrix Table */}
      <Card>
        <CardHeader>
          <CardTitle>Matriks Tagihan {year}</CardTitle>
          <CardDescription>
            Status pembayaran setiap pelanggan per bulan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Cari pelanggan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                    Pelanggan
                  </th>
                  {monthNames.map((name) => (
                    <th
                      key={name}
                      className="px-2 py-3 text-center font-medium text-muted-foreground"
                    >
                      {name}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-right font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="px-3 py-3 text-right font-medium text-muted-foreground">
                    Lunas
                  </th>
                </tr>
              </thead>
              <tbody>
                {query.isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={`skel-${i}`}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-3 py-3">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      {Array.from({ length: 12 }).map((_, j) => (
                        <td key={`skel-${i}-${j}`} className="px-2 py-3">
                          <Skeleton className="mx-auto h-6 w-6 rounded-full" />
                        </td>
                      ))}
                      <td className="px-3 py-3">
                        <Skeleton className="ml-auto h-4 w-20" />
                      </td>
                      <td className="px-3 py-3">
                        <Skeleton className="ml-auto h-4 w-12" />
                      </td>
                    </tr>
                  ))
                ) : rows.length ? (
                  rows.map((row) => (
                    <tr
                      key={row.customer.id}
                      className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium">
                              {row.customer.name}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {formatCurrency(row.customer.monthlyFee)}/bln
                            </p>
                          </div>
                        </div>
                      </td>
                      {row.payments.map((payment) => (
                        <td
                          key={payment.month}
                          className="px-2 py-3 text-center"
                        >
                          {payment.paid && payment.paymentDate ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 cursor-default">
                                    <CheckCircle2 className="h-4 w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-medium">Lunas</p>
                                  <p className="text-xs">
                                    Tgl: {formatDate(payment.paymentDate)}
                                  </p>
                                  {payment.amount !== null && (
                                    <p className="text-xs">
                                      Jumlah: {formatCurrency(payment.amount)}
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700 cursor-default">
                                    <XCircle className="h-4 w-4" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-medium">Belum Bayar</p>
                                  <p className="text-xs">
                                    {payment.monthName} {year}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </td>
                      ))}
                      <td className="px-3 py-3 text-right">
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(row.totalPaid)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <CompletionBadge percentage={row.completionPercentage} />
                      </td>
                    </tr>
                  ))
                ) : !query.isError ? (
                  <tr>
                    <td
                      className="px-3 py-8 text-center text-muted-foreground"
                      colSpan={monthNames.length + 3}
                    >
                      Tidak ada data tagihan untuk tahun {year}.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {query.data?.meta
                ? `Halaman ${query.data.meta.page} dari ${query.data.meta.totalPages}`
                : ""}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!query.data?.meta.hasPrev}
                onClick={() => setPage((v) => Math.max(1, v - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Sebelumnya
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!query.data?.meta.hasNext}
                onClick={() => setPage((v) => v + 1)}
              >
                Berikutnya
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
          </span>
          Lunas
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <XCircle className="h-3 w-3" />
          </span>
          Belum Bayar
        </div>
      </div>
    </section>
  );
}

function CompletionBadge({ percentage }: { percentage: number }) {
  const color =
    percentage >= 75
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : percentage >= 50
        ? "bg-amber-50 text-amber-700 ring-amber-600/20"
        : "bg-rose-50 text-rose-700 ring-rose-600/20";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${color}`}
    >
      {percentage.toFixed(0)}%
    </span>
  );
}
