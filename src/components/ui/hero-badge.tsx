import { FlowerMark } from "@/components/ui/logo";

const RING_MESSAGES = ["ACCEPTING NEW PATIENTS", "IN PERSON OR VIRTUAL"] as const;

export function RotatingFlowerBadge({
  messages,
  pathId,
  flowerColor = "rgb(241 238 235 / 0.8)",
  flowerClassName = "hero-flower-emboss",
  textColor = "var(--color-light)",
}: {
  messages: readonly [string, string];
  pathId: string;
  flowerColor?: string;
  flowerClassName?: string;
  textColor?: string;
}) {
  return (
    <>
      <svg
        width="190"
        height="190"
        viewBox="0 0 190 190"
        className="rp-spin block"
        style={{ filter: "drop-shadow(0 1px 4px rgba(58,35,40,0.4))", overflow: "visible" }}
        aria-hidden
      >
        <defs>
          <path
            id={pathId}
            d="M95,95 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
          />
        </defs>
        {messages.map((message, i) => (
          <text
            key={message}
            fill={textColor}
            fontFamily="var(--font-sans), system-ui, sans-serif"
            fontSize="12"
            fontWeight="600"
            letterSpacing="2.88"
            textAnchor="middle"
          >
            <textPath href={`#${pathId}`} startOffset={i === 0 ? "25%" : "75%"}>
              {message}
            </textPath>
          </text>
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <FlowerMark
          width={60}
          height={70}
          color={flowerColor}
          className={flowerClassName}
        />
      </div>
    </>
  );
}

/** Rotating circular badge with the flower mark centered, over the hero. */
export function HeroBadge() {
  return (
    <div className="pointer-events-none absolute -left-8 top-[-91px] hidden h-[190px] w-[190px] sm:block">
      <RotatingFlowerBadge messages={RING_MESSAGES} pathId="rp-hero-badge-path" />
    </div>
  );
}
