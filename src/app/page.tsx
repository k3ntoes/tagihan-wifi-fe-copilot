import { PublicBillingMatrix } from "@/components/app/public-billing-matrix";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <main className="mx-auto w-full max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">
            Dashboard Tagihan WiFi
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Ringkasan pembayaran tahunan pelanggan.
          </p>
        </div>
        <PublicBillingMatrix />
      </main>
    </div>
  );
}
