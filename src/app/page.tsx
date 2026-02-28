import { Wifi } from "lucide-react";
import Link from "next/link";
import { PublicBillingMatrix } from "@/components/app/public-billing-matrix";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100">
      {/* Hero Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Wifi className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Tagihan WiFi
            </span>
          </div>
          <Button asChild size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-8 md:py-8">
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Tagihan WiFi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan pembayaran tahunan pelanggan
          </p>
        </div>

        <PublicBillingMatrix />
      </main>
    </div>
  );
}
