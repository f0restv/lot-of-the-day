import { ImageResponse } from "next/og";
import { getLotByDate } from "@/lib/lots";
import { formatCurrency, formatAcreage } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

export const alt = "Lot of the Day";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const lot = getLotByDate(date);

  if (!lot) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            color: "#ededed",
            fontSize: 48,
            fontFamily: "serif",
          }}
        >
          {SITE_NAME}
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          backgroundColor: "#0a0a0a",
          backgroundImage: `linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.4) 100%)`,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "60px",
            right: "60px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "#F2A900",
              fontSize: 18,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {SITE_NAME}
          </span>
          <span
            style={{
              color: "#888",
              fontSize: 16,
              letterSpacing: "0.1em",
            }}
          >
            {lot.date}
          </span>
        </div>

        {/* Location */}
        <span
          style={{
            color: "#F2A900",
            fontSize: 20,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          {lot.location.county} County, {lot.location.state}
        </span>

        {/* Name */}
        <span
          style={{
            color: "#ededed",
            fontSize: 64,
            fontFamily: "serif",
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: "20px",
          }}
        >
          {lot.name}
        </span>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#F2A900",
                fontSize: 36,
                fontFamily: "serif",
                fontWeight: 700,
              }}
            >
              {formatCurrency(lot.price)}
            </span>
            <span
              style={{
                color: "#666",
                fontSize: 14,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              Price
            </span>
          </div>

          <div
            style={{
              width: "1px",
              height: "48px",
              backgroundColor: "#333",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                color: "#ededed",
                fontSize: 36,
                fontFamily: "serif",
                fontWeight: 700,
              }}
            >
              {formatAcreage(lot.acreage)} Acres
            </span>
            <span
              style={{
                color: "#666",
                fontSize: 14,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              Size
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
