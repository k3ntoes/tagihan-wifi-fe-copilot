"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSearch } from "@/components/data-table/data-table-search";
import {
  Sheet,
  SheetContent,
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
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Pelanggan</h1>

      <PelangganForm
        packages={packagesQuery.data?.data ?? []}
        loading={createCustomer.isPending}
        onSubmit={handleCreate}
      />

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
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Pelanggan</SheetTitle>
          </SheetHeader>
          {editItem && (
            <div className="mt-4">
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
