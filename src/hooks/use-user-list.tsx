import { zodResolver } from "@hookform/resolvers/zod";
import type { ColumnDef } from "@tanstack/react-table";
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

  const handleDeleteUser = async (id: string) => {
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
    { accessorKey: "username", header: "Username" },
    { accessorKey: "role", header: "Role" },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-700">
            Active
          </span>
        ) : (
          <span className="rounded bg-rose-100 px-2 py-0.5 text-rose-700">
            Inactive
          </span>
        ),
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
                <AlertDialogTitle>Hapus User?</AlertDialogTitle>
                <AlertDialogDescription>
                  User &ldquo;{row.original.username}&rdquo; akan dihapus secara
                  permanen.
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
