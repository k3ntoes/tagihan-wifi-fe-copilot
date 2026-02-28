"use client";

import { AlertCircle, TrendingUp, Users, Wallet, XCircle } from "lucide-react";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/number_helper";
import { useBillingMatrix } from "@/services/billing-service";
import { useCustomers } from "@/services/customer-service";

export default function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const billingQuery = useBillingMatrix({
    year: currentYear,
    page: 1,
    perPage: 100,
  });
  const customersQuery = useCustomers({ page: 1, perPage: 1 });

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
    return { totalCollected, collectionRate, unpaidThisMonth };
  }, [billingQuery.data, currentMonth]);

  const totalCustomers = customersQuery.data?.meta.total ?? 0;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Users className="h-3.5 w-3.5" />
            Total Pelanggan Aktif
          </div>
          {customersQuery.isLoading ? (
            <Skeleton className="mt-1 h-8 w-20" />
          ) : (
            <p className="mt-1 text-2xl font-semibold">{totalCustomers}</p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Wallet className="h-3.5 w-3.5" />
            Pendapatan Tahun Ini
          </div>
          {billingQuery.isLoading ? (
            <Skeleton className="mt-1 h-8 w-32" />
          ) : (
            <p className="mt-1 text-2xl font-semibold">
              {formatCurrency(stats?.totalCollected ?? 0)}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <XCircle className="h-3.5 w-3.5" />
            Belum Bayar (Bulan Ini)
          </div>
          {billingQuery.isLoading ? (
            <Skeleton className="mt-1 h-8 w-12" />
          ) : (
            <p className="mt-1 text-2xl font-semibold text-rose-600">
              {stats?.unpaidThisMonth.length ?? 0}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <TrendingUp className="h-3.5 w-3.5" />
            Collection Rate
          </div>
          {billingQuery.isLoading ? (
            <Skeleton className="mt-1 h-8 w-16" />
          ) : (
            <p className="mt-1 text-2xl font-semibold text-emerald-600">
              {stats?.collectionRate.toFixed(1) ?? "0"}%
            </p>
          )}
        </div>
      </div>

      {billingQuery.isError ? (
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
      ) : (
        <div className="space-y-2">
          <h2 className="text-base font-medium text-zinc-700">
            5 Pelanggan Belum Bayar Bulan Ini
          </h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Nama</th>
                  <th className="px-3 py-2 text-left font-medium">Paket</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Biaya/Bulan
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingQuery.isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr
                      key={`skel-row-${i}`}
                      className="border-t border-zinc-200"
                    >
                      <td className="px-3 py-2">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="px-3 py-2">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-3 py-2">
                        <Skeleton className="ml-auto h-4 w-20" />
                      </td>
                    </tr>
                  ))
                ) : stats?.unpaidThisMonth.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-zinc-500">
                      Semua pelanggan sudah bayar bulan ini. 🎉
                    </td>
                  </tr>
                ) : (
                  stats?.unpaidThisMonth.slice(0, 5).map((row) => (
                    <tr
                      key={row.customer.id}
                      className="border-t border-zinc-200"
                    >
                      <td className="px-3 py-2">{row.customer.name}</td>
                      <td className="px-3 py-2">{row.customer.package.name}</td>
                      <td className="px-3 py-2 text-right">
                        {formatCurrency(row.customer.monthlyFee)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
