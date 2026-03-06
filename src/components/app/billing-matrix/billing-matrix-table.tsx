import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/number_helper";
import type { BillingMatrixMeta, BillingMatrixRow } from "@/types/billing";
import { BillingMatrixCell } from "./billing-matrix-cell";
import { BillingMatrixPagination } from "./billing-matrix-pagination";

interface BillingMatrixTableProps {
  rows: BillingMatrixRow[];
  monthNames: string[];
  year: number;
  isLoading: boolean;
  isError: boolean;
  meta: BillingMatrixMeta | undefined;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function BillingMatrixTable({
  rows,
  monthNames,
  year,
  isLoading,
  isError,
  meta,
  currentPage,
  onPageChange,
}: BillingMatrixTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Matriks Tagihan {year}</CardTitle>
        <CardDescription>
          Status pembayaran setiap pelanggan per bulan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-225 border-collapse text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">
                  Pelanggan
                </th>
                <th className="px-3 py-3 text-right font-medium text-muted-foreground">
                  Biaya/Bln
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
                  Progres
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`} className="border-b last:border-b-0">
                    <td className="px-3 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-3 py-3">
                      <Skeleton className="ml-auto h-4 w-20" />
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
                      <Skeleton className="ml-auto h-4 w-16" />
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
                        <span className="font-medium">{row.customer.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right text-muted-foreground">
                      {formatCurrency(row.customer.monthlyFee)}
                    </td>
                    {row.payments.map((payment) => (
                      <td key={payment.month} className="px-2 py-3 text-center">
                        <BillingMatrixCell payment={payment} year={year} />
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(row.totalPaid)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-16 rounded-full bg-muted">
                          <div
                            className={`h-2 rounded-full ${
                              row.completionPercentage >= 75
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
              ) : !isError ? (
                <tr>
                  <td
                    className="px-3 py-8 text-center text-muted-foreground"
                    colSpan={monthNames.length + 4}
                  >
                    Tidak ada data tagihan untuk tahun {year}.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <BillingMatrixPagination
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
}
