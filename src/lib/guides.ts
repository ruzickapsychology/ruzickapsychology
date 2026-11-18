/** Pure helpers for reader guides (see src/data/guides.ts). */

export type GuideStage = "learn" | "compare" | "decide";

export const GUIDE_STAGES: readonly GuideStage[] = [
  "learn",
  "compare",
  "decide",
] as const;

export const GUIDE_STAGE_LABELS: Record<GuideStage, string> = {
  learn: "Learn",
  compare: "Compare",
  decide: "Decide",
};

/** Shown on every guide page and the hub. Crisis lines match /resources. */
export const GUIDE_SAFETY_NOTE =
  "This guide is general information, not medical advice or a diagnosis. If you are in immediate danger, call 911 or go to the nearest emergency department. For a suicidal crisis, call or text 988 at any time. More crisis and pregnancy support lines are on the [resources page](/resources).";

export function guidePath(guideSlug: string, pageSlug?: string) {
  return pageSlug ? `/guides/${guideSlug}/${pageSlug}` : `/guides/${guideSlug}`;
}
