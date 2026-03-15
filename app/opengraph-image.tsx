import { ImageResponse } from "next/og";
import { description, ogTags, siteName, stats } from "./site-data";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(219, 234, 254, 1) 0%, rgba(239, 246, 255, 1) 60%, rgba(226, 232, 240, 1) 100%)",
          position: "relative",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "rgba(147, 197, 253, 0.35)",
            top: -120,
            right: -80,
            filter: "blur(10px)"
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(191, 219, 254, 0.45)",
            bottom: -160,
            left: -120,
            filter: "blur(6px)"
          }}
        />
        <div
          style={{
            width: 980,
            height: 420,
            borderRadius: 36,
            border: "1px solid rgba(148, 163, 184, 0.35)",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(241,245,249,0.9) 100%)",
            boxShadow: "0 30px 80px rgba(15, 23, 42, 0.12)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 72px",
            gap: 18
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "rgba(100, 116, 139, 0.8)"
            }}
          >
            Portfolio
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "rgba(15, 23, 42, 1)"
            }}
          >
            {siteName}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "rgba(71, 85, 105, 0.9)"
            }}
          >
            {description}
          </div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 14,
              color: "rgba(59, 130, 246, 0.9)",
              fontSize: 20
            }}
          >
            {ogTags.slice(0, 3).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div
            style={{
              marginTop: 18,
              display: "flex",
              gap: 20,
              color: "rgba(100, 116, 139, 0.9)",
              fontSize: 18
            }}
          >
            {stats.slice(0, 3).map((item) => (
              <span key={item.label}>
                {item.label} · {item.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
