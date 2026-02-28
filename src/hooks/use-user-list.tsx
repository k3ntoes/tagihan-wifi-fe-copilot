import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  Edit,
  Shield,
  ShieldCheck,
  Trash2,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
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
import {
  useChangePassword,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/services/user-service";
import type { User } from "@/types/api";

const editUserSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  role: z.enum(["admin", "user"]),
  is_active: z.boolean(),
});
export type EditUserValues = z.infer<typeof editUserSchema>;

export function useUserList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<User | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
    useState(false);

  const usersQuery = useUsers({ page, perPage: 10 });
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const changePassword = useChangePassword();

  const handleCreateUser = async (payload: {
    username: string;
    password: string;
    role: "admin" | "user";
  }) => {
    try {
      await createUser.mutateAsync(payload);
      toast.success("User berhasil dibuat.");
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat user.",
      );
    }
  };

  const handleUpdateUser = async (values: EditUserValues) => {
    if (!editItem) return;
    try {
      await updateUser.mutateAsync({
        id: editItem.id,
        ...values,
      });
      toast.success("User berhasil diupdate.");
      setEditItem(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupdate user.",
      );
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser.mutateAsync(id);
      toast.success("User dihapus.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus user.",
      );
    }
  };

  const handleChangePassword = async (payload: {
    old_password: string;
    new_password: string;
  }) => {
    try {
      await changePassword.mutateAsync(payload);
      toast.success("Password berhasil diubah.");
      setChangePasswordDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengubah password.",
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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <UserIcon className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.original.username}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.role === "admin" ? (
            <>
              <ShieldCheck className="h-4 w-4 text-purple-500" />
              <span className="font-semibold text-purple-600">Admin</span>
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="font-semibold text-blue-600">User</span>
            </>
          )}
        </div>
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
                <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                <AlertDialogDescription>
                  User &ldquo;{row.original.username}&rdquo; akan dihapus secara
                  permanen. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-rose-600 hover:bg-rose-700"
                  onClick={() => handleDeleteUser(row.original.id)}
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

  const visibleUsers = search
    ? (usersQuery.data?.data ?? []).filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase()),
    )
    : (usersQuery.data?.data ?? []);

  return {
    // State
    search,
    editItem,
    setEditItem,
    createDialogOpen,
    setCreateDialogOpen,
    changePasswordDialogOpen,
    setChangePasswordDialogOpen,

    // Queries
    usersQuery,
    visibleUsers,

    // Mutations
    createUser,
    updateUser,
    changePassword,

    // Handlers
    handleCreateUser,
    handleUpdateUser,
    handleChangePassword,
    handleSearch,
    handlePreviousPage,
    handleNextPage,

    // Columns
    columns,
  };
}

export function useEditUserForm(user: User) {
  const form = useForm<EditUserValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: user.username,
      role: user.role,
      is_active: user.isActive,
    },
  });

  return form;
}
