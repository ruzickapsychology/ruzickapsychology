import { FlowerMark } from "@/components/ui/logo";

const RING_TEXT =
  "ACCEPTING NEW PATIENTS   ·   IN PERSON OR VIRTUAL   ·   ";

/** Rotating circular badge with the flower mark centered, over the hero. */
export function HeroBadge() {
  return (
    <div className="pointer-events-none absolute -left-4 -top-16 hidden h-[150px] w-[150px] sm:block">
      <svg
        width="150"
        height="150"
        viewBox="0 0 150 150"
        className="rp-spin block"
        style={{ filter: "drop-shadow(0 1px 4px rgba(58,35,40,0.4))", overflow: "visible" }}
        aria-hidden
      >
        <defs>
          <path
            id="rp-badge-path"
            d="M75,75 m-56,0 a56,56 0 1,1 112,0 a56,56 0 1,1 -112,0"
          />
        </defs>
        <text
          fill="var(--color-light)"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          fontSize="12.5"
          fontWeight="600"
          textLength="351"
          lengthAdjust="spacing"
        >
          <textPath href="#rp-badge-path" startOffset="0">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <FlowerMark
          width={50}
          height={58}
          color="var(--color-light)"
          className="[filter:drop-shadow(0_1px_4px_rgba(58,35,40,0.4))]"
        />
      </div>
    </div>
  );
}
