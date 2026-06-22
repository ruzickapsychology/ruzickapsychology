import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { theme } from "@/lib/theme";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "100px",
          backgroundColor: theme.bg,
          color: theme.fg,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 84, letterSpacing: "-0.02em" }}>
          {site.name}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, color: theme.accent }}>
          Evidence-based psychotherapy · Rochester, NY
        </div>
      </div>
    ),
    size,
  );
}
