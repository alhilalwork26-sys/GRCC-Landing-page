import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime     = "edge";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function TrainingOgImage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServerClient();
  const { data: t } = supabase
    ? await supabase
      .from("training")
      .select("title, category, format, date_start, date_end, location, price, price_label, color")
      .eq("id", params.id)
      .single()
    : { data: null };

  const c       = t?.color   || "#4F46E5";
  const title   = t?.title   || "Program Pelatihan GRCC";
  const cat     = t?.category || "";
  const format  = t?.format  || "";
  const date    = t?.date_start
    ? `${t.date_start}${t.date_end ? ` – ${t.date_end}` : ""}`
    : "";
  const loc     = t?.location || "";
  const price   = t?.price
    ? "Rp " + t.price.toLocaleString("id-ID")
    : t?.price_label || "";

  // Truncate long titles
  const shortTitle = title.length > 52 ? title.slice(0, 52) + "…" : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0D0D0D",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 8,
            background: c,
            display: "flex",
          }}
        />

        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c}30 0%, transparent 65%)`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: 60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${c}18 0%, transparent 65%)`,
            display: "flex",
          }}
        />

        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
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
            padding: "60px 80px 60px 88px",
            height: "100%",
            width: "100%",
          }}
        >
          {/* Top row: GRCC + badges */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 10,
                padding: "7px 18px",
                display: "flex",
              }}
            >
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 800, letterSpacing: "0.06em" }}>
                GRCC
              </span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {format && (
                <div
                  style={{
                    background: c,
                    borderRadius: 100,
                    padding: "6px 16px",
                    display: "flex",
                  }}
                >
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {format}
                  </span>
                </div>
              )}
              {cat && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 100,
                    padding: "6px 16px",
                    display: "flex",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {cat}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Middle: Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: c, display: "flex" }} />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Program Pelatihan
              </span>
            </div>

            <div
              style={{
                color: "#ffffff",
                fontSize: shortTitle.length > 40 ? 52 : 60,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                display: "flex",
                maxWidth: 900,
              }}
            >
              {shortTitle}
            </div>
          </div>

          {/* Bottom: Meta chips + price */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Meta */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {date && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    padding: "8px 16px",
                  }}
                >
                  <span style={{ fontSize: 14 }}>📅</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600 }}>{date}</span>
                </div>
              )}
              {loc && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    padding: "8px 16px",
                  }}
                >
                  <span style={{ fontSize: 14 }}>📍</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 600 }}>{loc}</span>
                </div>
              )}
            </div>

            {/* Price */}
            {price && (
              <div
                style={{
                  background: `${c}22`,
                  border: `1.5px solid ${c}60`,
                  borderRadius: 12,
                  padding: "12px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Investasi
                </span>
                <span style={{ color: c, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {price}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom color bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, display: "flex" }}>
          <div style={{ flex: 2, background: c, display: "flex" }} />
          <div style={{ flex: 1, background: `${c}80`, display: "flex" }} />
          <div style={{ flex: 1, background: `${c}40`, display: "flex" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
