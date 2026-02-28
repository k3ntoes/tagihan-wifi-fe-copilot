import { AlertCircle } from "lucide-react";

interface BillingMatrixErrorProps {
    error: Error | null;
    onRetry: () => void;
}

export function BillingMatrixError({
    error,
    onRetry,
}: BillingMatrixErrorProps) {
    return (
        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
            <AlertCircle className="h-4 w-4" />
            <span>
                {error instanceof Error ? error.message : "Gagal memuat data."}
            </span>
            <button type="button" className="underline" onClick={onRetry}>
                Coba lagi
            </button>
        </div>
    );
}
