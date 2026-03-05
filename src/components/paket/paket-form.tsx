"use client";

import { Banknote, Loader2, PackageIcon, Plus, Save, Wifi } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { type PaketFormValues, usePaketForm } from "@/hooks/use-paket-form";

interface PaketFormProps {
  initialValues?: PaketFormValues;
  onSubmit: (values: PaketFormValues) => Promise<void>;
  loading?: boolean;
}

export function PaketForm({
  initialValues,
  onSubmit,
  loading,
}: PaketFormProps) {
  const { form, handleSubmit } = usePaketForm({ initialValues, onSubmit });
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
                <PackageIcon className="h-4 w-4 text-primary" />
                Nama Paket
              </FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Paket Bronze" {...field} />
              </FormControl>
              <FormDescription>
                Nama unik untuk mengidentifikasi paket ini.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="speed"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-blue-500" />
                  Kecepatan
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: 20"
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>Dalam satuan Mbps.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-emerald-500" />
                  Harga
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Contoh: 150000"
                    type="number"
                    min={1}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>Harga per bulan (Rp).</FormDescription>
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
              Update Paket
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Simpan Paket
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
