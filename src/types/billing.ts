export interface BillingMatrixCustomer {
  id: string;
  name: string;
  monthlyFee: number;
}

export interface BillingMatrixPayment {
  month: number;
  monthName: string;
  paid: boolean;
  paymentDate: string | null;
  amount: number | null;
}

export interface BillingMatrixRow {
  customer: BillingMatrixCustomer;
  payments: BillingMatrixPayment[];
  totalPaid: number;
  totalExpected: number;
  completionPercentage: number;
}

export interface BillingMatrixMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

export interface BillingMatrixSummary {
  totalCustomers: number;
  totalCollected: number;
  totalExpected: number;
  collectionRate: number;
}
