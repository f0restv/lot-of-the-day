import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLotByDate, getAllLotDates } from "@/lib/lots";
import { formatCurrency, formatDate, formatAcreage } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { VideoHero } from "@/components/sections/video-hero";
import { PropertyDetails } from "@/components/sections/property-details";
import { PhotoGallery } from "@/components/sections/photo-gallery";
import { LotMap } from "@/components/sections/lot-map";
import { CtaSection } from "@/components/sections/cta-section";
import { CountdownBanner } from "@/components/sections/countdown-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface LotPageProps {
  params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
  return getAllLotDates().map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: LotPageProps): Promise<Metadata> {
  const { date } = await params;
  const lot = getLotByDate(date);
  if (!lot) return {};

  const title = `${lot.name} — ${formatAcreage(lot.acreage)} Acres in ${lot.location.state}`;
  const description = `${lot.tagline}. ${formatCurrency(lot.price)} for ${formatAcreage(lot.acreage)} acres in ${lot.location.county} County, ${lot.location.state}. ${lot.features.slice(0, 3).join(", ")}.`;

  return {
    title,
    description,
    openGraph: {
      title: `${lot.name} | ${SITE_NAME}`,
      description,
      type: "website",
      url: `${SITE_URL}/lot/${lot.date}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${lot.name} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function LotPage({ params }: LotPageProps) {
  const { date } = await params;
  const lot = getLotByDate(date);

  if (!lot) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <VideoHero lot={lot} />
        <CountdownBanner />
        <div className="relative z-10 bg-background">
          <div className="py-6 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-muted">
              Lot of the Day — {formatDate(lot.date)}
            </p>
          </div>
          <PropertyDetails lot={lot} />
          <PhotoGallery photos={lot.media.photos} />
          <LotMap
            lat={lot.location.coordinates.lat}
            lng={lot.location.coordinates.lng}
            name={lot.name}
          />
          <CtaSection lot={lot} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "RealEstateListing",
                name: lot.name,
                description: lot.tagline,
                url: `${SITE_URL}/lot/${lot.date}`,
                datePosted: lot.date,
                price: lot.price,
                priceCurrency: "USD",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: lot.location.city,
                  addressRegion: lot.location.state,
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: lot.location.coordinates.lat,
                  longitude: lot.location.coordinates.lng,
                },
              }),
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
