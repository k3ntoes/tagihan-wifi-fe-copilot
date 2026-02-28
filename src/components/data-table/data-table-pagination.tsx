"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

interface DataTablePaginationProps {
  meta?: PaginationMeta;
  onPrevious: () => void;
  onNext: () => void;
}

export function DataTablePagination({
  meta,
  onPrevious,
  onNext,
}: DataTablePaginationProps) {
  if (!meta) {
    return null;
  }

  const startItem = (meta.page - 1) * meta.perPage + 1;
  const endItem = Math.min(meta.page * meta.perPage, meta.total);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-700">
          Menampilkan {startItem} - {endItem} dari {meta.total} data
        </p>
        <p className="text-xs text-muted-foreground">
          Halaman {meta.page} dari {meta.totalPages}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={onPrevious}
          disabled={!meta.hasPrev}
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={onNext}
          disabled={!meta.hasNext}
        >
          Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
