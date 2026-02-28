"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import type { PaginatedResponse, Payment, SingleResponse } from "@/types/api";

interface PaymentQuery {
  page: number;
  perPage: number;
  customerId?: string;
  year?: number;
  month?: number;
}

const paymentKey = "payments";

export function usePayments(params: PaymentQuery) {
  return useQuery({
    queryKey: [paymentKey, params],
    queryFn: () =>
      apiGet<PaginatedResponse<Payment>>("/payments", {
        page: params.page,
        per_page: params.perPage,
        customer_id: params.customerId,
        year: params.year,
        month: params.month,
      }),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      customer_id: string;
      payment_date: string;
      billing_month: number;
      billing_year: number;
      amount: number;
    }) => apiPost<SingleResponse<Payment>>("/payments", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [paymentKey] }),
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      id: string;
      customer_id: string;
      payment_date: string;
      billing_month: number;
      billing_year: number;
      amount: number;
    }) =>
      apiPatch<SingleResponse<Payment>>(`/payments/${payload.id}`, {
        customer_id: payload.customer_id,
        payment_date: payload.payment_date,
        billing_month: payload.billing_month,
        billing_year: payload.billing_year,
        amount: payload.amount,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [paymentKey] }),
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payments/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [paymentKey] }),
  });
}

export function useParsePaymentLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { log_entry: string }) =>
      apiPost<SingleResponse<Payment>>("/payments/parse-log", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [paymentKey] }),
  });
}
