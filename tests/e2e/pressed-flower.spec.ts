import { expect, test } from "@playwright/test";

test("keepsake supports keyboard actions, exports a PNG, and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open the keepsake" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "A note on care" });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((element) => element.matches(":modal"))).toBe(
    true,
  );
  const close = dialog.getByRole("button", { name: "Close keepsake" });
  await close.focus();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Keep this moment" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(close).toBeFocused();
  const downloadEvent = page.waitForEvent("download");
  await dialog.getByRole("button", { name: "Keep this moment" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("a-small-moment-pressed-rose.png");
  expect(await download.failure()).toBeNull();
  await expect(
    dialog.getByText("Your keepsake is ready.", { exact: false }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("keepsake respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Open the keepsake" }).click();
  const dialog = page.getByRole("dialog", { name: "A note on care" });
  expect(
    await dialog.evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
});
