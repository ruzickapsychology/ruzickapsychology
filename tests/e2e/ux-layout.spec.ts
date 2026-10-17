import { expect, test } from "@playwright/test";

test.use({
  video: process.env.UX_AUDIT_CAPTURE_DIR ? "on" : "retain-on-failure",
  trace: "retain-on-failure",
});

test("fees remain unbroken and inside their panel at narrow and tablet widths", async ({
  page,
}, testInfo) => {
  test.skip(
    !["chromium", "webkit"].includes(testInfo.project.name),
    "Explicit breakpoint matrix.",
  );
  for (const width of [320, 375, 768, 820, 1024]) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto("/pricing");
    const amounts = page.getByText(/^\$\d+$/, { exact: true });
    for (const amount of await amounts.all()) {
      const metrics = await amount.evaluate((element) => ({
        height: element.getBoundingClientRect().height,
        lineHeight: Number.parseFloat(getComputedStyle(element).lineHeight),
        right: element.getBoundingClientRect().right,
        rowRight: element.parentElement!.getBoundingClientRect().right,
      }));
      expect(metrics.height).toBeLessThanOrEqual(metrics.lineHeight + 1);
      expect(metrics.right).toBeLessThanOrEqual(metrics.rowRight + 1);
    }
  }
});

test("stacked biography scrolls without the portrait covering its text", async ({
  page,
}, testInfo) => {
  test.skip(
    !["chromium", "webkit"].includes(testInfo.project.name),
    "Explicit breakpoint matrix.",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [375, 768, 1023, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    const portrait = page.locator('[data-slot="circular-portrait"]');
    const start = await portrait.boundingBox();
    await page.evaluate(() => window.scrollTo(0, 500));
    const end = await portrait.boundingBox();
    const scroll = await page.evaluate(() => window.scrollY);
    await page.screenshot({ path: testInfo.outputPath(`about-${width}.png`) });
    if (width < 1024) {
      expect(
        Math.abs(end!.y + scroll - start!.y),
        `Portrait at ${width}px`,
      ).toBeLessThan(2);
    } else {
      expect(end!.y).toBeGreaterThanOrEqual(64);
      expect(end!.x + end!.width).toBeLessThan(
        (await page.locator("h1").boundingBox())!.x,
      );
    }
  }
});

test("successful inquiry preserves the form footprint and shows confirmation", async ({
  page,
}, testInfo) => {
  await page.route("https://api.web3forms.com/submit", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );
  await page.goto("/contact");
  await page.getByLabel("First name").fill("UX Test");
  await page.getByLabel("Email address").fill("ux-test@example.com");
  await page
    .getByLabel("Scheduling or general question")
    .fill("Local mocked test; no inquiry will be sent.");
  const form = page.locator("form");
  const before = await form.boundingBox();
  await page.screenshot({
    path: testInfo.outputPath("form-before.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Submit →" }).click();
  const confirmation = page
    .getByRole("status")
    .filter({ hasText: "Your message has been received." });
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toBeFocused();
  await expect(confirmation).toBeInViewport({ ratio: 1 });
  expect((await confirmation.boundingBox())!.y).toBeGreaterThan(64);
  await page.screenshot({
    path: testInfo.outputPath("form-success.png"),
    fullPage: true,
  });
  const after = await form.boundingBox();
  expect(Math.abs(after!.height - before!.height)).toBeLessThan(2);
});
