"use client";

import { PackageIcon, Plus, Wifi, Zap } from "lucide-react";
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
import { usePaketList } from "@/hooks/use-paket-list";
import { formatCurrency } from "@/lib/number_helper";
import { PaketForm } from "./paket-form";

export function PaketList() {
  const {
    search,
    editItem,
    setEditItem,
    createDialogOpen,
    setCreateDialogOpen,
    packagesQuery,
    createPackage,
    updatePackage,
    handleCreate,
    handleUpdate,
    handleSearch,
    handlePreviousPage,
    handleNextPage,
    columns,
  } = usePaketList();

  const packages = packagesQuery.data?.data ?? [];
  const totalPackages = packages.length;
  const activePackages = packages.filter((p) => p.isActive).length;
  const avgPrice =
    totalPackages > 0
      ? packages.reduce((sum, p) => sum + p.price, 0) / totalPackages
      : 0;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paket Internet</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola paket internet untuk pelanggan Anda
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Paket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Tambah Paket Baru</DialogTitle>
              <DialogDescription>
                Buat paket internet baru dengan nama, kecepatan, dan harga.
              </DialogDescription>
            </DialogHeader>
            <PaketForm
              loading={createPackage.isPending}
              onSubmit={handleCreate}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paket</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
            <p className="text-xs text-muted-foreground">
              paket terdaftar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paket Aktif</CardTitle>
            <Wifi className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {activePackages}
            </div>
            <p className="text-xs text-muted-foreground">
              dari {totalPackages} paket
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Harga</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(avgPrice)}
            </div>
            <p className="text-xs text-muted-foreground">
              per paket
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Paket</CardTitle>
          <CardDescription>
            Semua paket internet yang tersedia untuk pelanggan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DataTableSearch
            value={search}
            onChange={handleSearch}
            placeholder="Cari paket..."
          />

          <DataTable
            columns={columns}
            data={packages}
            meta={packagesQuery.data?.meta}
            isLoading={packagesQuery.isLoading}
            isError={packagesQuery.isError}
            refetch={() => packagesQuery.refetch()}
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
            <DialogTitle>Edit Paket</DialogTitle>
            <DialogDescription>
              Ubah informasi paket internet yang sudah ada.
            </DialogDescription>
          </DialogHeader>
          {editItem && (
            <PaketForm
              key={editItem.id}
              initialValues={{
                name: editItem.name,
                speed: editItem.speed,
                price: editItem.price,
              }}
              loading={updatePackage.isPending}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
