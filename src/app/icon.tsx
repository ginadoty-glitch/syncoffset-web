import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const runtime = "edge";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        background: "#C8922A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "white",
          lineHeight: 1,
          marginTop: -1,
        }}
      >
        S
      </span>
    </div>,
    { ...size },
  );
}
