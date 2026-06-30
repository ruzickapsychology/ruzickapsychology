import type { SpecialtyIcon } from "@/lib/cms";

function Icon({
  size = 32,
  children,
}: {
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden
    >
      {children}
    </svg>
  );
}

/**
 * Specialty glyph. Sub-parts carry `anim-*` classes that only animate when
 * inside a hovered `.rp-q` cell (see globals.css) — static everywhere else.
 */
export function SpecialtyGlyph({
  icon,
  size = 32,
}: {
  icon: SpecialtyIcon;
  size?: number;
}) {
  switch (icon) {
    case "circle":
      return (
        <Icon size={size}>
          <circle
            className="anim-individual-ring"
            cx="16"
            cy="16"
            r="8.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <circle className="anim-individual-fill" cx="16" cy="16" r="8.5" />
        </Icon>
      );
    case "leaves":
      return (
        <Icon size={size}>
          <rect
            className="anim-couple-bridge-x"
            x="10"
            y="10.4"
            width="12"
            height="11.2"
            rx="5.6"
          />
          <rect
            className="anim-couple-bridge-y"
            x="10.4"
            y="10"
            width="11.2"
            height="12"
            rx="5.6"
          />
          <g className="anim-couple-left">
            <circle cx="16" cy="16" r="5.6" />
          </g>
          <g className="anim-couple-right">
            <circle cx="16" cy="16" r="5.6" />
          </g>
        </Icon>
      );
    case "bud":
      return (
        <Icon size={size}>
          <g className="anim-cuddle-drop">
            <path
              d="M0 0 Q -6 -7.44 -6 -12 A 6 6 0 1 1 6 -12 Q 6 -7.44 0 0 Z"
              transform="translate(13 5) rotate(180)"
            />
          </g>
          <g className="anim-cuddle-circle">
            <circle cx="23" cy="21.5" r="3.9" />
          </g>
        </Icon>
      );
    case "quatrefoil": {
      const p =
        "M0 0 Q -4.8 -6.57 -4.8 -10.6 A 4.8 4.8 0 1 1 4.8 -10.6 Q 4.8 -6.57 0 0 Z";
      return (
        <Icon size={size}>
          <g className="anim-spin-group">
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`translate(16 16) rotate(${deg})`}>
                <g className="anim-petal">
                  <path d={p} />
                </g>
              </g>
            ))}
          </g>
        </Icon>
      );
    }
  }
}

export function ArrowUpRight({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block" }}
      aria-hidden
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
