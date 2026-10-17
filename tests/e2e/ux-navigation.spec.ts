import { expect, test } from "@playwright/test";

for (const path of ["/", "/contact"]) {
  test(`reduced-motion menu retains its readable backdrop on ${path}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(menu).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Close menu" }),
    ).toHaveAttribute("aria-expanded", "true");
    const links = menu.getByRole("link");
    expect(await links.count()).toBeGreaterThan(0);
    for (const link of await links.all()) {
      await expect(link).toHaveCSS("animation-name", "none");
      await expect(link).toHaveCSS("opacity", "1");
      await expect(link).toHaveCSS("transform", "none");
    }
    if (process.env.UX_AUDIT_CAPTURE_DIR) {
      await page.screenshot({
        path: `${process.env.UX_AUDIT_CAPTURE_DIR}/reduced-motion-menu-${path === "/" ? "home" : "contact"}-${testInfo.project.name}.png`,
      });
    }
    await expect(menu).toHaveCSS("backdrop-filter", "blur(40px)");
    await expect(menu).toHaveCSS("animation-name", "none");
    await page.keyboard.press("Escape");
    await expect(page.locator("main")).toHaveJSProperty("inert", false);
  });
}

test("mobile menu controls have comfortable touch targets without growing the header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  const header = page.locator("header");
  const open = page.getByRole("button", { name: "Open menu" });
  const openBox = await open.boundingBox();
  expect(openBox?.height).toBeGreaterThanOrEqual(44);
  expect(openBox?.width).toBeGreaterThanOrEqual(44);
  expect((await header.boundingBox())?.height).toBeLessThanOrEqual(64);
  await open.click();
  const closeBox = await page
    .getByRole("button", { name: "Close menu" })
    .boundingBox();
  expect(closeBox?.height).toBeGreaterThanOrEqual(44);
});

test("footer navigation and contact links have light keyboard focus rings", async ({
  page,
}) => {
  await page.goto("/about");
  for (const link of [
    page.locator("footer").getByRole("link", { name: "About", exact: true }),
    page.locator('footer a[href^="tel:"]'),
  ]) {
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS("outline-color", "rgb(241, 238, 235)");
    await expect(link).toHaveCSS("outline-width", "2px");
  }
});

test("short landscape menu scrolls below the wordmark and keeps every link reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 700, height: 375 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/faq");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Navigation menu" });
  const links = menu.getByRole("link");
  const headerBottom = await page
    .getByRole("button", { name: "Close menu" })
    .evaluate((el) => el.getBoundingClientRect().bottom);
  for (const link of await links.all()) {
    await link.focus();
    await expect(link).toBeInViewport();
    expect((await link.boundingBox())!.y).toBeGreaterThan(headerBottom);
  }
  const wordmark = page
    .locator("header")
    .getByRole("link", { name: "Ruzicka Psychology", exact: true });
  const box = (await wordmark.boundingBox())!;
  expect(
    await page.evaluate(
      ({ x, y }) =>
        document.elementFromPoint(x, y)?.closest("a")?.getAttribute("href"),
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    ),
  ).toBe("/");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});
