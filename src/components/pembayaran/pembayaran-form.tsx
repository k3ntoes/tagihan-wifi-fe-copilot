"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  type PembayaranFormValues,
  usePembayaranForm,
} from "@/hooks/use-pembayaran-form";
import type { Customer } from "@/types/api";

interface PembayaranFormProps {
  customers: Customer[];
  onSubmit: (payload: PembayaranFormValues) => Promise<void>;
  loading?: boolean;
}

export function PembayaranForm({
  customers,
  onSubmit,
  loading,
}: PembayaranFormProps) {
  const { form, handleSubmit } = usePembayaranForm({ onSubmit });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pelanggan</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Pembayaran</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
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
                <FormLabel>Bulan Tagihan</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billing_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun Tagihan</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={2020}
                    placeholder="Contoh: 2026"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
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
              <FormLabel>Jumlah (Rp)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Contoh: 200000"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Pembayaran"
          )}
        </Button>
      </form>
    </Form>
  );
}
