## Plan: UI/UX Improvement — Tagihan WiFi Frontend

Perbaikan menyeluruh pada UI/UX aplikasi tagihan WiFi — dari halaman dashboard yang kosong, state handling yang buruk (loading/error), hingga fitur yang sudah ada di backend tapi belum di-expose ke UI (edit, filter, breadcrumb, dsb.). Semua komponen UI tersedia via shadcn/Tailwind. Form baru menggunakan `react-hook-form` + `zod`.

**Steps**

1. **Dashboard KPI Cards** — Ganti isi `src/app/(dashboard)/dashboard/page.tsx` dengan grid KPI cards: Total Pelanggan Aktif, Pendapatan Bulan Ini, Belum Bayar, Collection Rate. Tambahkan tabel "5 Pelanggan Belum Bayar" menggunakan data dari `useBillingMatrix` dan `useCustomers`.

2. **Skeleton Loading States** — Replace semua `"Memuat data..."` di `src/app/(dashboard)/tagihan/_components/billing-matrix.tsx`, `src/app/(dashboard)/paket/_components/paket-list.tsx`, `src/app/(dashboard)/pelanggan/_components/pelanggan-list.tsx`, `src/app/(dashboard)/pembayaran/_components/pembayaran-list.tsx`, `src/app/(dashboard)/users/_components/user-list.tsx` dengan `<Skeleton>` rows dari `src/components/ui/skeleton.tsx`.

3. **Error States** — Tambahkan blok `isError` di semua list/tabel dengan pesan deskriptif (icon `AlertCircle` + tombol retry `refetch()`). Saat ini hanya `PublicBillingMatrix` yang handle error.

4. **Edit Functionality** — Tambahkan tombol Edit di setiap row tabel yang membuka `Sheet` berisi form pre-filled menggunakan `react-hook-form` + Zod schema. Wire up `useUpdatePackage`, `useUpdateCustomer`, `useUpdateUser` yang sudah ada di `src/services/`.

5. **Delete Confirmation Dialog** — Install shadcn `AlertDialog`, wrap semua tombol Delete dengan konfirmasi "Apakah Anda yakin?" sebelum mutasi dieksekusi.

6. **Breadcrumbs** — Aktifkan komponen `src/components/ui/breadcrumb.tsx` di `src/app/(dashboard)/layout.tsx` dengan breadcrumb dinamis berdasarkan `pathname` (misal: `Dashboard > Pelanggan`).

7. **Month Names dari API** — Ganti hardcode `1–12` di `src/app/(dashboard)/tagihan/_components/billing-matrix.tsx` dan `src/app/_components/public-billing-matrix.tsx` dengan `data.monthNames[]` dari response API.

8. **Payment Cell Tooltips** — Wrap sel ✓ di billing matrix dengan `Tooltip` yang menampilkan `paymentDate` dan `amount` dari tipe `PaymentByMonth` (`src/types/api.ts`) saat hover.

9. **Payment Filters** — Tambahkan `Select` dropdown untuk `customer_id`, `year`, `month` di `src/app/(dashboard)/pembayaran/_components/pembayaran-list.tsx` (API sudah mendukung filter ini).

10. **User Status Badge & Search** — Ganti teks plain "Active"/"Inactive" di `src/app/(dashboard)/users/_components/user-list.tsx` dengan badge berwarna (emerald/rose seperti di `paket-list.tsx`). Tambahkan input search ke Users dan Pembayaran.

11. **Form Validation — Zod + react-hook-form** — Install `react-hook-form`, tambahkan Zod schema dan field-level error messages di `src/app/(dashboard)/paket/_components/paket-form.tsx`, `src/app/(dashboard)/pelanggan/_components/pelanggan-form.tsx`, `src/app/(dashboard)/pembayaran/_components/pembayaran-form.tsx`, `src/app/(dashboard)/users/_components/user-form.tsx`.

12. **Fix Public Stats Calculation** — Perbaiki kalkulasi `totalCollected` dan `collectionRate` di `src/app/_components/public-billing-matrix.tsx` agar tidak menghitung hanya dari data halaman saat ini.

13. **Nav Cleanup** — Hapus item boilerplate shadcn yang tidak fungsional (Bell, CreditCard, Sparkles) dari `src/app/(dashboard)/_components/nav-user.tsx`, ganti dengan link relevan (misal: Change Password).

14. **Move Components** — Pindahkan semua komponen terkait tagihan (billing matrix, forms, dsb.) ke folder `src/app/components/**` untuk konsistensi dan kemudahan maintenance.

15. **Pisahkan Logic kedalam Custom Hooks** — Refactor logic terkait billing matrix, forms, dsb. ke dalam custom hooks di `src/hooks/` untuk cleaner component code dan reusability.

**Verification**
- Manual test tiap halaman: dashboard stats muncul, skeleton terlihat saat fetch, error state muncul saat API gagal (simulasi via devtools offline).
- Test edit flow: klik Edit → Sheet terbuka dengan data terisi → submit → tabel refresh.
- Test delete: klik Delete → dialog konfirmasi muncul → cancel tidak menghapus.
- Test payment filters: pilih dropdown → data terfilter dengan benar.
- Jalankan e2e: `npx playwright test`.

**Decisions**
- Edit form: `react-hook-form` + Zod (konsisten dengan Step 11, pattern shadcn standar).
- Edit UI: `Sheet` sliding panel (konsisten dengan `src/components/ui/sheet.tsx` yang sudah ada).
- Urutan: semua 13 step dikerjakan berurutan sesuai prioritas dampak.
