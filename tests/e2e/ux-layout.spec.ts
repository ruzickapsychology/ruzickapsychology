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

test("section headers have one spacing owner across responsive boundaries", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium",
    "Explicit breakpoint matrix.",
  );
  for (const width of [320, 375, 639, 640, 768, 1023, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/about", "/contact"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const headers = page.locator('[data-slot="content-header"]');
      const measured = await headers.evaluateAll((elements) =>
        elements.flatMap((header) => {
          const next = header.nextElementSibling;
          if (
            !next ||
            !["divider-grid", "grid"].includes(
              next.getAttribute("data-slot") ?? "",
            )
          )
            return [];
          const expected = parseFloat(getComputedStyle(header).marginBottom);
          return [
            {
              expected,
              actual:
                next.getBoundingClientRect().top -
                header.getBoundingClientRect().bottom,
            },
          ];
        }),
      );
      expect(measured.length, route).toBeGreaterThan(0);
      for (const gap of measured) {
        expect(
          Math.abs(gap.actual - gap.expected),
          `${route} at ${width}px`,
        ).toBeLessThan(1);
        expect(gap.actual).toBeGreaterThanOrEqual(32);
        expect(gap.actual).toBeLessThanOrEqual(
          width < 640 ? 32 : width < 1024 ? 40 : 60,
        );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      if (route === "/contact" && [375, 768, 1440].includes(width)) {
        await page
          .getByRole("heading", { name: "What to Expect", exact: true })
          .locator("xpath=ancestor::section")
          .screenshot({ path: testInfo.outputPath(`process-${width}.png`) });
      }
    }
  }
});

test("divider grids share the page gutter until their column breakpoint", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium",
    "Explicit breakpoint matrix.",
  );
  for (const width of [320, 375, 639, 640, 767, 768, 1023, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, breakpoint, columns] of [
      ["/", 640, 2],
      ["/specialties", 768, 2],
      ["/contact", 640, 4],
    ] as const) {
      await page.goto(route);
      const grid = page.locator('[data-slot="divider-grid"]');
      const metrics = await grid.evaluate((element) => {
        const item = element.querySelector('[data-slot="divider-grid-item"]')!;
        const content = item.firstElementChild!;
        const style = getComputedStyle(content);
        return {
          columns:
            getComputedStyle(element).gridTemplateColumns.split(" ").length,
          inset: parseFloat(style.paddingLeft),
          rightInset: parseFloat(style.paddingRight),
          x:
            content.getBoundingClientRect().left +
            parseFloat(style.paddingLeft),
          gridX: element.getBoundingClientRect().left,
        };
      });
      const expectedColumns =
        width < breakpoint ? 1 : columns === 4 && width >= 1024 ? 4 : 2;
      expect(metrics.columns, `${route} at ${width}`).toBe(expectedColumns);
      expect(metrics.inset).toBe(width < breakpoint ? 0 : 32);
      expect(metrics.rightInset).toBe(metrics.inset);
      if (width < breakpoint) expect(metrics.x).toBe(metrics.gridX);
      if (route === "/contact" && width < 640) {
        const location = await page
          .getByText("Location", { exact: true })
          .boundingBox();
        expect(Math.abs(location!.x - metrics.x)).toBeLessThan(1);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});

test("footer keeps mobile navigation compact with comfortable tap targets", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium",
    "Explicit breakpoint matrix.",
  );
  for (const width of [320, 375, 640, 767, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact");
    const footer = page.locator('[data-slot="site-footer"]');
    const nav = footer.getByRole("navigation", { name: "Footer navigation" });
    const columns = await nav
      .locator('[data-slot="grid"]')
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
      );
    expect(columns).toBe(width < 768 ? 2 : 1);
    for (const link of await nav.getByRole("link").all()) {
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    const badge = footer.getByRole("link", {
      name: /Rochester, New York — home/,
    });
    if (width < 768) await expect(badge).toBeHidden();
    else await expect(badge).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 375)
      await footer.screenshot({
        path: testInfo.outputPath("footer-mobile.png"),
        style: "header, .skip-link { visibility: hidden !important; }",
      });
  }
});

test("page containers share responsive screen gutters", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "chromium", "Explicit breakpoint matrix.");
  for (const width of [320, 375, 639, 640, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/about",
      "/specialties",
      "/specialties/couples-therapy",
      "/pricing",
      "/faq",
      "/contact",
      "/blog",
      "/privacy",
    ]) {
      await page.goto(route);
      const expected =
        width < 640 ? 16 : Math.min(40, Math.max(24, width * 0.04));
      const paddings = await page
        .locator(
          '[data-slot="container"], [data-slot="grid-container"], [data-slot="content-section-content"], [data-slot="immersive-page-header-content"]',
        )
        .evaluateAll((elements) =>
          elements.map((e) => ({
            left: parseFloat(getComputedStyle(e).paddingLeft),
            right: parseFloat(getComputedStyle(e).paddingRight),
          })),
        );
      expect(paddings.length).toBeGreaterThan(0);
      for (const padding of paddings) {
        expect(Math.abs(padding.left - expected)).toBeLessThan(0.1);
        expect(Math.abs(padding.right - expected)).toBeLessThan(0.1);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});
