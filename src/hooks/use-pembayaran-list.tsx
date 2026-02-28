import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/number_helper";
import { useCustomers } from "@/services/customer-service";
import {
  useCreatePayment,
  useParsePaymentLog,
  usePayments,
} from "@/services/payment-service";
import type { Payment } from "@/types/api";

const MONTHS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

export function usePembayaranList() {
  const [page, setPage] = useState(1);
  const [filterCustomerId, setFilterCustomerId] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterMonth, setFilterMonth] = useState<string>("");

  const paymentsQuery = usePayments({
    page,
    perPage: 10,
    customerId: filterCustomerId || undefined,
    year: filterYear ? Number(filterYear) : undefined,
    month: filterMonth ? Number(filterMonth) : undefined,
  });
  const customersQuery = useCustomers({ page: 1, perPage: 100 });
  const createPayment = useCreatePayment();
  const parseLog = useParsePaymentLog();

  const handleCreatePayment = async (payload: {
    customer_id: string;
    payment_date: string;
    billing_month: number;
    billing_year: number;
    amount: number;
  }) => {
    try {
      await createPayment.mutateAsync(payload);
      toast.success("Pembayaran berhasil dicatat.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mencatat pembayaran.",
      );
    }
  };

  const handleParseLog = async (payload: { log_entry: string }) => {
    try {
      await parseLog.mutateAsync(payload);
      toast.success("Log pembayaran berhasil diparse.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal parse log.");
    }
  };

  const handleCustomerFilterChange = (value: string) => {
    setFilterCustomerId(value);
    setPage(1);
  };

  const handleYearFilterChange = (value: string) => {
    setFilterYear(value);
    setPage(1);
  };

  const handleMonthFilterChange = (value: string) => {
    setFilterMonth(value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilterCustomerId("");
    setFilterYear("");
    setFilterMonth("");
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => current + 1);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const columns: ColumnDef<Payment>[] = [
    {
      id: "customer",
      header: "Pelanggan",
      cell: ({ row }) => row.original.customer.name,
    },
    {
      id: "date",
      header: "Tanggal Bayar",
      cell: ({ row }) => formatDate(row.original.paymentDate),
    },
    {
      id: "period",
      header: "Periode",
      cell: ({ row }) =>
        `${row.original.billingMonth}/${row.original.billingYear}`,
    },
    {
      id: "amount",
      header: "Jumlah",
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
  ];

  return {
    // State
    filterCustomerId,
    filterYear,
    filterMonth,

    // Queries
    paymentsQuery,
    customersQuery,

    // Mutations
    createPayment,
    parseLog,

    // Handlers
    handleCreatePayment,
    handleParseLog,
    handleCustomerFilterChange,
    handleYearFilterChange,
    handleMonthFilterChange,
    handleResetFilters,
    handlePreviousPage,
    handleNextPage,

    // Options
    yearOptions,
    months: MONTHS,

    // Columns
    columns,
  };
}
