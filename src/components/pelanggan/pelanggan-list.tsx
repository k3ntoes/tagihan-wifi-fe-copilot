"use client";

import { Plus } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePelangganList } from "@/hooks/use-pelanggan-list";
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

  return (
    <section className="space-y-6">
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

      <DataTableSearch
        value={search}
        onChange={handleSearch}
        placeholder="Cari pelanggan..."
      />

      <DataTable
        columns={columns}
        data={customersQuery.data?.data ?? []}
        meta={customersQuery.data?.meta}
        isLoading={customersQuery.isLoading}
        isError={customersQuery.isError}
        refetch={() => customersQuery.refetch()}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />

      <Sheet
        open={editItem !== null}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <SheetContent className="sm:max-w-125">
          <SheetHeader>
            <SheetTitle>Edit Pelanggan</SheetTitle>
            <SheetDescription>
              Ubah informasi pelanggan yang sudah ada.
            </SheetDescription>
          </SheetHeader>
          {editItem && (
            <div className="mt-6">
              <PelangganForm
                packages={packagesQuery.data?.data ?? []}
                initialValues={{
                  name: editItem.name,
                  package_id: editItem.package.id,
                  monthly_fee: editItem.monthlyFee,
                }}
                loading={updateCustomer.isPending}
                onSubmit={handleUpdate}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
