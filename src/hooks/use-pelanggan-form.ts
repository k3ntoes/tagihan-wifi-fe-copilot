import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  package_id: z.string().min(1, "Paket wajib dipilih"),
  monthly_fee: z.number().min(1, "Biaya minimal 1"),
});

export type PelangganFormValues = z.infer<typeof schema>;

interface UsePelangganFormOptions {
  initialValues?: PelangganFormValues;
  onSubmit: (values: PelangganFormValues) => Promise<void>;
}

export function usePelangganForm({
  initialValues,
  onSubmit,
}: UsePelangganFormOptions) {
  const form = useForm<PelangganFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues ?? {
      name: "",
      package_id: "",
      monthly_fee: 0,
    },
  });

  useEffect(() => {
    if (initialValues) form.reset(initialValues);
  }, [initialValues, form]);

  const handleSubmit = async (values: PelangganFormValues) => {
    await onSubmit(values);
    if (!initialValues)
      form.reset({ name: "", package_id: "", monthly_fee: 0 });
  };

  return {
    form,
    handleSubmit,
  };
}
