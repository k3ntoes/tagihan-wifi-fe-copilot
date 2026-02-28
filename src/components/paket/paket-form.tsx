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

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Paket</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Paket Bronze" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="speed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kecepatan (Mbps)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: 20"
                  type="number"
                  min={1}
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga (Rp)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: 150000"
                  type="number"
                  min={1}
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
            "Update Paket"
          ) : (
            "Simpan Paket"
          )}
        </Button>
      </form>
    </Form>
  );
}
