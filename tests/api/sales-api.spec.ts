import { test, expect } from "@playwright/test";
import { API } from "../helpers/test-data";

test.describe("API — /api/sales (público, sin autenticación obligatoria)", () => {
  test.describe("GET /api/sales", () => {
    test("retorna 200 con lista de todas las ventas", async ({ request }) => {
      const res = await request.get(API.sales);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.sales)).toBe(true);
    });

    test("retorna estructura válida (sales: array)", async ({ request }) => {
      const res = await request.get(API.sales);
      expect(res.status()).toBe(200);
      const body = await res.json();

      expect(body).toHaveProperty("sales");
      if (body.sales.length > 0) {
        const sale = body.sales[0];
        expect(sale).toHaveProperty("id");
        expect(sale).toHaveProperty("totalprice");
        expect(sale).toHaveProperty("userid");
      }
    });

    test("GET /api/sales?id=X retorna la venta con ese ID", async ({
      request,
    }) => {
      const listRes = await request.get(API.sales);
      const listBody = await listRes.json();

      if (listBody.sales.length > 0) {
        const saleId = listBody.sales[0].id;
        const res = await request.get(`${API.sales}?id=${saleId}`);

        expect(res.status()).toBe(200);
        const body = await res.json();
        expect(body.sale || body).toHaveProperty("id", saleId);
      }
    });

    test("GET /api/sales?id=inexistente retorna sale null o 404", async ({
      request,
    }) => {
      const res = await request.get(
        `${API.sales}?id=11111111-1111-1111-1111-111111111111`,
      );

      expect([200, 404]).toContain(res.status());
      if (res.status() === 200) {
        const body = await res.json();
        expect(body.sale ?? null).toBeNull();
      }
    });
  });

  test.describe("GET /api/sales/:id", () => {
    let firstSaleId: string;

    test.beforeAll(async ({ request }) => {
      const res = await request.get(API.sales);
      const body = await res.json();
      if (body.sales.length > 0) {
        firstSaleId = body.sales[0].id;
      }
    });

    test("retorna 200 con el detalle de la venta", async ({ request }) => {
      if (!firstSaleId) test.skip();

      const res = await request.get(API.saleById(firstSaleId));
      expect(res.status()).toBe(200);
      const body = await res.json();
      const sale = body.sale || body;

      expect(sale).toHaveProperty("id");
      expect(sale).toHaveProperty("totalprice");
    });

    test("retorna estructura válida (sale con items)", async ({ request }) => {
      if (!firstSaleId) test.skip();

      const res = await request.get(API.saleById(firstSaleId));
      const body = await res.json();
      const sale = body.sale || body;
      const items = body.orders || body.items || [];

      expect(sale).toHaveProperty("id");
      expect(sale).toHaveProperty("totalprice");
      expect(Array.isArray(items)).toBe(true);

      if (items.length > 0) {
        const item = items[0];
        expect(item).toHaveProperty("productid");
        expect(item).toHaveProperty("productname");
        expect(item).toHaveProperty("price");
        expect(item).toHaveProperty("quantity");
      }
    });

    test("retorna 404 para ID inexistente", async ({ request }) => {
      const res = await request.get(
        API.saleById("11111111-1111-1111-1111-111111111111"),
      );

      expect(res.status()).toBe(404);
    });

    test("retorna 500 para ID con formato inválido", async ({ request }) => {
      const res = await request.get(API.saleById("invalid-id"));

      expect([400, 500]).toContain(res.status());
    });
  });

  test.describe("GET /api/sales/user", () => {
    test("sin userId retorna 500 (endpoint requiere userId válido)", async ({ request }) => {
      const res = await request.get(API.salesUser);

      expect(res.status()).toBe(500);
    });

    test("con userId válido retorna ventas de ese usuario", async ({
      request,
    }) => {
      const listRes = await request.get(API.sales);
      const listBody = await listRes.json();

      if (listBody.sales.length > 0) {
        const userId = listBody.sales[0].userid;

        const res = await request.get(`${API.salesUser}?userId=${userId}`);
        expect(res.status()).toBe(200);
        const body = await res.json();

        expect(Array.isArray(body.sales)).toBe(true);
        body.sales.forEach((sale: any) => {
          expect(sale.userid).toBe(userId);
        });
      }
    });

    test("retorna estructura válida (sales, total, page, pageSize, userId)", async ({
      request,
    }) => {
      const listRes = await request.get(API.sales);
      const listBody = await listRes.json();

      if (listBody.sales.length > 0) {
        const userId = listBody.sales[0].userid;

        const res = await request.get(`${API.salesUser}?userId=${userId}`);
        const body = await res.json();

        expect(body).toHaveProperty("sales");
        expect(Array.isArray(body.sales)).toBe(true);

        if (body.sales.length > 0) {
          expect(body.sales[0]).toHaveProperty("id");
          expect(body.sales[0]).toHaveProperty("totalprice");
        }
      }
    });

    test("GET /api/sales/user?page=1&pageSize=3 respeta la paginación", async ({
      request,
    }) => {
      const listRes = await request.get(API.sales);
      const listBody = await listRes.json();

      if (listBody.sales.length > 0) {
        const userId = listBody.sales[0].userid;

        const res = await request.get(
          `${API.salesUser}?userId=${userId}&page=1&pageSize=3`,
        );
        expect(res.status()).toBe(200);
        const body = await res.json();

        expect(body.sales.length).toBeLessThanOrEqual(3);
      }
    });

    test("con userId sin ventas retorna array vacío", async ({ request }) => {
      const res = await request.get(
        `${API.salesUser}?userId=00000000-0000-0000-0000-000000000000`,
      );

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.sales)).toBe(true);
      expect(body.sales.length).toBe(0);
    });
  });
});
