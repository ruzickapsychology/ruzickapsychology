import { expect, test } from "@playwright/test";

test("arrival invitation opens by keyboard and keeps each meeting mode usable", async ({
  page,
}) => {
  await page.goto("/about");
  const arrival = page.locator("[data-arrival-preview]");
  const open = arrival.locator("button[aria-expanded]");
  await open.focus();
  await page.keyboard.press("Enter");
  await expect(open).toHaveAttribute("aria-expanded", "true");
  await expect(arrival.locator("img")).toBeVisible();
  await expect(open).toBeFocused();

  const online = arrival.getByRole("button", { name: "Online", exact: true });
  await online.focus();
  await page.keyboard.press("Space");
  await expect(online).toHaveAttribute("aria-pressed", "true");
  await expect(
    arrival.getByRole("link", { name: "Ask about virtual appointments" }),
  ).toHaveAttribute("href", "/contact");
  await expect(
    arrival.getByRole("button", { name: "Close the door" }),
  ).toHaveCount(0);

  await arrival.getByRole("button", { name: "In person", exact: true }).click();
  const close = arrival.getByRole("button", { name: "Close the door" });
  await close.click();
  await expect(arrival).toHaveAttribute("data-open", "false");
});

test("arrival respects reduced motion and fits a narrow screen", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/about");
  const arrival = page.locator("[data-arrival-preview]");
  await arrival.getByRole("button", { name: "Step inside" }).click();
  const transitions = await arrival
    .locator('[aria-hidden="true"]')
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).transitionDuration),
    );
  expect(transitions.every((duration) => duration === "0s")).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await arrival.getByRole("button", { name: "Online", exact: true }).click();
  await expect(
    arrival.getByRole("link", { name: "Ask about virtual appointments" }),
  ).toBeVisible();
});
