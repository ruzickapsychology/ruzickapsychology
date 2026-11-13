import type { ResearchBar } from "@/data/research";
import { Text } from "@/components/typography";
import styles from "./styles.module.css";

const toneClass: Record<ResearchBar["tone"], string> = {
  highlight: styles.highlight,
  default: styles.default,
  muted: styles.muted,
  compare: styles.compare,
};

/**
 * Horizontal bar chart drawn with CSS. Every value is printed as text beside
 * its bar, so the chart reads the same to screen readers and in print.
 */
export function BarChart({
  bars,
  unit,
  label,
}: {
  bars: readonly ResearchBar[];
  unit: string;
  label: string;
}) {
  const max = Math.max(...bars.map((bar) => bar.value));
  return (
    <ul className={styles.chart} aria-label={label}>
      {bars.map((bar) => (
        <li
          key={bar.label}
          className={`${styles.row} ${toneClass[bar.tone]}`}
          data-tone={bar.tone}
        >
          <Text as="span" variant="supporting" className={styles.label}>
            {bar.label}
          </Text>
          <span className={styles.track} aria-hidden="true">
            <span
              className={styles.bar}
              style={{ width: `${Math.max((bar.value / max) * 100, 0.5)}%` }}
            />
          </span>
          <Text as="span" variant="supporting" className={styles.value}>
            {bar.display}
            <span className={styles.srOnly}> {unit}</span>
          </Text>
        </li>
      ))}
    </ul>
  );
}
