import type { ColumnDef } from "@tanstack/react-table";
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
import { formatCurrency } from "@/lib/number_helper";
import {
  useCreateCustomer,
  useCustomers,
  useDeleteCustomer,
  useUpdateCustomer,
} from "@/services/customer-service";
import { usePackages } from "@/services/package-service";
import type { Customer } from "@/types/api";

export function usePelangganList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<Customer | null>(null);

  const customersQuery = useCustomers({ page, perPage: 10, search });
  const packagesQuery = usePackages({ page: 1, perPage: 100, search: "" });
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const handleCreate = async (values: {
    name: string;
    package_id: string;
    monthly_fee: number;
  }) => {
    try {
      await createCustomer.mutateAsync(values);
      toast.success("Pelanggan berhasil dibuat.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat pelanggan.",
      );
    }
  };

  const handleUpdate = async (values: {
    name: string;
    package_id: string;
    monthly_fee: number;
  }) => {
    if (!editItem) return;
    try {
      await updateCustomer.mutateAsync({
        id: editItem.id,
        ...values,
      });
      toast.success("Pelanggan berhasil diupdate.");
      setEditItem(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupdate pelanggan.",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer.mutateAsync(id);
      toast.success("Pelanggan dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus pelanggan.",
      );
    }
  };

  const handleSearch = (nextSearch: string) => {
    setSearch(nextSearch);
    setPage(1);
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const handleNextPage = () => {
    setPage((current) => current + 1);
  };

  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "name", header: "Nama" },
    {
      id: "package",
      header: "Paket",
      cell: ({ row }) => row.original.package.name,
    },
    {
      accessorKey: "monthlyFee",
      header: "Biaya/Bulan",
      cell: ({ row }) => formatCurrency(row.original.monthlyFee),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            className="rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700"
            onClick={() => setEditItem(row.original)}
          >
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700"
              >
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Pelanggan?</AlertDialogTitle>
                <AlertDialogDescription>
                  Pelanggan &ldquo;{row.original.name}&rdquo; akan dihapus
                  secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={() => handleDelete(row.original.id)}
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
    search,
    editItem,
    setEditItem,

    // Queries
    customersQuery,
    packagesQuery,

    // Mutations
    createCustomer,
    updateCustomer,

    // Handlers
    handleCreate,
    handleUpdate,
    handleSearch,
    handlePreviousPage,
    handleNextPage,

    // Columns
    columns,
  };
}
