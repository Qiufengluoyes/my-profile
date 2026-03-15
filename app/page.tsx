import HomeClient from "./home-client";
import { fetchRssItems, type Article } from "./lib/rss";

export const revalidate = 7200;

export default async function Page() {
  let initialArticles: Article[] = [];

  try {
    initialArticles = await fetchRssItems();
  } catch {
    initialArticles = [];
  }

  return <HomeClient initialArticles={initialArticles} />;
}
