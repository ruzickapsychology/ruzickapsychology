import type { ComponentProps } from "react";
import styles from "./styles.module.css";

type InputFieldProps = {
  label: string;
  multiline?: false;
  className?: string;
} & Omit<ComponentProps<"input">, "aria-label" | "className">;

type TextareaFieldProps = {
  label: string;
  multiline: true;
  className?: string;
} & Omit<ComponentProps<"textarea">, "aria-label" | "className">;

type FormFieldProps = InputFieldProps | TextareaFieldProps;

export function FormField(props: FormFieldProps) {
  const { label, className, multiline, ...fieldProps } = props;
  const id =
    typeof fieldProps.id === "string" && fieldProps.id ? fieldProps.id : null;

  if (multiline) {
    return (
      <>
        {id ? (
          <label htmlFor={id} className={styles.label}>
            {label}
          </label>
        ) : null}
        <textarea
          aria-label={id ? undefined : label}
          className={className}
          {...(fieldProps as Omit<
            ComponentProps<"textarea">,
            "aria-label" | "className"
          >)}
        />
      </>
    );
  }

  return (
    <>
      {id ? (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      ) : null}
      <input
        aria-label={id ? undefined : label}
        className={className}
        {...(fieldProps as Omit<
          ComponentProps<"input">,
          "aria-label" | "className"
        >)}
      />
    </>
  );
}
