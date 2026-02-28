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
  type ChangePasswordFormValues,
  useChangePasswordForm,
} from "@/hooks/use-change-password-form";

interface ChangePasswordFormProps {
  onSubmit: (payload: ChangePasswordFormValues) => Promise<void>;
  loading?: boolean;
}

export function ChangePasswordForm({
  onSubmit,
  loading,
}: ChangePasswordFormProps) {
  const { form, handleSubmit } = useChangePasswordForm({ onSubmit });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Lama</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Masukkan password lama"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Baru</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Masukkan password baru"
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
            "Ganti Password"
          )}
        </Button>
      </form>
    </Form>
  );
}
