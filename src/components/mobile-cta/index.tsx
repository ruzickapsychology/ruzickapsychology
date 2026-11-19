import { buttonVariants } from "@/components/button";
import { CtaLink } from "@/components/cta-link";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { getNavigationInquiryLabel } from "@/config/availability";
import type { SiteSettings } from "@/data/cms";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

type MobileCtaProps = {
  siteSettings: SiteSettings | null;
};

/**
 * Fixed contact bar for phones and tablets (below 1024px, where the header
 * collapses into its menu): the inquiry action plus a call button. The site
 * shell reserves the same height at the bottom so the footer stays visible.
 */
export function MobileCta({ siteSettings }: MobileCtaProps) {
  if (!siteSettings) return null;
  const label = getNavigationInquiryLabel(
    siteSettings.availabilityStatus,
    siteSettings.availabilityMessaging,
    siteSettings.consultationCtaLabel,
  );
  const phone = siteSettings.phone?.trim();
  if (!label && !phone) return null;

  return (
    <nav
      aria-label="Contact Ruzicka Psychology"
      data-slot="mobile-cta"
      className={styles.bar}
    >
      {label ? (
        <CtaLink
          href="/contact"
          event="mobile_cta_click"
          variant="primary"
          size="compact"
          className={cn(styles.action, styles.primary)}
        >
          {label}
        </CtaLink>
      ) : null}
      {phone ? (
        <TrackedExternalLink
          href={`tel:${phone.replace(/[^+\d]/g, "")}`}
          event="phone_click"
          target="_self"
          aria-label={`Call ${phone}`}
          className={buttonVariants({
            variant: "secondary",
            size: "compact",
            className: cn(styles.action, styles.call),
          })}
        >
          Call
        </TrackedExternalLink>
      ) : null}
    </nav>
  );
}
