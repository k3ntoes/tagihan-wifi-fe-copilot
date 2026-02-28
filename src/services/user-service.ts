"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import type { PaginatedResponse, SingleResponse, User } from "@/types/api";

interface UserQuery {
  page: number;
  perPage: number;
}

const userKey = "users";

export function useUsers(params: UserQuery) {
  return useQuery({
    queryKey: [userKey, params],
    queryFn: () =>
      apiGet<PaginatedResponse<User>>("/auth/users", {
        page: params.page,
        per_page: params.perPage,
      }),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      username: string;
      password: string;
      role: "admin" | "user";
    }) => apiPost<SingleResponse<User>>("/auth/register", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [userKey] }),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      id: number;
      username?: string;
      password?: string;
      role?: "admin" | "user";
      is_active?: boolean;
    }) => apiPatch<SingleResponse<User>>(`/auth/users/${payload.id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [userKey] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/auth/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [userKey] }),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { old_password: string; new_password: string }) =>
      apiPost<SingleResponse<User>>("/auth/change-password", payload),
  });
}
