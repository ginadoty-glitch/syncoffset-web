import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "edge";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        borderRadius: 36,
        background: "#C8922A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 120,
          fontWeight: 800,
          color: "white",
          lineHeight: 1,
          marginTop: -6,
        }}
      >
        S
      </span>
    </div>,
    { ...size },
  );
}
