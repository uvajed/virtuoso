import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Virtuoso - Music Practice App";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#121212",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, #121212 50%)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#1DB954",
            marginBottom: 30,
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: 16,
            letterSpacing: "-2px",
          }}
        >
          Virtuoso
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#1DB954",
            marginBottom: 40,
          }}
        >
          Master Music Theory & Train Your Ear
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 40,
          }}
        >
          {["Ear Training", "Music Theory", "Instruments", "Progress Tracking"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#a0a0a0",
                  fontSize: 24,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#1DB954",
                  }}
                />
                {feature}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
