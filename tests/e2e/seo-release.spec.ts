import { expect, test } from "@playwright/test";

test("public pages expose accurate practice schema and contact links", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Psychologist.*Rochester/);
  const graphs = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.flatMap((script) => {
        const value = JSON.parse(script.textContent ?? "{}");
        return value["@graph"] ?? [value];
      }),
    );
  expect(graphs).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ "@type": "ProfessionalService" }),
      expect.objectContaining({ "@type": "Person" }),
    ]),
  );
  expect(JSON.stringify(graphs)).not.toContain("PhysiciansOffice");
  expect(JSON.stringify(graphs)).not.toContain(
    '"medicalSpecialty":"Psychiatric"',
  );
  await expect(page.locator('footer a[href^="tel:"]')).toBeVisible();
  await expect(
    page
      .locator("footer")
      .getByRole("link", { name: "Existing Client Portal" }),
  ).toBeVisible();
  await expect(
    page.locator("footer").getByRole("link", { name: "Privacy", exact: true }),
  ).toHaveAttribute("href", "/privacy");
});

test("contact labels remain readable after typing and privacy is adjacent", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByLabel("First name (required)", { exact: true }).fill("Test");
  const label = page.locator('label[for="contact-first-name"]');
  await expect(label).toBeVisible();
  const box = await label.boundingBox();
  expect(box?.height).toBeGreaterThan(10);
  await expect(page.locator('form a[href="/privacy"]')).toBeVisible();
  await expect(page.locator('main a[href^="tel:"]')).toBeVisible();
});

test("tablet desktop navigation fits beside the wordmark", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/about");
  const header = page.locator("header");
  const faq = header.getByRole("link", { name: "FAQ", exact: true });
  await expect(faq).toBeVisible();
  const boxes = await header.locator("a:visible").evaluateAll((links) =>
    links.map((link) => {
      const box = link.getBoundingClientRect();
      return { left: box.left, right: box.right };
    }),
  );
  for (let index = 0; index < boxes.length; index++) {
    expect(boxes[index].left).toBeGreaterThanOrEqual(0);
    expect(boxes[index].right).toBeLessThanOrEqual(768);
    if (index)
      expect(boxes[index].left).toBeGreaterThanOrEqual(boxes[index - 1].right);
  }
});

test("blog previews retain canonical identity and article metadata", async ({
  page,
}) => {
  const path =
    "/blog/beyond-the-buzzword-what-does-doing-the-work-actually-mean-in-therapy";
  await page.goto(path);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `https://www.ruzickapsychology.com${path}`,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "article",
  );
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description?.length).toBeGreaterThan(20);
  expect(description?.length).toBeLessThanOrEqual(160);
});

test("contact navigation becomes readable while scrolling through the form", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact");
  const header = page.locator("header");
  await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await page.evaluate(() => window.scrollTo(0, 200));
  await expect(header).toHaveCSS("background-color", "rgb(234, 230, 221)");
});

test("empty mobile submission keeps the invalid field label below the fixed header", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Never deliver an inquiry if form validation unexpectedly regresses.
  await page.route("https://api.web3forms.com/submit", (route) =>
    route.abort(),
  );
  await page.goto("/contact");
  await page.getByRole("button", { name: "Submit", exact: false }).click();
  await expect(
    page.getByLabel("First name (required)", { exact: true }),
  ).toBeFocused();
  const label = page.locator('label[for="contact-first-name"]');
  await expect(label).toBeVisible();
  await expect
    .poll(async () => {
      const labelBox = await label.boundingBox();
      const headerBox = await page.locator("header").boundingBox();
      if (!labelBox || !headerBox) return -1;
      return labelBox.y - (headerBox.y + headerBox.height);
    })
    .toBeGreaterThanOrEqual(0);
});
