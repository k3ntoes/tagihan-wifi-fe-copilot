"use client";

import { KeyRound, Loader2, Lock, Save } from "lucide-react";
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
              <FormLabel className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                Password Lama
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Masukkan password lama"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Password yang sedang digunakan saat ini.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-500" />
                Password Baru
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Gunakan kombinasi huruf dan angka yang kuat.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <Button type="submit" disabled={loading} className="w-full gap-2">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Ganti Password
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
