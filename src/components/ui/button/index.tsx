import styles from "./styles.module.css";

type Variant = "primary" | "secondary" | "outline";

export function buttonClasses(variant: Variant = "primary", className = "") {
  const variants: Record<Variant, string> = {
    primary: `${styles.root} ${styles.primary}`,
    secondary: `${styles.root} ${styles.secondary}`,
    outline: `${styles.root} ${styles.outline}`,
  };
  return `${variants[variant]} ${className}`.trim();
}
