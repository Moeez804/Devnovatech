import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "#services", "#portfolio", "#about", "#technologies", "#contact"];

  return routes.map((route) => ({
    url: `${SITE_CONFIG.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}