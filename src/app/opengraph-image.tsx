import { ImageResponse } from "next/og";
import { theme } from "@/lib/theme";
import { SITE_LEGAL_NAME } from "@/lib/site-defaults";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
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
        {SITE_LEGAL_NAME}
      </div>
      <div style={{ fontSize: 32, marginTop: 24, color: theme.accent }}>
        Evidence-based psychotherapy · Rochester, NY
      </div>
    </div>,
    size,
  );
}
