"use client";

import {
  CheckCircle2,
  Key,
  Loader2,
  Plus,
  Save,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableSearch } from "@/components/data-table/data-table-search";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  type EditUserValues,
  useEditUserForm,
  useUserList,
} from "@/hooks/use-user-list";
import type { User as UserType } from "@/types/api";
import { ChangePasswordForm } from "./change-password-form";
import { UserForm } from "./user-form";

function EditUserForm({
  user,
  onSubmit,
  loading,
}: {
  user: UserType;
  onSubmit: (values: EditUserValues) => Promise<void>;
  loading?: boolean;
}) {
  const form = useEditUserForm(user);

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Username
              </FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormDescription>Minimal 3 karakter.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-500" />
                Role
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Hak akses pengguna dalam sistem.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Aktif</FormLabel>
                <FormDescription>
                  User yang tidak aktif tidak dapat login ke sistem.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Separator />
        <Button type="submit" disabled={loading} className="w-full gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Update User
            </>
          )}
        </Button>
      </form>
    </Form>
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

  const users = usersQuery.data?.data ?? [];
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  return (
    <section className="space-y-6">
      {/* Header */}
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">pengguna terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Aktif</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              dari {totalUsers} pengguna
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {adminUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              pengguna dengan hak admin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar User</CardTitle>
          <CardDescription>
            Semua pengguna yang terdaftar beserta role dan status mereka.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editItem !== null}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Ubah informasi user yang sudah ada.
            </DialogDescription>
          </DialogHeader>
          {editItem && (
            <EditUserForm
              key={editItem.id}
              user={editItem}
              loading={updateUser.isPending}
              onSubmit={handleUpdateUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
