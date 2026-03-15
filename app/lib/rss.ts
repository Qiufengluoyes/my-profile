import { XMLParser } from "fast-xml-parser";

export type Article = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

type FeedItem = {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  pubdate?: string;
  [key: string]: unknown;
};

const FEED_URL = "https://blog.feng1026.top/rss.xml";
const CACHE_TTL = 2 * 60 * 60 * 1000;

let cachedItems: Article[] | null = null;
let cachedAt = 0;
let inflight: Promise<Article[]> | null = null;

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value: string, max = 140) =>
  value.length > max ? `${value.slice(0, max)}...` : value;

const fetchAndParse = async (): Promise<Article[]> => {
  const res = await fetch(FEED_URL, {
    next: { revalidate: 7200 }
  });

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

  return items
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
};

export async function fetchRssItems(): Promise<Article[]> {
  const now = Date.now();

  if (cachedItems && now - cachedAt < CACHE_TTL) {
    return cachedItems;
  }

  if (cachedItems && !inflight) {
    inflight = fetchAndParse();
    inflight
      .then((items) => {
        cachedItems = items;
        cachedAt = Date.now();
      })
      .catch(() => {})
      .finally(() => {
        inflight = null;
      });
    return cachedItems;
  }

  if (inflight) {
    try {
      return await inflight;
    } catch {
      if (cachedItems) return cachedItems;
      throw new Error("Failed to fetch feed");
    }
  }

  inflight = fetchAndParse();

  try {
    const items = await inflight;
    cachedItems = items;
    cachedAt = Date.now();
    return items;
  } finally {
    inflight = null;
  }
}
