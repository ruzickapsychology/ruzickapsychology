"use client";

import { useRef, useState, type CSSProperties } from "react";
import { BotanicalStudy, type Botanical } from "@/components/botanical-study";
import { Button } from "@/components/button";
import {
  ContentHeader,
  ContentHeaderDescription,
  ContentHeaderEyebrow,
  ContentHeaderTitle,
} from "@/components/content-header";
import { Container } from "@/components/container";
import { Grid } from "@/components/grid";
import { Section } from "@/components/section";
import { Stack } from "@/components/stack";
import { Eyebrow, Text } from "@/components/typography";
import type { AboutPageContent } from "@/data/cms";
import styles from "./styles.module.css";

const botanicals = [
  { id: "rose", name: "Garden rose", latin: "Rosa", number: "01" },
  { id: "cosmos", name: "Cosmos", latin: "Cosmos bipinnatus", number: "02" },
  { id: "fern", name: "Woodland fern", latin: "Dryopteris", number: "03" },
] as const;
const papers = [
  { id: "ivory", name: "Ivory", color: "var(--color-surface)" },
  { id: "rose", name: "Rose", color: "var(--color-accent-soft)" },
  { id: "sand", name: "Sand", color: "var(--color-feature)" },
] as const;

/** Draw the actual preview geometry, preserving the locally loaded site fonts. */
async function savePrint(
  preview: HTMLDivElement,
  filename: string,
  width: number,
  height: number,
) {
  await document.fonts.ready;
  // Measure an unrotated copy so the editorial tilt never distorts the export.
  const card = preview.cloneNode(true) as HTMLDivElement;
  Object.assign(card.style, {
    position: "fixed",
    left: "-10000px",
    top: "0",
    width: `${preview.offsetWidth}px`,
    transform: "none",
    pointerEvents: "none",
  });
  card.setAttribute("aria-hidden", "true");
  document.body.append(card);
  try {
    await renderPrint(card, filename, width, height);
  } finally {
    card.remove();
  }
}

