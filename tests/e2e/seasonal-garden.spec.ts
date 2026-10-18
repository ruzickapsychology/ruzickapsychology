import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const root = '[data-slot="seasonal-garden"]';

const calendarCases = [
  ["2026-03-01T02:00:00Z", "winter"], // Still February in Rochester.
  ["2026-03-01T05:00:00Z", "spring"],
  ["2026-06-01T04:00:00Z", "summer"],
  ["2026-09-01T04:00:00Z", "autumn"],
  ["2026-12-01T05:00:00Z", "winter"],
] as const;

test("the imagery automatically follows the Rochester calendar without seasonal UI", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let initialSize: { width: number; height: number } | undefined;
  for (const [date, season] of calendarCases) {
    await page.clock.setFixedTime(new Date(date));
    await page.goto("/specialties");
    const garden = page.locator(root);
    await expect(garden).toHaveAttribute("data-season", season);
    await expect(garden.locator("svg")).toBeVisible();
    await expect(garden).toHaveAttribute("aria-hidden", "true");
    await expect(garden).toHaveText("");
    await expect(
      garden.locator("button, input, select, a, [tabindex], [aria-live], text"),
    ).toHaveCount(0);
    const box = await garden.locator("svg").boundingBox();
    expect(box).not.toBeNull();
    const size = { width: box!.width, height: box!.height };
    initialSize ??= size;
    expect(size).toEqual(initialSize);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
  await expect(
    page
      .locator("#seasonal-modality")
      .getByRole("link", { name: "Learn more" }),
  ).toHaveAttribute("href", "/specialties/couples-therapy");
  expect(
    (await new AxeBuilder({ page }).include("#seasonal-modality").analyze())
      .violations,
  ).toEqual([]);
});

test("the decorative artwork remains still with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.setFixedTime(new Date("2026-07-15T12:00:00Z"));
  await page.goto("/specialties");
  const garden = page.locator(root);
  await expect(garden).toHaveAttribute("data-season", "summer");
  expect(
    await garden.locator("svg *").evaluateAll((parts) =>
      parts.every((part) => {
        const style = getComputedStyle(part);
        return (
          style.animationName === "none" && style.transitionDuration === "0s"
        );
      }),
    ),
  ).toBe(true);
});

test("the static artwork reserves the same dimensions before hydration", async ({
  browser,
  baseURL,
  page,
}) => {
  const viewport = page.viewportSize()!;
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport,
  });
  const staticPage = await context.newPage();
  await staticPage.goto(`${baseURL}/specialties`);
  const staticGarden = staticPage.locator(root);
  await expect(staticGarden.locator("svg")).toBeVisible();
  await expect(staticGarden).toHaveText("");
  const before = await staticGarden.locator("svg").boundingBox();
  await page.clock.setFixedTime(new Date("2026-10-15T12:00:00Z"));
  await page.goto("/specialties");
  await expect(page.locator(root)).toHaveAttribute("data-season", "autumn");
  const after = await page.locator(`${root} svg`).boundingBox();
  expect(after!.width).toBeCloseTo(before!.width, 1);
  expect(after!.height).toBeCloseTo(before!.height, 1);
  await context.close();
});

test("the seasonal illustration belongs to the Imago section and leaves the homepage sunlight intact", async ({
  page,
}, info) => {
  await page.goto("/");
  await expect(page.locator(root)).toHaveCount(0);
  await expect(page.locator('[data-slot="sunlight"]')).toHaveCount(1);
  if (info.project.name !== "chromium") return;
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/specialties");
    const section = page.locator("#seasonal-modality");
    await expect(section.locator(root)).toHaveCount(1);
    const content = section
      .locator('[data-slot="grid-container"] > div')
      .first();
    const copy = await content.boundingBox();
    const art = await section.locator(root).boundingBox();
    if (width >= 1024) expect(art!.x).toBeGreaterThan(copy!.x + copy!.width);
    else expect(art!.y).toBeGreaterThan(copy!.y + copy!.height);
    expect(art!.x).toBeGreaterThanOrEqual(0);
    expect(art!.x + art!.width).toBeLessThanOrEqual(width);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
