import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BillingMatrixFiltersProps {
  year: number;
  search: string;
  onYearChange: (delta: number) => void;
  onSearchChange: (value: string) => void;
}

export function BillingMatrixFilters({
  year,
  search,
  onYearChange,
  onSearchChange,
}: BillingMatrixFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Input
        className="max-w-sm"
        placeholder="Cari pelanggan..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onYearChange(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {year}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onYearChange(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
