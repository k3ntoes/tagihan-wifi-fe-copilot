import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  customer_id: z.string().min(1, "Pelanggan wajib dipilih"),
  payment_date: z.string().min(1, "Tanggal wajib diisi"),
  billing_month: z.number().min(1, "Min 1").max(12, "Max 12"),
  billing_year: z.number().min(2020, "Minimal 2020"),
  amount: z.number().min(1, "Jumlah minimal 1"),
});

export type PembayaranFormValues = z.infer<typeof schema>;

interface UsePembayaranFormOptions {
  onSubmit: (payload: PembayaranFormValues) => Promise<void>;
}

export function usePembayaranForm({ onSubmit }: UsePembayaranFormOptions) {
  const today = new Date().toISOString().split("T")[0] ?? "";

  const form = useForm<PembayaranFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_id: "",
      payment_date: today,
      billing_month: new Date().getMonth() + 1,
      billing_year: new Date().getFullYear(),
      amount: 0,
    },
  });

  const handleSubmit = async (values: PembayaranFormValues) => {
    await onSubmit(values);
    form.reset({
      customer_id: "",
      payment_date: today,
      billing_month: new Date().getMonth() + 1,
      billing_year: new Date().getFullYear(),
      amount: 0,
    });
  };

  return {
    form,
    handleSubmit,
  };
}
