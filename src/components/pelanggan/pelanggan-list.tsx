"use client";

import { Banknote, Plus, Users, Wifi } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePelangganList } from "@/hooks/use-pelanggan-list";
import { formatCurrency } from "@/lib/number_helper";
import { PelangganForm } from "./pelanggan-form";

export function PelangganList() {
  const {
    search,
    editItem,
    setEditItem,
    createDialogOpen,
    setCreateDialogOpen,
    customersQuery,
    packagesQuery,
    createCustomer,
    updateCustomer,
    handleCreate,
    handleUpdate,
    handleSearch,
    handlePreviousPage,
    handleNextPage,
    columns,
  } = usePelangganList();

  const customers = customersQuery.data?.data ?? [];
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.monthlyFee, 0);
  const avgFee = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pelanggan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data pelanggan dan paket layanan mereka
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Pelanggan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
              <DialogDescription>
                Daftarkan pelanggan baru dengan nama, paket, dan biaya bulanan.
              </DialogDescription>
            </DialogHeader>
            <PelangganForm
              packages={packagesQuery.data?.data ?? []}
              loading={createCustomer.isPending}
              onSubmit={handleCreate}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pelanggan
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">pelanggan terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <Banknote className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">per bulan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Biaya
            </CardTitle>
            <Wifi className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(avgFee)}
            </div>
            <p className="text-xs text-muted-foreground">per pelanggan</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelanggan</CardTitle>
          <CardDescription>
            Semua pelanggan yang terdaftar beserta paket layanan mereka.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTableSearch
            value={search}
            onChange={handleSearch}
            placeholder="Cari pelanggan..."
          />

          <DataTable
            columns={columns}
            data={customers}
            meta={customersQuery.data?.meta}
            isLoading={customersQuery.isLoading}
            isError={customersQuery.isError}
            refetch={() => customersQuery.refetch()}
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
            <DialogTitle>Edit Pelanggan</DialogTitle>
            <DialogDescription>
              Ubah informasi pelanggan yang sudah ada.
            </DialogDescription>
          </DialogHeader>
          {editItem && (
            <PelangganForm
              key={editItem.id}
              packages={packagesQuery.data?.data ?? []}
              initialValues={{
                name: editItem.name,
                package_id: editItem.package.id,
                monthly_fee: editItem.monthlyFee,
              }}
              loading={updateCustomer.isPending}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
