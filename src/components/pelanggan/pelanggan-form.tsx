"use client";

import { Banknote, Loader2, PackageIcon, Plus, Save, User } from "lucide-react";
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
  const isEdit = !!initialValues;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Nama Pelanggan
              </FormLabel>
              <FormControl>
                <Input placeholder="Contoh: John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Nama lengkap pelanggan yang akan didaftarkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="package_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <PackageIcon className="h-4 w-4 text-purple-500" />
                  Paket
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selected = packages.find((pkg) => pkg.id === value);
                    if (selected) {
                      form.setValue("monthly_fee", selected.price);
                    }
                  }}
                  value={field.value}
                >
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
                <FormDescription>Biaya otomatis mengikuti harga paket.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="monthly_fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-emerald-500" />
                  Biaya Bulanan
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
                <FormDescription>Biaya per bulan (Rp).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
              Update Pelanggan
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Simpan Pelanggan
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
