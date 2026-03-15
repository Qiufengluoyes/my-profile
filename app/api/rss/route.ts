import { NextResponse } from "next/server";
import { fetchRssItems } from "../../lib/rss";

export const revalidate = 7200;

export async function GET() {
  try {
    const items = await fetchRssItems();

    return NextResponse.json(
      { items },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=7200"
        }
      }
    );
  } catch {
    return NextResponse.json(
      { items: [] },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=7200"
        }
      }
    );
  }
}

