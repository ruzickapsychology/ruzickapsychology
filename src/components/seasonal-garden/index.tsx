"use client";

import { useSyncExternalStore } from "react";
import styles from "./styles.module.css";

type Season = "spring" | "summer" | "autumn" | "winter";
const subscribe = () => () => {};
const serverSeason = (): Season => "spring";
function currentSeason(): Season {
  const month = Number(
    new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      timeZone: "America/New_York",
    }).format(new Date()),
  );
  return month >= 3 && month <= 5
    ? "spring"
    : month >= 6 && month <= 8
      ? "summer"
      : month >= 9 && month <= 11
        ? "autumn"
        : "winter";
}

function Leaf({
  x,
  y,
  angle,
  scale = 1,
}: {
  x: number;
  y: number;
  angle: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
      <path
        className={styles.leafFill}
        d="M0 0C-27-9-49-28-52-64C-18-59 1-34 0 0Z"
      />
      <path d="M0 0Q-23-29-52-64M-11-16L-33-21M-21-29L-40-35M-30-40L-45-47M-11-16L-13-39M-21-29L-26-49" />
    </g>
  );
}

function Rose({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <g key={angle} transform={`rotate(${angle})`}>
          <path
            className={styles.petal}
            d="M0 8C-15 3-39-12-34-35C-30-52-13-55 0-43C13-55 30-52 34-35C39-12 15 3 0 8Z"
          />
          <path
            className={styles.petalVein}
            d="M0-10Q-15-20-18-38M-3-8Q-23-13-27-29M0-11Q11-22 18-38"
          />
        </g>
      ))}
      <circle r="13" className={styles.heart} />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 30})`}>
          <path d="M0-5L0-20" />
          <circle cx="0" cy="-21" r="1.8" className={styles.seed} />
        </g>
      ))}
    </g>
  );
}

function Bud({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path
        className={styles.petal}
        d="M0 7C-23-8-18-31 0-44C18-31 23-8 0 7Z"
      />
      <path d="M0 7Q-2-12 0-37M0 7Q-17-4-21-21M0 7Q17-4 21-21" />
    </g>
  );
}

function Hip({ x, y, angle = 0 }: { x: number; y: number; angle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path
        className={styles.hip}
        d="M0-23C-25-19-24 10-8 20C-3 24 3 24 8 20C24 10 25-19 0-23Z"
      />
      <path d="M0-23L-9-34L-3-29L1-36L4-28L12-32L7-21M-10-10Q-15 2-8 12" />
    </g>
  );
}

function GardenDrawing({ season }: { season: Season }) {
  return (
    <svg
      viewBox="0 0 440 400"
      width="440"
      height="400"
      aria-hidden="true"
      focusable="false"
      className={styles.drawing}
    >
      <circle className={styles.halo} cx="220" cy="183" r="149" />
      <circle className={styles.orbit} cx="220" cy="183" r="160" />
      {Array.from({ length: 48 }, (_, i) => (
        <path
          key={i}
          className={styles.tick}
          transform={`rotate(${i * 7.5} 220 183)`}
          d={i % 4 === 0 ? "M220 16V24" : "M220 19V23"}
        />
      ))}
      <g className={styles.botanical} key={season}>
        <g className={styles.stems}>
          <path d="M214 361C226 307 212 252 225 198C234 159 253 123 264 91M221 287C190 268 167 237 146 202M221 254C247 246 279 216 299 183M224 210C197 191 181 165 169 137M232 178C250 167 288 151 308 116M216 330C248 317 270 293 283 265" />
          <path d="M220 274L229 271L223 282M224 222L215 219L223 232M235 151L242 149L237 157M180 247L176 235L185 250" />
        </g>
        {season !== "winter" && (
          <g className={styles.leaves}>
            <Leaf x={222} y={291} angle={-28} />
            <Leaf x={238} y={243} angle={104} scale={0.9} />
            <Leaf x={213} y={210} angle={-13} scale={0.75} />
            <Leaf x={254} y={140} angle={89} scale={0.65} />
            <Leaf x={163} y={228} angle={-42} scale={0.65} />
            {season !== "autumn" && (
              <>
                <Leaf x={218} y={317} angle={50} scale={0.75} />
                <Leaf x={277} y={207} angle={113} scale={0.6} />
                <Leaf x={285} y={138} angle={102} scale={0.55} />
              </>
            )}
          </g>
        )}
        {season === "spring" && (
          <>
            <Bud x={264} y={91} angle={24} />
            <Bud x={169} y={137} angle={-25} />
            <Bud x={308} y={116} angle={26} />
            <Bud x={146} y={202} angle={-40} />
            <Leaf x={299} y={183} angle={95} scale={0.55} />
          </>
        )}
        {season === "summer" && (
          <>
            <Rose x={261} y={92} />
            <Rose x={167} y={138} scale={0.72} />
            <Rose x={301} y={180} scale={0.65} />
            <Bud x={308} y={116} angle={35} />
            <Bud x={146} y={202} angle={-35} />
            <Leaf x={283} y={265} angle={60} scale={0.65} />
          </>
        )}
        {(season === "autumn" || season === "winter") && (
          <>
            <Hip x={264} y={91} angle={22} />
            <Hip x={169} y={137} angle={-23} />
            <Hip x={308} y={116} angle={30} />
            <Hip x={299} y={183} angle={21} />
            <Hip x={146} y={202} angle={-35} />
          </>
        )}
        {season === "autumn" && (
          <g className={styles.fallen}>
            <Leaf x={318} y={300} angle={113} scale={0.7} />
            <Leaf x={152} y={328} angle={-82} scale={0.55} />
          </g>
        )}
        {season === "winter" && (
          <g className={styles.snow}>
            {[
              [116, 98],
              [198, 57],
              [315, 61],
              [347, 228],
              [112, 269],
              [272, 295],
              [185, 239],
              [331, 148],
              [97, 174],
              [227, 123],
              [303, 332],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" />
            ))}
          </g>
        )}
      </g>
      <path
        className={styles.ground}
        d="M171 366Q220 363 268 366M192 373H244"
      />
    </svg>
  );
}

export function SeasonalGarden() {
  // The fixed server snapshot keeps static HTML and hydration consistent. The
  // same SVG dimensions reserve the artwork's space when the local season loads.
  const season = useSyncExternalStore(subscribe, currentSeason, serverSeason);

  return (
    <div
      data-slot="seasonal-garden"
      data-season={season}
      aria-hidden="true"
      className={styles.root}
    >
      <GardenDrawing season={season} />
    </div>
  );
}
