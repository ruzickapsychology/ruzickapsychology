import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function Field({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="field" className={cn(styles.field, className)} {...props} />
  );
}

export function FieldLabel({
  className,
  visuallyHidden = false,
  ...props
}: {
  visuallyHidden?: boolean;
} & ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        styles.label,
        visuallyHidden && styles.visuallyHidden,
        className,
      )}
      {...props}
    />
  );
}

export type FieldTone = "default" | "inverse";
type ToneProps = { tone?: FieldTone };

export const FieldDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p"> & ToneProps
>(function FieldDescription({ className, tone = "default", ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="field-description"
      data-tone={tone}
      className={cn(styles.description, styles[tone], className)}
      {...props}
    />
  );
});

export const FieldError = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p"> & ToneProps
>(function FieldError({ className, tone = "default", ...props }, ref) {
  return (
    <p
      ref={ref}
      data-slot="field-error"
      data-tone={tone}
      role="alert"
      className={cn(styles.error, styles[tone], className)}
      {...props}
    />
  );
});

export const Input = forwardRef<
  HTMLInputElement,
  ComponentProps<"input"> & ToneProps
>(function Input({ className, tone = "default", ...props }, ref) {
  return (
    <input
      ref={ref}
      data-slot="input"
      data-tone={tone}
      className={cn(styles.control, styles[tone], className)}
      {...props}
    />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  ComponentProps<"textarea"> & ToneProps
>(function Textarea({ className, tone = "default", ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      data-tone={tone}
      className={cn(styles.control, styles.textarea, styles[tone], className)}
      {...props}
    />
  );
});
