import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom has no layout/scrolling; browser tests verify the resulting viewport.
HTMLElement.prototype.scrollIntoView = () => {};

afterEach(() => {
  cleanup();
});
