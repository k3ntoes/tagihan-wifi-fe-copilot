import { expect, type Page, type Route, test } from "@playwright/test";

function paginateMeta() {
  return {
    total: 1,
    page: 1,
    perPage: 10,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };
}

function paymentMonths() {
  return Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    monthName: String(index + 1),
    paid: index < 4,
    amount: index < 4 ? 350000 : null,
    paymentDate: index < 4 ? "2026-01-15" : null,
  }));
}

function mockJson(
  route: Route,
  payload: unknown,
  headers?: Record<string, string>,
) {
  return route.fulfill({
    status: 200,
    contentType: "application/json",
    headers,
    body: JSON.stringify(payload),
  });
}

async function mockApi(page: Page) {
  await page.route("**/api/proxy/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace("/api/proxy", "");

    if (path === "/auth/login" && request.method() === "POST") {
      return mockJson(
        route,
        {
          accessToken: "playwright-token",
          tokenType: "bearer",
          expiresIn: 3600,
        },
        {
          "set-cookie":
            "auth_token=playwright-token; Path=/; HttpOnly; SameSite=Lax",
        },
      );
    }

    if (path === "/packages" && request.method() === "GET") {
      return mockJson(route, {
        data: [
          {
            id: "pkg-1",
            name: "Paket 20 Mbps",
            speed: 20,
            price: 350000,
            isActive: true,
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
          },
        ],
        meta: paginateMeta(),
      });
    }

    if (path === "/customers" && request.method() === "GET") {
      return mockJson(route, {
        data: [
          {
            id: "cus-1",
            name: "Budi",
            package: {
              id: "pkg-1",
              name: "Paket 20 Mbps",
            },
            monthlyFee: 350000,
            createdAt: "2026-01-01T00:00:00Z",
            updatedAt: "2026-01-01T00:00:00Z",
          },
        ],
        meta: paginateMeta(),
      });
    }

    if (path === "/payments" && request.method() === "GET") {
      return mockJson(route, {
        data: [
          {
            id: "pay-1",
            customer: {
              id: "cus-1",
              name: "Budi",
              package: {
                id: "pkg-1",
                name: "Paket 20 Mbps",
              },
              monthlyFee: 350000,
              createdAt: "2026-01-01T00:00:00Z",
              updatedAt: "2026-01-01T00:00:00Z",
            },
            paymentDate: "2026-01-15",
            billingMonth: 1,
            billingYear: 2026,
            amount: 350000,
            createdAt: "2026-01-15T00:00:00Z",
            updatedAt: "2026-01-15T00:00:00Z",
          },
        ],
        meta: paginateMeta(),
      });
    }

    if (path.startsWith("/billing-matrix/") && request.method() === "GET") {
      return mockJson(route, {
        year: 2026,
        monthNames: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ],
        data: [
          {
            customer: {
              id: "cus-1",
              name: "Budi",
              package: {
                id: "pkg-1",
                name: "Paket 20 Mbps",
              },
              monthlyFee: 350000,
              createdAt: "2026-01-01T00:00:00Z",
              updatedAt: "2026-01-01T00:00:00Z",
            },
            payments: paymentMonths(),
            totalPaid: 1400000,
            totalExpected: 4200000,
            completionPercentage: 33.3,
          },
        ],
        meta: paginateMeta(),
      });
    }

    if (path === "/auth/users" && request.method() === "GET") {
      return mockJson(route, {
        data: [
          {
            id: 1,
            username: "admin",
            role: "admin",
            isActive: true,
            createdAt: "2026-01-01T00:00:00Z",
          },
        ],
        meta: paginateMeta(),
      });
    }

    return mockJson(route, { data: null });
  });
}

