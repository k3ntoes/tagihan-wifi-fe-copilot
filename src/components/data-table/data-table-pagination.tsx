"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

interface DataTablePaginationProps {
  meta?: PaginationMeta;
  onPrevious: () => void;
  onNext: () => void;
  onFirst?: () => void;
  onLast?: () => void;
}

export function DataTablePagination({
  meta,
  onPrevious,
  onNext,
  onFirst,
  onLast,
}: DataTablePaginationProps) {
  if (!meta) {
    return null;
  }

  const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.perPage + 1;
  const endItem = Math.min(meta.page * meta.perPage, meta.total);

  return (
    <div className="flex items-center justify-between border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Menampilkan{" "}
        <span className="font-medium text-foreground">
          {startItem}–{endItem}
        </span>{" "}
        dari{" "}
        <span className="font-medium text-foreground">{meta.total}</span> data
      </p>

      <div className="flex items-center gap-1">
        {onFirst && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onFirst}
            disabled={!meta.hasPrev}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2.5"
          onClick={onPrevious}
          disabled={!meta.hasPrev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>

        <div className="flex items-center gap-1 px-2">
          <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground">
            {meta.page}
          </span>
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs text-muted-foreground">
            {meta.totalPages}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2.5"
          onClick={onNext}
          disabled={!meta.hasNext}
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        {onLast && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={onLast}
            disabled={!meta.hasNext}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
