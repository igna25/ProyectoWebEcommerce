import { test, expect, Page } from "@playwright/test";
import path from "path";
import { ADMIN_USER, REGULAR_USER, ROUTES } from "../../helpers/test-data";

const TEST_IMAGE = path.join(__dirname, "../../fixtures/test-product.jpg");

async function loginAs(page: Page, email: string, password: string) {
  await page.goto(ROUTES.login);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.toString().includes("/login"), {
    timeout: 15000,
  });
}

async function goToNuevo(page: Page) {
  await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
  await page.goto(ROUTES.adminNuevo);
  await expect(page.locator("#productName")).toBeVisible();
}

async function fillForm(
  page: Page,
  fields: {
    name?: string;
    description?: string;
    price?: string;
    stock?: string;
    withImage?: boolean;
  },
) {
  if (fields.name !== undefined) await page.fill("#productName", fields.name);
  if (fields.description !== undefined)
    await page.fill("#description", fields.description);
  if (fields.price !== undefined) await page.fill("#price", fields.price);
  if (fields.stock !== undefined) await page.fill("#stock", fields.stock);
  if (fields.withImage) {
    await page.locator('input[type="file"]').setInputFiles(TEST_IMAGE);
  }
}

test.describe("Admin — Crear y Editar un Producto (/admin/nuevo)", () => {
  test.describe("Control de acceso", () => {
    test("usuario no autenticado es redirigido a /login", async ({ page }) => {
      await page.goto(ROUTES.adminNuevo);
      await expect(page).toHaveURL(/\/login/);
    });

    test("usuario regular es redirigido a /", async ({ page }) => {
      await loginAs(page, REGULAR_USER.email, REGULAR_USER.password);
      await page.goto(ROUTES.adminNuevo);
      await expect(page).toHaveURL("http://localhost:3000/");
    });

    test("admin accede correctamente a la página", async ({ page }) => {
      await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
      await page.goto(ROUTES.adminNuevo);
      await expect(page).toHaveURL(/\/admin\/nuevo/);
    });
  });

  test.describe("Renderizado del formulario", () => {
    test.beforeEach(async ({ page }) => {
      await goToNuevo(page);
    });

    test("muestra el título Crear Nuevo Producto", async ({ page }) => {
      await expect(
        page.locator("h2").filter({ hasText: "Crear Nuevo Producto" }),
      ).toBeVisible();
    });

    test("muestra todos los campos del formulario", async ({ page }) => {
      await expect(page.locator("#productName")).toBeVisible();
      await expect(page.locator("#description")).toBeVisible();
      await expect(page.locator("#price")).toBeVisible();
      await expect(page.locator("#stock")).toBeVisible();
      await expect(page.locator('input[type="file"]')).toBeAttached();
    });

    test("el botón de submit muestra el texto Crear Producto", async ({
      page,
    }) => {
      await expect(page.locator('button[type="submit"]')).toContainText(
        "Crear Producto",
      );
    });

    test("el botón de submit está habilitado inicialmente", async ({
      page,
    }) => {
      await expect(page.locator('button[type="submit"]')).toBeEnabled();
    });
  });

  test.describe("Validaciones del formulario", () => {
    test.beforeEach(async ({ page }) => {
      await goToNuevo(page);
    });

    test("muestra todos los errores al enviar el formulario vacío", async ({
      page,
    }) => {
      await page.click('button[type="submit"]');
      await expect(
        page.locator(
          "text=El nombre del producto debe tener al menos 3 caracteres",
        ),
      ).toBeVisible();
      await expect(
        page.locator("text=La descripción debe tener al menos 20 caracteres"),
      ).toBeVisible();
      await expect(
        page.locator("text=El precio debe ser un número positivo"),
      ).toBeVisible();
      await expect(
        page.locator("text=El stock debe ser un número no negativo"),
      ).toBeVisible();
      await expect(
        page.locator("text=Debe seleccionar una imagen"),
      ).toBeVisible();
    });

    test("muestra error cuando el nombre tiene menos de 3 caracteres", async ({
      page,
    }) => {
      await fillForm(page, { name: "ab" });
      await page.click('button[type="submit"]');
      await expect(
        page.locator(
          "text=El nombre del producto debe tener al menos 3 caracteres",
        ),
      ).toBeVisible();
    });

    test("muestra error cuando la descripción tiene menos de 20 caracteres", async ({
      page,
    }) => {
      await fillForm(page, { description: "Muy corta" });
      await page.click('button[type="submit"]');
      await expect(
        page.locator("text=La descripción debe tener al menos 20 caracteres"),
      ).toBeVisible();
    });

    test("muestra error cuando el precio es negativo", async ({ page }) => {
      await fillForm(page, { price: "-5" });
      await page.click('button[type="submit"]');
      await expect(
        page.locator("text=El precio debe ser un número positivo"),
      ).toBeVisible();
    });

    test("muestra error cuando el precio es cero", async ({ page }) => {
      await fillForm(page, { price: "0" });
      await page.click('button[type="submit"]');
      await expect(
        page.locator("text=El precio debe ser un número positivo"),
      ).toBeVisible();
    });

    test("muestra error cuando no se selecciona imagen", async ({ page }) => {
      await fillForm(page, {
        name: "Producto válido",
        description: "Descripción suficientemente larga para pasar la validación",
        price: "99.99",
        stock: "10",
      });
      await page.click('button[type="submit"]');
      await expect(
        page.locator("text=Debe seleccionar una imagen"),
      ).toBeVisible();
    });

    test("no muestra errores de nombre ni descripción cuando los valores son válidos", async ({
      page,
    }) => {
      await fillForm(page, {
        name: "Producto Válido",
        description:
          "Descripción suficientemente larga para pasar la validación del formulario",
      });
      await page.click('button[type="submit"]');
      await expect(
        page.locator(
          "text=El nombre del producto debe tener al menos 3 caracteres",
        ),
      ).not.toBeVisible();
      await expect(
        page.locator("text=La descripción debe tener al menos 20 caracteres"),
      ).not.toBeVisible();
    });
  });

  test.describe("Creación exitosa de producto", () => {
    test.beforeEach(async ({ page }) => {
      await goToNuevo(page);
    });

    test("muestra el toast de éxito al crear el producto correctamente", async ({
      page,
    }) => {
      await fillForm(page, {
        name: "Producto Test Playwright",
        description:
          "Descripción generada automáticamente por Playwright para pruebas E2E",
        price: "99.99",
        stock: "10",
        withImage: true,
      });
      await page.click('button[type="submit"]');
      await expect(
        page.getByText("Producto creado exitosamente"),
      ).toBeVisible({ timeout: 20000 });
    });

    test("el botón se deshabilita mientras se procesa el envío", async ({
      page,
    }) => {
      await fillForm(page, {
        name: "Producto Test Playwright",
        description:
          "Descripción generada automáticamente por Playwright para pruebas E2E",
        price: "99.99",
        stock: "10",
        withImage: true,
      });
      const submitBtn = page.locator('button[type="submit"]');
      await page.click('button[type="submit"]');
      await expect(submitBtn).toBeDisabled({ timeout: 5000 });
    });

    test("el formulario se limpia tras crear el producto exitosamente", async ({
      page,
    }) => {
      await fillForm(page, {
        name: "Producto Test Playwright",
        description:
          "Descripción generada automáticamente por Playwright para pruebas E2E",
        price: "99.99",
        stock: "10",
        withImage: true,
      });
      await page.click('button[type="submit"]');
      await expect(
        page.getByText("Producto creado exitosamente"),
      ).toBeVisible({ timeout: 20000 });
      await expect(page.locator("#productName")).toHaveValue("");
      await expect(page.locator("#description")).toHaveValue("");
      await expect(page.locator("#price")).toHaveValue("");
      await expect(page.locator("#stock")).toHaveValue("");
    });
  });

  test.describe("Editar un producto", ()=>{
    test.beforeEach(async ({page})=>{
      await loginAs(page, ADMIN_USER.email, ADMIN_USER.password);
      await page.goto(ROUTES.adminActivos);
      await page.locator("text=Editar").first().click();
      await expect(page).toHaveURL(/\/admin\/activos\/.*/);
    });

    test("muestra el formulario de edición con los datos del producto", async ({page})=>{
      await expect(page.locator("#productName")).toBeVisible();
      await expect(page.locator("#description")).toBeVisible();
      await expect(page.locator("#price")).toBeVisible();
      await expect(page.locator("#stock")).toBeVisible();
      await expect(page.locator('input[type="file"]')).toBeAttached();
    });

    test("Edición exitosa del producto", async ({page})=>{
      await fillForm(page, {
        name: "Test edición playwrgiht",
        description: "Descripción generada automáticamente por Playwright para pruebas E2E",
        price: "99.99",
        stock: "10",
        withImage: true,
      });
      await page.click('button[type="submit"]');
      await expect(
        page.getByText("Producto actualizado exitosamente"),
      ).toBeVisible({ timeout: 20000 });
    });

  });
});
