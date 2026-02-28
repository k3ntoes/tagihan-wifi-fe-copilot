"use client";

import { FileText, Plus } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePembayaranList } from "@/hooks/use-pembayaran-list";
import { ParseLogForm } from "./parse-log-form";
import { PembayaranForm } from "./pembayaran-form";

export function PembayaranList() {
  const {
    filterCustomerId,
    filterYear,
    filterMonth,
    createDialogOpen,
    setCreateDialogOpen,
    parseDialogOpen,
    setParseDialogOpen,
    paymentsQuery,
    customersQuery,
    createPayment,
    parseLog,
    handleCreatePayment,
    handleParseLog,
    handleCustomerFilterChange,
    handleYearFilterChange,
    handleMonthFilterChange,
    handleResetFilters,
    handlePreviousPage,
    handleNextPage,
    yearOptions,
    months,
    columns,
  } = usePembayaranList();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pembayaran</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Catat pembayaran pelanggan dan parse log pembayaran
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Pembayaran
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Catat Pembayaran Baru</DialogTitle>
                <DialogDescription>
                  Catat penerimaan pembayaran dari pelanggan untuk periode
                  tertentu.
                </DialogDescription>
              </DialogHeader>
              <PembayaranForm
                customers={customersQuery.data?.data ?? []}
                loading={createPayment.isPending}
                onSubmit={handleCreatePayment}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={parseDialogOpen} onOpenChange={setParseDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Parse Log
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
              <DialogHeader>
                <DialogTitle>Parse Log Pembayaran</DialogTitle>
                <DialogDescription>
                  Salin dan tempel log pembayaran untuk diparse secara otomatis.
                </DialogDescription>
              </DialogHeader>
              <ParseLogForm
                loading={parseLog.isPending}
                onSubmit={handleParseLog}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          value={filterCustomerId}
          onChange={(e) => handleCustomerFilterChange(e.target.value)}
        >
          <option value="">📋 Semua Pelanggan</option>
          {(customersQuery.data?.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          value={filterYear}
          onChange={(e) => handleYearFilterChange(e.target.value)}
        >
          <option value="">📅 Semua Tahun</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          value={filterMonth}
          onChange={(e) => handleMonthFilterChange(e.target.value)}
        >
          <option value="">🗓️ Semua Bulan</option>
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {(filterCustomerId || filterYear || filterMonth) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-sm"
            onClick={handleResetFilters}
          >
            Reset Filter
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={paymentsQuery.data?.data ?? []}
        meta={paymentsQuery.data?.meta}
        isLoading={paymentsQuery.isLoading}
        isError={paymentsQuery.isError}
        refetch={() => paymentsQuery.refetch()}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </section>
  );
}
