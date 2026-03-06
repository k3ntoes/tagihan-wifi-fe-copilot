import { Banknote, PercentCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/number_helper";
import type { BillingMatrixSummary } from "@/types/billing";

interface BillingMatrixSummaryCardsProps {
  summary: BillingMatrixSummary;
  year: number;
  search: string;
}

export function BillingMatrixSummaryCards({
  summary,
  year,
  search,
}: BillingMatrixSummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            {search ? `hasil pencarian "${search}"` : `pelanggan tahun ${year}`}
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
            {formatCurrency(summary.totalCollected)}
          </div>
          <p className="text-xs text-muted-foreground">
            dari {formatCurrency(summary.totalExpected)} ekspektasi tahun {year}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          <PercentCircle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {summary.collectionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            tingkat pelunasan tahun {year}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
