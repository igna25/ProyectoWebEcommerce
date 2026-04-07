import { test, expect, APIRequestContext } from "@playwright/test";
import { REGULAR_USER, REGULAR_USER_2, API } from "../helpers/test-data";

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

async function getUserIdFromSession(
  request: APIRequestContext,
): Promise<string | undefined> {
  const sessionRes = await request.get("/api/auth/session");
  const session = await sessionRes.json();
  return session.user?.id;
}

test.describe("API — /api/cart", () => {
  test.describe("GET /api/cart (obtener carrito del usuario)", () => {
    test("sin userId retorna items vacíos y cartId null", async ({
      request,
    }) => {
      const res = await request.get(API.cart);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("cartId");
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.items.length).toBe(0);
      expect(body.cartId).toBeNull();
    });

    test("con userId válido pero sin carrito retorna items vacíos", async ({
      request,
    }) => {
      await loginWithCredentials(request, REGULAR_USER_2.email, REGULAR_USER_2.password);
      const userId = await getUserIdFromSession(request);

      const res = await request.get(`${API.cart}?userId=${userId}`);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("cartId");
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.items.length).toBe(0);
    });

    test("con userId inexistente retorna items vacíos y cartId null", async ({
      request,
    }) => {
      const inexistentUserId = "00000000-0000-0000-0000-000000000000";

      const res = await request.get(`${API.cart}?userId=${inexistentUserId}`);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.cartId).toBeNull();
    });

    test("con userId inválido 500 para error del servidor", async ({ request }) => {
      const res = await request.get(`${API.cart}?userId=invalid-format`);

      expect(res.status()).toBe(500);
      const body = await res.json();
      expect(body).toHaveProperty("msg");
    });

    test("retorna estructura válida (items: array, cartId)", async ({
      request,
    }) => {
      await loginWithCredentials(request, REGULAR_USER.email, REGULAR_USER.password);
      const userId = await getUserIdFromSession(request);

      const res = await request.get(`${API.cart}?userId=${userId}`);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("cartId");
      expect(typeof body.items).toBe("object");
      expect(Array.isArray(body.items)).toBe(true);
      expect(
        body.cartId === null || typeof body.cartId === "string",
      ).toBeTruthy();
    });

    test("con userId válido recupera carrito existente", async ({
      request,
    }) => {
      await loginWithCredentials(request, REGULAR_USER.email, REGULAR_USER.password);
      const userId = await getUserIdFromSession(request);

      const productsRes = await request.get(API.products);
      const productsBody = await productsRes.json();

      const product = productsBody.products[0];
      await request.post(API.cartSync, {
        data: {
          userId,
          items: [{ productid: product.id, quantity: 1 }],
        },
      });

      const res = await request.get(`${API.cart}?userId=${userId}`);

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("items");
      expect(body).toHaveProperty("cartId");
      expect(Array.isArray(body.items)).toBe(true);
      expect(body.items.length).toBeGreaterThan(0);
      expect(body.cartId).not.toBeNull();
    });
  });

  test.describe("POST /api/cart/sync (sincronizar carrito)", () => {
    test("sincroniza el carrito de un usuario existente", async ({
      request,
    }) => {
      await loginWithCredentials(request, REGULAR_USER.email, REGULAR_USER.password);
      const userId = await getUserIdFromSession(request);

      const productsRes = await request.get(API.products);
      const productsBody = await productsRes.json();

      const product = productsBody.products[0];
      const syncRes = await request.post(API.cartSync, {
        data: {
          userId,
          items: [
            {
              productid: product.id,
              quantity: 2,
              productprice: 24.99,
            },
          ],
        },
      });

      expect(syncRes.status()).toBe(200);
      const syncBody = await syncRes.json();
      expect(syncBody).toHaveProperty("ok", true);
      expect(syncBody).toHaveProperty("staleProductIds");
      expect(Array.isArray(syncBody.staleProductIds)).toBe(true);
      expect(syncBody.staleProductIds.length).not.toBeGreaterThan(0);
      const getRes = await request.get(`${API.cart}?userId=${userId}`);
      const getBody = await getRes.json();
      expect(getBody.items.length).toBe(1);
      expect(getBody.items[0].productid).toBe(product.id);
      expect(getBody.items[0].quantity).toBe(2);
    });

    test("crea un carrito nuevo si el usuario no tenía uno", async ({
      request,
    }) => {
      const uniqueEmail = `test_cart_${Date.now()}@playwright.com`;
      const newUserPassword = "testPassword123";
      await request.post("/api/auth/register", {
        data: {
          email: uniqueEmail,
          username: uniqueEmail.split("@")[0],
          password: newUserPassword,
        },
      });

      await loginWithCredentials(request, uniqueEmail, newUserPassword);
      const userId = await getUserIdFromSession(request);
      expect(userId).toBeDefined();

      const initialRes = await request.get(`${API.cart}?userId=${userId}`);
      const initialBody = await initialRes.json();
      expect(initialBody.items.length).toBe(0);
      expect(initialBody.items.length).toBeNull;

      const productsRes = await request.get(API.products);
      const productsBody = await productsRes.json();
      const product = productsBody.products[0];

      const syncRes = await request.post(API.cartSync, {
        data: {
          userId,
          items: [
            {
              productid: product.id,
              quantity: 1,
            },
          ],
        },
      });

      expect(syncRes.status()).toBe(200);
      const syncBody = await syncRes.json();
      expect(syncBody.ok).toBe(true);

      const getRes = await request.get(`${API.cart}?userId=${userId}`);
      const getBody = await getRes.json();
      expect(getBody.items.length).toBe(1);
      expect(getBody.items[0].productid).toBe(product.id);
    });

    test("reemplaza los items existentes con los nuevos", async ({
      request,
    }) => {
      await loginWithCredentials(request, REGULAR_USER_2.email, REGULAR_USER_2.password);
      const userId = await getUserIdFromSession(request);

      const productsRes = await request.get(API.products);
      const productsBody = await productsRes.json();

      const product1 = productsBody.products[0];
      const product2 = productsBody.products[1];

      await request.post(API.cartSync, {
        data: {
          userId,
          items: [{ productid: product1.id, quantity: 3 }],
        },
      });

      const syncRes = await request.post(API.cartSync, {
        data: {
          userId,
          items: [{ productid: product2.id, quantity: 1 }],
        },
      });

      expect(syncRes.status()).toBe(200);

      const getRes = await request.get(`${API.cart}?userId=${userId}`);
      const getBody = await getRes.json();
      expect(getBody.items.length).toBe(1);
      expect(getBody.items[0].productid).toBe(product2.id);
    });

    test("con items vacíos deja el carrito vacío", async ({ request }) => {
      await loginWithCredentials(request, REGULAR_USER.email, REGULAR_USER.password);
      const userId = await getUserIdFromSession(request);

      const syncRes = await request.post(API.cartSync, {
        data: {
          userId,
          items: [],
        },
      });

      expect(syncRes.status()).toBe(200);
      const syncBody = await syncRes.json();
      expect(syncBody.ok).toBe(true);

      const getRes = await request.get(`${API.cart}?userId=${userId}`);
      const getBody = await getRes.json();
      expect(getBody.items.length).toBe(0);
    });

    test("usa el precio del servidor, no el del cliente", async ({
      request,
    }) => {
      await loginWithCredentials(request, REGULAR_USER_2.email, REGULAR_USER_2.password);
      const userId = await getUserIdFromSession(request);

      const cleanRes = await request.post(API.cartSync, {
        data: {
          userId,
          items: [],
        },
      });
      expect(cleanRes.status()).toBe(200);

      const productsRes = await request.get(API.products);
      const productsBody = await productsRes.json();
      expect(productsBody.products.length).toBeGreaterThan(0);
      const product = productsBody.products[0];
      expect(product).toHaveProperty("price");
      const serverPrice = parseFloat(product.price);
      expect(Number.isFinite(serverPrice)).toBe(true);

      // Intenta sincronizar con precio incorrecto
      const syncRes = await request.post(API.cartSync, {
        data: {
          userId,
          items: [
            {
              productid: product.id,
              quantity: 1,
              productprice: 9999.99, // Precio falso
            },
          ],
        },
      });

      expect(syncRes.status()).toBe(200);
      const syncBody = await syncRes.json();
      expect(syncBody.ok).toBe(true);

      // Obtén el carrito y verifica que usa el precio del servidor
      const getRes = await request.get(`${API.cart}?userId=${userId}`);
      expect(getRes.status()).toBe(200);
      const getBody = await getRes.json();
      expect(getBody.items.length).toBeGreaterThan(0);
      const cartItem = getBody.items[0];
      expect(cartItem).toBeDefined();
      expect(cartItem).toHaveProperty("productprice");
      const cartPrice = parseFloat(cartItem.productprice);
      expect(Number.isFinite(cartPrice)).toBe(true);
      expect(cartPrice).toBeCloseTo(serverPrice, 2);
      expect(cartPrice).not.toBeCloseTo(9999.99, 2);
    });

    test("retorna 200 con { ok: true } al sincronizar exitosamente", async ({
      request,
    }) => {
      await loginWithCredentials(request, REGULAR_USER.email, REGULAR_USER.password);
      const userId = await getUserIdFromSession(request);

      const productsRes = await request.get(API.products);
      const productsBody = await productsRes.json();

      const product = productsBody.products[0];

      const syncRes = await request.post(API.cartSync, {
        data: {
          userId,
          items: [{ productid: product.id, quantity: 1 }],
        },
      });

      expect(syncRes.status()).toBe(200);
      const syncBody = await syncRes.json();
      expect(syncBody).toHaveProperty("ok", true);
      expect(syncBody).toHaveProperty("staleProductIds");
      expect(Array.isArray(syncBody.staleProductIds)).toBe(true);
      expect(syncBody.staleProductIds.length).not.toBeGreaterThan(0);
      const getRes = await request.get(`${API.cart}?userId=${userId}`);
      const getBody = await getRes.json();
      expect(getBody.items.length).toBe(1);
      expect(getBody.items[0].productid).toBe(product.id);
    });

    test("retorna 500 si userId está ausente", async ({ request }) => {
      const productsRes = await request.get(API.products);
      const productsBody = await productsRes.json();
      const product = productsBody.products[0];

      const syncRes = await request.post(API.cartSync, {
        data: {
          items: [{ productid: product.id, quantity: 1 }],
        },
      });

      expect(syncRes.status()).toBe(500);
    });

    test("retorna 200 si items contiene productId inexistente (con staleProductIds)", async ({
      request,
    }) => {
      await loginWithCredentials(request, REGULAR_USER_2.email, REGULAR_USER_2.password);
      const userId = await getUserIdFromSession(request);

      const inexistentProductId = "00000000-0000-0000-0000-000000000000";

      const syncRes = await request.post(API.cartSync, {
        data: {
          userId,
          items: [{ productid: inexistentProductId, quantity: 1 }],
        },
      });

      // Cuando hay productos inexistentes, se retorna 200 ok: true pero con staleProductIds
      expect(syncRes.status()).toBe(200);
      const syncBody = await syncRes.json();
      expect(syncBody.ok).toBe(true);
      expect(syncBody.staleProductIds).toContain(inexistentProductId);
    });
  });
});
