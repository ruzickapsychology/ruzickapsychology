import { beforeEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { getSitemapEntries } from "@/data/cms";

vi.mock("@/data/cms", () => ({ getSitemapEntries: vi.fn() }));

beforeEach(() => vi.clearAllMocks());

describe("sitemap archive discovery", () => {
  it.each([
    [10, false],
    [11, true],
  ])(
    "includes page 2 only when %i posts require it",
    async (count, expected) => {
      vi.mocked(getSitemapEntries).mockResolvedValue({
        pages: [],
        services: [],
        posts: Array.from({ length: count }, (_, index) => ({
          slug: `post-${index}`,
          _updatedAt: "2026-01-01T00:00:00Z",
        })),
      });
      const urls = (await sitemap()).map((entry) => entry.url);
      expect(urls.some((url) => url.endsWith("/blog/page/2"))).toBe(expected);
      expect(urls.some((url) => url.endsWith("/blog/page/1"))).toBe(false);
      expect(urls.some((url) => url.endsWith("/privacy"))).toBe(true);
    },
  );
});
