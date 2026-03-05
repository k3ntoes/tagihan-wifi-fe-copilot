import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BillingMatrixMeta } from "@/types/billing";

interface BillingMatrixPaginationProps {
    meta: BillingMatrixMeta | undefined;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export function BillingMatrixPagination({
    meta,
    currentPage,
    onPageChange,
}: BillingMatrixPaginationProps) {
    return (
        <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
                Halaman{" "}
                <span className="font-medium text-foreground">
                    {meta?.page ?? currentPage}
                </span>{" "}
                dari{" "}
                <span className="font-medium text-foreground">
                    {meta?.totalPages ?? 1}
                </span>
            </p>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    disabled={!meta?.hasPrev}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    disabled={!meta?.hasNext}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
