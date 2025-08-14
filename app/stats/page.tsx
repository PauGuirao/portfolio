'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function StatsPage() {
  // Adjust days or add &pathname=/profile if you want per-page stats
  const { data, error, isLoading } = useSWR('/api/stats?days=30', fetcher, {
    refreshInterval: 10 * 60 * 1000, // refresh every 10 minutes (analytics don't need real-time updates)
    revalidateOnFocus: false, // don't refetch when window gains focus
    revalidateOnReconnect: true, // do refetch when connection is restored
    dedupingInterval: 5 * 60 * 1000, // dedupe requests within 5 minutes
  });

  const total = data?.totalPageviews ?? 0;
  const rows: Array<{ country: string; pageviews: number }> = data?.topCountries ?? [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Stats</h1>
        <p className="text-muted-foreground">
          Here are my site visits and where visitors come from.
        </p>
      </div>

      <div className="space-y-8">
        {/* KPI Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Total visits (last {data?.days ?? 30} days)</div>
            <div className="text-3xl font-semibold tabular-nums">
              {isLoading ? '…' : total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Top Countries Table */}
        <div className="rounded-lg border overflow-hidden">
          <div className="px-4 py-3 border-b bg-muted/50 font-medium">
            Top 5 countries by visits
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Country</th>
                  <th className="px-4 py-2">Visits</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground" colSpan={3}>Loading…</td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td className="px-4 py-3 text-red-600" colSpan={3}>Error loading stats</td>
                  </tr>
                )}
                {!isLoading && !error && rows.length === 0 && (
                  <tr>
                    <td className="px-4 py-3 text-muted-foreground" colSpan={3}>No data yet.</td>
                  </tr>
                )}
                {rows.map((r, i) => (
                  <tr key={r.country ?? i} className="border-t">
                    <td className="px-4 py-2 w-10">{i + 1}</td>
                    <td className="px-4 py-2">{r.country || 'Unknown'}</td>
                    <td className="px-4 py-2 tabular-nums">{(r.pageviews ?? 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
