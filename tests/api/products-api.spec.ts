import { test, expect } from "@playwright/test";
import { API } from "../helpers/test-data";

test.describe("API — /api/products", () => {
  test.describe("GET /api/products", () => {
    test("retorna 200 con estructura paginada correcta", async ({ request }) => {
      const res = await request.get(API.products);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("products");
      expect(body).toHaveProperty("total");
      expect(body).toHaveProperty("page", 1);
      expect(body).toHaveProperty("pageSize", 6);
      expect(Array.isArray(body.products)).toBe(true);
    });

    test("respeta el parámetro pageSize", async ({ request }) => {
      const res = await request.get(`${API.products}?page=1&pageSize=3`);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.page).toBe(1);
      expect(body.pageSize).toBe(3);
      expect(body.products.length).toBeLessThanOrEqual(3);
    });

    test("la segunda página devuelve productos distintos a la primera", async ({
      request,
    }) => {
      const page1Res = await request.get(`${API.products}?page=1&pageSize=3`);
      const page1 = await page1Res.json();
      if (page1.total <= 3) test.skip();

      const page2Res = await request.get(`${API.products}?page=2&pageSize=3`);
      expect(page2Res.status()).toBe(200);
      const page2 = await page2Res.json();

      const ids1 = page1.products.map((p: { id: string }) => p.id);
      const ids2 = page2.products.map((p: { id: string }) => p.id);
      const overlap = ids1.filter((id: string) => ids2.includes(id));
      expect(overlap.length).toBe(0);
    });

    test("filtra por nombre con el parámetro query", async ({ request }) => {
      const allRes = await request.get(API.products);
      const allBody = await allRes.json();
      if (!allBody.products?.length) test.skip();

      const partialName = (allBody.products[0].productname as string).slice(0, 3);
      const res = await request.get(
        `${API.products}?query=${encodeURIComponent(partialName)}`,
      );

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("query", partialName);
      expect(Array.isArray(body.products)).toBe(true);
      for (const product of body.products) {
        expect(
          (product.productname as string).toLowerCase(),
        ).toContain(partialName.toLowerCase());
      }
    });

    test("una búsqueda sin coincidencias retorna array vacío", async ({
      request,
    }) => {
      const res = await request.get(
        `${API.products}?query=XZQNOMATCHPRODUCT99999`,
      );

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.products)).toBe(true);
      expect(body.products.length).toBe(0);
    });

    test("retorna solo productos con active = true", async ({ request }) => {
      const res = await request.get(API.products);

      expect(res.status()).toBe(200);
      const body = await res.json();
      for (const product of body.products) {
        expect(product.active).toBe(true);
      }
    });

    test("cada producto contiene los campos requeridos", async ({ request }) => {
      const res = await request.get(API.products);
      const body = await res.json();
      if (!body.products?.length) test.skip();

      for (const product of body.products) {
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("productname");
        expect(product).toHaveProperty("description");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("stock");
        expect(product).toHaveProperty("imageurl");
        expect(product).toHaveProperty("active");
      }
    });
  });

  test.describe("GET /api/products/:id", () => {
    let firstProductId: string;

    test.beforeAll(async ({ request }) => {
      const res = await request.get(API.products);
      const body = await res.json();
      firstProductId = body.products?.[0]?.id ?? "";
    });

    test("retorna 200 con datos completos del producto", async ({ request }) => {
      if (!firstProductId) test.skip();
      const res = await request.get(API.productById(firstProductId));

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("product");
      expect(body.product).toHaveProperty("id", firstProductId);
      expect(body.product).toHaveProperty("productname");
      expect(body.product).toHaveProperty("price");
      expect(body.product).toHaveProperty("stock");
      expect(body.product).toHaveProperty("active");
      expect(body.product).toHaveProperty("imageurl");
    });

    test("retorna 404 para UUID válido pero inexistente", async ({
      request,
    }) => {
      const res = await request.get(
        API.productById("00000000-0000-0000-0000-000000000000"),
      );

      expect(res.status()).toBe(404);
      const body = await res.json();
      expect(body).toHaveProperty("msg");
    });

    test("retorna error (500) para ID con formato inválido", async ({
      request,
    }) => {
      const res = await request.get(API.productById("id-invalido-abc-123"));
      expect(res.status()).toBe(500);
    });
  });

  test.describe("GET /api/products/recent", () => {
    test("retorna 200 con array de productos recientes", async ({ request }) => {
      const res = await request.get(API.productsRecent);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("products");
      expect(Array.isArray(body.products)).toBe(true);
    });

    test("los productos recientes tienen estructura válida", async ({
      request,
    }) => {
      const res = await request.get(API.productsRecent);
      expect(res.status()).toBe(200);
      const body = await res.json();
      if (!body.products?.length) test.skip();

      for (const product of body.products) {
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("productname");
        expect(product).toHaveProperty("price");
        expect(product).toHaveProperty("publicationdate");
      }
    });
  });

  test.describe("GET /api/products/top", () => {
    test("retorna 200 con array de productos más vendidos", async ({
      request,
    }) => {
      const res = await request.get(API.productsTop);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("products");
      expect(Array.isArray(body.products)).toBe(true);
    });

    test("los productos top tienen estructura válida", async ({ request }) => {
      const res = await request.get(API.productsTop);
      expect(res.status()).toBe(200);
      const body = await res.json();
      if (!body.products?.length) test.skip();

      for (const product of body.products) {
        expect(product).toHaveProperty("id");
        expect(product).toHaveProperty("productname");
        expect(product).toHaveProperty("price");
      }
    });
  });
});
