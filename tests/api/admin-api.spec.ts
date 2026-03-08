import { test, expect, APIRequestContext } from "@playwright/test";
import { ADMIN_USER, REGULAR_USER, API } from "../helpers/test-data";

async function getCSRFToken(request: APIRequestContext): Promise<string> {
  const res = await request.get("/api/auth/csrf");
  const body = await res.json();
  return body.csrfToken;
}

async function loginWithCredentials(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<void> {
  const csrfToken = await getCSRFToken(request);
  await request.post("/api/auth/callback/credentials", {
    form: {
      csrfToken,
      email,
      password,
      json: "true",
    },
  });
}

test.describe("API — /api/admin (autenticado como admin)", () => {
  test.describe("GET /api/admin/products", () => {
    test("retorna 401 sin autenticación", async ({ request }) => {
      const res = await request.get(API.adminProducts);
      expect(res.status()).toBe(401);
    });

    test("retorna 401 con usuario sin rol admin", async ({ request }) => {
      await loginWithCredentials(
        request,
        REGULAR_USER.email,
        REGULAR_USER.password,
      );

      const res = await request.get(API.adminProducts);
      expect(res.status()).toBe(401);
    });

    test("retorna 200 con lista paginada para admin", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(API.adminProducts);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.products)).toBe(true);
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("pageSize");
    });

    test("retorna estructura válida (products, total, page, pageSize, active)", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(API.adminProducts);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("products");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("pageSize");

      if (body.products.length > 0) {
        const product = body.products[0];
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("productname");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("stock");
        expect(product).toHaveProperty("active");
      }
    });

    test("GET /api/admin/products?active=false retorna productos inactivos", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(`${API.adminProducts}?active=false`);
      expect(res.status()).toBe(200);
      const body = await res.json();

      body.products.forEach((product: any) => {
        expect(product.active).toBe(false);
      });
    });

    test("GET /api/admin/products?active=true retorna solo productos activos", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(`${API.adminProducts}?active=true`);
      expect(res.status()).toBe(200);
      const body = await res.json();

      body.products.forEach((product: any) => {
        expect(product.active).toBe(true);
      });
    });

    test("GET /api/admin/products?query=X filtra por nombre", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const searchTerm = "Test";
      const res = await request.get(
        `${API.adminProducts}?query=${searchTerm}`,
      );
      expect(res.status()).toBe(200);
      const body = await res.json();

      body.products.forEach((product: any) => {
        expect(product.name.toLowerCase()).toContain(searchTerm.toLowerCase());
      });
    });

    test("GET /api/admin/products?page=1&pageSize=3 respeta la paginación", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(
        `${API.adminProducts}?page=1&pageSize=3`,
      );
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(3);
      expect(body.products.length).toBeLessThanOrEqual(3);
    });
  });

  test.describe("GET /api/admin/products/:id", () => {
    let firstProductId: string;

    test.beforeAll(async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);
      const res = await request.get(`${API.adminProducts}?pageSize=1`);
      const body = await res.json();
      if (body.products.length > 0) {
        firstProductId = body.products[0].id;
      }
    });

    test("retorna 401 sin autenticación", async ({ request }) => {
      const res = await request.get(API.adminProductById("test-id"));
      expect(res.status()).toBe(401);
    });

    test("retorna 200 con datos del producto (incluye inactivos)", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(API.adminProductById(firstProductId));
      expect(res.status()).toBe(200);
      const body = await res.json();
      const product = body.product || body;
      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("productname");
      expect(product).toHaveProperty("price");
      expect(product).toHaveProperty("stock");
      expect(product).toHaveProperty("active");
    });

    test("retorna 404 para ID inexistente", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(
        API.adminProductById("11111111-1111-11111"),
      );
      expect(res.status()).toBe(404);
    });

    test("retorna 500 para ID con formato inválido", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(API.adminProductById("invalid-id"));
      expect([400, 500]).toContain(res.status());
    });
  });

  test.describe("POST /api/admin/products/status", () => {
    let testProductId: string;

    test.beforeAll(async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);
      const res = await request.get(`${API.adminProducts}?pageSize=1`);
      const body = await res.json();
      if (body.products.length > 0) {
        testProductId = body.products[0].id;
      }
    });

    test("retorna 401 sin autenticación", async ({ request }) => {
      const res = await request.post(API.adminProductStatus, {
        data: { productId: testProductId, active: true },
      });
      expect(res.status()).toBe(401);
    });

    test("activa un producto inactivo exitosamente", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStatus, {
        data: { productId: testProductId, active: true },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
    });

    test("desactiva un producto activo exitosamente", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStatus, {
        data: { productId: testProductId, active: false },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
    });

    test("retorna 400 si falta productId", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStatus, {
        data: { active: true },
      });
      expect(res.status()).toBe(400);
    });

    test("retorna 400 si falta campo active", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStatus, {
        data: { productId: testProductId },
      });
      expect(res.status()).toBe(400);
    });

    test("retorna 400 si active no es booleano", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStatus, {
        data: { productId: testProductId, active: "true" },
      });
      expect(res.status()).toBe(400);
    });

    test("retorna 404 para productId inexistente", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStatus, {
        data: {
          productId: "11111111-1111-1111-1111-111111111111",
          active: true,
        },
      });
      expect(res.status()).toBe(404);
    });
  });

  test.describe("POST /api/admin/products/stock", () => {
    let testProductId: string;

    test.beforeAll(async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);
      const res = await request.get(`${API.adminProducts}?pageSize=1`);
      const body = await res.json();
      if (body.products.length > 0) {
        testProductId = body.products[0].id;
      }
    });

    test("retorna 401 sin autenticación", async ({ request }) => {
      const res = await request.post(API.adminProductStock, {
        data: { productId: testProductId, stock: 10 },
      });
      expect(res.status()).toBe(401);
    });

    test("actualiza el stock exitosamente", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStock, {
        data: { productId: testProductId, stock: 25 },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("success", true);
    });

    test("retorna 400 si falta productId", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStock, {
        data: { stock: 10 },
      });
      expect(res.status()).toBe(400);
    });

    test("retorna 400 si stock es negativo", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStock, {
        data: { productId: testProductId, stock: -5 },
      });
      expect(res.status()).toBe(400);
    });

    test("retorna 400 si stock no es número", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStock, {
        data: { productId: testProductId, stock: "no es número" },
      });
      expect(res.status()).toBe(400);
    });

    test("retorna 404 para productId inexistente", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.post(API.adminProductStock, {
        data: {
          productId: "11111111-11111",
          stock: 10,
        },
      });
      expect(res.status()).toBe(404);
    });
  });

  test.describe("GET /api/admin/sales", () => {
    test("retorna 401 sin autenticación", async ({ request }) => {
      const res = await request.get(API.adminSales);
      expect(res.status()).toBe(401);
    });

    test("retorna 401 con usuario sin rol admin", async ({ request }) => {
      await loginWithCredentials(
        request,
        REGULAR_USER.email,
        REGULAR_USER.password,
      );

      const res = await request.get(API.adminSales);
      expect(res.status()).toBe(401);
    });

    test("retorna 200 con lista paginada de ventas", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(API.adminSales);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.sales)).toBe(true);
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("pageSize");
    });

    test("retorna estructura válida (sales, total, page, pageSize)", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(API.adminSales);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("sales");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page");
      expect(body).toHaveProperty("pageSize");

      if (body.sales.length > 0) {
        const sale = body.sales[0];
        expect(sale).toHaveProperty("id");
        expect(sale).toHaveProperty("totalprice");
      }
    });

    test("GET /api/admin/sales?page=1&pageSize=3 respeta la paginación", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(`${API.adminSales}?page=1&pageSize=3`);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(3);
      expect(body.sales.length).toBeLessThanOrEqual(3);
    });
  });

  test.describe("GET /api/admin/sales/:id", () => {
    let firstSaleId: string;

    test.beforeAll(async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);
      const res = await request.get(`${API.adminSales}?pageSize=1`);
      const body = await res.json();
      if (body.sales.length > 0) {
        firstSaleId = body.sales[0].id;
      }
    });

    test("retorna 401 sin autenticación", async ({ request }) => {
      const res = await request.get(API.adminSaleById("test-id"));
      expect(res.status()).toBe(401);
    });

    test("retorna 200 con detalle de la venta", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(API.adminSaleById(firstSaleId));
      expect(res.status()).toBe(200);
      const body = await res.json();
      const sale = body.sale || body;
      expect(sale).toHaveProperty("id");
      expect(sale).toHaveProperty("totalprice");
      const items = body.orders || body.items || [];
      expect(Array.isArray(items)).toBe(true);
    });

    test("retorna 404 para ID inexistente", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get(
        API.adminSaleById("11111111-1111-1111-1111"),
      );
      expect(res.status()).toBe(404);
    });
  });
});