async function renderPrint(
  card: HTMLDivElement,
  filename: string,
  width: number,
  height: number,
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  const bounds = card.getBoundingClientRect();
  const scale = width / bounds.width;
  ctx.scale(scale, scale);
  ctx.fillStyle = getComputedStyle(card).backgroundColor;
  ctx.fillRect(0, 0, bounds.width, bounds.height);

  const artwork = card.querySelector("svg");
  if (!artwork) throw new Error("Artwork is unavailable");
  const artBox = artwork.getBoundingClientRect();
  const svg = artwork.cloneNode(true) as SVGSVGElement;
  svg.setAttribute("color", getComputedStyle(artwork).color);
  svg.setAttribute("width", "1200");
  svg.setAttribute("height", "1200");
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
  await image.decode();
  ctx.drawImage(
    image,
    artBox.left - bounds.left,
    artBox.top - bounds.top,
    artBox.width,
    artBox.height,
  );

  for (const element of card.querySelectorAll<HTMLElement>(
    "[data-print-text]",
  )) {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.fillStyle = style.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.letterSpacing =
      style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
    const words = (element.textContent ?? "").split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > box.width && line) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    const lineHeight = Number.parseFloat(style.lineHeight);
    const fontSize = Number.parseFloat(style.fontSize);
    lines.forEach((text, i) =>
      ctx.fillText(
        text,
        box.left - bounds.left + box.width / 2,
        box.top - bounds.top + i * lineHeight + (lineHeight - fontSize) / 2,
      ),
    );
  }
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("Could not create image")),
      "image/png",
    ),
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Leave enough time for mobile browsers to begin the download.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function PrintStudio({
  philosophy,
}: {
  philosophy?: AboutPageContent["philosophy"];
}) {
  const [botanical, setBotanical] = useState<Botanical>("rose");
  const [paper, setPaper] = useState<(typeof papers)[number]["id"]>("ivory");
  const [format, setFormat] = useState<"postcard" | "wallpaper">("postcard");
  const [withNote, setWithNote] = useState(
    Boolean(philosophy?.quote && philosophy?.attribution),
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const specimen = botanicals.find((item) => item.id === botanical)!;
  const paperColor = papers.find((item) => item.id === paper)!.color;
  const note = withNote && philosophy?.attribution ? philosophy : undefined;

  async function download() {
    if (!cardRef.current || saving) return;
    setSaving(true);
    setStatus("");
    try {
      await savePrint(
        cardRef.current,
        `botanical-${botanical}-${format}.png`,
        format === "postcard" ? 1500 : 1080,
        format === "postcard" ? 2100 : 1920,
      );
      setStatus("Your print is ready. Find it in your downloads.");
    } catch {
      setStatus("Your print couldn’t be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section
      id="print-studio"
      size="spacious"
      tone="feature"
      aria-labelledby="print-studio-title"
      data-slot="print-studio"
    >
      <Container size="xl">
        <Grid layout="twoLg" gap="lg" align="center">
          <Stack gap="lg" className={styles.controls}>
            <ContentHeader align="left" gap="none">
              <ContentHeaderEyebrow>
                The little print studio
              </ContentHeaderEyebrow>
              <ContentHeaderTitle id="print-studio-title">
                A little beauty,
                <br />
                to keep.
              </ContentHeaderTitle>
              <ContentHeaderDescription>
                Choose a flower, a paper, a little space for a thought. Make a
                botanical print to take with you.
              </ContentHeaderDescription>
            </ContentHeader>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                <span>01</span> Choose your botanical
              </legend>
              <div className={styles.botanicalOptions}>
                {botanicals.map((item) => (
                  <label key={item.id} className={styles.botanicalOption}>
                    <input
                      type="radio"
                      name="botanical"
                      value={item.id}
                      checked={botanical === item.id}
                      onChange={() => {
                        setBotanical(item.id);
                        setStatus("");
                      }}
                    />
                    <span className={styles.botanicalTile}>
                      <BotanicalStudy botanical={item.id} />
                    </span>
                    <span className={styles.choiceName}>{item.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                <span>02</span> Pick your paper
              </legend>
              <div className={styles.paperOptions}>
                {papers.map((item) => (
                  <label key={item.id} className={styles.paperOption}>
                    <input
                      type="radio"
                      name="paper"
                      value={item.id}
                      checked={paper === item.id}
                      onChange={() => {
                        setPaper(item.id);
                        setStatus("");
                      }}
                    />
                    <span
                      className={styles.swatch}
                      style={{ "--paper-color": item.color } as CSSProperties}
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>
                <span>03</span> Make it yours
              </legend>
              <div className={styles.formatOptions}>
                <label>
                  <input
                    type="radio"
                    name="format"
                    value="postcard"
                    checked={format === "postcard"}
                    onChange={() => {
                      setFormat("postcard");
                      setStatus("");
                    }}
                  />
                  <span>Art print · 5 × 7</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="format"
                    value="wallpaper"
                    checked={format === "wallpaper"}
                    onChange={() => {
                      setFormat("wallpaper");
                      setStatus("");
                    }}
                  />
                  <span>Phone wallpaper</span>
                </label>
              </div>
              {philosophy?.quote && philosophy.attribution ? (
                <label className={styles.noteOption}>
                  <input
                    type="checkbox"
                    checked={withNote}
                    onChange={(event) => {
                      setWithNote(event.target.checked);
                      setStatus("");
                    }}
                  />
                  Include the thought from our About page
                </label>
              ) : null}
            </fieldset>
            <Stack gap="sm">
              <Button
                onClick={download}
                disabled={saving}
                className={styles.download}
              >
                {saving ? "Preparing your print…" : "Save your print"}
                <span aria-hidden="true">↓</span>
              </Button>
              <Text variant="detail" tone="subdued">
                A small gift. Yours to save, print, or pass along.
              </Text>
              <Text
                variant="detail"
                role="status"
                aria-live="polite"
                className={styles.status}
              >
                {status}
              </Text>
            </Stack>
          </Stack>

          <div className={styles.display}>
            <div className={styles.previewMeta}>
              <Eyebrow variant="meta" tone="subdued">
                Botanical collection
              </Eyebrow>
              <Eyebrow variant="meta" tone="subdued">
                No. {specimen.number}
              </Eyebrow>
            </div>
            <div className={styles.paperStage}>
              <div
                ref={cardRef}
                className={styles.print}
                data-format={format}
                data-note={Boolean(note)}
                style={{ "--paper-color": paperColor } as CSSProperties}
                role="img"
                aria-label={`${specimen.name} on ${paper} paper${note ? `, with the quote “${note.quote}” attributed to ${note.attribution}` : ""}`}
              >
                <span className={styles.edition} data-print-text>
                  BOTANICAL STUDY / {specimen.number}
                </span>
                <BotanicalStudy
                  botanical={botanical}
                  className={styles.artwork}
                />
                <div className={styles.printWords}>
                  {note ? (
                    <>
                      <div
                        className={styles.quote}
                        data-long={note.quote.length > 100}
                        data-print-text
                      >
                        {note.quote.replace(/^[“"]|[”"]$/g, "")}
                      </div>
                      <div className={styles.attribution} data-print-text>
                        {note.attribution}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.specimenName} data-print-text>
                        {specimen.name}
                      </div>
                      <div className={styles.attribution} data-print-text>
                        {specimen.latin}
                      </div>
                    </>
                  )}
                </div>
                <span className={styles.colophon} data-print-text>
                  RUZICKA PSYCHOLOGY · ROCHESTER, NY
                </span>
              </div>
            </div>
            <Text variant="detail" tone="subdued" className={styles.caption}>
              {format === "postcard"
                ? "1500 × 2100 px · ready to print"
                : "1080 × 1920 px · room for your lock-screen clock"}
            </Text>
          </div>
        </Grid>
      </Container>
    </Section>
  );
}
