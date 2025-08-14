import { NextResponse } from "next/server";

const GITHUB_USERNAME = "PauGuirao"; // Your GitHub username

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year =
      searchParams.get("year") || new Date().getFullYear().toString();

    // GitHub GraphQL query to get contributions for the specified year
    const query = `
      query($userName: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  color
                }
              }
            }
          }
        }
      }
    `;

    const fromDate = `${year}-01-01T00:00:00Z`;
    const toDate = `${year}-12-31T23:59:59Z`;

    const variables = {
      userName: GITHUB_USERNAME,
      from: fromDate,
      to: toDate,
    };

    // If you have a GitHub token, use it for higher rate limits
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const contributionData =
      data.data.user.contributionsCollection.contributionCalendar;

    return NextResponse.json({
      success: true,
      data: contributionData,
      year: parseInt(year),
      username: GITHUB_USERNAME,
    });
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch GitHub contributions",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
