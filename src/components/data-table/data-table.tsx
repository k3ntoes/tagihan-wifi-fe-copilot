"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaginationMeta } from "@/types/api";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  isError?: boolean;
  refetch?: () => void;
  emptyMessage?: string;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
}

export function DataTable<TData>({
  columns,
  data,
  meta,
  isLoading,
  isError,
  refetch,
  emptyMessage = "Tidak ada data.",
  onPreviousPage,
  onNextPage,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    {columns.map((_, j) => (
                      <td key={`skel-cell-${j}`} className="px-4 py-3">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8">
                    <div className="flex items-center justify-center gap-2 text-rose-600">
                      <AlertCircle className="h-5 w-5" />
                      <span>Gagal memuat data.</span>
                      {refetch && (
                        <button
                          type="button"
                          className="underline hover:text-rose-700"
                          onClick={refetch}
                        >
                          Coba lagi
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-zinc-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DataTablePagination
        meta={meta}
        onPrevious={onPreviousPage ?? (() => undefined)}
        onNext={onNextPage ?? (() => undefined)}
      />
    </div>
  );
}
