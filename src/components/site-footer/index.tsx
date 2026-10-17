import Link from "next/link";
import { ArrowUpRight } from "@/components/arrow-up-right";
import { Container } from "@/components/container";
import { Grid } from "@/components/grid";
import { RotatingFlowerBadge } from "@/components/hero-badge";
import { Stack } from "@/components/stack";
import { TrackedExternalLink } from "@/components/tracked-external-link";
import { Eyebrow, Text } from "@/components/typography";
import type { SiteSettings } from "@/data/cms";
import { FOOTER_NAV } from "@/config/site";
import { cn } from "@/lib/class-names";
import styles from "./styles.module.css";

export function SiteFooter({
  siteSettings,
}: {
  siteSettings?: SiteSettings | null;
}) {
  return (
    <footer data-slot="site-footer" className={styles.root}>
      <Container size="xl" className={styles.container}>
        <Stack gap="lg">
          <Grid layout="three" gap="lg" className={styles.grid}>
            <Stack
              as="section"
              gap="xs"
              className={styles.links}
              aria-labelledby="footer-explore"
            >
              <Eyebrow
                as="div"
                variant="overline"
                tone="inverse"
                id="footer-explore"
                className={styles.groupLabel}
              >
                Explore
              </Eyebrow>
              <nav aria-label="Footer navigation">
                <Grid layout="two" gap="none" className={styles.navigation}>
                  {FOOTER_NAV.map((l) => (
                    <Link key={l.label} href={l.href} className={styles.link}>
                      {l.label}
                    </Link>
                  ))}
                  {siteSettings?.portalUrl ? (
                    <TrackedExternalLink
                      href={siteSettings.portalUrl}
                      event="client_portal_click"
                      className={cn(styles.link, styles.portalLink)}
                    >
                      <span className={styles.portalInner}>
                        Existing Client Portal
                        <span className={styles.portalIcon}>
                          <ArrowUpRight />
                        </span>
                      </span>
                    </TrackedExternalLink>
                  ) : null}
                </Grid>
              </nav>
            </Stack>

            <div className={styles.badge}>
              {siteSettings?.name ? (
                <Link
                  href="/"
                  aria-label={`${siteSettings.name}, Rochester, New York — home`}
                  className={styles.badgeLink}
                >
                  <RotatingFlowerBadge
                    messages={[
                      siteSettings.name.toUpperCase(),
                      "ROCHESTER, NEW YORK",
                    ]}
                    pathId="rp-footer-badge-path"
                    flowerColor="rgb(241 238 235 / 0.18)"
                    flowerClassName="footerFlowerEmboss"
                    textColor="var(--color-footer-badge)"
                  />
                </Link>
              ) : null}
            </div>

            <Stack gap="sm" className={styles.info}>
              {siteSettings ? (
                <>
                  <Text as="div" variant="detail" tone="inverse">
                    {siteSettings.address.streetAddress}
                    <br />
                    {siteSettings.address.addressLocality},{" "}
                    {siteSettings.address.addressRegion === "NY"
                      ? "New York"
                      : siteSettings.address.addressRegion}{" "}
                    {siteSettings.address.postalCode}
                    {siteSettings.address.note ? (
                      <Text
                        as="div"
                        variant="detail"
                        tone="inverse"
                        className={styles.note}
                      >
                        {siteSettings.address.note.replace("also ", "")}
                      </Text>
                    ) : null}
                  </Text>
                  {siteSettings.phone ? (
                    <Text as="div" variant="detail" tone="inverse">
                      <TrackedExternalLink
                        href={`tel:${siteSettings.phone.replace(/[^+\d]/g, "")}`}
                        event="phone_click"
                        target="_self"
                        className={styles.profileLink}
                      >
                        {siteSettings.phone}
                      </TrackedExternalLink>
                    </Text>
                  ) : null}
                  {siteSettings.externalProfiles?.length ? (
                    <div className={styles.profileLinks}>
                      {siteSettings.externalProfiles.map((profile) => (
                        <TrackedExternalLink
                          key={profile._key ?? profile.url}
                          href={profile.url}
                          event="external_profile_click"
                          className={styles.profileLink}
                        >
                          {profile.label}
                        </TrackedExternalLink>
                      ))}
                    </div>
                  ) : null}
                  <Text as="div" variant="detail" tone="inverse">
                    © {new Date().getFullYear()} {siteSettings.legalName}
                  </Text>
                </>
              ) : null}
            </Stack>
          </Grid>
          {siteSettings?.safetyNotice ? (
            <Text variant="detail" tone="inverse">
              {siteSettings.safetyNotice}
            </Text>
          ) : null}
        </Stack>
      </Container>
    </footer>
  );
}
