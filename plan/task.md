# Tagihan WiFi Frontend

## Planning
- [x] Read API documentation
- [x] Study existing project structure
- [x] Read Next.js 16 proxy docs
- [x] Write implementation plan
- [x] User review & approval

## Project Setup
- [x] Install dependencies (react-query, zod, lucide-react, sonner)
- [x] Init shadcn/ui & install components
- [x] Create `.env.local`

## Core Library
- [x] Create `src/lib/api-client.ts`
- [x] Create `src/lib/utils.ts`
- [x] Create `src/types/api.ts`
- [x] Create `src/hooks/use-pagination.ts`

## Proxy & Auth
- [x] Create `src/proxy.ts`
- [x] Create `src/lib/auth.ts`
- [x] Create `src/app/login/page.tsx`

## Layout & Providers
- [x] Update [src/app/layout.tsx](file:///home/kentoes/html/tagihan-wifi-fe-copilot/src/app/layout.tsx)
- [x] Create `src/app/providers.tsx`
- [x] Create `src/app/(dashboard)/layout.tsx`
- [x] Create dashboard page

## Reusable DataTable
- [x] Create `src/components/data-table/data-table.tsx`
- [x] Create pagination & search components

## Feature Pages
- [x] Packages (Paket) — CRUD + DataTable
- [x] Customers (Pelanggan) — CRUD + DataTable
- [x] Payments (Pembayaran) — CRUD + DataTable + Parse Log
- [x] Billing Matrix (Tagihan)
- [x] Users (Admin) — CRUD + Change Password

## Verification
- [x] Dev server runs without errors
- [ ] All pages render with real API data
- [ ] CRUD operations work
- [x] Build passes
