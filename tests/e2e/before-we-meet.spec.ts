import { expect, test } from "@playwright/test";

test("the personal note opens and closes from the keyboard", async ({
  page,
}) => {
  await page.goto("/about");
  const note = page.locator('[data-slot="folded-note"]');
  const cover = note.locator("summary");
  const content = note.locator('[data-slot="portable-content"]');

  await expect(content).toBeHidden();
  await cover.focus();
  await page.keyboard.press("Enter");
  await expect(note).toHaveAttribute("open", "");
  await expect(content).toBeVisible();
  await expect(cover).toBeFocused();
  await expect(cover).toContainText("Fold the note");

  await page.keyboard.press("Space");
  await expect(note).not.toHaveAttribute("open");
  await expect(content).toBeHidden();
  await expect(cover).toBeFocused();
  // Closing the decorative note never removes the original biography.
  await expect(page.locator('[data-prose="intro"]').first()).toBeVisible();
});

test("reduced motion reveals the note without fold animations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  const note = page.locator('[data-slot="folded-note"]');
  await note.locator("summary").click();
  await expect(note.locator('[data-slot="portable-content"]')).toBeVisible();
  const animatedElements = await note.evaluate(
    (element) =>
      Array.from(element.querySelectorAll("*")).filter((child) => {
        const style = getComputedStyle(child);
        return (
          style.animationName !== "none" ||
          style.transitionDuration
            .split(",")
            .some((duration) => parseFloat(duration) > 0)
        );
      }).length,
  );
  expect(animatedElements).toBe(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the native note remains readable and reversible", async ({ page }) => {
    await page.goto("/about");
    const note = page.locator('[data-slot="folded-note"]');
    const cover = note.locator("summary");
    const content = note.locator('[data-slot="portable-content"]');
    await cover.focus();
    await page.keyboard.press("Enter");
    await expect(content).toBeVisible();
    await expect(content).not.toBeEmpty();
    await cover.focus();
    await page.keyboard.press("Space");
    await expect(content).toBeHidden();
  });
});
