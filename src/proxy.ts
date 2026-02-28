import { type NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "auth_token";
const API_PREFIX = "/api/proxy";
const PUBLIC_PATHS = ["/", "/login"];
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/paket",
  "/pelanggan",
  "/pembayaran",
  "/tagihan",
  "/users",
];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) {
    return true;
  }

  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return true;
  }

  return false;
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

async function handleProxyApi(request: NextRequest) {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { detail: "API_BASE_URL belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const targetPath = request.nextUrl.pathname.replace(API_PREFIX, "");
  const targetUrl = `${baseUrl}${targetPath}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("accept-encoding");

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });

  const contentType = upstream.headers.get("content-type") || "";

  if (
    targetPath === "/auth/login" &&
    contentType.includes("application/json")
  ) {
    const payload = await upstream.json();
    const response = NextResponse.json(payload, { status: upstream.status });

    if (upstream.ok && payload?.accessToken) {
      response.cookies.set(AUTH_COOKIE_NAME, payload.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: Number(payload.expiresIn ?? 3600),
      });
    }

    return response;
  }

  const passthrough = new NextResponse(upstream.body, {
    status: upstream.status,
    headers: upstream.headers,
  });

  return passthrough;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(API_PREFIX)) {
    return handleProxyApi(request);
  }

  if (pathname === "/login" && request.cookies.get(AUTH_COOKIE_NAME)?.value) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    isProtectedPath(pathname) &&
    !request.cookies.get(AUTH_COOKIE_NAME)?.value
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
