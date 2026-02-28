"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import type { Customer, PaginatedResponse, SingleResponse } from "@/types/api";

interface CustomerQuery {
  page: number;
  perPage: number;
  search?: string;
}

const customerKey = "customers";

export function useCustomers(params: CustomerQuery) {
  return useQuery({
    queryKey: [customerKey, params],
    queryFn: () =>
      apiGet<PaginatedResponse<Customer>>("/customers", {
        page: params.page,
        per_page: params.perPage,
        name: params.search || undefined,
      }),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      name: string;
      package_id: string;
      monthly_fee: number;
    }) => apiPost<SingleResponse<Customer>>("/customers", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [customerKey] }),
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      id: string;
      name: string;
      package_id: string;
      monthly_fee: number;
    }) =>
      apiPatch<SingleResponse<Customer>>(`/customers/${payload.id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [customerKey] }),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/customers/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [customerKey] }),
  });
}
