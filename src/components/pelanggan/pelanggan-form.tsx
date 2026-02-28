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
  type PelangganFormValues,
  usePelangganForm,
} from "@/hooks/use-pelanggan-form";
import type { Package } from "@/types/api";

interface PelangganFormProps {
  packages: Package[];
  initialValues?: PelangganFormValues;
  onSubmit: (values: PelangganFormValues) => Promise<void>;
  loading?: boolean;
}

export function PelangganForm({
  packages,
  initialValues,
  onSubmit,
  loading,
}: PelangganFormProps) {
  const { form, handleSubmit } = usePelangganForm({ initialValues, onSubmit });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Pelanggan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="package_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Paket</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih paket" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name}
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
          name="monthly_fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biaya Bulanan (Rp)</FormLabel>
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
          ) : initialValues ? (
            "Update Pelanggan"
          ) : (
            "Simpan Pelanggan"
          )}
        </Button>
      </form>
    </Form>
  );
}
