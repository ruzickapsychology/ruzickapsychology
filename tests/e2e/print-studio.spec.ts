import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("botanical studio exports the selected print at its advertised resolution", async ({
  page,
}, info) => {
  await page.goto("/#print-studio");
  const studio = page.locator("#print-studio");
  await studio
    .locator('label:has(input[name="botanical"][value="cosmos"])')
    .click();
  await studio.locator('label:has(input[name="paper"][value="rose"])').click();
  await expect(
    studio.getByRole("img", { name: /^Cosmos on rose paper/ }),
  ).toBeVisible();
  await studio.getByLabel("Include the thought from our About page").uncheck();
  await expect(studio.getByRole("img")).toHaveAccessibleName(
    "Cosmos on rose paper",
  );

  for (const [format, width, height] of [
    ["postcard", 1500, 2100],
    ["wallpaper", 1080, 1920],
  ] as const) {
    await studio
      .locator(`label:has(input[name="format"][value="${format}"])`)
      .click();
    const downloading = page.waitForEvent("download");
    await studio.getByRole("button", { name: "Save your print" }).click();
    const download = await downloading;
    expect(download.suggestedFilename()).toBe(`botanical-cosmos-${format}.png`);
    const path = info.outputPath(`${format}.png`);
    await download.saveAs(path);
    const png = await readFile(path);
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(width);
    expect(png.readUInt32BE(20)).toBe(height);
    // The image must contain actual artwork/text, not just a uniform paper fill.
    expect(png.length).toBeGreaterThan(30_000);
    await expect(studio.getByRole("status")).toContainText(
      "Your print is ready",
    );
    await info.attach(`${format} exported print`, {
      path,
      contentType: "image/png",
    });
  }
  expect(
    (await new AxeBuilder({ page }).include("#print-studio").analyze())
      .violations,
  ).toEqual([]);
});

test("studio radio choices work with the keyboard and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#print-studio");
  const rose = page.locator('input[name="botanical"][value="rose"]');
  await rose.focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.locator('input[name="botanical"][value="cosmos"]'),
  ).toBeChecked();
  await expect(page.locator('#print-studio [role="img"]')).toHaveAccessibleName(
    /^Cosmos on ivory paper/,
  );
  await expect(page.locator('#print-studio [role="img"]')).toHaveCSS(
    "transition-duration",
    "0s",
  );
  const width = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(width.content).toBeLessThanOrEqual(width.viewport);
});
