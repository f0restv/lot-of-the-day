import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLotByDate, getAllLotDates, getSimilarLots } from "@/lib/lots";
import { formatCurrency, formatDate, formatAcreage } from "@/lib/utils";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { VideoHero } from "@/components/sections/video-hero";
import { PropertyDetails } from "@/components/sections/property-details";
import { PhotoGallery } from "@/components/sections/photo-gallery";
import { LotMap } from "@/components/sections/lot-map";
import { CtaSection } from "@/components/sections/cta-section";
import { CountdownBanner } from "@/components/sections/countdown-banner";
import { StickyCTA } from "@/components/sections/sticky-cta";
import { SimilarLots } from "@/components/sections/similar-lots";
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
  const url = `${SITE_URL}/lot/${lot.date}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${lot.name} | ${SITE_NAME}`,
      description,
      type: "website",
      url,
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

  const similar = getSimilarLots(lot, 3);

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
          <SimilarLots lots={similar} currentState={lot.location.state} />
          <StickyCTA lot={lot} />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                  { "@type": "ListItem", position: 2, name: "Archive", item: `${SITE_URL}/archive` },
                  { "@type": "ListItem", position: 3, name: lot.name, item: `${SITE_URL}/lot/${lot.date}` },
                ],
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "RealEstateListing",
                name: lot.name,
                description: lot.description || lot.tagline,
                url: `${SITE_URL}/lot/${lot.date}`,
                datePosted: lot.date,
                image: [lot.media.poster, ...lot.media.photos.map((p) => p.url)],
                offers: {
                  "@type": "Offer",
                  price: lot.price,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                },
                address: {
                  "@type": "PostalAddress",
                  addressLocality: lot.location.city,
                  addressRegion: lot.location.state,
                  postalCode: lot.location.zip,
                  addressCountry: "US",
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: lot.location.coordinates.lat,
                  longitude: lot.location.coordinates.lng,
                },
                ...(lot.acreage > 0 && {
                  floorSize: {
                    "@type": "QuantitativeValue",
                    value: lot.acreage,
                    unitCode: "ACR",
                  },
                }),
              }),
            }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
