import { expect, test } from "@playwright/test";

const overviewRoutes = ["/specialties", "/pricing", "/faq", "/blog"];

const standardRoutes = [
  "/specialties",
  "/pricing",
  "/faq",
  "/blog",
  "/privacy",
  "/specialties/couples-therapy",
  "/blog/welcome-to-the-practice",
];

test("page introductions share alignment, heading scale, and navigation clearance", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium",
    "Explicit responsive matrix.",
  );
  for (const [width, gap] of [
    [375, 40],
    [768, 56],
    [1440, 72],
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [...standardRoutes, "/about", "/contact"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveCSS(
        "text-align",
        overviewRoutes.includes(path) ? "center" : "left",
      );
      if (overviewRoutes.includes(path)) {
        for (const selector of [
          "h1",
          '[data-slot="page-header-description"]',
        ]) {
          const element = page.locator(selector);
          if (await element.count()) {
            const box = await element.boundingBox();
            expect(
              Math.abs(box!.x + box!.width / 2 - width / 2),
              path,
            ).toBeLessThan(1);
          }
        }
      }
      const metrics = await page.evaluate(() => {
        const intro = document.querySelector(
          '[data-slot="page-shell"] > section',
        )!;
        const heading = document.querySelector("h1")!;
        return {
          padding: parseFloat(getComputedStyle(intro).paddingTop),
          headerBottom: document
            .querySelector("header")!
            .getBoundingClientRect().bottom,
          fontSize: parseFloat(getComputedStyle(heading).fontSize),
          lineHeight: parseFloat(getComputedStyle(heading).lineHeight),
        };
      });
      expect(
        metrics.padding - metrics.headerBottom,
        path,
      ).toBeGreaterThanOrEqual(gap);
      expect(metrics.lineHeight / metrics.fontSize).toBeCloseTo(1.16, 2);
    }
  }
});

test("breadcrumbs consistently identify nested services and articles", async ({
  page,
}) => {
  for (const path of [
    "/specialties/couples-therapy",
    "/blog/welcome-to-the-practice",
  ]) {
    await page.goto(path);
    const trail = page.getByRole("navigation", {
      name: "Breadcrumb",
      exact: true,
    });
    await expect(
      trail.getByRole("link", { name: "Home", exact: true }),
    ).toHaveAttribute("href", "/");
    await expect(trail.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(
      trail.getByRole("link", {
        name: path.startsWith("/blog") ? "Blog" : "Specialties",
        exact: true,
      }),
    ).toHaveAttribute(
      "href",
      path.startsWith("/blog") ? "/blog" : "/specialties",
    );
  }
  for (const path of [
    "/",
    "/about",
    "/specialties",
    "/pricing",
    "/faq",
    "/blog",
    "/contact",
    "/privacy",
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb", exact: true }),
    ).toHaveCount(0);
  }
});
