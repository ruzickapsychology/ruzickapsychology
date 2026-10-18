import { expect, test } from "@playwright/test";

const animatedGlyphs = () =>
  Array.from(document.querySelectorAll('[data-slot="specialty-glyph"]')).filter(
    (glyph) =>
      Array.from(glyph.querySelectorAll("*")).some(
        (part) => getComputedStyle(part).animationName !== "none",
      ),
  ).length;

test("botanical illustrations and compact marks stay still during touch scrolling", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "mobile-chrome",
    "Requires a non-hover touch device.",
  );
  for (const route of ["/", "/specialties"]) {
    if (route === "/") await page.goto(route);
    else {
      await page
        .getByRole("navigation", { name: "Footer navigation" })
        .getByRole("link", { name: "Specialties", exact: true })
        .click();
      await expect(page).toHaveURL(/\/specialties$/);
    }
    const glyphs = page.locator('[data-slot="specialty-glyph"]');
    for (let i = 0; i < (await glyphs.count()); i++) {
      await glyphs.nth(i).evaluate((el) => {
        const r = el.getBoundingClientRect();
        window.scrollTo(0, scrollY + r.top - innerHeight * 0.4);
      });
      const card = page.locator('[data-slot="specialty-card"]').nth(i);
      await expect(card).toHaveAttribute("data-motion-active", "true");
      await expect.poll(() => page.evaluate(animatedGlyphs)).toBe(0);
      const iterations = await card
        .locator("svg *")
        .evaluateAll((parts) =>
          parts
            .filter((part) => getComputedStyle(part).animationName !== "none")
            .map((part) => getComputedStyle(part).animationIterationCount),
        );
      expect(iterations.every((value) => value === "1")).toBe(true);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator('[data-motion-active="true"]')).toHaveCount(0);
    await expect.poll(() => page.evaluate(animatedGlyphs)).toBe(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect.poll(() => page.evaluate(animatedGlyphs)).toBe(0);
    await page.evaluate(() =>
      scrollTo(0, document.documentElement.scrollHeight),
    );
    await expect(page.locator('[data-motion-active="true"]')).toHaveCount(0);
  }
});

test("desktop homepage illustrations stay still on hover and keyboard focus", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "chromium", "Requires a hover device.");
  await page.goto("/");
  const card = page.locator('[data-slot="specialty-card"]').first();
  await card.hover();
  await expect.poll(() => page.evaluate(animatedGlyphs)).toBe(0);
  await page.mouse.move(0, 0);
  await card.focus();
  await expect.poll(() => page.evaluate(animatedGlyphs)).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.evaluate(animatedGlyphs)).toBe(0);
});
