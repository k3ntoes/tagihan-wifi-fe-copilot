"use client";

import {
  Banknote,
  Calendar,
  CalendarDays,
  Hash,
  Loader2,
  Plus,
  Save,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  type PembayaranFormValues,
  usePembayaranForm,
} from "@/hooks/use-pembayaran-form";
import type { Customer } from "@/types/api";

interface PembayaranFormProps {
  customers: Customer[];
  initialValues?: PembayaranFormValues;
  onSubmit: (payload: PembayaranFormValues) => Promise<void>;
  loading?: boolean;
}

export function PembayaranForm({
  customers,
  initialValues,
  onSubmit,
  loading,
}: PembayaranFormProps) {
  const { form, handleSubmit } = usePembayaranForm({ initialValues, onSubmit });
  const isEdit = !!initialValues;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Pelanggan
              </FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  const selected = customers.find((c) => c.id === value);
                  if (selected) {
                    form.setValue("amount", selected.monthlyFee);
                  }
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pelanggan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Jumlah otomatis mengikuti biaya bulanan pelanggan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                Tanggal Pembayaran
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>Tanggal uang diterima.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="billing_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-purple-500" />
                  Bulan Tagihan
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={12}
                    placeholder="1-12"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>Bulan (1–12).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billing_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-amber-500" />
                  Tahun Tagihan
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={2020}
                    placeholder="Contoh: 2026"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>Tahun periode tagihan.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Banknote className="h-4 w-4 text-emerald-500" />
                Jumlah
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Contoh: 200000"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>Jumlah pembayaran (Rp).</FormDescription>
              <FormMessage />
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
          ) : isEdit ? (
            <>
              <Save className="h-4 w-4" />
              Update Pembayaran
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Simpan Pembayaran
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
