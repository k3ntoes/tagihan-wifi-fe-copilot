"use client";

import {
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api-client";
import type {
  CreatePackagePayload,
  Package,
  PaginatedResponse,
  SingleResponse,
  UpdatePackagePayload,
} from "@/types/api";

interface PackageQuery {
  page: number;
  perPage: number;
  search?: string;
}

const packageKey = "packages";

export function usePackages(
  params: PackageQuery,
): UseQueryResult<PaginatedResponse<Package>> {
  return useQuery({
    queryKey: [packageKey, params],
    queryFn: () =>
      apiGet<PaginatedResponse<Package>>("/packages", {
        page: params.page,
        per_page: params.perPage,
        name: params.search || undefined,
      }),
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePackagePayload) =>
      apiPost<SingleResponse<Package>>("/packages", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [packageKey] }),
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePackagePayload) =>
      apiPut<SingleResponse<Package>>(`/packages/${payload.id}`, {
        name: payload.name,
        speed: payload.speed,
        price: payload.price,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [packageKey] }),
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/packages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [packageKey] }),
  });
}
