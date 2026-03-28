import { test, expect, Page } from "@playwright/test";
import {
  ADMIN_USER,
  REGULAR_USER,
  INVALID_CREDENTIALS,
} from "../../helpers/test-data";

async function fillAndSubmitLoginForm(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
}

test.describe("Login — UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test.describe("Renderizado del formulario", () => {
    test("muestra el título de bienvenida", async ({ page }) => {
      await expect(page.locator("h2").filter({ hasText: "Bienvenido" })).toBeVisible();
    });

    test("muestra los campos email y password", async ({ page }) => {
      await expect(page.locator("#email")).toBeVisible();
      await expect(page.locator("#password")).toBeVisible();
    });

    test("el campo email es de tipo email", async ({ page }) => {
      await expect(page.locator("#email")).toHaveAttribute("type", "email");
    });

    test("el campo password es de tipo password", async ({ page }) => {
      await expect(page.locator("#password")).toHaveAttribute(
        "type",
        "password",
      );
    });

    test("muestra el botón Sign In", async ({ page }) => {
      const submitBtn = page.locator('button[type="submit"]');
      await expect(submitBtn).toBeVisible();
      await expect(submitBtn).toContainText("Iniciar sesión");
    });

    test("muestra enlace para registro", async ({ page }) => {
      const registerLink = page.locator('a[href="/register"]');
      await expect(registerLink).toBeVisible();
      await expect(registerLink).toContainText("Registrate aquí");
    });

    test("los campos email y password son requeridos", async ({ page }) => {
      await expect(page.locator("#email")).toHaveAttribute("required", "");
      await expect(page.locator("#password")).toHaveAttribute("required", "");
    });
  });

  test.describe("Login exitoso", () => {
    test("admin: redirige a /admin tras el login", async ({ page }) => {
      await fillAndSubmitLoginForm(page, ADMIN_USER.email, ADMIN_USER.password);
      await page.waitForURL("**/admin**", { timeout: 15000 });
      expect(page.url()).toContain("/admin");
    });

    test("usuario regular: redirige a / tras el login", async ({ page }) => {
      await fillAndSubmitLoginForm(
        page,
        REGULAR_USER.email,
        REGULAR_USER.password,
      );
      await page.waitForURL("http://localhost:3000/", { timeout: 15000 });
      expect(page.url()).toBe("http://localhost:3000/");
    });
  });

  test.describe("Login fallido", () => {
    test("credenciales inexistentes: permanece en /login", async ({ page }) => {
      await fillAndSubmitLoginForm(
        page,
        INVALID_CREDENTIALS.email,
        INVALID_CREDENTIALS.password,
      );
      await page.waitForURL("**/login**", { timeout: 15000 });
      expect(page.url()).toContain("/login");
    });

    test("contraseña incorrecta para usuario existente: permanece en /login", async ({
      page,
    }) => {
      await fillAndSubmitLoginForm(
        page,
        ADMIN_USER.email,
        "contraseñaIncorrecta",
      );
      await page.waitForURL("**/login**", { timeout: 15000 });
      expect(page.url()).toContain("/login");
    });

    test("email con formato inválido: el formulario no se envía (validación HTML5)", async ({
      page,
    }) => {
      await page.fill("#email", "no-es-un-email");
      await page.fill("#password", "password123");
      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);
      expect(page.url()).toContain("/login");
    });
  });

  test.describe("Navegación desde el formulario", () => {
    test("el enlace de registro navega a /register", async ({ page }) => {
      await page.click('a[href="/register"]');
      await page.waitForURL("**/register**");
      expect(page.url()).toContain("/register");
    });
  });
});
