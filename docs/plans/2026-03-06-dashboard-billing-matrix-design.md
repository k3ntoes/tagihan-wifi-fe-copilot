# Dashboard Billing Matrix Design

## Overview

Add a full billing matrix view to the `/dashboard` page, replacing the current "Belum Bayar" table. Each payment cell becomes interactive — clicking opens a dialog to create (if unpaid) or edit (if paid) a payment using the existing `PembayaranForm` component.

## Layout

1. **Summary cards** (7 cards) — unchanged, stay at top
2. **Billing Matrix** — replaces "Belum Bayar Bulan Ini" card
   - Year navigation (prev/next)
   - Customer search filter
   - 12-month payment status matrix
   - Pagination
   - Legend

## Interactive Cells

Each payment cell is a `<button>` (not `<span>`), retaining the existing icons:

- **Unpaid cell** (XCircle, red): Opens "Tambah Pembayaran" dialog
  - Prefilled: `customer_id`, `billing_month`, `billing_year`, `amount` (from monthlyFee)
- **Paid cell** (CheckCircle, green): Opens "Edit Pembayaran" dialog
  - Fetches payment via `GET /payments?customer_id=X&month=Y&year=Z` to get payment ID + details
  - Prefilled: all fields from fetched payment data

## Components

### New: `src/components/dashboard/dashboard-billing-matrix.tsx`

Modified version of `BillingMatrix` from `/tagihan` with:
- No "Tagihan" header (dashboard already has its own header)
- Clickable cells that open payment dialog
- Integrated `Dialog` with `PembayaranForm`
- Uses `useCreatePayment` / `useUpdatePayment` mutations
- Invalidates `billing-matrix` + `payments` queries on success

### Reused: `PembayaranForm`

Existing form component, wrapped in a `Dialog`. Receives `initialValues` from cell context and `customers` list from billing data.

## Data Flow

1. Click cell → set state: `{ customerId, month, year, paid, customerName, monthlyFee }`
2. If paid: fetch `usePayments({ customerId, year, month })` to get payment ID
3. Open Dialog with PembayaranForm (prefilled)
4. On submit: call create/update mutation
5. On success: toast, close dialog, invalidate queries

## Modified Files

- `src/app/(dashboard)/dashboard/page.tsx` — replace unpaid table with `DashboardBillingMatrix`
- `src/components/dashboard/dashboard-billing-matrix.tsx` — new component
- `src/services/payment-service.ts` — ensure invalidation includes `billing-matrix` key
