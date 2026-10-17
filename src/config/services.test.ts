import { describe, expect, it } from "vitest";
import {
  getContactInterestLabel,
  getServiceDefinition,
  isServiceSlug,
  serviceContactHref,
} from "./services";

describe("service route definitions", () => {
  it("recognizes only approved public service slugs", () => {
    expect(isServiceSlug("individual-therapy")).toBe(true);
    expect(isServiceSlug("group-therapy")).toBe(true);
    expect(getServiceDefinition("couples-counseling")).toBeUndefined();
  });

  it("builds service-specific consultation links", () => {
    expect(serviceContactHref("couples-therapy")).toBe(
      "/contact?interest=couples-therapy",
    );
  });

  it("prefills only allow-listed therapy interests", () => {
    expect(getContactInterestLabel("perinatal-postpartum-therapy")).toBe(
      "Perinatal or postpartum therapy",
    );
    expect(getContactInterestLabel("group-therapy")).toBe(
      "Group therapy or workshop",
    );
    expect(getContactInterestLabel("anything-else")).toBeUndefined();
  });
});
