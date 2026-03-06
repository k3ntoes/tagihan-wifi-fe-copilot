import type { ColumnDef } from "@tanstack/react-table";
import {
  Calendar,
  CheckCircle2,
  CreditCard,
  Edit,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/number_helper";
import { useCustomers } from "@/services/customer-service";
import {
  useCreatePayment,
  useDeletePayment,
  useParsePaymentLog,
  usePayments,
  useUpdatePayment,
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [parseDialogOpen, setParseDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Payment | null>(null);

  const paymentsQuery = usePayments({
    page,
    perPage: 10,
    customerId: filterCustomerId || undefined,
    year: filterYear ? Number(filterYear) : undefined,
    month: filterMonth ? Number(filterMonth) : undefined,
  });
  const customersQuery = useCustomers({ page: 1, perPage: 100 });
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const deletePayment = useDeletePayment();
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
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mencatat pembayaran.",
      );
    }
  };

  const handleUpdatePayment = async (payload: {
    customer_id: string;
    payment_date: string;
    billing_month: number;
    billing_year: number;
    amount: number;
  }) => {
    if (!editItem) return;
    try {
      await updatePayment.mutateAsync({ id: editItem.id, ...payload });
      toast.success("Pembayaran berhasil diupdate.");
      setEditItem(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupdate pembayaran.",
      );
    }
  };

  const handleDeletePayment = async (id: string) => {
    try {
      await deletePayment.mutateAsync(id);
      toast.success("Pembayaran dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus pembayaran.",
      );
    }
  };

  const handleParseLog = async (payload: { log_entry: string }) => {
    try {
      await parseLog.mutateAsync(payload);
      toast.success("Log pembayaran berhasil diparse.");
      setParseDialogOpen(false);
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.original.customer.name}</span>
        </div>
      ),
    },
    {
      id: "date",
      header: "Tanggal Bayar",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-600">
            {formatDate(row.original.paymentDate)}
          </span>
        </div>
      ),
    },
    {
      id: "period",
      header: "Periode",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {row.original.billingMonth}/{row.original.billingYear}
        </span>
      ),
    },
    {
      id: "amount",
      header: "Jumlah",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-emerald-500" />
          <span className="font-semibold text-emerald-600">
            {formatCurrency(row.original.amount)}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setEditItem(row.original)}
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Pembayaran?</AlertDialogTitle>
                <AlertDialogDescription>
                  Pembayaran dari &ldquo;{row.original.customer.name}&rdquo;
                  periode {row.original.billingMonth}/{row.original.billingYear}{" "}
                  akan dihapus secara permanen. Tindakan ini tidak dapat
                  dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={() => handleDeletePayment(row.original.id)}
                >
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return {
    // State
    filterCustomerId,
    filterYear,
    filterMonth,
    createDialogOpen,
    setCreateDialogOpen,
    parseDialogOpen,
    setParseDialogOpen,
    editItem,
    setEditItem,

    // Queries
    paymentsQuery,
    customersQuery,

    // Mutations
    createPayment,
    updatePayment,
    parseLog,

    // Handlers
    handleCreatePayment,
    handleUpdatePayment,
    handleDeletePayment,
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
