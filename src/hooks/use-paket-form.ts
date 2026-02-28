import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  speed: z.number().min(1, "Minimal 1 Mbps"),
  price: z.number().min(1, "Harga minimal 1"),
});

export type PaketFormValues = z.infer<typeof schema>;

interface UsePaketFormOptions {
  initialValues?: PaketFormValues;
  onSubmit: (values: PaketFormValues) => Promise<void>;
}

export function usePaketForm({ initialValues, onSubmit }: UsePaketFormOptions) {
  const form = useForm<PaketFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues ?? { name: "", speed: 0, price: 0 },
  });

  useEffect(() => {
    if (initialValues) form.reset(initialValues);
  }, [initialValues, form]);

  const handleSubmit = async (values: PaketFormValues) => {
    await onSubmit(values);
    if (!initialValues) form.reset({ name: "", speed: 0, price: 0 });
  };

  return {
    form,
    handleSubmit,
  };
}
