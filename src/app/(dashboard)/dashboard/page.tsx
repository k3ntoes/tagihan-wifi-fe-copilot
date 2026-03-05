"use client";

import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  CreditCard,
  Package,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/number_helper";
import { useBillingMatrix } from "@/services/billing-service";
import { useCustomers } from "@/services/customer-service";
import { usePackages } from "@/services/package-service";

export default function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const monthName = new Date().toLocaleString("id-ID", { month: "long" });

  const billingQuery = useBillingMatrix({
    year: currentYear,
    page: 1,
    perPage: 100,
  });
  const customersQuery = useCustomers({ page: 1, perPage: 1 });
  const packagesQuery = usePackages({ page: 1, perPage: 1, search: "" });

  const stats = useMemo(() => {
    if (!billingQuery.data) return null;
    const rows = billingQuery.data.data;
    const totalCollected = rows.reduce((sum, row) => sum + row.totalPaid, 0);
    const totalExpected = rows.reduce((sum, row) => sum + row.totalExpected, 0);
    const collectionRate =
      totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
    const unpaidThisMonth = rows.filter((row) => {
      const payment = row.payments.find((p) => p.month === currentMonth);
      return payment && !payment?.paid;
    });
    const paidThisMonth = rows.filter((row) => {
      const payment = row.payments.find((p) => p.month === currentMonth);
      return payment && payment?.paid;
    });
    return {
      totalCollected,
      totalExpected,
      collectionRate,
      unpaidThisMonth,
      paidThisMonth,
    };
  }, [billingQuery.data, currentMonth]);

  const totalCustomers = customersQuery.data?.meta.total ?? 0;
  const totalPackages = packagesQuery.data?.meta.total ?? 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ringkasan data tagihan WiFi tahun {currentYear}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pelanggan
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {customersQuery.isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  pelanggan terdaftar
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendapatan {currentYear}
            </CardTitle>
            <Banknote className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {billingQuery.isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(stats?.totalCollected ?? 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  dari {formatCurrency(stats?.totalExpected ?? 0)} ekspektasi
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Belum Bayar ({monthName})
            </CardTitle>
            <XCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {billingQuery.isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-rose-600">
                  {stats?.unpaidThisMonth.length ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  dari {totalCustomers} pelanggan
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Collection Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {billingQuery.isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.collectionRate.toFixed(1) ?? "0"}%
                </div>
                <p className="text-xs text-muted-foreground">
                  tingkat pelunasan tahun {currentYear}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paket Aktif</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {packagesQuery.isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-purple-600">
                  {totalPackages}
                </div>
                <p className="text-xs text-muted-foreground">
                  paket internet tersedia
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sudah Bayar ({monthName})
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {billingQuery.isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold text-emerald-600">
                  {stats?.paidThisMonth.length ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  pelanggan sudah lunas
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Piutang Bulan Ini
            </CardTitle>
            <CreditCard className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            {billingQuery.isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold text-rose-600">
                  {formatCurrency(
                    (stats?.unpaidThisMonth ?? []).reduce(
                      (sum, row) => sum + row.customer.monthlyFee,
                      0,
                    ),
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.unpaidThisMonth.length ?? 0} pelanggan belum bayar
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {billingQuery.isError && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <AlertCircle className="h-4 w-4" />
          <span>Gagal memuat data tagihan.</span>
          <button
            type="button"
            className="ml-1 underline"
            onClick={() => billingQuery.refetch()}
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Unpaid This Month Table */}
      {!billingQuery.isError && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Belum Bayar Bulan {monthName}</CardTitle>
              <CardDescription>
                Pelanggan yang belum melakukan pembayaran untuk bulan ini.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tagihan">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Pelanggan
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Paket
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Biaya/Bulan
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Progres Tahun Ini
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billingQuery.isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr
                        key={`skel-${i}`}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-32" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="ml-auto h-4 w-24" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="ml-auto h-4 w-16" />
                        </td>
                      </tr>
                    ))
                  ) : stats?.unpaidThisMonth.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                          <p className="font-medium">
                            Semua pelanggan sudah bayar bulan ini!
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    stats?.unpaidThisMonth.slice(0, 10).map((row) => (
                      <tr
                        key={row.customer.id}
                        className="border-b last:border-b-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="font-medium">
                              {row.customer.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                            <Package className="h-3 w-3" />
                            {row.customer.package.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(row.customer.monthlyFee)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-2 w-20 rounded-full bg-muted">
                              <div
                                className={`h-2 rounded-full ${row.completionPercentage >= 75
                                  ? "bg-emerald-500"
                                  : row.completionPercentage >= 50
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                  }`}
                                style={{
                                  width: `${Math.min(row.completionPercentage, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground w-10 text-right">
                              {row.completionPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
