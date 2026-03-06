# Dashboard Billing Matrix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an interactive billing matrix to the dashboard page, where each cell opens a dialog to create/edit payments.

**Architecture:** Create a new `DashboardBillingMatrix` component based on the existing `BillingMatrix` from `/tagihan`. The cells become clickable buttons that open a `Dialog` containing the existing `PembayaranForm`. For edit mode, payment details are fetched on-demand via the payments API. Mutations invalidate both `payments` and `billing-matrix` query keys.

**Tech Stack:** Next.js (App Router), React, TanStack Query, Shadcn Dialog, PembayaranForm, Zod

---

### Task 1: Update payment service to invalidate billing-matrix queries

**Files:**
- Modify: `src/services/payment-service.ts`

**Step 1: Add billing-matrix invalidation to create/update mutations**

In `src/services/payment-service.ts`, update `useCreatePayment` and `useUpdatePayment` to also invalidate the `billing-matrix` query key so the matrix refreshes after a payment is created or updated.

```typescript
// In useCreatePayment, change onSuccess:
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: [paymentKey] });
  queryClient.invalidateQueries({ queryKey: ["billing-matrix"] });
},

// In useUpdatePayment, change onSuccess:
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: [paymentKey] });
  queryClient.invalidateQueries({ queryKey: ["billing-matrix"] });
},
```

**Step 2: Verify the app compiles**

Run: `npx next build` or `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/services/payment-service.ts
git commit -m "feat: invalidate billing-matrix on payment create/update"
```

---

### Task 2: Create DashboardBillingMatrix component

**Files:**
- Create: `src/components/dashboard/dashboard-billing-matrix.tsx`

This is the main new component. It is based on `src/components/tagihan/billing-matrix.tsx` but:
- Removes the page-level header ("Tagihan" h1) since dashboard has its own
- Removes the duplicate summary cards (dashboard already has cards above)
- Changes each payment cell from `<span>` to `<button>` that opens a Dialog
- Adds Dialog + PembayaranForm integration
- Fetches payment details on-demand for edit mode

**Step 1: Create the component file**

Create `src/components/dashboard/dashboard-billing-matrix.tsx` with the following structure:

