import { Text } from "@/components/typography";
import styles from "./styles.module.css";

export function OfficeHours({ hours }: { hours: readonly string[] }) {
  return (
    <table
      className={styles.root}
      data-slot="office-hours"
      aria-label="Office hours"
    >
      <tbody>
        {hours.map((line, index) => {
          const separator = line.indexOf("·");
          const day = separator >= 0 ? line.slice(0, separator).trim() : "";
          const detail = separator >= 0 ? line.slice(separator + 1).trim() : "";
          return (
            <tr key={`${index}-${line}`}>
              {day && detail ? (
                <>
                  <th scope="row" className={styles.day}>
                    <Text as="span">{day}</Text>
                  </th>
                  <td>
                    <Text as="span" className={styles.time}>
                      {detail.replace(
                        /(\d(?:am|pm))\s*[-–]\s*(?=\d)/gi,
                        "$1 – ",
                      )}
                    </Text>
                  </td>
                </>
              ) : (
                <td colSpan={2}>
                  <Text as="span">{line}</Text>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
