import type { MetadataRoute } from "next";

const siteUrl = "https://www.feng1026.top";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
