"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSearch } from "@/components/data-table/data-table-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
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
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>

      <UserForm loading={createUser.isPending} onSubmit={handleCreateUser} />

      <ChangePasswordForm
        loading={changePassword.isPending}
        onSubmit={handleChangePassword}
      />

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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
          </SheetHeader>
          {editItem && (
            <div className="mt-4">
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
