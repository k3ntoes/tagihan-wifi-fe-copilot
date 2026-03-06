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
import { useMemo } from "react";
import { DashboardBillingMatrix } from "@/components/dashboard/dashboard-billing-matrix";
import {
  Card,
  CardContent,
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
      return payment && !payment.paid;
    });
    const paidThisMonth = rows.filter((row) => {
      const payment = row.payments.find((p) => p.month === currentMonth);
      return payment?.paid;
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

      {/* Billing Matrix */}
      {!billingQuery.isError && <DashboardBillingMatrix />}
    </section>
  );
}
