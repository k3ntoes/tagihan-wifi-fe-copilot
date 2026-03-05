import type { ApiError } from "@/types/api";

class HttpError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function toSearchParams(params?: Record<string, string | number | boolean | undefined>) {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function request<T>(
  path: string,
  init?: RequestInit,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const query = toSearchParams(params);
  const response = await fetch(`/api/proxy${path}${query}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = payload as ApiError | null;
    throw new HttpError(
      response.status,
      error?.detail ?? "Terjadi kesalahan pada server.",
      error?.code,
    );
  }

  return payload as T;
}

export function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  return request<T>(path, { method: "GET" }, params);
}

export function apiPost<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPut<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPatch<T>(path: string, body?: unknown) {
  return request<T>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete(path: string) {
  return request<void>(path, { method: "DELETE" });
}

export { HttpError };
