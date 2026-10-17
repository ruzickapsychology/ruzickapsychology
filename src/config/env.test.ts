import { describe, expect, it } from "vitest";
import { requireEnvValue } from "./env";

describe("requireEnvValue", () => {
  it("throws a clear error when a required env var is missing", () => {
    expect(() => requireEnvValue("MISSING_TEST_ENV", undefined)).toThrow(
      "Missing environment variable: MISSING_TEST_ENV",
    );
  });
});
