import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "GRCC — Pusat Tata Kelola, Risiko, Kepatuhan & Daya Saing";
export const size    = { width: 1200, height: 630 };
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
          background: "#0D0D0D",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 80px",
            height: "100%",
          }}
        >
          {/* Top: Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: "8px 20px",
                display: "flex",
              }}
            >
              <span style={{ color: "#fff", fontSize: 18, fontWeight: 800, letterSpacing: "0.05em" }}>
                GRCC
              </span>
            </div>
          </div>

          {/* Middle: Main text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 820 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(79,70,229,0.2)",
                border: "1px solid rgba(79,70,229,0.4)",
                borderRadius: 100,
                padding: "6px 18px",
                width: "fit-content",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4F46E5", display: "flex" }} />
              <span style={{ color: "#818CF8", fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Pelatihan Profesional GRC
              </span>
            </div>

            <div
              style={{
                color: "#ffffff",
                fontSize: 62,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Pusat Tata Kelola,</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Risiko &amp; Kepatuhan</span>
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 22,
                lineHeight: 1.6,
                margin: 0,
                maxWidth: 680,
              }}
            >
              Pelatihan GRC, manajemen risiko, dan kepatuhan untuk organisasi Indonesia. Tersertifikasi dan relevan.
            </p>
          </div>

          {/* Bottom: Stats + URL */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Stats */}
            <div style={{ display: "flex", gap: 32 }}>
              {[
                { value: "500+", label: "Alumni" },
                { value: "20+", label: "Program" },
                { value: "10+", label: "Tahun" },
              ].map(({ value, label }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>{value}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* URL chip */}
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 100,
                padding: "10px 22px",
                display: "flex",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: 600 }}>
                grcc-landing-page.vercel.app
              </span>
            </div>
          </div>
        </div>

        {/* Bottom color bars */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, display: "flex" }}>
          {["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"].map((c) => (
            <div key={c} style={{ flex: 1, background: c, display: "flex" }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