```tsx
"use client";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { PembayaranForm } from "@/components/pembayaran/pembayaran-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PembayaranFormValues } from "@/hooks/use-pembayaran-form";
import { formatCurrency, formatDate } from "@/lib/number_helper";
import { useBillingMatrix } from "@/services/billing-service";
import type { BillingRow, Customer, PaymentByMonth } from "@/types/api";
import {
  useCreatePayment,
  usePayments,
  useUpdatePayment,
} from "@/services/payment-service";

interface CellContext {
  customerId: string;
  customerName: string;
  monthlyFee: number;
  month: number;
  monthName: string;
  year: number;
  paid: boolean;
  paymentDate: string | null;
  amount: number | null;
}

export function DashboardBillingMatrix() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cellCtx, setCellCtx] = useState<CellContext | null>(null);

  const query = useBillingMatrix({
    year,
    page,
    perPage: 10,
    customerName: search || undefined,
  });

  // Fetch payment for edit mode — only enabled when dialog is open and cell is paid
  const paymentQuery = usePayments({
    page: 1,
    perPage: 1,
    customerId: cellCtx?.paid ? cellCtx.customerId : undefined,
    year: cellCtx?.paid ? cellCtx.year : undefined,
    month: cellCtx?.paid ? cellCtx.month : undefined,
  });
  // Note: usePayments uses enabled by default; it will fetch whenever params change.
  // We rely on the query being fast and showing a loader in the dialog.

  const createMutation = useCreatePayment();
  const updateMutation = useUpdatePayment();

  const monthNames =
    query.data?.monthNames ??
    Array.from({ length: 12 }, (_, i) => String(i + 1));

  const rows = query.data?.data ?? [];

  const handleCellClick = useCallback(
    (row: BillingRow, payment: PaymentByMonth) => {
      setCellCtx({
        customerId: row.customer.id,
        customerName: row.customer.name,
        monthlyFee: row.customer.monthlyFee,
        month: payment.month,
        monthName: payment.monthName,
        year,
        paid: payment.paid,
        paymentDate: payment.paymentDate,
        amount: payment.amount,
      });
      setDialogOpen(true);
    },
    [year],
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setCellCtx(null);
  }, []);

  // Build customers list from billing rows for PembayaranForm's Select
  const customersForForm: Customer[] = rows.map((r) => ({
    id: r.customer.id,
    name: r.customer.name,
    package: r.customer.package,
    monthlyFee: r.customer.monthlyFee,
    createdAt: "",
    updatedAt: "",
  }));

  // Determine initialValues for the form
  const existingPayment =
    cellCtx?.paid && paymentQuery.data?.data?.[0]
      ? paymentQuery.data.data[0]
      : null;

  const formInitialValues: PembayaranFormValues | undefined = cellCtx
    ? cellCtx.paid && existingPayment
      ? {
          customer_id: existingPayment.customer.id,
          payment_date:
            existingPayment.paymentDate.split("T")[0] ?? "",
          billing_month: existingPayment.billingMonth,
          billing_year: existingPayment.billingYear,
          amount: existingPayment.amount,
        }
      : cellCtx.paid
        ? undefined // still loading payment data
        : {
            customer_id: cellCtx.customerId,
            payment_date: new Date().toISOString().split("T")[0] ?? "",
            billing_month: cellCtx.month,
            billing_year: cellCtx.year,
            amount: cellCtx.monthlyFee,
          }
    : undefined;

  const handleFormSubmit = async (values: PembayaranFormValues) => {
    if (cellCtx?.paid && existingPayment) {
      await updateMutation.mutateAsync({
        id: existingPayment.id,
        ...values,
      });
      toast.success("Pembayaran berhasil diupdate");
    } else {
      await createMutation.mutateAsync(values);
      toast.success("Pembayaran berhasil disimpan");
    }
    handleDialogClose();
  };

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  return (
    <>
      {/* Billing Matrix Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Matriks Tagihan {year}</CardTitle>
              <CardDescription>
                Klik icon untuk menambah atau mengedit pembayaran.
              </CardDescription>
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

          {/* Matrix Table */}
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-200 border-collapse text-sm">
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCellClick(row, payment)
                                  }
                                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-opacity hover:opacity-80 ${
                                    payment.paid && payment.paymentDate
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-rose-100 text-rose-700"
                                  }`}
                                >
                                  {payment.paid && payment.paymentDate ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {payment.paid && payment.paymentDate ? (
                                  <>
                                    <p className="font-medium">
                                      Lunas — klik untuk edit
                                    </p>
                                    <p className="text-xs">
                                      Tgl: {formatDate(payment.paymentDate)}
                                    </p>
                                    {payment.amount !== null && (
                                      <p className="text-xs">
                                        Jumlah:{" "}
                                        {formatCurrency(payment.amount)}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <p className="font-medium">
                                      Belum Bayar — klik untuk tambah
                                    </p>
                                    <p className="text-xs">
                                      {payment.monthName} {year}
                                    </p>
                                  </>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      ))}
                      <td className="px-3 py-3 text-right">
                        <span className="font-semibold text-emerald-600">
                          {formatCurrency(row.totalPaid)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <CompletionBadge
                          percentage={row.completionPercentage}
                        />
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

      {/* Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) handleDialogClose(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {cellCtx?.paid ? "Edit Pembayaran" : "Tambah Pembayaran"}
            </DialogTitle>
            <DialogDescription>
              {cellCtx
                ? `${cellCtx.customerName} — ${cellCtx.monthName} ${cellCtx.year}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {cellCtx?.paid && !existingPayment && paymentQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : formInitialValues || !cellCtx?.paid ? (
            <PembayaranForm
              customers={customersForForm}
              initialValues={formInitialValues}
              onSubmit={handleFormSubmit}
              loading={isSubmitting}
            />
          ) : (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              Gagal memuat data pembayaran.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
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
```

**Key differences from `BillingMatrix`:**
- No page header (h1) — dashboard has its own
- No summary cards — dashboard already shows them
- Year nav moved into the Card header
- Each cell is a `<button>` with `onClick` → `handleCellClick`
- Tooltip text updated: "klik untuk edit" / "klik untuk tambah"
- Dialog with PembayaranForm at the bottom
- Payment fetch for edit mode via `usePayments` filtered by customer/month/year
- `customersForForm` built from billing rows (avoids extra API call)

**Step 2: Verify the app compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

**Step 3: Commit**

```bash
git add src/components/dashboard/dashboard-billing-matrix.tsx
git commit -m "feat: create DashboardBillingMatrix component with interactive cells"
```

---

### Task 3: Update dashboard page to use DashboardBillingMatrix

**Files:**
- Modify: `src/app/(dashboard)/dashboard/page.tsx`

**Step 1: Replace the unpaid table section with DashboardBillingMatrix**

Replace the entire `{/* Unpaid This Month Table */}` section (lines 262-386) with the new component import and usage. Keep all the summary cards (lines 79-245) and the error alert (lines 247-260) intact.

At the top, add the import:
```tsx
import { DashboardBillingMatrix } from "@/components/dashboard/dashboard-billing-matrix";
```

Remove unused imports that were only used by the unpaid table:
- Remove `Link` from `next/link` (if only used for "Lihat Semua" button)
- Remove `Button` from `@/components/ui/button` (if only used in unpaid table)
- Keep `Package` icon import (used in quick stats row)

Replace the `{/* Unpaid This Month Table */}` block (the entire `{!billingQuery.isError && ( <Card>...</Card> )}` section) with:

```tsx
{/* Billing Matrix */}
{!billingQuery.isError && <DashboardBillingMatrix />}
```

**Step 2: Verify the app compiles and renders**

Run: `npx tsc --noEmit`
Run: `npm run dev` — visit `/dashboard`, verify:
- Summary cards display correctly
- Billing matrix appears below cards
- Year navigation works
- Cell click opens dialog
- Create payment dialog pre-fills correctly
- Edit payment dialog loads and pre-fills correctly

**Step 3: Commit**

```bash
git add src/app/(dashboard)/dashboard/page.tsx
git commit -m "feat: replace unpaid table with interactive billing matrix on dashboard"
```

---

### Task 4: Verify and clean up

**Step 1: Full verification**

- Visit `/dashboard` — confirm cards + matrix + dialog workflow
- Visit `/tagihan` — confirm original billing matrix still works unchanged
- Create a payment via dialog → confirm matrix cell updates to green
- Edit a payment via dialog → confirm values update

**Step 2: Final commit if any cleanup needed**

```bash
git add -A
git commit -m "chore: clean up dashboard billing matrix integration"
```
