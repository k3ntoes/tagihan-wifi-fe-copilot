# Tagihan WiFi Frontend — Full Implementation Plan

Build a complete frontend for the Tagihan WiFi API using Next.js 16.1.6, shadcn/ui, React Query (TanStack Query), and TanStack Table.

## User Review Required

> [!IMPORTANT]
> **API Base URL**: `https://be-tagihan-wifi.kentoes.my.id/api/v1` (as per your comment, not localhost).

> [!IMPORTANT]
> **Use Mcp Server**: use next-devtools-mcp to implement bestpractice from nextjs 16.1.6

> [!IMPORTANT]
> **`proxy.ts` pattern**: Will use the new Next.js 16 `proxy.ts` (replaces `middleware.ts`) to proxy all `/api/proxy/*` requests to the backend, keeping the real API URL server-side only. Auth cookies are HttpOnly — token never exposed to client JS.

> [!WARNING]
> This will **replace** the existing default [page.tsx](src/app/page.tsx) and [layout.tsx](src/app/layout.tsx). The project is a fresh scaffold, so this is safe.

---

## Proposed Changes

### 1. Project Setup & Dependencies

#### [MODIFY] [package.json](package.json)
Install dependencies:
- `@tanstack/react-query` — data fetching & caching
- `@tanstack/react-table` — headless datatable
- `zod` — schema validation
- `lucide-react` — icons (shadcn dep)
- `sonner` — toast notifications (shadcn dep)
- shadcn/ui CLI components (see below)

#### shadcn/ui init & components
Run `bunx --bun shadcn@latest init` then add:
- `button`, `input`, `label`, `card`, `dialog`, `table`, `select`, `badge`, `skeleton`, `dropdown-menu`, `form`, `separator`, `sheet`, `sidebar`, `sonner`, `tooltip`, `pagination`, `popover`, `command`

#### [NEW] [.env.local](.env.local)
```
API_BASE_URL=https://be-tagihan-wifi.kentoes.my.id/api/v1
```
Server-only env var (no `NEXT_PUBLIC_` prefix).

---

### 2.5 Public Dashboard (Root Path `/`)

#### [MODIFY] [src/app/page.tsx](src/app/page.tsx)
Public-facing dashboard accessible **without authentication**. Consumes the Billing Matrix API (`GET /billing-matrix/{year}`) to show:
- Year selector
- Matrix table: customer name, monthly fee, 12-month payment status (✓/✗ badges), total paid, progress bar
- Search by customer name
- Pagination
- Summary cards: total customers, total collected, collection rate %

This page is **not** behind the proxy auth guard — the proxy will allow `/api/proxy/billing-matrix/*` without token for public consumption (or the page uses a server component that calls the API directly without auth if the endpoint is public).

> [!IMPORTANT]
> If the billing-matrix endpoint requires auth, we'll use a server component that calls the API with a service-level token, or adjust the proxy to allow public access. Please confirm if this endpoint requires auth.

#### [NEW] [src/app/_components/public-billing-matrix.tsx](src/app/_components/public-billing-matrix.tsx)
Client component for the interactive billing matrix display with year navigation, search, and pagination.

---

### 2. Proxy Layer (Next.js 16 `proxy.ts`)

#### [NEW] [proxy.ts](src/proxy.ts)
- Intercepts `/api/proxy/:path*` requests → forwards to `API_BASE_URL/:path*`
- Attaches `Authorization: Bearer <token>` from HttpOnly `auth_token` cookie
- Intercepts `/auth/login` proxy response to set cookie from response body
- Redirects unauthenticated users on protected routes to `/login`
- Allows public routes: `/login`, `/`, `/_next/*`, `/api/proxy/auth/login`

---

### 3. Core Library (DRY Shared Code)

#### [NEW] [src/lib/api-client.ts](src/lib/api-client.ts)
- Thin `fetch` wrapper pointing to `/api/proxy/` (relative, goes through proxy)
- Generic `apiGet<T>`, `apiPost<T>`, `apiPut<T>`, `apiPatch<T>`, `apiDelete` helpers
- Automatic JSON parsing, error extraction (`detail` field)

#### [NEW] [src/lib/number_helper.ts](src/lib/utils.ts)
- `formatCurrency(n)` → `Rp 250.000`
- `formatDate(iso)` → locale date string

#### [NEW] [src/types/api.ts](src/types/api.ts)
Shared TypeScript interfaces:
- `PaginationMeta` (`total`, `page`, `perPage`, `totalPages`, `hasNext`, `hasPrev`)
- `PaginatedResponse<T>` (`data: T[]`, `meta: PaginationMeta`)
- `SingleResponse<T>` (`data: T`)
- `ApiError` (`detail`, `code?`)
- Entity types: `User`, `Package`, `Customer`, `Payment`, `BillingRow`, `PaymentByMonth`

#### [NEW] [src/hooks/use-pagination.ts](src/hooks/use-pagination.ts)
Reusable hook managing `page`, `perPage`, `search` params synced with URL search params.

---

### 4. Auth Module

#### [NEW] [src/app/login/page.tsx](src/app/login/page.tsx)
Login form with shadcn `Card`, `Input`, `Button`. Calls `/api/proxy/auth/login`, on success redirect to `/dashboard`.

#### [NEW] [src/lib/auth.ts](src/lib/auth.ts)
Server-side helpers:
- `getAuthToken()` — reads cookie
- `getCurrentUser()` — calls `/auth/me` from server
- `logout()` — server action clearing cookie

---

### 5. Dashboard Layout

#### [MODIFY] [src/app/layout.tsx](src/app/layout.tsx)
- Wrap with `QueryClientProvider` (via a client `providers.tsx`)
- Add `Toaster` from sonner
- Update metadata

