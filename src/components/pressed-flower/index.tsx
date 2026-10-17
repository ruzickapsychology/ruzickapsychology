"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Grid } from "@/components/grid";
import { Section } from "@/components/section";
import { Stack } from "@/components/stack";
import { Eyebrow, Heading, Text } from "@/components/typography";
import { theme } from "@/config/theme";
import styles from "./styles.module.css";

function Rose({ className }: { className?: string }) {
  return (
    <Image
      src="/images/pressed-rose.svg"
      width={400}
      height={600}
      alt=""
      className={className}
      unoptimized
    />
  );
}

export function PressedFlower({
  quote,
  attribution,
}: {
  quote: string;
  attribution?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function saveWallpaper() {
    setSaving(true);
    setMessage("");
    try {
      await document.fonts.ready;
      const image = new window.Image();
      image.src = "/images/pressed-rose.svg";
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 1170;
      canvas.height = 2532;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.fillStyle = theme.surface;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = theme.accentSoft;
      ctx.lineWidth = 2;
      ctx.strokeRect(65, 65, 1040, 2402);
      ctx.drawImage(image, 335, 350, 500, 750);
      ctx.fillStyle = theme.fg;
      const serif = getComputedStyle(document.body).fontFamily;
      ctx.font = `42px ${serif}`;
      ctx.textAlign = "center";
      const lines: string[] = [];
      let line = "";
      for (const word of quote.split(/\s+/)) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width > 850 && line) {
          lines.push(line);
          line = word;
        } else line = next;
      }
      if (line) lines.push(line);
      const lineHeight = Math.min(70, 700 / lines.length);
      lines.forEach((text, index) =>
        ctx.fillText(text, 585, 1260 + index * lineHeight, 850),
      );
      ctx.font = `25px ${serif}`;
      ctx.fillStyle = theme.accent;
      if (attribution)
        ctx.fillText(
          attribution,
          585,
          Math.min(2100, 1360 + lines.length * lineHeight),
          850,
        );
      ctx.font = "20px monospace";
      ctx.fillText("A SMALL MOMENT TO KEEP", 585, 2320);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (value) =>
            value ? resolve(value) : reject(new Error("Export unavailable")),
          "image/png",
        ),
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "a-small-moment-pressed-rose.png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setMessage("Your keepsake is ready. Find it in your downloads.");
    } catch {
      setMessage("The image could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Section
        size="compact"
        tone="feature"
        className={styles.root}
        aria-labelledby="keepsake-title"
        data-slot="pressed-flower"
      >
        <Container size="xl">
          <Grid layout="twoMd" align="center" gap="lg">
            <Stack gap="sm">
              <Eyebrow variant="overline">A small discovery</Eyebrow>
              <Heading as="h2" size="content" id="keepsake-title">
                Something to take with you.
              </Heading>
              <Text variant="supporting" tone="subdued">
                A pressed flower. A few words. A moment to keep.
              </Text>
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    dialog.current?.showModal();
                    setOpen(true);
                  }}
                  aria-haspopup="dialog"
                >
                  Open the keepsake <span aria-hidden="true">↗</span>
                </Button>
              </div>
            </Stack>
            <div className={styles.preview} aria-hidden="true">
              <div className={styles.backPaper} />
              <div className={styles.frontPaper}>
                <Rose className={styles.previewRose} />
                <span className={styles.tape} />
                <span className={styles.specimen}>
                  ROSA · A MOMENT PRESERVED
                </span>
              </div>
              <span className={styles.sideNote}>just for you</span>
            </div>
          </Grid>
        </Container>
      </Section>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="keepsake-dialog-title"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className={styles.folio}>
          <div className={styles.artPage}>
            <Eyebrow variant="meta" className={styles.collection}>
              THE SMALL THINGS COLLECTION
            </Eyebrow>
            <Rose className={styles.rose} />
            <span className={styles.mountTape} aria-hidden="true" />
            <div className={styles.botanicalLabel}>
              <span>01 / ROSA</span>
              <span>A moment, preserved.</span>
            </div>
          </div>
          <div className={styles.notePage}>
            <div className={styles.close}>
              <Button
                variant="outline"
                size="compact"
                onClick={() => dialog.current?.close()}
                aria-label="Close keepsake"
              >
                Close <span aria-hidden="true">×</span>
              </Button>
            </div>
            <Stack gap="lg" className={styles.note}>
              <Eyebrow variant="overline" id="keepsake-dialog-title">
                A note on care
              </Eyebrow>
              <Text variant="quote" className={styles.quote}>
                {quote}
              </Text>
              {attribution ? (
                <Text variant="detail" tone="accent">
                  {attribution}
                </Text>
              ) : null}
              <span className={styles.rule} aria-hidden="true" />
              <Stack gap="sm">
                <div>
                  <Button onClick={saveWallpaper} disabled={saving}>
                    {saving ? "Preparing your image…" : "Keep this moment"}{" "}
                    <span aria-hidden="true">↓</span>
                  </Button>
                </div>
                <Text variant="detail" tone="subdued">
                  Save as a phone wallpaper. A little piece of this place, for
                  wherever you are.
                </Text>
                <Text
                  variant="detail"
                  className={styles.status}
                  aria-live="polite"
                >
                  {message}
                </Text>
              </Stack>
            </Stack>
          </div>
        </div>
      </dialog>
    </>
  );
}
