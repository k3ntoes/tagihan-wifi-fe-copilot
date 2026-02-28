import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Edit,
  PackageIcon,
  Trash2,
  Wifi,
  XCircle,
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
import { formatCurrency } from "@/lib/number_helper";
import {
  useCreatePackage,
  useDeletePackage,
  usePackages,
  useUpdatePackage,
} from "@/services/package-service";
import type { CreatePackagePayload, Package } from "@/types/api";

export function usePaketList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<Package | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const packagesQuery = usePackages({ page, perPage: 10, search });
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const deletePackage = useDeletePackage();

  const handleCreate = async (values: CreatePackagePayload) => {
    try {
      await createPackage.mutateAsync(values);
      toast.success("Paket berhasil dibuat.");
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat paket.",
      );
    }
  };

  const handleUpdate = async (values: CreatePackagePayload) => {
    if (!editItem) return;
    try {
      await updatePackage.mutateAsync({
        id: editItem.id,
        ...values,
      });
      toast.success("Paket berhasil diupdate.");
      setEditItem(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupdate paket.",
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePackage.mutateAsync(id);
      toast.success("Paket dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus paket.",
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

  const columns: ColumnDef<Package>[] = [
    {
      accessorKey: "name",
      header: "Nama Paket",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <PackageIcon className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "speed",
      header: "Kecepatan",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-blue-600">
            {row.original.speed} Mbps
          </span>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Harga",
      cell: ({ row }) => (
        <span className="font-semibold text-emerald-600">
          {formatCurrency(row.original.price)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Aktif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
            <XCircle className="h-3.5 w-3.5" />
            Nonaktif
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
                <AlertDialogTitle>Hapus Paket?</AlertDialogTitle>
                <AlertDialogDescription>
                  Paket &ldquo;{row.original.name}&rdquo; akan dihapus secara
                  permanen. Tindakan ini tidak dapat dibatalkan.
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
    packagesQuery,

    // Mutations
    createPackage,
    updatePackage,

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
