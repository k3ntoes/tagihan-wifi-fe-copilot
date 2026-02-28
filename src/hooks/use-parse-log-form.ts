import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const schema = z.object({
  log_entry: z.string().min(1, "Log entry wajib diisi"),
});

export type ParseLogFormValues = z.infer<typeof schema>;

interface UseParseLogFormOptions {
  onSubmit: (payload: ParseLogFormValues) => Promise<void>;
}

export function useParseLogForm({ onSubmit }: UseParseLogFormOptions) {
  const form = useForm<ParseLogFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      log_entry: "",
    },
  });

  const handleSubmit = async (values: ParseLogFormValues) => {
    await onSubmit(values);
    form.reset({ log_entry: "" });
  };

  return {
    form,
    handleSubmit,
  };
}
