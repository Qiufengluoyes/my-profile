import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

type FeedItem = {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  pubdate?: string;
  [key: string]: unknown;
};

const FEED_URL = "https://blog.feng1026.top/rss.xml";

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value: string, max = 140) =>
  value.length > max ? `${value.slice(0, max)}...` : value;

export async function GET() {
  try {
    const res = await fetch(FEED_URL, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch feed");
    }

    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: ""
    });
    const data = parser.parse(xml);
    const rawItems = data?.rss?.channel?.item ?? [];
    const items = (Array.isArray(rawItems) ? rawItems : [rawItems]) as FeedItem[];

    const normalized = items
      .map((item) => {
        const description =
          typeof item.description === "string"
            ? item.description
            : typeof item["content:encoded"] === "string"
              ? (item["content:encoded"] as string)
              : "";

        const pubDate =
          typeof item.pubDate === "string"
            ? item.pubDate
            : typeof item.pubdate === "string"
              ? item.pubdate
              : typeof item["dc:date"] === "string"
                ? (item["dc:date"] as string)
                : "";

        return {
          title: item.title ?? "未命名文章",
          link: item.link ?? "",
          description: truncate(stripHtml(description)) || "暂无摘要",
          pubDate
        };
      })
      .filter((item) => item.link && item.title)
      .slice(0, 6);

    return NextResponse.json({ items: normalized }, { status: 200 });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

