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
      <form
        className="grid grid-cols-1 gap-3 md:grid-cols-3"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="old_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" placeholder="Password lama" {...field} />
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
              <FormControl>
                <Input type="password" placeholder="Password baru" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={loading}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Ganti Password"}
        </Button>
      </form>
    </Form>
  );
}
