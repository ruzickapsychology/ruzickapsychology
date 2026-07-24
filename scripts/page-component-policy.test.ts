import { describe, expect, it } from "vitest";
import { pageComponentViolations } from "./page-component-policy.mjs";

describe("page component policy", () => {
  it("rejects loader imports but permits type-only imports", () => {
    expect(
      pageComponentViolations('import { getHome } from "@/data/cms";'),
    ).toHaveLength(1);
    expect(
      pageComponentViolations(
        'import type { Home } from "@/data/cms"; import { type Post } from "@/data/blog";',
      ),
    ).toEqual([]);
  });
  it("requires shared visible controls and disclosure semantics", () => {
    expect(
      pageComponentViolations(
        "const ui = <><label>Name</label><input /><textarea /><details><summary>Question</summary></details></>;",
      ),
    ).toHaveLength(5);
    expect(
      pageComponentViolations(
        "const ui = <Field><FieldLabel>Name</FieldLabel><Input /></Field>;",
      ),
    ).toEqual([]);
  });
  it("allows explicitly hidden honeypots and ignores comment examples", () => {
    expect(
      pageComponentViolations(
        "const ui = <div aria-hidden><label>Company</label><input /></div>; // <input />",
      ),
    ).toEqual([]);
    expect(
      pageComponentViolations('const ui = <input type="hidden" />;'),
    ).toEqual([]);
    expect(
      pageComponentViolations(
        "const ui = <div aria-hidden={false}><input /></div>;",
      ),
    ).toHaveLength(1);
  });
});
