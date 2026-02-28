import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["admin", "user"]),
});

export type UserFormValues = z.infer<typeof schema>;

interface UseUserFormOptions {
  onSubmit: (payload: UserFormValues) => Promise<void>;
}

export function useUserForm({ onSubmit }: UseUserFormOptions) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "", role: "user" },
  });

  const handleSubmit = async (values: UserFormValues) => {
    await onSubmit(values);
    form.reset({ username: "", password: "", role: "user" });
  };

  return {
    form,
    handleSubmit,
  };
}
