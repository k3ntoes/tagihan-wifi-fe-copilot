import { CheckCircle2, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency, formatDate } from "@/lib/number_helper";
import type { BillingMatrixPayment } from "@/types/billing";

interface BillingMatrixCellProps {
  payment: BillingMatrixPayment;
  year: number;
}

export function BillingMatrixCell({ payment, year }: BillingMatrixCellProps) {
  if (payment.paid && payment.paymentDate) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 cursor-default">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Lunas</p>
            <p className="text-xs">Tgl: {formatDate(payment.paymentDate)}</p>
            {payment.amount !== null && (
              <p className="text-xs">
                Jumlah: {formatCurrency(payment.amount)}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700 cursor-default">
            <XCircle className="h-4 w-4" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">Belum Bayar</p>
          <p className="text-xs">
            {payment.monthName} {year}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
