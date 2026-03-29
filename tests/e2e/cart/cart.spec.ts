import { test, expect, Page } from "@playwright/test";
import { REGULAR_USER, ROUTES } from "../../helpers/test-data";

async function loginAsUser(page: Page) {
  await page.goto(ROUTES.login);
  await page.fill("#email", REGULAR_USER.email);
  await page.fill("#password", REGULAR_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.toString().includes("/login"), {
    timeout: 15000,
  });
}

async function clearCart(page: Page) {
  await page.waitForFunction(() => !!localStorage.getItem("userId"), {
    timeout: 5000,
  });
  const userId = await page.evaluate(() => localStorage.getItem("userId"));
  if (userId) {
    await page.request.post("/api/cart/sync", {
      data: { userId, items: [] },
      headers: { "Content-Type": "application/json" },
    });
  }
  await page.evaluate(() => {
    localStorage.removeItem("cart");
    localStorage.removeItem("productsById");
  });
}

async function goToDashboard(page: Page) {
  await page.goto(ROUTES.dashboard);
  await expect(
    page.locator("h1").filter({ hasText: "Nuestros productos" }),
  ).toBeVisible({ timeout: 10000 });
  await page.locator("h3").first().waitFor({ state: "visible", timeout: 10000 });
}

async function getProductName(page: Page, index: number): Promise<string> {
  await page.locator("h3").nth(index).waitFor({ state: "visible", timeout: 10000 });
  return ((await page.locator("h3").nth(index).textContent()) ?? "").trim();
}

async function addToCart(page: Page, index: number) {
  await page.getByText("Agregar al carrito").nth(index).click();
  await expect(page.getByText("¡Agregado al carrito!")).toBeVisible({
    timeout: 5000,
  });
}

test.describe("Carrito de compras", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
    await clearCart(page);
    await goToDashboard(page);
  });

  test.describe("Agregar al carrito", () => {
    test("muestra el modal de confirmación al agregar un producto", async ({
      page,
    }) => {
      await addToCart(page, 0);
      await expect(page.getByText("¡Agregado al carrito!")).toBeVisible();
    });

    test("el modal muestra el nombre del producto agregado", async ({
      page,
    }) => {
      const productName = await getProductName(page, 0);
      await addToCart(page, 0);
      await expect(
        page.getByRole("dialog").getByText(productName),
      ).toBeVisible();
    });

    test("el modal ofrece seguir comprando o ir al carrito", async ({
      page,
    }) => {
      await addToCart(page, 0);
      await expect(page.getByText("Seguir comprando")).toBeVisible();
      await expect(page.getByText("Ir al carrito")).toBeVisible();
    });

    test("Seguir comprando cierra el modal y permanece en el dashboard", async ({
      page,
    }) => {
      await addToCart(page, 0);
      await page.getByText("Seguir comprando").click();
      await expect(page.getByText("¡Agregado al carrito!")).not.toBeVisible();
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("Ir al carrito navega a /cart", async ({ page }) => {
      await addToCart(page, 0);
      await page.getByText("Ir al carrito").click();
      await expect(page).toHaveURL(/\/cart/);
    });
  });

  test.describe("Carrito con dos productos", () => {
    test("ambos productos aparecen en el carrito tras agregarlos", async ({
      page,
    }) => {
      const firstName = await getProductName(page, 0);
      const secondName = await getProductName(page, 1);

      await addToCart(page, 0);
      await page.getByText("Seguir comprando").click();

      await addToCart(page, 1);
      await page.getByText("Ir al carrito").click();

      await expect(page).toHaveURL(/\/cart/);
      await expect(page.locator("p").filter({ hasText: firstName })).toBeVisible({ timeout: 8000 });
      await expect(page.locator("p").filter({ hasText: secondName })).toBeVisible({ timeout: 8000 });
    });

    test("el resumen muestra el total correcto con dos productos", async ({
      page,
    }) => {
      await addToCart(page, 0);
      await page.getByText("Seguir comprando").click();
      await addToCart(page, 1);
      await page.getByText("Ir al carrito").click();

      await expect(page).toHaveURL(/\/cart/);
      await expect(page.getByText("Total", { exact: true })).toBeVisible({ timeout: 8000 });
      await expect(page.locator("p.text-2xl.font-extrabold")).toBeVisible();
    });
  });

  test.describe("Eliminar producto del carrito", () => {
    test("al eliminar un producto solo queda el otro en el carrito", async ({
      page,
    }) => {
      const firstName = await getProductName(page, 0);
      const secondName = await getProductName(page, 1);

      await addToCart(page, 0);
      await page.getByText("Seguir comprando").click();
      await addToCart(page, 1);
      await page.getByText("Ir al carrito").click();

      await expect(page).toHaveURL(/\/cart/);
      await expect(page.locator("p").filter({ hasText: firstName })).toBeVisible({ timeout: 8000 });

      const firstCartItem = page
        .locator(".bg-white.rounded-2xl.border.p-4")
        .filter({ hasText: firstName });
      await firstCartItem
        .getByRole("button", { name: "Quitar producto" })
        .click();

      await expect(page.locator("p").filter({ hasText: firstName })).not.toBeVisible({
        timeout: 5000,
      });
      await expect(page.locator("p").filter({ hasText: secondName })).toBeVisible();
    });

    test("al eliminar el único producto muestra el carrito vacío", async ({
      page,
    }) => {
      await addToCart(page, 0);
      await page.getByText("Ir al carrito").click();

      await expect(page).toHaveURL(/\/cart/);
      await expect(
        page.getByRole("button", { name: "Quitar producto" }),
      ).toBeVisible({ timeout: 8000 });

      await page.getByRole("button", { name: "Quitar producto" }).click();

      await expect(page.getByText("Tu carrito está vacío")).toBeVisible({
        timeout: 5000,
      });
    });
  });
});
