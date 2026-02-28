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
import { usePaketList } from "@/hooks/use-paket-list";
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

  return (
    <section className="space-y-6">
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

      <DataTableSearch
        value={search}
        onChange={handleSearch}
        placeholder="Cari paket..."
      />

      <DataTable
        columns={columns}
        data={packagesQuery.data?.data ?? []}
        meta={packagesQuery.data?.meta}
        isLoading={packagesQuery.isLoading}
        isError={packagesQuery.isError}
        refetch={() => packagesQuery.refetch()}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />

      <Sheet
        open={editItem !== null}
        onOpenChange={(open) => !open && setEditItem(null)}
      >
        <SheetContent className="sm:max-w-125">
          <SheetHeader>
            <SheetTitle>Edit Paket</SheetTitle>
            <SheetDescription>
              Ubah informasi paket internet yang sudah ada.
            </SheetDescription>
          </SheetHeader>
          {editItem && (
            <div className="mt-6">
              <PaketForm
                initialValues={{
                  name: editItem.name,
                  speed: editItem.speed,
                  price: editItem.price,
                }}
                loading={updatePackage.isPending}
                onSubmit={handleUpdate}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