#### [NEW] [src/app/providers.tsx](src/app/providers.tsx)
`"use client"` — provides `QueryClientProvider`.

#### [NEW] [src/app/(dashboard)/layout.tsx](src/app/(dashboard)/layout.tsx)
Dashboard layout with shadcn `Sidebar` navigation:
- Links: Dashboard, Paket, Pelanggan, Pembayaran, Tagihan, Users
- User info & logout button

#### [NEW] [src/app/(dashboard)/dashboard/page.tsx](src/app/(dashboard)/dashboard/page.tsx)
Summary dashboard with cards.

---

### 6. Feature Pages (CRUD with DataTable)

Each feature follows this DRY pattern:
1. **`src/services/<feature>.ts`** — react-query hooks (`useQuery`, `useMutation`) 
2. **`src/app/(dashboard)/<route>/page.tsx`** — server component wrapper
3. **`src/app/(dashboard)/<route>/_components/`** — client components (list with DataTable, form dialog)
4. **`src/components/data-table/`** — reusable generic DataTable component

#### Reusable DataTable Component
#### [NEW] [src/components/data-table/data-table.tsx](src/components/data-table/data-table.tsx)
Generic `<DataTable>` using `@tanstack/react-table` + shadcn `Table`. Props: columns, data, pagination meta, loading state, onPaginationChange.

#### [NEW] [src/components/data-table/data-table-pagination.tsx](src/components/data-table/data-table-pagination.tsx)
Pagination controls using shadcn buttons.

#### [NEW] [src/components/data-table/data-table-search.tsx](src/components/data-table/data-table-search.tsx)
Debounced search input with shadcn `Input`.

---

#### Packages (Paket)
- **[NEW] `src/services/package-service.ts`** — `usePackages()`, `usePackage(id)`, `useCreatePackage()`, `useUpdatePackage()`, `useDeletePackage()`
- **[NEW] `src/app/(dashboard)/paket/page.tsx`** — list page
- **[NEW] `src/app/(dashboard)/paket/_components/paket-list.tsx`** — DataTable with columns: Name, Speed, Price, Status, Actions
- **[NEW] `src/app/(dashboard)/paket/_components/paket-form.tsx`** — Create/Edit dialog with Zod validation

#### Customers (Pelanggan)
- **[NEW] `src/services/customer-service.ts`** — `useCustomers()`, `useCreateCustomer()`, `useUpdateCustomer()`, `useDeleteCustomer()`
- **[NEW] `src/app/(dashboard)/pelanggan/page.tsx`**
- **[NEW] `src/app/(dashboard)/pelanggan/_components/pelanggan-list.tsx`** — Name, Package, Monthly Fee, Actions
- **[NEW] `src/app/(dashboard)/pelanggan/_components/pelanggan-form.tsx`** — With package select dropdown

#### Payments (Pembayaran)
- **[NEW] `src/services/payment-service.ts`** — `usePayments()`, `useCreatePayment()`, `useParsePaymentLog()`
- **[NEW] `src/app/(dashboard)/pembayaran/page.tsx`**
- **[NEW] `src/app/(dashboard)/pembayaran/_components/pembayaran-list.tsx`** — Customer, Date, Month/Year, Amount
- **[NEW] `src/app/(dashboard)/pembayaran/_components/pembayaran-form.tsx`** — Customer select, date picker, billing month/year
- **[NEW] `src/app/(dashboard)/pembayaran/_components/parse-log-form.tsx`** — Text input for log parsing

#### Billing Matrix (Tagihan)
- **[NEW] `src/services/billing-service.ts`** — `useBillingMatrix(year)`
- **[NEW] `src/app/(dashboard)/tagihan/page.tsx`**
- **[NEW] `src/app/(dashboard)/tagihan/_components/billing-matrix.tsx`** — Year selector, matrix table with 12 month columns, paid/unpaid badges, progress bar

#### Users (Admin)
- **[NEW] `src/services/user-service.ts`** — `useUsers()`, `useCreateUser()`, `useUpdateUser()`, `useDeleteUser()`, `useChangePassword()`
- **[NEW] `src/app/(dashboard)/users/page.tsx`**
- **[NEW] `src/app/(dashboard)/users/_components/user-list.tsx`** — Username, Role, Status, Actions
- **[NEW] `src/app/(dashboard)/users/_components/user-form.tsx`** — Register/Edit user
- **[NEW] `src/app/(dashboard)/users/_components/change-password-form.tsx`**

---

### 7. Root Path

The root path `/` serves the **public billing dashboard** (Section 2.5 above). The admin panel lives under [(dashboard)](src/app/page.tsx#3-66) route group at `/dashboard`, `/paket`, `/pelanggan`, etc.

---

## DRY Patterns Summary

| Pattern | Implementation |
|---------|---------------|
| API calls | Single `api-client.ts` with generic typed helpers |
| DataTable | One `<DataTable>` component, reused everywhere |
| Pagination | One `usePagination` hook for URL-synced pagination |
| React Query | Service files with typed query/mutation hooks |
| Form validation | Zod schemas per entity, shared error display |
| Types | Centralized `types/api.ts` |
| Proxy/Auth | Single `proxy.ts` handling all API forwarding |

---

## Verification Plan

### Browser Testing
1. Start dev server: `bun run dev`
2. Visit `http://localhost:3000` → should redirect to `/login`
3. Login with credentials → should redirect to `/dashboard`
4. Navigate to each page (Paket, Pelanggan, Pembayaran, Tagihan, Users)
5. Verify DataTable renders with real data, pagination works
6. Test CRUD operations (create, edit, delete) with toast notifications
7. Test Billing Matrix year navigation and paid/unpaid display
8. Test logout → should redirect to `/login`

### Build Verification
```bash
bun run build
```
Verify no TypeScript or build errors.
