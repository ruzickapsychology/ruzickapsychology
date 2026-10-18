import { expect, test } from "@playwright/test";

test("botanical plates retain their content, links, and layout at every breakpoint", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "chromium", "Explicit viewport matrix.");
  for (const width of [320, 375, 639, 640, 767, 768, 1023, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const cabinet = page.locator('[data-specimen-cabinet="true"]');
    const cards = cabinet.locator('[data-slot="specialty-card"]');
    await expect(cards).toHaveCount(4);
    await expect(cabinet.locator("svg[aria-hidden=true]")).toHaveCount(4);
    // Artwork stays decorative; only the service content and links carry text.
    for (const illustration of await cabinet.locator("svg").all()) {
      const plate = illustration.locator("..");
      await expect(plate).toHaveText("");
    }
    for (const card of await cards.all()) {
      await expect(card.getByRole("heading")).toBeVisible();
      const bounds = await card.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
    const expectedColumns = width < 640 ? 1 : width < 1024 ? 2 : 4;
    const metrics = await cabinet.evaluate((element) => {
      const container = element.closest('[data-slot="container"]')!;
      const containerRect = container.getBoundingClientRect();
      const containerStyle = getComputedStyle(container);
      const gridRect = element.getBoundingClientRect();
      return {
        columns:
          getComputedStyle(element).gridTemplateColumns.split(" ").length,
        left: gridRect.left,
        right: gridRect.right,
        contentLeft:
          containerRect.left + parseFloat(containerStyle.paddingLeft),
        contentRight:
          containerRect.right - parseFloat(containerStyle.paddingRight),
        padding: parseFloat(containerStyle.paddingLeft),
        gap: parseFloat(getComputedStyle(element).columnGap),
        cards: Array.from(element.children).map((card) => {
          const rect = card.getBoundingClientRect();
          return {
            left: rect.left,
            right: rect.right,
            top: rect.top,
            width: rect.width,
          };
        }),
      };
    });
    expect(metrics.columns, `Columns at ${width}px`).toBe(expectedColumns);
    expect(Math.abs(metrics.left - metrics.contentLeft)).toBeLessThan(1);
    expect(Math.abs(metrics.right - metrics.contentRight)).toBeLessThan(1);
    const expectedGutter =
      width < 640 ? 16 : Math.min(40, Math.max(24, width * 0.04));
    expect(Math.abs(metrics.padding - expectedGutter)).toBeLessThan(1);
    expect(metrics.gap).toBe(16);
    for (let i = 0; i < metrics.cards.length; i++) {
      const card = metrics.cards[i];
      const column = i % expectedColumns;
      const rowStart = metrics.cards[i - column];
      expect(Math.abs(card.top - rowStart.top)).toBeLessThan(1);
      expect(Math.abs(card.width - metrics.cards[0].width)).toBeLessThan(1);
      if (column === 0)
        expect(Math.abs(card.left - metrics.left)).toBeLessThan(1);
      else
        expect(
          Math.abs(card.left - metrics.cards[i - 1].right - metrics.gap),
        ).toBeLessThan(1);
      if (column === expectedColumns - 1)
        expect(Math.abs(card.right - metrics.right)).toBeLessThan(1);
      if (i >= expectedColumns)
        expect(card.top).toBeGreaterThan(
          metrics.cards[i - expectedColumns].top,
        );
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const first = cards.first();
    await expect(first).toHaveAttribute("href", /\/individual-therapy/);
  }
  await page.locator('[data-specimen-cabinet="true"] a').first().click();
  await expect(page).toHaveURL(/individual-therapy/);
});

test("botanical illustrations remain still on focus and hover", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "chromium",
    "Keyboard on hover-capable device.",
  );
  await page.goto("/");
  const card = page.locator('[data-specimen-cabinet="true"] a').first();
  await card.focus();
  await expect(card).toBeFocused();
  const animations = () =>
    card.locator("svg g").evaluateAll((els) =>
      els
        .map((el) => ({
          name: getComputedStyle(el).animationName,
          iterations: getComputedStyle(el).animationIterationCount,
        }))
        .filter((value) => value.name !== "none"),
    );
  await expect.poll(animations).toEqual([]);
  await card.hover();
  await expect.poll(animations).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(animations).toEqual([]);
});

test("matching compact illustrations connect the homepage, overview, and service pages", async ({
  page,
}, info) => {
  await page.goto("/");
  const studies = await page
    .locator("[data-specimen-cabinet] a")
    .evaluateAll((cards) =>
      cards.map((card) => ({
        href: card.getAttribute("href")!,
        icon: card.querySelector("svg")!.getAttribute("data-botanical-study")!,
      })),
    );
  expect(studies).toHaveLength(4);
  await page.goto("/specialties");
  for (const { href, icon } of studies) {
    const card = page.locator(`[data-slot="specialty-card"][href="${href}"]`);
    const mark = card.locator('svg[data-size="compact"]');
    await expect(mark).toHaveAttribute("data-botanical-study", icon);
    await card.focus();
    if (info.project.name === "chromium") await card.hover();
    expect(
      await mark.evaluate((el) => el.getAnimations({ subtree: true }).length),
    ).toBe(0);
  }
  for (const { href, icon } of studies) {
    await page.goto(href);
    const mark = page.locator(
      '[data-slot="page-header"] svg[data-size="compact"]',
    );
    await expect(mark).toHaveAttribute("data-botanical-study", icon);
    await expect(mark).toHaveAttribute("aria-hidden", "true");
    const box = await mark.boundingBox();
    expect(box!.width).toBeCloseTo(64, 1);
    expect(box!.height).toBeCloseTo(80, 1);
    const title = await page.locator("h1").boundingBox();
    expect(box!.y + box!.height).toBeLessThan(title!.y);
    expect(
      await mark.evaluate((el) => el.getAnimations({ subtree: true }).length),
    ).toBe(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
