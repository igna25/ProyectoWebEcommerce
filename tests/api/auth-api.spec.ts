import { test, expect, APIRequestContext } from "@playwright/test";
import { ADMIN_USER, INVALID_CREDENTIALS } from "../helpers/test-data";

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

test.describe("API — /api/auth (NextAuth)", () => {
  test.describe("GET /api/auth/session", () => {
    test("retorna sesión vacía para usuario no autenticado", async ({
      request,
    }) => {
      const res = await request.get("/api/auth/session");

      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.user ?? null).toBeNull();
    });

    test("retorna sesión activa con email correcto tras login exitoso", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const res = await request.get("/api/auth/session");
      expect(res.status()).toBe(200);
      const session = await res.json();
      expect(session).toHaveProperty("user");
      expect(session.user).toHaveProperty("email", ADMIN_USER.email);
      expect(session).toHaveProperty("expires");
    });
  });

  test.describe("POST /api/auth/callback/credentials", () => {
    test("login exitoso: la sesión queda establecida", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const sessionRes = await request.get("/api/auth/session");
      const session = await sessionRes.json();
      expect(session.user ?? null).not.toBeNull();
      expect(session.user.email).toBe(ADMIN_USER.email);
    });

    test("login fallido con credenciales incorrectas: no se establece sesión", async ({
      request,
    }) => {
      await loginWithCredentials(
        request,
        INVALID_CREDENTIALS.email,
        INVALID_CREDENTIALS.password,
      );

      const sessionRes = await request.get("/api/auth/session");
      const session = await sessionRes.json();
      expect(session.user ?? null).toBeNull();
    });

    test("login fallido con email con formato inválido: no se establece sesión", async ({
      request,
    }) => {
      await loginWithCredentials(request, "no-es-un-email", "password123");

      const sessionRes = await request.get("/api/auth/session");
      const session = await sessionRes.json();
      expect(session.user ?? null).toBeNull();
    });

    test("login fallido con campos vacíos: no se establece sesión", async ({
      request,
    }) => {
      await loginWithCredentials(request, "", "");

      const sessionRes = await request.get("/api/auth/session");
      const session = await sessionRes.json();
      expect(session.user ?? null).toBeNull();
    });

    test("login fallido con contraseña vacía: no se establece sesión", async ({
      request,
    }) => {
      await loginWithCredentials(request, ADMIN_USER.email, "");

      const sessionRes = await request.get("/api/auth/session");
      const session = await sessionRes.json();
      expect(session.user ?? null).toBeNull();
    });
  });

  test.describe("POST /api/auth/signout", () => {
    test("cierra la sesión correctamente", async ({ request }) => {
      await loginWithCredentials(request, ADMIN_USER.email, ADMIN_USER.password);

      const beforeSignout = await request.get("/api/auth/session");
      const sessionBefore = await beforeSignout.json();
      expect(sessionBefore.user ?? null).not.toBeNull();

      const csrfToken = await getCSRFToken(request);
      const signoutRes = await request.post("/api/auth/signout", {
        form: { csrfToken },
      });
      expect([200, 302]).toContain(signoutRes.status());

      const afterSignout = await request.get("/api/auth/session");
      const sessionAfter = await afterSignout.json();
      expect(sessionAfter.user ?? null).toBeNull();
    });
  });

  test.describe("GET /api/auth/csrf", () => {
    test("retorna un token CSRF válido", async ({ request }) => {
      const res = await request.get("/api/auth/csrf");
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("csrfToken");
      expect(typeof body.csrfToken).toBe("string");
      expect(body.csrfToken.length).toBeGreaterThan(0);
    });
  });

  test.describe("POST /api/auth/register", () => {
    test("registro exitoso retorna message success", async ({ request }) => {
      const uniqueEmail = `test_${Date.now()}@playwright.com`;
      const res = await request.post("/api/auth/register", {
        data: { email: uniqueEmail, password: "password123" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body).toHaveProperty("message", "success");
    });
  });
});
