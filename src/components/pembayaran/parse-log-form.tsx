"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  type ParseLogFormValues,
  useParseLogForm,
} from "@/hooks/use-parse-log-form";

interface ParseLogFormProps {
  onSubmit: (payload: ParseLogFormValues) => Promise<void>;
  loading?: boolean;
}

export function ParseLogForm({ onSubmit, loading }: ParseLogFormProps) {
  const { form, handleSubmit } = useParseLogForm({ onSubmit });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="log_entry"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Contoh: 05-02-2026 PT Mitra Bisnis"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
          type="submit"
          disabled={loading}
        >
          {loading ? "Memproses..." : "Parse Log"}
        </Button>
      </form>
    </Form>
  );
}
