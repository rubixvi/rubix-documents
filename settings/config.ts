import { OpenGraph, TwitterCard } from "@/lib/metadata";

const url = "https://www.rubixstudios.com.au";

export const Settings = {
  title: "Documents",
  metadataBase: url,
  description:
    "This comprehensive documentation template, crafted with Next.js and available as open-source, delivers a sleek and responsive design, tailored to meet all your project documentation requirements.",
  siteicon: "/icon.png",
  keywords: ["Next.js", "documentation", "Rubix Studios", "open source", "SEO"],
  openGraph: {
    type: "website",
    title: "Documents",
    description: "This comprehensive documentation template delivers a sleek and responsive design.",
    siteName: "Rubix Studios",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rubix Studios Documentation",
      },
    ],
  } as OpenGraph,
  twitter: {
    card: "summary_large_image",
    title: "Documents",
    description: "This comprehensive documentation template delivers a sleek and responsive design.",
    site: "@RubixStudios",
    images: [
      {
        url: "/images/og-image.png",
        alt: "Rubix Studios Documentation",
      },
    ],
  } as TwitterCard,
  canonical: url,
};