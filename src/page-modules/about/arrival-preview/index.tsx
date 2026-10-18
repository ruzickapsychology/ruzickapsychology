"use client";

import { useId, useState } from "react";
import { BackgroundImageLayer } from "@/components/background-image-layer";
import { Button } from "@/components/button";
import { FlowerMark } from "@/components/flower-mark";
import { Grid } from "@/components/grid";
import { Stack } from "@/components/stack";
import { TextLink } from "@/components/text-link";
import { Eyebrow, Heading, Text } from "@/components/typography";
import { imageSrc } from "@/config/cms-images";
import type { AboutPageContent, SiteSettings } from "@/data/cms";
import styles from "./styles.module.css";

/** The doorway is an artistic invitation, not a rendering of the building. */
export function ArrivalPreview({
  space,
  address,
}: {
  space: NonNullable<AboutPageContent["space"]>;
  address?: SiteSettings["address"];
}) {
  const [mode, setMode] = useState<"person" | "online">("person");
  const [open, setOpen] = useState(false);
  const id = useId();
  const hasImage = Boolean(imageSrc(space.interiorImage));

  return (
    <Grid
      layout="twoMd"
      gap="lg"
      align="center"
      data-arrival-preview=""
      data-mode={mode}
      data-open={open}
      className={styles.root}
    >
      <figure className={styles.figure}>
        <div className={styles.stage}>
          <svg
            className={styles.architecture}
            viewBox="0 0 600 580"
            fill="none"
            aria-hidden="true"
          >
            <path d="M46 510H554M74 526H526M112 541H488" />
            <path d="M146 510V226a154 154 0 0 1 308 0v284M156 510V226a144 144 0 0 1 288 0v284" />
            <path d="M136 510V226a164 164 0 0 1 328 0v284M130 508h22m296 0h22" />
            <path d="M92 490v-77m-20 40c25 6 30 21 20 37m0-42c-1-26 11-42 32-42-1 23-13 38-32 42m0-24c-22-3-28-17-26-35 21 5 29 18 26 35" />
            <path d="M70 490h45l-6 20H76z" />
            <path d="M495 510v-92m0 48c-24-5-34-21-30-40 23 4 34 18 30 40m0-25c3-22 15-36 34-35-2 23-14 34-34 35" />
            <path d="M476 487h40l-5 23h-30zM300 43v12m-6-6h12" />
          </svg>
          <div className={styles.opening} id={`${id}-view`}>
            {mode === "person" && hasImage ? (
              <BackgroundImageLayer
                image={space.interiorImage}
                alt={space.interiorImage?.alt ?? "Therapy office seating area"}
                sizes="(min-width: 768px) 340px, 70vw"
              />
            ) : (
              <svg
                className={styles.onlineArt}
                viewBox="0 0 300 430"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className={styles.sun}
                  d="M150 65a60 60 0 1 0 0 120 60 60 0 0 0 0-120"
                />
                <path d="M74 195V106a76 76 0 0 1 152 0v89H74ZM150 31v164M74 117h152" />
                <path d="M42 339h216M60 339v58m180-58v58M92 230h116v82H92zM82 324h136l-10-12H92z" />
                <path d="M126 271c0-16 24-16 24 0s24 16 24 0M58 290v-59m0 35c-20-3-22-17-20-29 17 4 22 15 20 29m0-16c3-19 13-27 26-27-1 18-12 25-26 27M41 290h33l-4 34H45zM230 309h17v14h-17zM247 312h5v7h-5" />
              </svg>
            )}
          </div>
          {mode === "person" && hasImage ? (
            <div className={styles.door} aria-hidden="true">
              <div className={styles.doorInset}>
                <FlowerMark width={60} height={70} />
                <span className={styles.doorLine} />
              </div>
              <span className={styles.handle} />
            </div>
          ) : null}
        </div>
        <figcaption className={styles.caption}>
          <Eyebrow variant="meta">
            {mode === "person" && hasImage
              ? "An illustrated invitation · Office photograph inside"
              : "An illustrated invitation"}
          </Eyebrow>
        </figcaption>
        <div className={styles.actions}>
          {mode === "person" && hasImage ? (
            <Button
              variant="outline"
              aria-expanded={open}
              aria-controls={`${id}-view`}
              onClick={() => setOpen(!open)}
            >
              {open ? "Close the door" : "Step inside"}
              <span aria-hidden="true">{open ? "↶" : "→"}</span>
            </Button>
          ) : (
            <TextLink href="/contact">
              {mode === "online"
                ? "Ask about virtual appointments"
                : "Contact the practice"}
            </TextLink>
          )}
        </div>
      </figure>

      <Stack gap="lg" className={styles.details}>
        <div
          className={styles.modeControls}
          role="group"
          aria-label="How to meet"
        >
          <Button
            size="compact"
            variant={mode === "person" ? "primary" : "outline"}
            aria-pressed={mode === "person"}
            onClick={() => setMode("person")}
          >
            In person
          </Button>
          <Button
            size="compact"
            variant={mode === "online" ? "primary" : "outline"}
            aria-pressed={mode === "online"}
            onClick={() => setMode("online")}
          >
            Online
          </Button>
        </div>
        <Stack
          gap="md"
          aria-live="polite"
          aria-atomic="true"
          className={styles.information}
        >
          <Eyebrow variant="label">
            {mode === "person" ? "01 / The office" : "02 / Your own space"}
          </Eyebrow>
          <Heading as="h3" size="content">
            {mode === "person"
              ? "A little look inside."
              : "A different way to arrive."}
          </Heading>
          {mode === "person" && address ? (
            <Text as="div" variant="supporting">
              <address className={styles.address}>
                {address.streetAddress}
                <br />
                {address.addressLocality}, {address.addressRegion}{" "}
                {address.postalCode}
              </address>
            </Text>
          ) : null}
          {mode === "online" && space.body ? (
            <Text variant="supporting">{space.body}</Text>
          ) : null}
        </Stack>
      </Stack>
    </Grid>
  );
}
