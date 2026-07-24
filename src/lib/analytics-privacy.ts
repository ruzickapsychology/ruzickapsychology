/** Remove visitor-supplied URL details before analytics or performance delivery. */
export function sanitizeAnalyticsEvent<T extends { url: string }>(
  event: T,
): T | null {
  try {
    const url = new URL(event.url);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.pathname === "/studio" ||
      url.pathname.startsWith("/studio/")
    ) {
      return null;
    }
    url.search = "";
    url.hash = "";
    url.username = "";
    url.password = "";
    return { ...event, url: url.toString() };
  } catch {
    return null;
  }
}
