import { CheckCircle2, XCircle } from "lucide-react";

export function BillingMatrixLegend() {
  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
        </span>
        Lunas
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <XCircle className="h-3 w-3" />
        </span>
        Belum Bayar
      </div>
    </div>
  );
}
