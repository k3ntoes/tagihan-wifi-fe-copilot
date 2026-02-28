"use client";

import { Key, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSearch } from "@/components/data-table/data-table-search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEditUserForm, useUserList } from "@/hooks/use-user-list";
import type { User } from "@/types/api";
import { ChangePasswordForm } from "./change-password-form";
import { UserForm } from "./user-form";

function EditUserForm({
  user,
  onSubmit,
  loading,
}: {
  user: User;
  onSubmit: (values: {
    username: string;
    role: "admin" | "user";
    is_active: boolean;
  }) => Promise<void>;
  loading?: boolean;
}) {
  const form = useEditUserForm(user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1">
        <label htmlFor="edit-username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="edit-username"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-xs text-rose-600">{errors.username.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="edit-role" className="text-sm font-medium">
          Role
        </label>
        <select
          id="edit-role"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          {...register("role")}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_active" {...register("is_active")} />
        <label htmlFor="is_active" className="text-sm">
          Aktif
        </label>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Update User"}
      </Button>
    </form>
  );
}

export function UserList() {
  const {
    search,
    editItem,
    setEditItem,
    createDialogOpen,
    setCreateDialogOpen,
    changePasswordDialogOpen,
    setChangePasswordDialogOpen,
    usersQuery,
    visibleUsers,
    createUser,
    updateUser,
    changePassword,
    handleCreateUser,
    handleUpdateUser,
    handleChangePassword,
    handleSearch,
    handlePreviousPage,
    handleNextPage,
    columns,
  } = useUserList();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola akun pengguna dan hak akses sistem
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
                <DialogDescription>
                  Buat akun pengguna baru dengan username, password, dan role.
                </DialogDescription>
              </DialogHeader>
              <UserForm
                loading={createUser.isPending}
                onSubmit={handleCreateUser}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={changePasswordDialogOpen}
            onOpenChange={setChangePasswordDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Key className="h-4 w-4" />
                Ganti Password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Ganti Password</DialogTitle>
                <DialogDescription>
                  Perbarui password akun Anda untuk keamanan yang lebih baik.
                </DialogDescription>
              </DialogHeader>
              <ChangePasswordForm
                loading={changePassword.isPending}
                onSubmit={handleChangePassword}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <DataTableSearch
        value={search}
        onChange={handleSearch}
        placeholder="Cari user..."
      />

      <DataTable
        columns={columns}
        data={visibleUsers}
        meta={usersQuery.data?.meta}
        isLoading={usersQuery.isLoading}
        isError={usersQuery.isError}
        refetch={() => usersQuery.refetch()}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />

      <Sheet
        open={editItem !== null}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <SheetContent className="sm:max-w-125">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Ubah informasi user yang sudah ada.
            </SheetDescription>
          </SheetHeader>
          {editItem && (
            <div className="mt-6">
              <EditUserForm
                user={editItem}
                loading={updateUser.isPending}
                onSubmit={handleUpdateUser}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
