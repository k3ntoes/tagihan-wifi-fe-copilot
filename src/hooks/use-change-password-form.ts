import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  old_password: z.string().min(1, "Password lama wajib diisi"),
  new_password: z.string().min(6, "Password baru minimal 6 karakter"),
});

export type ChangePasswordFormValues = z.infer<typeof schema>;

interface UseChangePasswordFormOptions {
  onSubmit: (payload: ChangePasswordFormValues) => Promise<void>;
}

export function useChangePasswordForm({
  onSubmit,
}: UseChangePasswordFormOptions) {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      old_password: "",
      new_password: "",
    },
  });

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    await onSubmit(values);
    form.reset({
      old_password: "",
      new_password: "",
    });
  };

  return {
    form,
    handleSubmit,
  };
}
