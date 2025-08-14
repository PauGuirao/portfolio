import { NextResponse } from "next/server";

const PH_HOST = process.env.PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID!;
const PH_KEY = process.env.PUBLIC_POSTHOG_KEY!; // personal API key (server-only)

// Cache configuration
const CACHE_DURATION_HOURS = 2; // Cache for 2 hours, adjust as needed
const CACHE_DURATION_MS = CACHE_DURATION_HOURS * 60 * 60 * 1000;

// In-memory cache
interface CacheEntry {
  data: any;
  timestamp: number;
  key: string;
}

const cache = new Map<string, CacheEntry>();

function getCacheKey(days: number, pathname: string | null): string {
  return `stats-${days}-${pathname || "all"}`;
}

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION_MS;
}

async function runHogQL(query: string) {
  const r = await fetch(`${PH_HOST}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PH_KEY}`,
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    // cache hint if you like: // next: { revalidate: 60 }
  });
  console.log("HogQL response:", r);
  if (!r.ok) throw new Error(await r.text());
  const data = await r.json();

  // Normalize results into array of objects using returned column names
  const rows = data?.results ?? [];
  const cols: string[] = data?.columns ?? [];
  if (rows.length && Array.isArray(rows[0]) && cols.length) {
    return rows.map((arr: any[]) =>
      Object.fromEntries(arr.map((v, i) => [cols[i], v]))
    );
  }
  return rows; // some deployments may already return objects
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const days = Math.max(
    1,
    Math.min(365, parseInt(searchParams.get("days") || "30", 10))
  ); // 1..365
  // OPTIONAL: filter to a specific page:
  const pathname = searchParams.get("pathname"); // e.g. "/profile"

  const cacheKey = getCacheKey(days, pathname);
  const cachedEntry = cache.get(cacheKey);

  if (cachedEntry && isCacheValid(cachedEntry)) {
    return NextResponse.json(cachedEntry.data);
  }

  const wherePage = pathname ? `AND properties.$pathname = '${pathname}'` : "";

  const qTotal = `
    SELECT count() AS pageviews
    FROM events
    WHERE event = '$pageview'
      AND timestamp > now() - INTERVAL ${days} DAY
      ${wherePage}
  `;

  const qTopCountries = `
    SELECT
      coalesce(properties.$geoip_country_name, 'Unknown') AS country,
      count() AS pageviews
    FROM events
    WHERE event = '$pageview'
      AND timestamp > now() - INTERVAL ${days} DAY
      ${wherePage}
    GROUP BY country
    ORDER BY pageviews DESC
    LIMIT 5
  `;

  try {
    const [totalRows, countryRows] = await Promise.all([
      runHogQL(qTotal),
      runHogQL(qTopCountries),
    ]);

    const total = Number(
      Array.isArray(totalRows) && totalRows[0]
        ? (totalRows[0].pageviews ?? totalRows[0][0])
        : 0
    );

    const responseData = {
      days,
      pathname: pathname ?? null,
      totalPageviews: total,
      topCountries: countryRows, // [{ country: "Spain", pageviews: 123 }, ...]
    };

    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
      key: cacheKey,
    });

    return NextResponse.json(responseData);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
