"use client";

import { KeyRound, Loader2, Plus, ShieldCheck, User } from "lucide-react";
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
import { type UserFormValues, useUserForm } from "@/hooks/use-user-form";

interface UserFormProps {
  onSubmit: (payload: UserFormValues) => Promise<void>;
  loading?: boolean;
}

export function UserForm({ onSubmit, loading }: UserFormProps) {
  const { form, handleSubmit } = useUserForm({ onSubmit });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Username
              </FormLabel>
              <FormControl>
                <Input placeholder="Contoh: johndoe" {...field} />
              </FormControl>
              <FormDescription>Minimal 3 karakter, harus unik.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-amber-500" />
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Gunakan kombinasi huruf dan angka.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-500" />
                Role
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Admin memiliki akses penuh ke sistem.
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
              Menyimpan...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Tambah User
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
