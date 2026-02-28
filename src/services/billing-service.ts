"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { BillingMatrixResponse } from "@/types/api";

interface BillingQuery {
  year: number;
  page: number;
  perPage: number;
  customerId?: string;
  customerName?: string;
}

export function useBillingMatrix(params: BillingQuery) {
  return useQuery({
    queryKey: ["billing-matrix", params],
    queryFn: () =>
      apiGet<BillingMatrixResponse>(`/billing-matrix/${params.year}`, {
        page: params.page,
        per_page: params.perPage,
        customer_id: params.customerId,
        customer_name: params.customerName || undefined,
      }),
  });
}
