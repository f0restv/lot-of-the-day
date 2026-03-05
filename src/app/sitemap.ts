import type { MetadataRoute } from "next";
import { getAllLots } from "@/lib/lots";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const lots = getAllLots();

  const lotEntries = lots.map((lot) => ({
    url: `${SITE_URL}/lot/${lot.date}`,
    lastModified: new Date(lot.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...lotEntries,
  ];
}
