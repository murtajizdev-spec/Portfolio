import type { Metadata } from "next";
import { siteConfig, getBaseUrl } from "@/lib/site-config";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description = siteConfig.description,
  path = "",
  image,
  noIndex = false,
}: SEOProps): Metadata {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/og-default.png`;
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(baseUrl),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
