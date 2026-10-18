export type HomeSpecialtiesLayout = "botanical" | "quadrant";

// Keep the original quadrant layout available: the practice may switch back.
// Change this to "quadrant" to restore its dividers, small glyphs, and centered heading.
// Both versions use the same live CMS content; do not delete the retained variant.
export const homeSpecialtiesLayout: HomeSpecialtiesLayout = "botanical";
