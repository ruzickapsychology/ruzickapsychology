import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/specialties",
  "/pricing",
  "/contact",
  "/faq",
  "/blog",
  "/blog/welcome-to-the-practice",
];

test.describe("public routes", () => {
  for (const route of routes) {
    test(`${route} renders without critical accessibility violations`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
});

test("mobile menu exposes primary and utility navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /open menu/i }).click();

  const primaryNav = page.getByLabel("Mobile primary navigation");
  const secondaryNav = page.getByLabel("Mobile secondary navigation");

  await expect(primaryNav.getByRole("link", { name: "About" })).toBeVisible();
  await expect(
    primaryNav.getByRole("link", { name: "Specialties" }),
  ).toBeVisible();
  await expect(secondaryNav.getByRole("link", { name: "Blog" })).toBeVisible();
  await expect(secondaryNav.getByRole("link", { name: "FAQ" })).toBeVisible();
});

test("home and contact headers are transparent at the top", async ({
  page,
}) => {
  for (const route of ["/", "/contact"]) {
    await page.goto(route);
    await page.reload();
    await page.evaluate(() => window.scrollTo(0, 0));

    const header = page.locator("header");

    await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  }
});

test("home header becomes solid after scrolling past the hero", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 980));

  await expect(page.locator("header")).toHaveCSS(
    "background-color",
    "rgba(217, 211, 198, 0.8)",
  );
});

test("contact success bloom renders without submitting externally", async ({
  page,
}) => {
  await page.route("https://api.web3forms.com/submit", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.goto("/contact");
  await page.getByLabel("First name").fill("Test");
  await page.getByLabel("Email address").fill("test@example.com");
  await page
    .getByLabel("Scheduling or general question")
    .fill("Testing the success animation.");
  await page.getByRole("button", { name: "Submit →" }).click();

  await expect(
    page.locator('img[src*="/images/submission-flower.svg"]'),
  ).toBeVisible();
  await expect(page.locator('object[data*="submission-flower"]')).toHaveCount(
    0,
  );
});
