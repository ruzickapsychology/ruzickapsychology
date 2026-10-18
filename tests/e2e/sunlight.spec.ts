import { expect, test } from "@playwright/test";

test("gentle shadow motion pauses offscreen and resumes without jumping", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const sunlight = page.locator('[data-slot="sunlight"]');
  const branch = sunlight.locator("svg");
  const transform = () =>
    branch.evaluate((el) => getComputedStyle(el).transform);
  await sunlight.scrollIntoViewIfNeeded();
  await expect(sunlight).toHaveAttribute("data-motion", "playing");
  const start = await transform();
  await page.clock.runFor(6000);
  const moved = await transform();
  expect(moved).not.toBe(start);
  const bounds = await branch.evaluate((el) => {
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return { x: m.e, y: m.f };
  });
  expect(Math.abs(bounds.x)).toBeLessThanOrEqual(20);
  expect(Math.abs(bounds.y)).toBeLessThanOrEqual(6);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(sunlight).toHaveAttribute("data-motion", "paused");
  const offscreen = await transform();
  await page.clock.runFor(3000);
  expect(await transform()).toBe(offscreen);
  await sunlight.scrollIntoViewIfNeeded();
  await expect(sunlight).toHaveAttribute("data-motion", "playing");
  await page.clock.runFor(2000);
  expect(await transform()).not.toBe(offscreen);
  await expect(sunlight).toHaveAttribute("aria-hidden", "true");
  await expect(sunlight).toHaveCSS("pointer-events", "none");
});

test("visitors can pause and resume the shadow with the keyboard", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const sunlight = page.locator('[data-slot="sunlight"]');
  await sunlight.scrollIntoViewIfNeeded();
  await page.clock.runFor(4000);
  const pause = page.getByRole("button", { name: "Pause shadow motion" });
  await pause.focus();
  await page.keyboard.press("Enter");
  await expect(sunlight).toHaveAttribute("data-motion", "paused");
  const frozen = await sunlight.getAttribute("style");
  await page.clock.runFor(4000);
  expect(await sunlight.getAttribute("style")).toBe(frozen);
  await page
    .getByRole("button", { name: "Resume shadow motion" })
    .press("Enter");
  await expect(sunlight).toHaveAttribute("data-motion", "playing");
  await page.clock.runFor(2000);
  expect(await sunlight.getAttribute("style")).not.toBe(frozen);
});

test("reduced motion keeps sunlight static and the location link usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  const sunlight = page.locator('[data-slot="sunlight"]');
  await sunlight.scrollIntoViewIfNeeded();
  await expect(sunlight).toHaveAttribute("data-motion", "paused");
  await expect(
    page.getByRole("button", { name: "Pause shadow motion" }),
  ).toBeHidden();
  const before = await sunlight
    .locator("svg")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.clock.runFor(8000);
  expect(
    await sunlight
      .locator("svg")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe(before);
  const link = page.getByRole("link", {
    name: "View location and get started",
  });
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact$/);
});

test("shadow artwork has room around every leaf and fades at section edges", async ({
  page,
}) => {
  await page.goto("/");
  const sunlight = page.locator('[data-slot="sunlight"]');
  const margins = await sunlight.locator("svg").evaluate((el) => {
    const svg = el as SVGSVGElement;
    const art = svg.querySelector("g")!.getBBox();
    const box = svg.viewBox.baseVal;
    return [
      art.x - box.x,
      art.y - box.y,
      box.x + box.width - art.x - art.width,
      box.y + box.height - art.y - art.height,
    ];
  });
  expect(Math.min(...margins)).toBeGreaterThan(40);
  await expect(sunlight).not.toHaveCSS("mask-image", "none");
});
