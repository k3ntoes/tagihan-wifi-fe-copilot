export type Role = "admin" | "user";

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ApiError {
  detail: string;
  code?: string;
}

export interface User {
  id: number;
  username: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

import type { Package } from "./package";

export type {
  CreatePackagePayload,
  Package,
  UpdatePackagePayload,
} from "./package";

export interface Customer {
  id: string;
  name: string;
  package: Pick<Package, "id" | "name">;
  monthlyFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  customer: Customer;
  paymentDate: string;
  billingMonth: number;
  billingYear: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentByMonth {
  month: number;
  monthName: string;
  paid: boolean;
  amount: number | null;
  paymentDate: string | null;
}

export interface BillingRow {
  customer: Customer;
  payments: PaymentByMonth[];
  totalPaid: number;
  totalExpected: number;
  completionPercentage: number;
}

export interface BillingMatrixResponse {
  year: number;
  monthNames: string[];
  data: BillingRow[];
  meta: PaginationMeta;
}
