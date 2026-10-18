import { cn } from "@/lib/class-names";
import type { SpecialtyIcon } from "@/data/cms";
import styles from "./styles.module.css";

/** Original vector studies, composed like pressed specimens on archival paper. */
function Leaf({
  x,
  y,
  angle = 0,
  scale = 1,
}: {
  x: number;
  y: number;
  angle?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <path
        className={styles.leaf}
        d="M0 0 C-22-10-22-38-10-62 C9-47 20-19 0 0Z"
      />
      <path
        className={styles.vein}
        d="M0 0 Q-2-30-10-62 M-2-15-13-25 M-3-25 6-38 M-6-38-14-47"
      />
    </g>
  );
}

function Flower({
  x,
  y,
  scale = 1,
  angle = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  angle?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((rotation) => (
        <g key={rotation} transform={`rotate(${rotation})`}>
          <path
            className={styles.petal}
            d="M0 1 C-8-5-26-17-23-31 C-22-43-10-48-1-40 C8-50 22-42 23-31 C23-18 8-4 0 1Z"
          />
          <path
            className={styles.petalVein}
            d="M-1-5 Q-12-20-15-31 M2-6 Q11-21 13-33 M0-12-1-32"
          />
        </g>
      ))}
      <circle className={styles.center} r="8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation) => (
        <g key={rotation} transform={`rotate(${rotation})`}>
          <path className={styles.vein} d="M0-5 0-13" />
          <circle className={styles.center} cy="-13" r="1.8" />
        </g>
      ))}
    </g>
  );
}

function Fern() {
  return (
    <g>
      <path
        className={styles.stem}
        d="M105 270 C103 205 111 146 138 65 Q148 36 159 50 Q164 59 155 62 Q149 63 150 57"
      />
      {Array.from({ length: 8 }, (_, i) => {
        const y = 235 - i * 23;
        const x = 107 + i * i * 0.48;
        const size = 1.03 - i * 0.085;
        return (
          <g key={i}>
            <Leaf x={x} y={y} angle={-52} scale={size} />
            <Leaf x={x + 1} y={y - 6} angle={63} scale={size * 0.88} />
          </g>
        );
      })}
    </g>
  );
}

function Pair() {
  return (
    <g>
      <path
        className={styles.stem}
        d="M127 271 C106 215 95 157 92 88 M122 262 C133 209 151 158 162 111"
      />
      <Leaf x={111} y={221} angle={-63} scale={0.9} />
      <Leaf x={132} y={222} angle={65} scale={0.78} />
      <Leaf x={99} y={164} angle={-51} scale={0.67} />
      <Leaf x={149} y={170} angle={73} scale={0.7} />
      <Flower x={91} y={86} angle={-16} scale={0.86} />
      <Flower x={165} y={113} angle={20} scale={0.68} />
      <path className={styles.stem} d="M105 192 Q76 162 58 160" />
      <Leaf x={61} y={162} angle={-58} scale={0.45} />
    </g>
  );
}

function Bud() {
  return (
    <g>
      <path
        className={styles.stem}
        d="M117 270 Q133 202 119 114 M125 213 Q169 184 165 143"
      />
      <Leaf x={125} y={217} angle={-60} scale={1.12} />
      <Leaf x={124} y={172} angle={55} scale={0.82} />
      <g>
        <path
          className={styles.petal}
          d="M119 119 C100 111 88 88 96 65 Q101 51 112 57 Q120 44 131 53 C158 70 144 105 119 119Z"
        />
        <path
          className={styles.petalVein}
          d="M119 115 Q108 92 112 58 M119 115 Q134 85 130 55 M119 113 Q110 77 100 67"
        />
        <path
          className={styles.leaf}
          d="M118 123 Q101 116 97 94 Q109 99 118 113 Q127 103 141 94 Q140 116 118 123Z"
        />
        <path className={styles.vein} d="M118 125 118 111" />
      </g>
      <g transform="translate(166 137) rotate(22) scale(.45)">
        <path
          className={styles.petal}
          d="M0 0 C-30-20-24-63 0-65 C26-62 27-20 0 0Z"
        />
        <path className={styles.petalVein} d="M0 0 Q-8-35 0-62" />
        <path
          className={styles.leaf}
          d="M0 8 Q-19 1-20-18 L0-2 21-18 Q18 3 0 8Z"
        />
      </g>
    </g>
  );
}

function Meadow() {
  return (
    <g>
      <path
        className={styles.stem}
        d="M118 271 Q105 189 74 134 M120 271 Q134 168 146 81 M120 263 Q149 217 180 171 M117 250 Q92 214 61 201"
      />
      <Leaf x={116} y={236} angle={-42} scale={0.63} />
      <Leaf x={129} y={209} angle={67} scale={0.6} />
      <Leaf x={138} y={153} angle={-35} scale={0.44} />
      <Flower x={74} y={128} scale={0.53} angle={15} />
      <Flower x={146} y={75} scale={0.68} angle={-13} />
      <Flower x={183} y={168} scale={0.44} angle={36} />
      <Flower x={57} y={198} scale={0.32} />
    </g>
  );
}

const specimens = { circle: Fern, leaves: Pair, bud: Bud, quatrefoil: Meadow };

export function BotanicalStudy({
  icon,
  size = "full",
}: {
  icon: SpecialtyIcon;
  size?: "full" | "compact";
}) {
  const Specimen = specimens[icon];
  return (
    <svg
      data-slot="specialty-glyph"
      data-botanical-study={icon}
      data-size={size}
      className={cn(styles.root, size === "compact" && styles.compact)}
      viewBox="0 0 240 300"
      width={size === "compact" ? 64 : 240}
      height={size === "compact" ? 80 : 300}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <Specimen />
    </svg>
  );
}
