import { expect, test } from "@playwright/test";

test.use({
  video: process.env.UX_AUDIT_CAPTURE_DIR ? "on" : "retain-on-failure",
  trace: "retain-on-failure",
});

test("a visitor can compare couples therapy fees and recover from a failed inquiry", async ({
  page,
}, testInfo) => {
  let attempts = 0;
  await page.route("https://api.web3forms.com/submit", (route) => {
    attempts += 1;
    return route.fulfill({
      status: attempts === 1 ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify({ success: attempts > 1 }),
    });
  });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  if (await menu.isVisible()) {
    await menu.click();
    await page
      .getByLabel("Mobile primary navigation")
      .getByRole("link", { name: "Specialties", exact: true })
      .click();
  } else {
    await page
      .getByLabel("Primary navigation", { exact: true })
      .getByRole("link", { name: "Specialties", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/\/specialties$/);
  await page
    .locator(
      '[data-slot="specialty-card"][href="/specialties/couples-therapy"]',
    )
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Couples Therapy in Rochester, NY",
  );
  const question = page.locator("summary").filter({ hasText: /What is Imago/ });
  await question.click();
  await expect(question.locator("..")).toHaveAttribute("open", "");
  await page
    .getByRole("link", { name: "Fees and insurance", exact: false })
    .click();
  await expect(page).toHaveURL(/\/pricing$/);
  await page
    .locator("summary")
    .filter({ hasText: "Call your insurance company" })
    .click();
  await page
    .locator('[data-slot="cta-section"]')
    .getByRole("link", { name: "Request a consultation", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole("button", { name: "Submit →" }).click();
  await expect(page.getByLabel("First name")).toBeFocused();
  expect(attempts).toBe(0);
  await page.getByLabel("First name").fill("UX Test");
  await page.getByLabel("Email address").fill("ux-test@example.com");
  await page
    .getByLabel("Scheduling or general question")
    .fill("Local mocked inquiry; no email will be sent.");
  await page.getByRole("button", { name: "Submit →" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Something went wrong" }),
  ).toBeFocused();
  await expect(page.getByLabel("Email address")).toHaveValue(
    "ux-test@example.com",
  );
  await page.screenshot({ path: testInfo.outputPath("inquiry-retry.png") });
  await page.getByRole("button", { name: "Submit →" }).click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Your message has been received." }),
  ).toBeFocused();
  expect(attempts).toBe(2);
  await page.screenshot({
    path: testInfo.outputPath("inquiry-confirmation.png"),
  });
});