async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin123");
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe("Pages dan menu", () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test("halaman publik dapat diakses", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Dashboard Tagihan WiFi" }),
    ).toBeVisible();
    await expect(page.getByText("Total Pelanggan")).toBeVisible();
  });

  test("halaman terproteksi redirect ke login jika belum autentikasi", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: "Login Admin" }),
    ).toBeVisible();
  });

  test("login dan navigasi semua menu dashboard", async ({ page }) => {
    await loginAsAdmin(page);
    await expect(
      page.getByRole("heading", { name: "Dashboard" }),
    ).toBeVisible();

    const sidebar = page.locator("aside nav");
    const menus = [
      { label: "Dashboard", path: /\/dashboard$/, heading: "Dashboard" },
      { label: "Paket", path: /\/paket$/, heading: "Paket" },
      { label: "Pelanggan", path: /\/pelanggan$/, heading: "Pelanggan" },
      { label: "Pembayaran", path: /\/pembayaran$/, heading: "Pembayaran" },
      { label: "Tagihan", path: /\/tagihan$/, heading: "Tagihan" },
      { label: "Users", path: /\/users$/, heading: "Users" },
    ];

    for (const menu of menus) {
      await sidebar.getByRole("link", { name: menu.label }).click();
      await expect(page).toHaveURL(menu.path);
      await expect(
        page.locator("main").getByRole("heading", { name: menu.heading }),
      ).toBeVisible();
    }

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(
      page.getByRole("heading", { name: "Login Admin" }),
    ).toBeVisible();
  });

  test("menu Paket menampilkan form dan tabel", async ({ page }) => {
    await loginAsAdmin(page);
    await page
      .locator("aside nav")
      .getByRole("link", { name: "Paket" })
      .click();

    await expect(page).toHaveURL(/\/paket$/);
    await expect(
      page.locator("main").getByRole("heading", { name: "Paket" }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Cari paket...")).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Nama" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Harga" }),
    ).toBeVisible();
    await expect(
      page.locator("main").getByRole("cell", { name: "Paket 20 Mbps" }),
    ).toBeVisible();
  });

  test("menu Pelanggan menampilkan data pelanggan", async ({ page }) => {
    await loginAsAdmin(page);
    await page
      .locator("aside nav")
      .getByRole("link", { name: "Pelanggan" })
      .click();

    await expect(page).toHaveURL(/\/pelanggan$/);
    await expect(
      page.locator("main").getByRole("heading", { name: "Pelanggan" }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Cari pelanggan...")).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Paket" }),
    ).toBeVisible();
    await expect(
      page.locator("main").getByRole("cell", { name: "Budi" }),
    ).toBeVisible();
    await expect(
      page.locator("main").getByRole("cell", { name: "Paket 20 Mbps" }),
    ).toBeVisible();
  });

  test("menu Pembayaran menampilkan form parse log dan tabel", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await page
      .locator("aside nav")
      .getByRole("link", { name: "Pembayaran" })
      .click();

    await expect(page).toHaveURL(/\/pembayaran$/);
    await expect(
      page.locator("main").getByRole("heading", { name: "Pembayaran" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Parse Log" })).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Tanggal Bayar" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Jumlah" }),
    ).toBeVisible();
    await expect(
      page.locator("main").getByRole("cell", { name: "Budi" }),
    ).toBeVisible();
  });

  test("menu Tagihan menampilkan matriks tagihan", async ({ page }) => {
    await loginAsAdmin(page);
    await page
      .locator("aside nav")
      .getByRole("link", { name: "Tagihan" })
      .click();

    await expect(page).toHaveURL(/\/tagihan$/);
    await expect(
      page.locator("main").getByRole("heading", { name: "Tagihan" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Pelanggan" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Total" }),
    ).toBeVisible();
    await expect(
      page.locator("main").getByRole("button", { name: "Prev", exact: true }),
    ).toBeVisible();
    await expect(
      page.locator("main").getByRole("button", { name: "Next", exact: true }),
    ).toBeVisible();
  });

  test("menu Users menampilkan form user", async ({ page }) => {
    await loginAsAdmin(page);
    await page
      .locator("aside nav")
      .getByRole("link", { name: "Users" })
      .click();

    await expect(page).toHaveURL(/\/users$/);
    await expect(
      page.locator("main").getByRole("heading", { name: "Users" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Tambah User" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Ganti Password" }),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Username" }),
    ).toBeVisible();
    await expect(
      page.locator("main").getByRole("cell", { name: "admin" }).first(),
    ).toBeVisible();
  });
});
