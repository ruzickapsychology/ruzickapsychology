import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/specialties",
  "/specialties/individual-therapy",
  "/specialties/couples-therapy",
  "/specialties/perinatal-postpartum-therapy",
  "/specialties/group-therapy",
  "/pricing",
  "/contact",
  "/faq",
  "/privacy",
  "/blog",
  "/blog/welcome-to-the-practice",
];

const responsiveViewports = [
  { name: "small mobile", width: 320, height: 568 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "short landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

test.describe("public routes", () => {
  for (const route of routes) {
    test(`${route} renders without critical accessibility violations`, async ({
      page,
    }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("body")).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();

      expect(results.violations).toEqual([]);
    });
  }
});

test("public routes fit the supported viewport matrix", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "chromium",
    "The explicit matrix already covers mobile and desktop widths.",
  );

  for (const viewport of responsiveViewports) {
    await page.setViewportSize(viewport);

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} at ${viewport.name}`).toBe(200);
      await page.evaluate(async () => document.fonts.ready);

      const layout = await page.evaluate(() => {
        const dividerGrids = Array.from(
          document.querySelectorAll<HTMLElement>('[data-slot="divider-grid"]'),
        ).map((grid) => {
          const container = grid.closest<HTMLElement>(
            '[data-slot="container"]',
          );
          return {
            width: grid.getBoundingClientRect().width,
            containerWidth: container?.getBoundingClientRect().width ?? 0,
          };
        });

        return {
          viewportWidth: window.innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          h1Count: document.querySelectorAll("main h1").length,
          brokenImages: Array.from(document.images).filter(
            (image) => image.complete && image.naturalWidth === 0,
          ).length,
          pageHeaderTransitions: Array.from(
            document.querySelectorAll<HTMLElement>('[data-slot="page-header"]'),
          ).flatMap((header) => {
            const content = header.nextElementSibling;
            return content?.getAttribute("data-slot") === "content-section"
              ? [Number.parseFloat(getComputedStyle(content).paddingBlockStart)]
              : [];
          }),
          textLinks: Array.from(
            document.querySelectorAll<HTMLElement>('[data-slot="text-link"]'),
          ).map((link) => {
            const style = getComputedStyle(link);
            return {
              borderBottomWidth: style.borderBottomWidth,
              textDecorationLine: style.textDecorationLine,
            };
          }),
          dividerGrids,
        };
      });

      expect(
        layout.documentWidth,
        `${route} document overflow at ${viewport.name}`,
      ).toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(
        layout.bodyWidth,
        `${route} body overflow at ${viewport.name}`,
      ).toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(layout.h1Count, `${route} heading at ${viewport.name}`).toBe(1);
      expect(
        layout.brokenImages,
        `${route} broken images at ${viewport.name}`,
      ).toBe(0);

      for (const paddingStart of layout.pageHeaderTransitions) {
        expect(
          paddingStart,
          `${route} duplicates header/content padding at ${viewport.name}`,
        ).toBe(0);
      }

      for (const textLink of layout.textLinks) {
        expect(
          textLink.textDecorationLine,
          `${route} text link decoration at ${viewport.name}`,
        ).toContain("underline");
        expect(
          textLink.borderBottomWidth,
          `${route} text link duplicates its underline at ${viewport.name}`,
        ).toBe("0px");
      }

      for (const divider of layout.dividerGrids) {
        expect(
          divider.width,
          `${route} divider grid collapsed at ${viewport.name}`,
        ).toBeGreaterThanOrEqual(divider.containerWidth * 0.8);
      }
    }
  }
});

test("service consultation links prefill an editable therapy interest", async ({
  page,
}) => {
  const response = await page.goto("/specialties/couples-therapy");
  expect(response?.status()).toBe(200);
  await page
    .getByRole("link", { name: /request a consultation/i })
    .last()
    .click();

  const therapyInterest = page.getByLabel("Therapy interest");
  await expect(therapyInterest).toHaveValue("Couples therapy");
  await therapyInterest.fill("Couples therapy for communication");
  await expect(therapyInterest).toHaveValue(
    "Couples therapy for communication",
  );
});

test("every specialty card links to its detail page", async ({ page }) => {
  await page.goto("/specialties");
  const main = page.locator("main");

  for (const slug of [
    "individual-therapy",
    "couples-therapy",
    "perinatal-postpartum-therapy",
    "group-therapy",
  ]) {
    await expect(
      main.locator(
        `a[data-service-slug="${slug}"][href="/specialties/${slug}"]`,
      ),
    ).toBeVisible();
  }
});

test("service headers and overview copy share the article column", async ({
  page,
}) => {
  await page.goto("/specialties/couples-therapy");

  const alignment = await page.evaluate(() => {
    const headerContent = document.querySelector<HTMLElement>(
      '[data-slot="page-header-content"]',
    );
    const overviewContent = document.querySelector<HTMLElement>(
      '[data-slot="page-header"] + [data-slot="content-section"] [data-slot="portable-content"]',
    );

    return {
      headerLeft: headerContent?.getBoundingClientRect().left ?? 0,
      overviewLeft: overviewContent?.getBoundingClientRect().left ?? 0,
    };
  });

  expect(Math.abs(alignment.headerLeft - alignment.overviewLeft)).toBeLessThan(
    1,
  );
});

test("blog post headers use the editorial measure and a single-underline author link", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(
    "/blog/beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy",
  );

  const header = page.locator('[data-slot="page-header-content"]');
  const author = page.getByRole("link", {
    name: "Dr. Christina Ruzicka, PsyD",
  });

  await expect(header).toHaveCSS("max-width", "1120px");
  await expect(author).toHaveCSS("text-decoration-line", "underline");
  await expect(author).toHaveCSS("border-bottom-width", "0px");
});

const supportedContactInterests = [
  ["individual-therapy", "Individual therapy"],
  ["couples-therapy", "Couples therapy"],
  ["perinatal-postpartum-therapy", "Perinatal or postpartum therapy"],
  ["group-therapy", "Group therapy or workshop"],
] as const;

for (const [interest, expectedLabel] of supportedContactInterests) {
  test(`contact prefills the allow-listed ${interest} interest`, async ({
    page,
  }) => {
    await page.goto(`/contact?interest=${interest}`);
    await expect(page.getByLabel("Therapy interest")).toHaveValue(
      expectedLabel,
    );
  });
}

test("contact ignores unsupported interest query values", async ({ page }) => {
  await page.goto("/contact?interest=not-a-real-service");
  await expect(page.getByLabel("Therapy interest")).toHaveValue("");
});

test("unknown specialty routes return not found", async ({ request }) => {
  expect((await request.get("/specialties/not-a-service")).status()).toBe(404);
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

  const menuButton = page.getByRole("button", { name: /close menu/i });
  await expect(primaryNav.getByRole("link", { name: "About" })).toBeFocused();
  await expect(page.locator("main")).toHaveJSProperty("inert", true);

  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("main")).toHaveJSProperty("inert", false);

  await page.getByRole("button", { name: /open menu/i }).click();
  await page.setViewportSize({ width: 768, height: 844 });

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
  expect(
    await page.locator("body").evaluate((element) => element.style.overflow),
  ).toBe("");
});

test("skip link moves focus to the public main landmark", async ({
  page,
  browserName,
}) => {
  await page.goto("/");
  // WebKit's macOS default uses Option-Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");

  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("unknown routes retain an accessible main landmark", async ({ page }) => {
  const response = await page.goto("/not-a-real-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("main")).toHaveCount(1);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("studio remains isolated and explicitly titled", async ({ page }) => {
  const response = await page.goto("/studio");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Ruzicka Psychology Studio");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("production security headers keep Studio allowances scoped", async ({
  request,
}) => {
  const publicResponse = await request.get("/");
  const studioResponse = await request.get("/studio");

  expect(publicResponse.headers()["strict-transport-security"]).toBe(
    "max-age=63072000",
  );
  expect(publicResponse.headers()["content-security-policy"]).not.toContain(
    "'unsafe-eval'",
  );
  expect(studioResponse.headers()["content-security-policy"]).toContain(
    "'unsafe-eval'",
  );
});

test("sitemap includes the new services and privacy notice", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const sitemap = await response.text();

  expect(sitemap).toContain("/specialties/individual-therapy");
  expect(sitemap).toContain("/specialties/couples-therapy");
  expect(sitemap).toContain("/specialties/perinatal-postpartum-therapy");
  expect(sitemap).toContain("/specialties/group-therapy");
  expect(sitemap).toContain("/privacy");
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

test("home hero exposes bottom-anchored navigation to the next section", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const hero = page.locator('[data-slot="immersive-page-header"]');
  const navigation = page.locator(
    '[data-slot="immersive-page-header-navigation"]',
  );
  const jumpLink = page.getByRole("link", {
    name: "Continue to therapy specialties",
  });

  await expect(jumpLink).toHaveAttribute("href", "#home-specialties");

  const [heroBox, navigationBox] = await Promise.all([
    hero.boundingBox(),
    navigation.boundingBox(),
  ]);
  expect(heroBox).not.toBeNull();
  expect(navigationBox).not.toBeNull();
  expect(
    heroBox!.y + heroBox!.height - (navigationBox!.y + navigationBox!.height),
  ).toBe(32);

  await jumpLink.click();
  await expect(page).toHaveURL(/#home-specialties$/);
});

test("footer uses the simplified three-part layout without services", async ({
  page,
}) => {
  await page.goto("/");

  const footer = page.locator('[data-slot="site-footer"]');
  await expect(footer.getByText("Services", { exact: true })).toHaveCount(0);
  await expect(footer.locator('[data-slot="grid"]').first()).toHaveAttribute(
    "data-layout",
    "three",
  );
});

test("home header hydrates without a server/client style mismatch", async ({
  page,
}) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      /hydrated|hydration|server rendered html/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  await page.goto("/");
  await page.reload();
  await expect(page.locator("header")).toHaveAttribute(
    "data-background",
    "home",
  );
  expect(hydrationErrors).toEqual([]);
});

test("contact email uses the inverse hero-link treatment", async ({ page }) => {
  await page.goto("/contact");
  const email = page.getByRole("link", {
    name: "Christina@ruzickapsychology.com",
  });

  await expect(email).toHaveCSS("color", "rgb(241, 238, 235)");
  await expect(email).toHaveCSS("text-decoration-line", "underline");
});

test("home header becomes solid after scrolling past the hero", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 980));

  await expect(page.locator("header")).toHaveCSS(
    "background-color",
    "rgb(234, 230, 221)",
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

test("contact delivery errors are announced and focused", async ({ page }) => {
  await page.route("https://api.web3forms.com/submit", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ success: false, message: "Unavailable" }),
    });
  });

  await page.goto("/contact");
  await page.getByLabel("First name").fill("Test");
  await page.getByLabel("Email address").fill("test@example.com");
  await page
    .getByLabel("Scheduling or general question")
    .fill("Testing the error state.");
  await page.getByRole("button", { name: "Submit →" }).click();

  const alert = page.getByRole("alert").filter({
    hasText: "Something went wrong sending your message.",
  });
  await expect(alert).toBeVisible();
  await expect(alert).toBeFocused();
});
