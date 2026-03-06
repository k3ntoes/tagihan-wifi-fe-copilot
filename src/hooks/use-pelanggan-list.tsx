import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Package as PackageIcon, Trash2, User } from "lucide-react";
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
      setCreateDialogOpen(false);
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
    {
      accessorKey: "name",
      header: "Nama Pelanggan",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      id: "package",
      header: "Paket",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <PackageIcon className="h-4 w-4 text-purple-500" />
          <span className="font-semibold text-purple-600">
            {row.original.package.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "monthlyFee",
      header: "Biaya/Bulan",
      cell: ({ row }) => (
        <span className="font-semibold text-emerald-600">
          {formatCurrency(row.original.monthlyFee)}
        </span>
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
                <AlertDialogTitle>Hapus Pelanggan?</AlertDialogTitle>
                <AlertDialogDescription>
                  Pelanggan &ldquo;{row.original.name}&rdquo; akan dihapus
                  secara permanen. Tindakan ini tidak dapat dibatalkan.
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
    createDialogOpen,
    setCreateDialogOpen,

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
