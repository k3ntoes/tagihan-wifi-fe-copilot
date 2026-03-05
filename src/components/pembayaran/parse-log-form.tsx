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
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="log_entry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Log Entry</FormLabel>
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
        <Button type="submit" disabled={loading} className="w-full gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            "Parse Log"
          )}
        </Button>
      </form>
    </Form>
  );
}
