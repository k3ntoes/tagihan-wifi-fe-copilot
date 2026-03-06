"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { PembayaranFormValues } from "@/hooks/use-pembayaran-form";
import { useBillingMatrix } from "@/services/billing-service";
import {
  useCreatePayment,
  usePayments,
  useUpdatePayment,
} from "@/services/payment-service";
import type { BillingRow, Customer, PaymentByMonth } from "@/types/api";

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

export function useDashboardBillingMatrix() {
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

  const paymentQuery = usePayments({
    page: 1,
    perPage: 1,
    customerId: cellCtx?.paid ? cellCtx.customerId : undefined,
    year: cellCtx?.paid ? cellCtx.year : undefined,
    month: cellCtx?.paid ? cellCtx.month : undefined,
  });

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

  const customersForForm: Customer[] = rows.map((r) => ({
    id: r.customer.id,
    name: r.customer.name,
    package: r.customer.package,
    monthlyFee: r.customer.monthlyFee,
    createdAt: "",
    updatedAt: "",
  }));

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
        ? undefined
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

  const handlePrevYear = useCallback(() => {
    setYear((v) => v - 1);
    setPage(1);
  }, []);

  const handleNextYear = useCallback(() => {
    setYear((v) => v + 1);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setPage((v) => Math.max(1, v - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((v) => v + 1);
  }, []);

  return {
    // State
    year,
    search,
    dialogOpen,
    cellCtx,

    // Query
    query,
    paymentQuery,
    monthNames,
    rows,

    // Dialog / Form
    existingPayment,
    formInitialValues,
    customersForForm,
    isSubmitting,

    // Handlers
    handleCellClick,
    handleDialogClose,
    handleFormSubmit,
    handlePrevYear,
    handleNextYear,
    handleSearchChange,
    handlePrevPage,
    handleNextPage,
  };
}
