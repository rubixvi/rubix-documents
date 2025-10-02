import type { MetadataRoute } from "next"

import { Settings } from "@/types/settings"
import { PageRoutes } from "@/lib/pageroutes"

export default function sitemap(): MetadataRoute.Sitemap {
  return PageRoutes.map((page) => ({
    url: `${Settings.metadataBase}${page.href}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))
}
