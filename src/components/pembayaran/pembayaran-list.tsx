"use client";

import { Banknote, CreditCard, FileText, Plus, Users } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
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
import { usePembayaranList } from "@/hooks/use-pembayaran-list";
import { formatCurrency } from "@/lib/number_helper";
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
    editItem,
    setEditItem,
    paymentsQuery,
    customersQuery,
    createPayment,
    updatePayment,
    parseLog,
    handleCreatePayment,
    handleUpdatePayment,
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

  const payments = paymentsQuery.data?.data ?? [];
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const uniqueCustomers = new Set(payments.map((p) => p.customer.id)).size;

  return (
    <section className="space-y-6">
      {/* Header */}
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

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pembayaran
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments}</div>
            <p className="text-xs text-muted-foreground">transaksi tercatat</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Penerimaan
            </CardTitle>
            <Banknote className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              dari {totalPayments} transaksi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pelanggan Bayar
            </CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {uniqueCustomers}
            </div>
            <p className="text-xs text-muted-foreground">pelanggan unik</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pembayaran</CardTitle>
          <CardDescription>
            Semua transaksi pembayaran yang tercatat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              value={filterCustomerId}
              onChange={(e) => handleCustomerFilterChange(e.target.value)}
            >
              <option value="">Semua Pelanggan</option>
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
              <option value="">Semua Tahun</option>
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
              <option value="">Semua Bulan</option>
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
            data={payments}
            meta={paymentsQuery.data?.meta}
            isLoading={paymentsQuery.isLoading}
            isError={paymentsQuery.isError}
            refetch={() => paymentsQuery.refetch()}
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
            <DialogTitle>Edit Pembayaran</DialogTitle>
            <DialogDescription>
              Ubah informasi pembayaran yang sudah ada.
            </DialogDescription>
          </DialogHeader>
          {editItem && (
            <PembayaranForm
              key={editItem.id}
              customers={customersQuery.data?.data ?? []}
              initialValues={{
                customer_id: editItem.customer.id,
                payment_date: editItem.paymentDate,
                billing_month: editItem.billingMonth,
                billing_year: editItem.billingYear,
                amount: editItem.amount,
              }}
              loading={updatePayment.isPending}
              onSubmit={handleUpdatePayment}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
